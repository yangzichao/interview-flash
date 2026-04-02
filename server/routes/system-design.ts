import { Router } from 'express';
import db from '../db.js';

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

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM reviews WHERE item_type = ? AND item_id = ?').run('system_design', req.params.id);
  db.prepare('DELETE FROM system_design_problems WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
