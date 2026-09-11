import os
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from pathlib import PureWindowsPath
from resolve_installation import resolve
import extract_manager_css as css
import manager_sources

ROOT = Path(__file__).resolve().parents[1]


class InstallationTests(unittest.TestCase):
    def test_selected_nested_path(self):
        self.assertEqual(str(resolve(PureWindowsPath('D:/'))),
                         r'D:\GestionClub\FC_LA_COUR_GestionClub')

    def test_old_installation_does_not_override_selected_path(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / 'Other_GestionClub/data').mkdir(parents=True)
            (root / 'Other_GestionClub/data/club.sqlite3').write_bytes(b'preserved')
            self.assertEqual(resolve(root), root / 'GestionClub/FC_LA_COUR_GestionClub')

    def test_css_manifest_uses_portable_paths(self):
        raw = (ROOT / 'client/GESTION_CLUB_Manager.html').read_bytes()
        expected = css.collect(raw)[1]
        with patch.object(css, 'SOURCE_DEFAULT', PureWindowsPath(css.SOURCE_DEFAULT)):
            self.assertEqual(css.collect(raw)[1], expected)

    @unittest.skipUnless(os.name == 'nt', 'Real Robocopy requires Windows')
    def test_real_update_copy_preserves_database_and_composes(self):
        with tempfile.TemporaryDirectory(prefix='Gestion Club copy ') as d:
            target = Path(d) / 'installation'
            (target / 'data').mkdir(parents=True)
            (target / 'data/club.sqlite3').write_bytes(b'customer-database')
            (target / 'logs').mkdir()
            (target / 'logs/previous.log').write_bytes(b'customer-log')
            line = next(line for line in (ROOT/'METTRE_A_JOUR.cmd').read_text(encoding='utf-8').splitlines()
                        if line.lower().startswith('robocopy '))
            line = line.replace('%SOURCE_FULL%', str(ROOT)).replace('%TARGET_FULL%', str(target))
            line = line.replace('%UPDATE_LOG%', str(Path(d)/'copy.log'))
            result = subprocess.run(line, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            self.assertLess(result.returncode, 8, result.stdout[-2000:])
            self.assertEqual((target/'data/club.sqlite3').read_bytes(), b'customer-database')
            self.assertEqual((target/'logs/previous.log').read_bytes(), b'customer-log')
            self.assertEqual((target/'client/shared/data/fff-example.json').read_bytes(),
                             (ROOT/'client/shared/data/fff-example.json').read_bytes())
            self.assertEqual(manager_sources.compose(target),
                             (ROOT/'client/GESTION_CLUB_Manager.html').read_bytes())
