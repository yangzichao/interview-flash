import { Router } from 'express';
import db from '../db.js';
import { evaluateAnswer } from '../services/evaluator.js';

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
    const { item_type, item_id, user_answer, step_data } = req.body;
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

    const result = db.prepare(`
      INSERT INTO reviews (item_type, item_id, user_answer, evaluation, score, step_data)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(item_type, item_id, user_answer, evaluation, score, step_data ? JSON.stringify(step_data) : null);

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(review);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get review history for a specific item
router.get('/:itemType/:itemId', (req, res) => {
  const reviews = db.prepare(
    'SELECT * FROM reviews WHERE item_type = ? AND item_id = ? ORDER BY reviewed_at DESC'
  ).all(req.params.itemType, req.params.itemId);
  res.json(reviews);
});

export default router;
