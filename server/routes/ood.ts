import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  const rows = db.prepare(`
    SELECT o.*,
      (SELECT MAX(r.reviewed_at) FROM reviews r WHERE r.item_type = 'ood' AND r.item_id = o.id) as last_reviewed,
      (SELECT r.score FROM reviews r WHERE r.item_type = 'ood' AND r.item_id = o.id ORDER BY r.reviewed_at DESC LIMIT 1) as last_score
    FROM ood_problems o
    ORDER BY last_reviewed ASC NULLS FIRST
  `).all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM ood_problems WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM reviews WHERE item_type = ? AND item_id = ?').run('ood', req.params.id);
  db.prepare('DELETE FROM ood_problems WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
