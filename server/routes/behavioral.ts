import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  const rows = db.prepare(`
    SELECT b.*,
      (SELECT MAX(r.reviewed_at) FROM reviews r WHERE r.item_type = 'behavioral' AND r.item_id = b.id) as last_reviewed,
      (SELECT r.score FROM reviews r WHERE r.item_type = 'behavioral' AND r.item_id = b.id ORDER BY r.reviewed_at DESC LIMIT 1) as last_score
    FROM behavioral_questions b
    ORDER BY last_reviewed ASC NULLS FIRST
  `).all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM behavioral_questions WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM reviews WHERE item_type = ? AND item_id = ?').run('behavioral', req.params.id);
  db.prepare('DELETE FROM behavioral_questions WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
