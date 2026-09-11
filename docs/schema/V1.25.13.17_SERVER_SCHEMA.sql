-- Sanitized structural schema for Gestion Club V1.25.13.17
-- Generated from the validated runtime sources and inspected Windows data copy.
-- NO REAL DATA, PASSWORD HASH, TOKEN, CLUB BACKUP OR DOCUMENT CONTENT IS INCLUDED.

CREATE TABLE users(
  name TEXT PRIMARY KEY,
  salt TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin','editor','reader','educator','member'))
);

CREATE TABLE sessions(
  token TEXT PRIMARY KEY,
  user TEXT NOT NULL REFERENCES users(name),
  csrf TEXT NOT NULL,
  expires REAL NOT NULL
);

CREATE TABLE revisions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created REAL NOT NULL,
  actor TEXT NOT NULL,
  club TEXT NOT NULL,
  payload TEXT NOT NULL
);

CREATE TABLE attempts(
  id INTEGER PRIMARY KEY,
  created REAL NOT NULL
);

CREATE TABLE user_profiles(
  user TEXT PRIMARY KEY REFERENCES users(name) ON DELETE CASCADE,
  member_id TEXT,
  educator_scope TEXT,
  permissions_json TEXT,
  created REAL NOT NULL,
  updated REAL NOT NULL
);

CREATE TABLE members(
  id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL,
  license_number TEXT,
  person_number TEXT,
  last_name TEXT,
  first_name TEXT,
  full_name TEXT,
  birth_date TEXT,
  category TEXT,
  subcategory TEXT,
  license_type TEXT,
  member_type TEXT,
  status TEXT,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  payload TEXT NOT NULL
);
CREATE INDEX idx_members_revision ON members(revision);
CREATE INDEX idx_members_license ON members(license_number);
CREATE INDEX idx_members_person ON members(person_number);
CREATE INDEX idx_members_name ON members(last_name, first_name);

CREATE TABLE teams(
  id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL,
  name TEXT,
  competition TEXT,
  team_group TEXT,
  coach TEXT,
  assistant TEXT,
  manager TEXT,
  ground TEXT,
  training TEXT,
  public INTEGER NOT NULL DEFAULT 0,
  roster_public INTEGER NOT NULL DEFAULT 0,
  payload TEXT NOT NULL
);
CREATE INDEX idx_teams_revision ON teams(revision);
CREATE INDEX idx_teams_name ON teams(name);
CREATE INDEX idx_teams_group ON teams(team_group);

CREATE TABLE watch_sources(
  id TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 0,
  interval_days INTEGER NOT NULL DEFAULT 7,
  next_run REAL NOT NULL,
  last_success REAL,
  version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE watch_runs(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  actor TEXT NOT NULL,
  started REAL NOT NULL,
  ended REAL,
  status TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE watch_entries(
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  published TEXT NOT NULL,
  topics TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  first_seen REAL NOT NULL,
  last_seen REAL NOT NULL,
  changed REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  version INTEGER NOT NULL DEFAULT 1,
  origin_page TEXT NOT NULL,
  is_document INTEGER NOT NULL DEFAULT 0,
  observation_mode TEXT NOT NULL DEFAULT 'network',
  UNIQUE(source,url)
);

CREATE TABLE watch_versions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id TEXT NOT NULL,
  observed REAL NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  published TEXT NOT NULL,
  fingerprint TEXT NOT NULL
);

CREATE TABLE watch_actions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  created REAL NOT NULL,
  old_status TEXT NOT NULL,
  new_status TEXT NOT NULL
);

CREATE TABLE watch_pdfs(
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  created REAL NOT NULL,
  actor TEXT NOT NULL,
  raw BLOB NOT NULL,
  report TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE watch_pdf_actions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document TEXT NOT NULL,
  actor TEXT NOT NULL,
  created REAL NOT NULL,
  old_status TEXT NOT NULL,
  new_status TEXT NOT NULL
);

CREATE TABLE watch_pdf_analyses(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document TEXT NOT NULL,
  actor TEXT NOT NULL,
  created REAL NOT NULL,
  analysis_version TEXT NOT NULL,
  players INTEGER NOT NULL
);

CREATE TABLE watch_convocations(
  document TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  payload TEXT NOT NULL,
  actor TEXT NOT NULL,
  updated REAL NOT NULL
);
