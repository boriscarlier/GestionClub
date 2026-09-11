import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import data_layout


ROOT = Path(__file__).resolve().parents[1]


class V126DataLayoutTests(unittest.TestCase):
    def test_default_layout_separates_instance_club_and_domains(self):
        layout = data_layout.DataLayout(Path('D:/GestionClub/data'))
        self.assertEqual(layout.instance_db('accounts'), Path('D:/GestionClub/data/instance/accounts.db'))
        self.assertEqual(layout.instance_db('permissions'), Path('D:/GestionClub/data/instance/permissions.db'))
        self.assertEqual(layout.club_db('club-demo', 'people'), Path('D:/GestionClub/data/clubs/club-demo/people.db'))
        self.assertEqual(layout.club_db('club-demo', 'licenses'), Path('D:/GestionClub/data/clubs/club-demo/licenses.db'))
        self.assertEqual(layout.club_documents_dir('club-demo'), Path('D:/GestionClub/data/clubs/club-demo/documents'))
        self.assertEqual(layout.club_backups_dir('club-demo'), Path('D:/GestionClub/data/backups/clubs/club-demo'))

    def test_club_id_rejects_paths_and_empty_values(self):
        for value in ['', '../club', 'club/demo', 'club\\demo', '-club', 'club-', 'Club Demo']:
            with self.subTest(value=value), self.assertRaises(ValueError):
                data_layout.normalize_club_id(value)
        self.assertEqual(data_layout.normalize_club_id('CLUB_DEMO-01'), 'club_demo-01')

    def test_environment_root_is_configurable_without_legacy_database_file(self):
        with patch.dict('os.environ', {'GESTION_CLUB_V126_DATA_ROOT': 'E:/GC/data'}, clear=True):
            self.assertEqual(data_layout.default_root(ROOT), Path('E:/GC/data'))
        with patch.dict('os.environ', {'GESTION_CLUB_DATA_DIR': 'D:/GESTION_CLUB_GestionClub/data'}, clear=True):
            self.assertEqual(data_layout.default_root(ROOT), Path('D:/GESTION_CLUB_GestionClub/data'))

    def test_required_directories_include_selective_backup_targets(self):
        layout = data_layout.DataLayout(Path('data'))
        dirs = layout.required_directories(['club-a', 'club-b'])
        self.assertIn(Path('data/instance'), dirs)
        self.assertIn(Path('data/clubs/club-a'), dirs)
        self.assertIn(Path('data/clubs/club-b/documents'), dirs)
        self.assertIn(Path('data/backups/instance'), dirs)
        self.assertIn(Path('data/backups/clubs/club-a'), dirs)


class V126CanonicalSchemaTests(unittest.TestCase):
    def test_schema_file_is_executable_by_sections(self):
        schema = (ROOT / 'docs/schema/V1.26_CANONICAL_SCHEMA.sql').read_text(encoding='utf-8')
        sections = [part.strip() for part in schema.split('-- FILE: ') if part.strip()]
        self.assertGreaterEqual(len(sections), 8)
        for section in sections:
            name, _, sql = section.partition('\n')
            with self.subTest(section=name):
                with tempfile.TemporaryDirectory() as tmp:
                    path = Path(tmp) / 'section.db'
                    db = sqlite3.connect(path)
                    try:
                        db.execute('PRAGMA foreign_keys=ON')
                        db.executescript(sql)
                    finally:
                        db.close()

    def test_schema_defines_canonical_ids_and_club_scope(self):
        schema = (ROOT / 'docs/schema/V1.26_CANONICAL_SCHEMA.sql').read_text(encoding='utf-8')
        for token in ('club_id', 'person_id', 'license_id', 'account_id', 'team_id', 'membership_id'):
            self.assertIn(token, schema)
        self.assertIn('UNIQUE(club_id, license_number)', schema)
        self.assertIn('UNIQUE(club_id, person_number)', schema)
        self.assertNotIn('CREATE TABLE sessions', schema)

    def test_schema_avoids_cross_file_foreign_keys(self):
        schema = (ROOT / 'docs/schema/V1.26_CANONICAL_SCHEMA.sql').read_text(encoding='utf-8')
        licenses = schema.split('-- FILE: clubs/<club_id>/licenses.db', 1)[1].split('-- FILE:', 1)[0]
        memberships = schema.split('-- FILE: clubs/<club_id>/memberships.db', 1)[1].split('-- FILE:', 1)[0]
        self.assertNotIn('REFERENCES people', licenses)
        self.assertNotIn('REFERENCES people', memberships)
        self.assertNotIn('REFERENCES licenses', memberships)
        self.assertNotIn('REFERENCES teams', memberships)


if __name__ == '__main__':
    unittest.main(verbosity=2)
