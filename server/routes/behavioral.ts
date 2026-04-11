import { Router } from 'express';
import { getItemsWithReviewData, getItemById, deleteItem } from '../services/queries.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getItemsWithReviewData('behavioral'));
});

router.get('/:id', (req, res) => {
  const row = getItemById('behavioral', req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

router.delete('/:id', (req, res) => {
  deleteItem('behavioral', req.params.id);
  res.json({ ok: true });
});

export default router;
