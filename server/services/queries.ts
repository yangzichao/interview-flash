import db from '../db.js';

const TABLE_MAP: Record<string, { table: string; itemType: string }> = {
  algorithm: { table: 'algorithms', itemType: 'algorithm' },
  behavioral: { table: 'behavioral_questions', itemType: 'behavioral' },
  ood: { table: 'ood_problems', itemType: 'ood' },
  system_design: { table: 'system_design_problems', itemType: 'system_design' },
};

/**
 * Get all items of a type with their latest review score and date.
 * Eliminates the duplicated SQL pattern across 4 route files.
 */
function resolve(type: string) {
  const entry = TABLE_MAP[type];
  if (!entry) throw new Error(`Invalid item type: ${type}`);
  return entry;
}

export function getItemsWithReviewData(type: keyof typeof TABLE_MAP) {
  const { table, itemType } = resolve(type);
  return db.prepare(`
    SELECT t.*,
      (SELECT MAX(r.reviewed_at) FROM reviews r WHERE r.item_type = ? AND r.item_id = t.id) as last_reviewed,
      (SELECT r.score FROM reviews r WHERE r.item_type = ? AND r.item_id = t.id ORDER BY r.reviewed_at DESC LIMIT 1) as last_score
    FROM ${table} t
    ORDER BY last_reviewed ASC NULLS FIRST
  `).all(itemType, itemType);
}

export function getItemById(type: keyof typeof TABLE_MAP, id: string | number) {
  const { table } = resolve(type);
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

export function deleteItem(type: keyof typeof TABLE_MAP, id: string | number) {
  const { table, itemType } = resolve(type);
  db.prepare('DELETE FROM srs_state WHERE item_type = ? AND item_id = ?').run(itemType, id);
  db.prepare('DELETE FROM reviews WHERE item_type = ? AND item_id = ?').run(itemType, id);
  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
}
