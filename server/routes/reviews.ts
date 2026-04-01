import { Router } from 'express';
import db from '../db.js';
import { evaluateAnswer } from '../services/evaluator.js';

const router = Router();

// Submit a review for evaluation
router.post('/', async (req, res) => {
  try {
    const { problem_id, user_answer } = req.body;
    if (!problem_id || !user_answer) {
      return res.status(400).json({ error: 'problem_id and user_answer are required' });
    }

    const problem = db.prepare('SELECT * FROM problems WHERE id = ?').get(problem_id) as any;
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const { score, evaluation } = await evaluateAnswer(
      problem.title,
      problem.content,
      user_answer
    );

    const stmt = db.prepare(`
      INSERT INTO reviews (problem_id, user_answer, evaluation, score)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(problem_id, user_answer, evaluation, score);

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(review);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get review history for a problem
router.get('/problem/:problemId', (req, res) => {
  const reviews = db.prepare(
    'SELECT * FROM reviews WHERE problem_id = ? ORDER BY reviewed_at DESC'
  ).all(req.params.problemId);
  res.json(reviews);
});

export default router;
