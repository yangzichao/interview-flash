import db from '../db.js';

/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Maps our 1-5 score to SM-2 quality (0-5):
 *   score 1 → quality 0 (complete blackout)
 *   score 2 → quality 2 (serious difficulty)
 *   score 3 → quality 3 (correct with difficulty)
 *   score 4 → quality 4 (correct after hesitation)
 *   score 5 → quality 5 (perfect)
 */

const SCORE_TO_QUALITY = [0, 0, 2, 3, 4, 5];

interface SRSState {
  item_type: string;
  item_id: number;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string;
}

export function updateSRS(itemType: string, itemId: number, score: number): void {
  const quality = SCORE_TO_QUALITY[score] ?? 3;

  let state = db.prepare(
    'SELECT * FROM srs_state WHERE item_type = ? AND item_id = ?'
  ).get(itemType, itemId) as SRSState | undefined;

  let ef = state?.ease_factor ?? 2.5;
  let interval = state?.interval ?? 0;
  let reps = state?.repetitions ?? 0;

  if (quality < 3) {
    // Failed — reset repetitions
    reps = 0;
    interval = 0;
  } else {
    // Successful recall
    if (reps === 0) {
      interval = 1;
    } else if (reps === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ef);
    }
    reps += 1;
  }

  // Update ease factor (min 1.3)
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  const nextReviewStr = nextReview.toISOString().slice(0, 19).replace('T', ' ');

  db.prepare(`
    INSERT INTO srs_state (item_type, item_id, ease_factor, interval, repetitions, next_review)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(item_type, item_id) DO UPDATE SET
      ease_factor = excluded.ease_factor,
      interval = excluded.interval,
      repetitions = excluded.repetitions,
      next_review = excluded.next_review
  `).run(itemType, itemId, ef, interval, reps, nextReviewStr);
}

export interface DueItem {
  item_type: string;
  item_id: number;
  title: string;
  difficulty?: string;
  category?: string;
  last_score: number | null;
  next_review: string;
  interval: number;
}

export function getDueItems(): DueItem[] {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // Items with SRS state that are due
  const dueWithSRS = db.prepare(`
    SELECT s.item_type, s.item_id, s.next_review, s.interval,
      (SELECT r.score FROM reviews r WHERE r.item_type = s.item_type AND r.item_id = s.item_id ORDER BY r.reviewed_at DESC LIMIT 1) as last_score
    FROM srs_state s
    WHERE s.next_review <= ?
    ORDER BY s.next_review ASC
    LIMIT 50
  `).all(now) as any[];

  // Items never reviewed (no SRS state)
  const neverReviewed = db.prepare(`
    SELECT 'algorithm' as item_type, id as item_id, title, difficulty, category FROM algorithms
    WHERE id NOT IN (SELECT item_id FROM srs_state WHERE item_type = 'algorithm')
    UNION ALL
    SELECT 'behavioral', id, title, NULL, category FROM behavioral_questions
    WHERE id NOT IN (SELECT item_id FROM srs_state WHERE item_type = 'behavioral')
    UNION ALL
    SELECT 'ood', id, title, difficulty, category FROM ood_problems
    WHERE id NOT IN (SELECT item_id FROM srs_state WHERE item_type = 'ood')
    UNION ALL
    SELECT 'system_design', id, title, difficulty, category FROM system_design_problems
    WHERE id NOT IN (SELECT item_id FROM srs_state WHERE item_type = 'system_design')
    LIMIT 20
  `).all() as any[];

  // Enrich due items with titles
  const enriched = dueWithSRS.map((item) => {
    const info = getItemInfo(item.item_type, item.item_id);
    return { ...item, ...info };
  });

  const neverItems = neverReviewed.map((item) => ({
    ...item,
    last_score: null,
    next_review: '',
    interval: 0,
  }));

  return [...enriched, ...neverItems];
}

function getItemInfo(itemType: string, itemId: number): { title: string; difficulty?: string; category?: string } {
  const tableMap: Record<string, string> = {
    algorithm: 'algorithms',
    behavioral: 'behavioral_questions',
    ood: 'ood_problems',
    system_design: 'system_design_problems',
  };
  const table = tableMap[itemType];
  if (!table) return { title: 'Unknown' };

  const row = db.prepare(`SELECT title, difficulty, category FROM ${table} WHERE id = ?`).get(itemId) as any;
  return row ? { title: row.title, difficulty: row.difficulty, category: row.category } : { title: 'Unknown' };
}
