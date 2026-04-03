import { Router } from 'express';
import db from '../db.js';
import { runLLM } from '../services/llm.js';

const router = Router();

router.get('/', (_req, res) => {
  const rows = db.prepare(`
    SELECT s.*,
      (SELECT MAX(r.reviewed_at) FROM reviews r WHERE r.item_type = 'system_design' AND r.item_id = s.id) as last_reviewed,
      (SELECT r.score FROM reviews r WHERE r.item_type = 'system_design' AND r.item_id = s.id ORDER BY r.reviewed_at DESC LIMIT 1) as last_score
    FROM system_design_problems s
    ORDER BY last_reviewed ASC NULLS FIRST
  `).all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM system_design_problems WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// Reveal requirements (Step 1 of the workflow)
router.get('/:id/requirements', (req, res) => {
  const row = db.prepare('SELECT functional_reqs, non_functional_reqs FROM system_design_problems WHERE id = ?').get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json({
    functional_reqs: JSON.parse(row.functional_reqs || '[]'),
    non_functional_reqs: JSON.parse(row.non_functional_reqs || '[]'),
  });
});

// Per-step feedback: evaluate one step and give coaching
router.post('/:id/step-feedback', async (req, res) => {
  try {
    const { step_key, step_label, user_answer, previous_steps } = req.body;
    const item = db.prepare('SELECT * FROM system_design_problems WHERE id = ?').get(req.params.id) as any;
    if (!item) return res.status(404).json({ error: 'Not found' });

    const prevContext = previous_steps
      ? Object.entries(previous_steps as Record<string, string>)
          .filter(([_, v]) => v?.trim())
          .map(([k, v]) => `[${k}]: ${v}`)
          .join('\n\n')
      : '';

    const prompt = `You are a system design interviewer coaching a candidate in real time.
The candidate is working on: "${item.title}"

Problem: ${item.problem_statement}

${prevContext ? `Their work so far:\n${prevContext}\n\n---\n` : ''}

They just completed the "${step_label}" step with this answer:

${user_answer}

Give brief, actionable coaching feedback (3-5 bullet points max):
- What they got right
- What's missing or could be improved
- One specific suggestion for what to add or change
- A hint for the next step they should think about

Keep it concise and encouraging. Format as markdown. Do NOT give them the full answer — guide them to discover it.`;

    const feedback = await runLLM(prompt);
    res.json({ feedback });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mock interview chat: back-and-forth with the "interviewer"
router.post('/:id/chat', async (req, res) => {
  try {
    const { messages } = req.body; // Array of { role: 'interviewer'|'candidate', content: string }
    const item = db.prepare('SELECT * FROM system_design_problems WHERE id = ?').get(req.params.id) as any;
    if (!item) return res.status(404).json({ error: 'Not found' });

    const chatHistory = (messages as { role: string; content: string }[])
      .map(m => `**${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}:** ${m.content}`)
      .join('\n\n');

    const prompt = `You are a senior engineer conducting a system design interview. You are friendly but thorough.

The problem is: "${item.title}"
${item.problem_statement}

You have this reference solution (DO NOT reveal it directly — use it to guide the conversation):
${item.reference_solution}

The conversation so far:
${chatHistory}

As the interviewer, respond naturally. Follow these rules:
- If the candidate just started, ask them to clarify requirements first
- Ask probing follow-up questions ("What happens when X fails?", "How would you scale Y?")
- If they're stuck, give a gentle nudge — not the answer ("Have you considered what happens at the database level?")
- If they mention something good, acknowledge it briefly and push deeper
- If they mention something incorrect or hand-wavy, challenge it politely ("That's interesting — how would that handle 10x traffic?")
- Keep responses concise (2-4 sentences). This is a conversation, not a lecture.
- After 8+ exchanges, start wrapping up: summarize what they covered well, note 1-2 gaps, and give a score

Respond ONLY as the interviewer. One message only.`;

    const reply = await runLLM(prompt);
    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM reviews WHERE item_type = ? AND item_id = ?').run('system_design', req.params.id);
  db.prepare('DELETE FROM system_design_problems WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
