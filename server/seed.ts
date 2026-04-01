import db from './db.js';
import { fetchProblem } from './services/leetcode.js';
import seedData from './seed-data.js';
import extendedData from './seed-data-extended.js';

const allProblems = [...seedData, ...extendedData];
const DELAY_MS = 1200; // be polite to LeetCode API

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO problems (leetcode_id, title, slug, difficulty, content, solution, topics)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

async function seed() {
  console.log(`Seeding ${allProblems.length} classic problems...\n`);

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < allProblems.length; i++) {
    const { slug, solution } = allProblems[i];

    // Check if already exists
    const existing = db.prepare('SELECT id FROM problems WHERE slug = ?').get(slug);
    if (existing) {
      // Update solution if it's empty
      db.prepare("UPDATE problems SET solution = ? WHERE slug = ? AND (solution IS NULL OR solution = '')").run(solution, slug);
      console.log(`  [${i + 1}/${allProblems.length}] ✓ ${slug} (already exists)`);
      skipped++;
      continue;
    }

    try {
      const lc = await fetchProblem(slug);

      if (!lc.content) {
        console.log(`  [${i + 1}/${allProblems.length}] ⚠ ${slug} (premium — skipping)`);
        failed++;
        await sleep(DELAY_MS);
        continue;
      }

      insertStmt.run(
        parseInt(lc.questionId),
        lc.title,
        lc.titleSlug,
        lc.difficulty,
        lc.content,
        solution,
        JSON.stringify(lc.topicTags.map((t) => t.name))
      );

      console.log(`  [${i + 1}/${allProblems.length}] ✓ ${lc.title} (${lc.difficulty})`);
      added++;
    } catch (err: any) {
      console.log(`  [${i + 1}/${allProblems.length}] ✗ ${slug}: ${err.message}`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone! Added: ${added}, Skipped: ${skipped}, Failed: ${failed}`);
}

seed().catch(console.error);
