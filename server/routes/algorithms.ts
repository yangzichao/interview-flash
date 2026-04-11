import { Router } from 'express';
import db from '../db.js';
import { fetchProblem, slugFromInput } from '../services/leetcode.js';
import { getItemsWithReviewData, getItemById, deleteItem } from '../services/queries.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getItemsWithReviewData('algorithm'));
});

router.get('/:id', (req, res) => {
  const row = getItemById('algorithm', req.params.id);
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
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

router.delete('/:id', (req, res) => {
  deleteItem('algorithm', req.params.id);
  res.json({ ok: true });
});

export default router;
