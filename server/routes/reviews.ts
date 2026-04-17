import { Router } from 'express';
import db from '../db.js';
import { evaluateAnswer } from '../services/evaluator.js';
import { updateSRS } from '../services/srs.js';
import { runLLM } from '../services/llm.js';

const router = Router();

const tableMap: Record<string, string> = {
  algorithm: 'algorithms',
  behavioral: 'behavioral_questions',
  ood: 'ood_problems',
  system_design: 'system_design_problems',
};

function getItemContent(itemType: string, item: any): { title: string; content: string; reference: string; category: string } {
  switch (itemType) {
    case 'algorithm':
      return { title: item.title, content: item.content, reference: item.solution || '', category: item.category || '' };
    case 'behavioral':
      return { title: item.title, content: item.prompt + '\n\n' + item.guidance, reference: item.sample_answer || '', category: 'Behavioral' };
    case 'ood':
      return { title: item.title, content: item.requirements, reference: item.reference_design || '', category: 'OOD' };
    case 'system_design':
      return { title: item.title, content: item.problem_statement, reference: item.reference_solution || '', category: 'System Design' };
    default:
      return { title: '', content: '', reference: '', category: '' };
  }
}

// Submit a review
router.post('/', async (req, res) => {
  try {
    const { item_type, item_id, user_answer, step_data, duration_seconds } = req.body;
    if (!item_type || !item_id || !user_answer) {
      return res.status(400).json({ error: 'item_type, item_id, and user_answer are required' });
    }

    const table = tableMap[item_type];
    if (!table) return res.status(400).json({ error: `Invalid item_type: ${item_type}` });

    const item = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(item_id) as any;
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const { title, content, reference, category } = getItemContent(item_type, item);

    const { score, evaluation } = await evaluateAnswer(
      title, content, reference, user_answer, category, step_data || undefined
    );

    const duration = Number.isFinite(duration_seconds) && duration_seconds >= 0
      ? Math.round(duration_seconds)
      : null;

    const result = db.prepare(`
      INSERT INTO reviews (item_type, item_id, user_answer, evaluation, score, step_data, duration_seconds)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(item_type, item_id, user_answer, evaluation, score, step_data ? JSON.stringify(step_data) : null, duration);

    // Update SRS state based on score
    updateSRS(item_type, item_id, score);

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// Get review history for a specific item
router.get('/:itemType/:itemId', (req, res) => {
  const reviews = db.prepare(
    'SELECT * FROM reviews WHERE item_type = ? AND item_id = ? ORDER BY reviewed_at DESC'
  ).all(req.params.itemType, req.params.itemId);
  res.json(reviews);
});

// Follow-up question practice
router.post('/follow-up', async (req, res) => {
  try {
    const { item_type, item_id, question, user_answer, context } = req.body;
    if (!item_type || !item_id || !question || !user_answer) {
      return res.status(400).json({ error: 'item_type, item_id, question, and user_answer are required' });
    }

    const table = tableMap[item_type];
    if (!table) return res.status(400).json({ error: `Invalid item_type: ${item_type}` });

    const item = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(item_id) as any;
    if (!item) return res.status(404).json({ error: 'Item not found' });
    const { title } = getItemContent(item_type, item);

    const prompt = `You are an interview prep coach. A student just practiced "${title}" and received feedback. Now they are answering a follow-up question.

## Original Problem: ${title}

## Follow-up Question:
${question}

## Student's Answer:
${user_answer}

${context ? `## Context from their original evaluation:\n${context}\n` : ''}
Provide a brief, helpful evaluation of their follow-up answer:

## Assessment
<2-3 sentences: did they answer correctly? What did they get right/wrong?>

## Key Point
<The most important thing they should understand about this follow-up>

Keep it concise — this is a quick follow-up check, not a full evaluation.`;

    const feedback = await runLLM(prompt);
    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
