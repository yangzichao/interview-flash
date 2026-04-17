import { Router } from 'express';
import db from '../db.js';

const router = Router();

const VALID_ITEM_TYPES = new Set(['algorithm', 'behavioral', 'ood', 'system_design']);
const MAX_NOTE_LENGTH = 50_000;

router.get('/:itemType/:itemId', (req, res) => {
  const { itemType, itemId } = req.params;
  if (!VALID_ITEM_TYPES.has(itemType)) {
    return res.status(400).json({ error: `Invalid item_type: ${itemType}` });
  }
  const id = Number(itemId);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid item_id' });
  }
  const row = db.prepare(
    'SELECT notes, updated_at FROM problem_notes WHERE item_type = ? AND item_id = ?'
  ).get(itemType, id) as { notes: string; updated_at: string } | undefined;
  res.json({ notes: row?.notes ?? '', updated_at: row?.updated_at ?? null });
});

router.put('/:itemType/:itemId', (req, res) => {
  const { itemType, itemId } = req.params;
  if (!VALID_ITEM_TYPES.has(itemType)) {
    return res.status(400).json({ error: `Invalid item_type: ${itemType}` });
  }
  const id = Number(itemId);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid item_id' });
  }
  const notes = typeof req.body?.notes === 'string' ? req.body.notes : '';
  if (notes.length > MAX_NOTE_LENGTH) {
    return res.status(400).json({ error: `Notes exceed ${MAX_NOTE_LENGTH} characters` });
  }
  const row = db.prepare(`
    INSERT INTO problem_notes (item_type, item_id, notes, updated_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(item_type, item_id) DO UPDATE SET
      notes = excluded.notes,
      updated_at = excluded.updated_at
    RETURNING updated_at
  `).get(itemType, id, notes) as { updated_at: string };
  res.json({ ok: true, updated_at: row.updated_at });
});

export default router;
