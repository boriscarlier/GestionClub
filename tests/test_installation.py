import tempfile
import unittest
from pathlib import Path
from resolve_installation import resolve


class InstallationTests(unittest.TestCase):
    def test_existing_database_wins_over_empty_default(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            existing = root / 'Mon_GestionClub'
            (existing / 'server').mkdir(parents=True)
            (existing / 'server/current_server.py').touch()
            (existing / 'data').mkdir()
            (existing / 'data/club.sqlite3').write_bytes(b'preserved')
            (root / 'GESTION_CLUB_GestionClub').mkdir()
            self.assertEqual(resolve(root), existing)
            self.assertEqual((existing / 'data/club.sqlite3').read_bytes(), b'preserved')

    def test_multiple_databases_refuse_implicit_selection(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            for name in ['One_GestionClub', 'Two_GestionClub']:
                p = root / name
                (p / 'server').mkdir(parents=True)
                (p / 'server/current_server.py').touch()
                (p / 'data').mkdir()
                (p / 'data/club.sqlite3').touch()
            with self.assertRaises(ValueError):
                resolve(root)

    def test_fresh_installation(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(resolve(Path(d)), Path(d) / 'GESTION_CLUB_GestionClub')
