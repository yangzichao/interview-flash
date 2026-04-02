import db from './db.js';
import behavioral from './seed-behavioral-extra.js';
import ood from './seed-ood-extra.js';
import sysdesign from './seed-sysdesign-extra.js';

const all = [...behavioral, ...ood, ...sysdesign];

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO problems (leetcode_id, title, slug, difficulty, content, solution, category, topics, lists)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let added = 0;
let skipped = 0;

for (const p of all) {
  const existing = db.prepare('SELECT id FROM problems WHERE slug = ?').get(p.slug) as any;
  if (existing) {
    console.log(`  - ${p.title} (exists)`);
    skipped++;
    continue;
  }
  insertStmt.run(p.leetcode_id, p.title, p.slug, p.difficulty, p.content, p.solution, p.category, JSON.stringify(p.topics), JSON.stringify(p.lists));
  console.log(`  ✓ ${p.title}`);
  added++;
}

console.log(`\nDone! Added: ${added}, Skipped: ${skipped}`);
