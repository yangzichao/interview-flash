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
    reviewed_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_type, item_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_at ON reviews(reviewed_at);
`);

export default db;
