import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'interview-flash.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  -- ============================================================
  -- Algorithm problems (from LeetCode)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS algorithms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    leetcode_id INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    difficulty TEXT NOT NULL,
    content TEXT NOT NULL,
    solution TEXT DEFAULT '',
    category TEXT DEFAULT '',
    topics TEXT DEFAULT '[]',
    lists TEXT DEFAULT '[]',
    added_at TEXT DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- Behavioral interview questions
  -- ============================================================
  CREATE TABLE IF NOT EXISTS behavioral_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    prompt TEXT NOT NULL,
    guidance TEXT DEFAULT '',
    sample_answer TEXT DEFAULT '',
    framework TEXT DEFAULT 'STAR',
    added_at TEXT DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- Object-Oriented Design problems
  -- ============================================================
  CREATE TABLE IF NOT EXISTS ood_problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    difficulty TEXT NOT NULL,
    category TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    requirements TEXT NOT NULL,
    reference_design TEXT DEFAULT '',
    key_patterns TEXT DEFAULT '[]',
    added_at TEXT DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- System Design problems (multi-step workflow)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS system_design_problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    difficulty TEXT NOT NULL,
    category TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    problem_statement TEXT NOT NULL,
    functional_reqs TEXT DEFAULT '[]',
    non_functional_reqs TEXT DEFAULT '[]',
    capacity_estimation TEXT DEFAULT '',
    api_design TEXT DEFAULT '',
    data_model TEXT DEFAULT '',
    high_level_architecture TEXT DEFAULT '',
    deep_dives TEXT DEFAULT '[]',
    reference_solution TEXT DEFAULT '',
    added_at TEXT DEFAULT (datetime('now'))
  );

  -- ============================================================
  -- Unified reviews (polymorphic)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    user_answer TEXT NOT NULL,
    evaluation TEXT NOT NULL,
    score INTEGER NOT NULL CHECK(score BETWEEN 1 AND 5),
    step_data TEXT DEFAULT NULL,
    duration_seconds INTEGER DEFAULT NULL,
    reviewed_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_type, item_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_at ON reviews(reviewed_at);

  -- Slug indexes for search/uniqueness enforcement
  CREATE INDEX IF NOT EXISTS idx_algorithms_slug ON algorithms(slug);
  CREATE INDEX IF NOT EXISTS idx_behavioral_slug ON behavioral_questions(slug);
  CREATE INDEX IF NOT EXISTS idx_ood_slug ON ood_problems(slug);
  CREATE INDEX IF NOT EXISTS idx_sysdesign_slug ON system_design_problems(slug);

  -- ============================================================
  -- Settings (key-value store)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  -- ============================================================
  -- Spaced Repetition State (SM-2 algorithm)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS srs_state (
    item_type TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    ease_factor REAL DEFAULT 2.5,
    interval INTEGER DEFAULT 0,
    repetitions INTEGER DEFAULT 0,
    next_review TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (item_type, item_id)
  );

  CREATE INDEX IF NOT EXISTS idx_srs_next_review ON srs_state(next_review);

  -- ============================================================
  -- Personal notes per problem (free-form study journal)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS problem_notes (
    item_type TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (item_type, item_id)
  );

  -- Default provider
  INSERT OR IGNORE INTO settings (key, value) VALUES ('llm_provider', 'claude-cli');
`);

// Backfill SRS state for any existing reviews that don't have one
db.exec(`
  INSERT OR IGNORE INTO srs_state (item_type, item_id, ease_factor, interval, repetitions, next_review)
  SELECT DISTINCT r.item_type, r.item_id, 2.5, 0, 0, datetime('now')
  FROM reviews r
  WHERE NOT EXISTS (
    SELECT 1 FROM srs_state s WHERE s.item_type = r.item_type AND s.item_id = r.item_id
  )
`);

// Add duration_seconds to reviews for existing installs (idempotent).
const reviewCols = db.prepare("PRAGMA table_info(reviews)").all() as { name: string }[];
if (!reviewCols.some(c => c.name === 'duration_seconds')) {
  db.exec('ALTER TABLE reviews ADD COLUMN duration_seconds INTEGER DEFAULT NULL');
}

export default db;
