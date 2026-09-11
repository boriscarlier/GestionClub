-- Gestion Club V1.26 canonical data model draft
-- Structural schema only. No real club data, password hash, token or PDF content.
-- The schema is split by physical file in the V1.26 data layout.

-- FILE: instance/instance.db
CREATE TABLE clubs(
  club_id TEXT PRIMARY KEY,
  affiliation TEXT,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','archived','disabled')),
  created REAL NOT NULL,
  updated REAL NOT NULL,
  UNIQUE(affiliation)
);

CREATE TABLE schema_versions(
  domain TEXT PRIMARY KEY,
  version TEXT NOT NULL,
  migrated_from TEXT,
  applied REAL NOT NULL
);

-- FILE: instance/accounts.db
CREATE TABLE accounts(
  account_id TEXT PRIMARY KEY,
  login TEXT NOT NULL,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','disabled','incomplete')),
  password_salt TEXT,
  password_hash TEXT,
  created REAL NOT NULL,
  updated REAL NOT NULL,
  UNIQUE(login)
);

CREATE TABLE account_links(
  account_id TEXT NOT NULL,
  club_id TEXT NOT NULL,
  person_id TEXT,
  license_id TEXT,
  link_status TEXT NOT NULL CHECK(link_status IN ('confirmed','to_confirm','conflict','disabled')),
  created REAL NOT NULL,
  updated REAL NOT NULL,
  PRIMARY KEY(account_id, club_id),
  FOREIGN KEY(account_id) REFERENCES accounts(account_id)
);

-- FILE: instance/permissions.db
CREATE TABLE roles(
  role_id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  scope TEXT NOT NULL CHECK(scope IN ('instance','club','team','self'))
);

CREATE TABLE account_roles(
  account_id TEXT NOT NULL,
  club_id TEXT,
  team_id TEXT,
  role_id TEXT NOT NULL,
  created REAL NOT NULL,
  PRIMARY KEY(account_id, club_id, team_id, role_id),
  FOREIGN KEY(role_id) REFERENCES roles(role_id)
);

-- FILE: instance/audit.db
CREATE TABLE audit_events(
  event_id TEXT PRIMARY KEY,
  created REAL NOT NULL,
  actor_account_id TEXT,
  club_id TEXT,
  domain TEXT NOT NULL,
  action TEXT NOT NULL,
  target_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}'
);

-- FILE: clubs/<club_id>/club.db
CREATE TABLE club_profile(
  club_id TEXT PRIMARY KEY,
  affiliation TEXT,
  name TEXT NOT NULL,
  payload TEXT NOT NULL DEFAULT '{}',
  updated REAL NOT NULL
);

-- FILE: clubs/<club_id>/people.db
CREATE TABLE people(
  person_id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  birth_date TEXT,
  email TEXT,
  phone TEXT,
  payload TEXT NOT NULL DEFAULT '{}',
  created REAL NOT NULL,
  updated REAL NOT NULL,
  UNIQUE(club_id, last_name, first_name, birth_date)
);

-- FILE: clubs/<club_id>/licenses.db
CREATE TABLE licenses(
  license_id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL,
  person_id TEXT NOT NULL,
  license_number TEXT,
  person_number TEXT,
  category TEXT,
  subcategory TEXT,
  license_type TEXT,
  member_type TEXT,
  status TEXT,
  season TEXT,
  payload TEXT NOT NULL DEFAULT '{}',
  created REAL NOT NULL,
  updated REAL NOT NULL,
  UNIQUE(club_id, license_number),
  UNIQUE(club_id, person_number),
  FOREIGN KEY(person_id) REFERENCES people(person_id)
);

-- FILE: clubs/<club_id>/teams.db
CREATE TABLE teams(
  team_id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  competition TEXT,
  payload TEXT NOT NULL DEFAULT '{}',
  created REAL NOT NULL,
  updated REAL NOT NULL,
  UNIQUE(club_id, name)
);

-- FILE: clubs/<club_id>/memberships.db
CREATE TABLE memberships(
  membership_id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL,
  person_id TEXT NOT NULL,
  license_id TEXT,
  team_id TEXT,
  role TEXT NOT NULL CHECK(role IN ('player','educator','manager','volunteer','other')),
  starts_on TEXT,
  ends_on TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','ended','suspended')),
  payload TEXT NOT NULL DEFAULT '{}',
  created REAL NOT NULL,
  updated REAL NOT NULL,
  FOREIGN KEY(person_id) REFERENCES people(person_id),
  FOREIGN KEY(license_id) REFERENCES licenses(license_id),
  FOREIGN KEY(team_id) REFERENCES teams(team_id)
);

-- FILE: clubs/<club_id>/settings.db
CREATE TABLE club_settings(
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated REAL NOT NULL
);
