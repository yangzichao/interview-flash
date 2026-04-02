import db from './db.js';
import data from './seed-data-non-algo.js';

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO problems (leetcode_id, title, slug, difficulty, content, solution, category, topics, lists)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const updateStmt = db.prepare(`
  UPDATE problems SET content = ?, solution = ?, category = ?, topics = ?, lists = ?
  WHERE slug = ?
`);

let added = 0;
let updated = 0;

for (const p of data) {
  const existing = db.prepare('SELECT id FROM problems WHERE slug = ?').get(p.slug) as any;
  if (existing) {
    updateStmt.run(p.content, p.solution, p.category, JSON.stringify(p.topics), JSON.stringify(p.lists), p.slug);
    console.log(`  ✓ ${p.title} (updated)`);
    updated++;
  } else {
    insertStmt.run(p.leetcode_id, p.title, p.slug, p.difficulty, p.content, p.solution, p.category, JSON.stringify(p.topics), JSON.stringify(p.lists));
    console.log(`  ✓ ${p.title} (added)`);
    added++;
  }
}

console.log(`\nDone! Added: ${added}, Updated: ${updated}`);
