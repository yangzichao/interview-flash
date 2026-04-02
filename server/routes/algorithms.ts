import { Router } from 'express';
import db from '../db.js';
import { fetchProblem, slugFromInput } from '../services/leetcode.js';

const router = Router();

router.get('/', (_req, res) => {
  const rows = db.prepare(`
    SELECT a.*,
      (SELECT MAX(r.reviewed_at) FROM reviews r WHERE r.item_type = 'algorithm' AND r.item_id = a.id) as last_reviewed,
      (SELECT r.score FROM reviews r WHERE r.item_type = 'algorithm' AND r.item_id = a.id ORDER BY r.reviewed_at DESC LIMIT 1) as last_score
    FROM algorithms a
    ORDER BY last_reviewed ASC NULLS FIRST
  `).all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM algorithms WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

router.post('/', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: 'Input is required' });
    const slug = slugFromInput(input);
    const existing = db.prepare('SELECT * FROM algorithms WHERE slug = ?').get(slug);
    if (existing) return res.status(409).json({ error: 'Already exists', item: existing });
    const lc = await fetchProblem(slug);
    const result = db.prepare(`
      INSERT INTO algorithms (leetcode_id, title, slug, difficulty, content, topics)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(parseInt(lc.questionId), lc.title, lc.titleSlug, lc.difficulty, lc.content, JSON.stringify(lc.topicTags.map(t => t.name)));
    const row = db.prepare('SELECT * FROM algorithms WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(row);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM reviews WHERE item_type = ? AND item_id = ?').run('algorithm', req.params.id);
  db.prepare('DELETE FROM algorithms WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
