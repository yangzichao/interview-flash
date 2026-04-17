import { Router } from 'express';
import db from '../db.js';
import { getDueItems } from '../services/srs.js';
import { runLLM } from '../services/llm.js';

const router = Router();

// ============================================================
// Overview stats
// ============================================================
router.get('/overview', (_req, res) => {
  try {
  const totalProblems = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM algorithms) +
      (SELECT COUNT(*) FROM behavioral_questions) +
      (SELECT COUNT(*) FROM ood_problems) +
      (SELECT COUNT(*) FROM system_design_problems) as total
  `).get() as any;

  const totalReviews = db.prepare('SELECT COUNT(*) as count FROM reviews').get() as any;
  const avgScore = db.prepare('SELECT AVG(score) as avg FROM reviews').get() as any;

  // Reviews by category
  const byCategoryRows = db.prepare(`
    SELECT item_type, COUNT(*) as count, AVG(score) as avg_score
    FROM reviews GROUP BY item_type
  `).all() as any[];

  const byCategory: Record<string, { count: number; avg_score: number }> = {};
  for (const r of byCategoryRows) {
    byCategory[r.item_type] = { count: r.count, avg_score: Math.round(r.avg_score * 10) / 10 };
  }

  // Streak: consecutive days with at least 1 review
  const days = db.prepare(`
    SELECT DISTINCT date(reviewed_at) as day FROM reviews ORDER BY day DESC
  `).all() as any[];

  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (days.length > 0 && (days[0].day === today || days[0].day === yesterday)) {
    streak = 1;
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1].day);
      const curr = new Date(days[i].day);
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (diff === 1) streak++;
      else break;
    }
  }

  // Due items count
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const dueCount = db.prepare(
    'SELECT COUNT(*) as count FROM srs_state WHERE next_review <= ?'
  ).get(now) as any;

  // Never reviewed count
  const neverReviewed = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM algorithms WHERE id NOT IN (SELECT item_id FROM srs_state WHERE item_type = 'algorithm')) +
      (SELECT COUNT(*) FROM behavioral_questions WHERE id NOT IN (SELECT item_id FROM srs_state WHERE item_type = 'behavioral')) +
      (SELECT COUNT(*) FROM ood_problems WHERE id NOT IN (SELECT item_id FROM srs_state WHERE item_type = 'ood')) +
      (SELECT COUNT(*) FROM system_design_problems WHERE id NOT IN (SELECT item_id FROM srs_state WHERE item_type = 'system_design')) as count
  `).get() as any;

  res.json({
    total_problems: totalProblems.total,
    total_reviews: totalReviews.count,
    avg_score: avgScore.avg ? Math.round(avgScore.avg * 10) / 10 : null,
    streak,
    by_category: byCategory,
    due_count: dueCount.count + neverReviewed.count,
  });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// ============================================================
// Score history (for trend chart)
// ============================================================
router.get('/score-history', (req, res) => {
  const days = parseInt(req.query.days as string) || 30;

  const rows = db.prepare(`
    SELECT date(reviewed_at) as day, AVG(score) as avg_score, COUNT(*) as count
    FROM reviews
    WHERE reviewed_at >= datetime('now', ?)
    GROUP BY day
    ORDER BY day ASC
  `).all(`-${days} days`) as any[];

  res.json(rows.map(r => ({
    day: r.day,
    avg_score: Math.round(r.avg_score * 10) / 10,
    count: r.count,
  })));
});

// ============================================================
// Topic/category performance (for radar chart)
// ============================================================
router.get('/topic-stats', (_req, res) => {
  // Algorithm topic stats (from the topics JSON field)
  const algoReviews = db.prepare(`
    SELECT a.topics, r.score
    FROM reviews r
    JOIN algorithms a ON r.item_id = a.id
    WHERE r.item_type = 'algorithm'
  `).all() as any[];

  const topicScores: Record<string, { total: number; count: number }> = {};
  for (const row of algoReviews) {
    let topics: string[] = [];
    try { topics = JSON.parse(row.topics); } catch {}
    // Use category if no topics
    if (topics.length === 0) continue;
    for (const t of topics) {
      if (!topicScores[t]) topicScores[t] = { total: 0, count: 0 };
      topicScores[t].total += row.score;
      topicScores[t].count += 1;
    }
  }

  const topicStats = Object.entries(topicScores)
    .map(([topic, s]) => ({
      topic,
      avg_score: Math.round(s.total / s.count * 10) / 10,
      count: s.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Category stats (across all types)
  const categoryRows = db.prepare(`
    SELECT item_type, AVG(score) as avg_score, COUNT(*) as count
    FROM reviews
    GROUP BY item_type
  `).all() as any[];

  const categoryStats = categoryRows.map(r => ({
    topic: r.item_type === 'algorithm' ? 'Algorithms'
      : r.item_type === 'behavioral' ? 'Behavioral'
      : r.item_type === 'ood' ? 'OOD'
      : 'System Design',
    avg_score: Math.round(r.avg_score * 10) / 10,
    count: r.count,
  }));

  res.json({ topic_stats: topicStats, category_stats: categoryStats });
});

// ============================================================
// Activity heatmap data (for calendar)
// ============================================================
router.get('/activity', (_req, res) => {
  const rows = db.prepare(`
    SELECT date(reviewed_at) as day, COUNT(*) as count
    FROM reviews
    WHERE reviewed_at >= datetime('now', '-365 days')
    GROUP BY day
    ORDER BY day ASC
  `).all() as any[];

  res.json(rows);
});

// ============================================================
// Due items (SRS)
// ============================================================
router.get('/due', (_req, res) => {
  try {
    res.json(getDueItems());
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// ============================================================
// Weakness analysis (LLM-powered)
// ============================================================
router.post('/weakness', async (_req, res) => {
  try {
    // Gather stats
    const recentReviews = db.prepare(`
      SELECT r.item_type, r.score, r.reviewed_at,
        CASE r.item_type
          WHEN 'algorithm' THEN (SELECT title FROM algorithms WHERE id = r.item_id)
          WHEN 'behavioral' THEN (SELECT title FROM behavioral_questions WHERE id = r.item_id)
          WHEN 'ood' THEN (SELECT title FROM ood_problems WHERE id = r.item_id)
          WHEN 'system_design' THEN (SELECT title FROM system_design_problems WHERE id = r.item_id)
        END as title,
        CASE r.item_type
          WHEN 'algorithm' THEN (SELECT topics FROM algorithms WHERE id = r.item_id)
          ELSE NULL
        END as topics,
        CASE r.item_type
          WHEN 'algorithm' THEN (SELECT category FROM algorithms WHERE id = r.item_id)
          WHEN 'behavioral' THEN (SELECT category FROM behavioral_questions WHERE id = r.item_id)
          WHEN 'ood' THEN (SELECT category FROM ood_problems WHERE id = r.item_id)
          WHEN 'system_design' THEN (SELECT category FROM system_design_problems WHERE id = r.item_id)
        END as category
      FROM reviews r
      ORDER BY r.reviewed_at DESC
      LIMIT 100
    `).all() as any[];

    if (recentReviews.length < 3) {
      return res.json({ analysis: 'Not enough review data yet. Complete at least 3 reviews to get weakness analysis.' });
    }

    const summaryLines = recentReviews
      .filter(r => r.title != null)
      .map(r =>
        `- [${r.item_type}] "${r.title}" — score ${r.score}/5${r.topics ? ` (topics: ${r.topics})` : ''}${r.category ? ` [${r.category}]` : ''}`
      ).join('\n');

    const prompt = `You are an interview prep coach analyzing a student's practice history to identify weaknesses and create a study plan.

Here are their recent reviews (most recent first):

${summaryLines}

Based on this data, provide a concise analysis:

## Strengths
<What categories/topics they're doing well in, with specific examples>

## Weaknesses
<What categories/topics they're struggling with — be specific about patterns>

## Study Plan
<A prioritized list of 3-5 specific actions they should take this week. Be concrete: mention specific problem types, topics, or approaches to focus on.>

Keep the response concise and actionable. No fluff.`;

    const analysis = await runLLM(prompt);
    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
