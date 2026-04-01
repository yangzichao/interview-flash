import { Router } from 'express';
import db from '../db.js';
import { fetchProblem, slugFromInput } from '../services/leetcode.js';

const router = Router();

// List all problems
router.get('/', (_req, res) => {
  const problems = db.prepare(`
    SELECT p.*,
      (SELECT MAX(r.reviewed_at) FROM reviews r WHERE r.problem_id = p.id) as last_reviewed,
      (SELECT r.score FROM reviews r WHERE r.problem_id = p.id ORDER BY r.reviewed_at DESC LIMIT 1) as last_score
    FROM problems p
    ORDER BY last_reviewed ASC NULLS FIRST
  `).all();
  res.json(problems);
});

// Get single problem
router.get('/:id', (req, res) => {
  const problem = db.prepare('SELECT * FROM problems WHERE id = ?').get(req.params.id);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });
  res.json(problem);
});

// Add a problem by slug or URL
router.post('/', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: 'Input is required' });

    const slug = slugFromInput(input);
    const existing = db.prepare('SELECT * FROM problems WHERE slug = ?').get(slug);
    if (existing) return res.status(409).json({ error: 'Problem already added', problem: existing });

    const lc = await fetchProblem(slug);

    const stmt = db.prepare(`
      INSERT INTO problems (leetcode_id, title, slug, difficulty, content, topics)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      parseInt(lc.questionId),
      lc.title,
      lc.titleSlug,
      lc.difficulty,
      lc.content,
      JSON.stringify(lc.topicTags.map(t => t.name))
    );

    const problem = db.prepare('SELECT * FROM problems WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(problem);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a problem
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM problems WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
