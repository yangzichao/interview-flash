import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'interview-flash.db'));
db.pragma('journal_mode = WAL');

// Check if old problems table exists
const oldTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='problems'").get() as any;
if (!oldTable) {
  console.log('No legacy problems table found — nothing to migrate.');
  process.exit(0);
}

// Check if migration already ran
const algoCount = db.prepare("SELECT COUNT(*) as c FROM algorithms").get() as any;
if (algoCount.c > 0) {
  console.log(`algorithms table already has ${algoCount.c} rows — migration appears to have run already.`);
  console.log('To re-migrate, drop the new tables first.');
  process.exit(0);
}

// Rename old reviews table if it has the old schema (problem_id column)
const oldReviewsTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='reviews'").get() as any;
if (oldReviewsTable) {
  const cols = db.prepare("PRAGMA table_info(reviews)").all() as any[];
  const hasProblemId = cols.some((c: any) => c.name === 'problem_id');
  if (hasProblemId) {
    db.exec('ALTER TABLE reviews RENAME TO reviews_legacy');
    console.log('Renamed old reviews → reviews_legacy');
    // Re-run the schema creation to create the new reviews table
    db.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_type TEXT NOT NULL,
        item_id INTEGER NOT NULL,
        user_answer TEXT NOT NULL,
        evaluation TEXT NOT NULL,
        score INTEGER NOT NULL CHECK(score BETWEEN 1 AND 5),
        step_data TEXT DEFAULT NULL,
        reviewed_at TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_type, item_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_at ON reviews(reviewed_at);
    `);
    console.log('Created new reviews table with polymorphic schema');
  }
}

console.log('Starting migration from problems → separate tables...\n');

const allProblems = db.prepare('SELECT * FROM problems').all() as any[];
const hasLegacyReviews = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='reviews_legacy'").get();
const oldReviews = hasLegacyReviews
  ? db.prepare('SELECT * FROM reviews_legacy').all() as any[]
  : [];

// Mapping: old problem id → { item_type, item_id }
const idMap = new Map<number, { item_type: string; item_id: number }>();

const insertAlgo = db.prepare(`
  INSERT INTO algorithms (leetcode_id, title, slug, difficulty, content, solution, category, topics, lists, added_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertBehavioral = db.prepare(`
  INSERT INTO behavioral_questions (title, slug, category, tags, prompt, guidance, sample_answer, framework, added_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertOOD = db.prepare(`
  INSERT INTO ood_problems (title, slug, difficulty, category, tags, requirements, reference_design, key_patterns, added_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertSD = db.prepare(`
  INSERT INTO system_design_problems (title, slug, difficulty, category, tags, problem_statement, reference_solution, added_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertReview = db.prepare(`
  INSERT INTO reviews (item_type, item_id, user_answer, evaluation, score, step_data, reviewed_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const migrate = db.transaction(() => {
  let algos = 0, behavioral = 0, ood = 0, sd = 0;

  for (const p of allProblems) {
    const type = p.type || (p.category === 'Behavioral' ? 'behavioral' : p.category === 'OOD' ? 'ood' : p.category === 'System Design' ? 'system-design' : 'algorithm');

    if (type === 'algorithm') {
      const result = insertAlgo.run(
        p.leetcode_id, p.title, p.slug, p.difficulty || 'Medium',
        p.content, p.solution || '', p.category || '', p.topics || '[]', p.lists || '[]', p.added_at
      );
      idMap.set(p.id, { item_type: 'algorithm', item_id: result.lastInsertRowid as number });
      algos++;
    } else if (type === 'behavioral') {
      // Parse content into prompt + guidance
      const content = p.content || '';
      const solution = p.solution || '';
      // Try to split content: everything before "What the interviewer is looking for" is the prompt
      const guidanceMatch = content.match(/<p><strong>What the interviewer is looking for:<\/strong><\/p>([\s\S]*)/);
      const prompt = guidanceMatch ? content.slice(0, guidanceMatch.index) : content;
      const guidance = guidanceMatch ? guidanceMatch[0] : '';
      // Derive category from tags
      let tags: string[] = [];
      try { tags = JSON.parse(p.topics || '[]'); } catch {}
      const category = tags[0] || p.category || '';

      const result = insertBehavioral.run(
        p.title, p.slug, category, JSON.stringify(tags),
        prompt, guidance, solution, 'STAR', p.added_at
      );
      idMap.set(p.id, { item_type: 'behavioral', item_id: result.lastInsertRowid as number });
      behavioral++;
    } else if (type === 'ood') {
      let tags: string[] = [];
      try { tags = JSON.parse(p.topics || '[]'); } catch {}
      // Extract patterns from solution text
      const patternMatch = (p.solution || '').match(/Patterns?\s*(?:Used)?:?\s*(.*?)(?:\n\n|\n\*\*|$)/i);
      const patterns = patternMatch ? [patternMatch[1].trim()] : [];

      const result = insertOOD.run(
        p.title, p.slug, p.difficulty || 'Medium', p.category || 'OOD',
        JSON.stringify(tags), p.content || '', p.solution || '', JSON.stringify(patterns), p.added_at
      );
      idMap.set(p.id, { item_type: 'ood', item_id: result.lastInsertRowid as number });
      ood++;
    } else if (type === 'system-design' || type === 'system_design') {
      let tags: string[] = [];
      try { tags = JSON.parse(p.topics || '[]'); } catch {}

      const result = insertSD.run(
        p.title, p.slug, p.difficulty || 'Hard', p.category || 'System Design',
        JSON.stringify(tags), p.content || '', p.solution || '', p.added_at
      );
      idMap.set(p.id, { item_type: 'system_design', item_id: result.lastInsertRowid as number });
      sd++;
    }
  }

  console.log(`Migrated content: ${algos} algorithms, ${behavioral} behavioral, ${ood} OOD, ${sd} system design`);

  // Migrate reviews
  let reviewCount = 0;
  for (const r of oldReviews) {
    const mapping = idMap.get(r.problem_id);
    if (!mapping) {
      console.log(`  ⚠ Review ${r.id} references problem_id ${r.problem_id} which was not migrated`);
      continue;
    }
    insertReview.run(
      mapping.item_type, mapping.item_id,
      r.user_answer, r.evaluation, r.score, null, r.reviewed_at
    );
    reviewCount++;
  }
  console.log(`Migrated ${reviewCount} reviews`);

  // Rename old tables
  db.exec('ALTER TABLE problems RENAME TO problems_legacy');
  console.log('\nRenamed problems → problems_legacy');
});

try {
  migrate();
  console.log('\nMigration complete!');
} catch (err: any) {
  console.error('Migration failed:', err.message);
  process.exit(1);
}
