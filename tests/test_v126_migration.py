import json
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'scripts/migrate_v126_from_sqlite.py'


def create_source(path):
    db = sqlite3.connect(path)
    try:
        db.executescript('''
        CREATE TABLE users(name TEXT PRIMARY KEY,salt TEXT NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL);
        CREATE TABLE user_profiles(user TEXT PRIMARY KEY,member_id TEXT,educator_scope TEXT,permissions_json TEXT,created REAL,updated REAL);
        CREATE TABLE revisions(id INTEGER PRIMARY KEY AUTOINCREMENT,created REAL,actor TEXT,club TEXT,payload TEXT);
        CREATE TABLE members(id TEXT PRIMARY KEY,revision INTEGER,license_number TEXT,person_number TEXT,last_name TEXT,first_name TEXT,full_name TEXT,birth_date TEXT,category TEXT,subcategory TEXT,license_type TEXT,member_type TEXT,status TEXT,email TEXT,phone TEXT,mobile TEXT,payload TEXT);
        CREATE TABLE teams(id TEXT PRIMARY KEY,revision INTEGER,name TEXT,competition TEXT,team_group TEXT,coach TEXT,assistant TEXT,manager TEXT,ground TEXT,training TEXT,public INTEGER,roster_public INTEGER,payload TEXT);
        ''')
        db.execute('INSERT INTO users VALUES(?,?,?,?)', ('administrator', 'salt-secret', 'hash-secret', 'admin'))
        db.execute('INSERT INTO user_profiles VALUES(?,?,?,?,?,?)', ('administrator', 'm-1', '', '{}', 1, 1))
        backup = {'format': 'GESTION_CLUB_FULL_BACKUP', 'schemaVersion': 1, 'build': 'V1.25.13.17', 'state': {'clubProfile': {'official': {'affiliation': '000000'}}, 'members': [], 'teams': [], 'matches': [], 'accounts': []}}
        db.execute('INSERT INTO revisions(created,actor,club,payload) VALUES(?,?,?,?)', (1, 'administrator', '000000', json.dumps(backup)))
        db.execute('INSERT INTO members VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ('m-1', 1, '9601', 'p-1', 'DEMO', 'Alpha', 'DEMO Alpha', '2010-01-01', 'U17', '', 'Libre', 'Joueur', 'Actif', 'demo@example.invalid', '', '0692000000', '{"id":"m-1"}'))
        db.execute('INSERT INTO teams VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', ('t-1', 1, 'U17', 'Régional', 'Jeunes', '', '', '', '', '', 1, 1, '{"id":"t-1"}'))
        db.commit()
    finally:
        db.close()


class V126MigrationTests(unittest.TestCase):
    def test_dry_run_reports_counts_and_does_not_create_target(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / 'club.sqlite3'
            target = Path(tmp) / 'v126'
            create_source(source)
            result = subprocess.run([sys.executable, str(SCRIPT), str(source), '--target', str(target)], cwd=ROOT, text=True, capture_output=True, check=True)
            report = json.loads(result.stdout)
            self.assertEqual(report['mode'], 'dry-run')
            self.assertEqual(report['counts']['accounts'], 1)
            self.assertEqual(report['counts']['people'], 1)
            self.assertEqual(report['counts']['licenses'], 1)
            self.assertEqual(report['counts']['teams'], 1)
            self.assertFalse(target.exists())
            self.assertTrue(report['sensitive']['source_not_modified'])
            self.assertNotIn('hash-secret', result.stdout)

    def test_apply_creates_separated_v126_databases_without_sessions(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / 'club.sqlite3'
            target = Path(tmp) / 'v126'
            report_path = Path(tmp) / 'report.json'
            create_source(source)
            subprocess.run([sys.executable, str(SCRIPT), str(source), '--target', str(target), '--apply', '--report', str(report_path)], cwd=ROOT, text=True, capture_output=True, check=True)
            report = json.loads(report_path.read_text(encoding='utf-8'))
            club_id = report['club_id']
            self.assertTrue((target / 'instance/accounts.db').exists())
            self.assertTrue((target / 'clubs' / club_id / 'people.db').exists())
            self.assertTrue((target / 'clubs' / club_id / 'licenses.db').exists())
            self.assertTrue((target / 'clubs' / club_id / 'teams.db').exists())
            db = sqlite3.connect(target / 'clubs' / club_id / 'people.db')
            try:
                self.assertEqual(db.execute('SELECT count(*) FROM people').fetchone()[0], 1)
            finally:
                db.close()
            accounts = sqlite3.connect(target / 'instance/accounts.db')
            try:
                self.assertEqual(accounts.execute('SELECT count(*) FROM accounts').fetchone()[0], 1)
                self.assertFalse(accounts.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='sessions'").fetchone())
            finally:
                accounts.close()


if __name__ == '__main__':
    unittest.main(verbosity=2)
