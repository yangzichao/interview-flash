import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'leetcode-flash.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    leetcode_id INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    content TEXT NOT NULL,
    solution TEXT DEFAULT '',
    category TEXT DEFAULT '',
    topics TEXT DEFAULT '[]',
    lists TEXT DEFAULT '[]',
    added_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    evaluation TEXT NOT NULL,
    score INTEGER NOT NULL CHECK(score BETWEEN 1 AND 5),
    reviewed_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
