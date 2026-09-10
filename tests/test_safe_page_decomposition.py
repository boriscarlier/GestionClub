import hashlib
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANAGER = ROOT / 'client' / 'FC_LA_COUR_Manager.html'
EXPECTED_MANAGER_BYTES = 1_143_051
EXPECTED_MANAGER_SHA256 = '5646baa6ab0d19c31172eeeb5270fcccc8bc719726cb2f9c06f4147677f1f45c'

PAGE_BRIDGES = {
    'client/pages/admin/dashboard.html': '/gestion#dashboard',
    'client/pages/admin/members.html': '/gestion#members',
    'client/pages/admin/teams.html': '/gestion#teams',
    'client/pages/public/home.html': '/gestion#public-home',
    'client/pages/coach/home.html': '/gestion#coach-home',
    'client/pages/member/home.html': '/gestion#portal-home',
}


class SafePageDecompositionTests(unittest.TestCase):
    def test_01_monolith_stays_exact_stable_reference(self):
        raw = MANAGER.read_bytes()
        self.assertEqual(len(raw), EXPECTED_MANAGER_BYTES)
        self.assertEqual(hashlib.sha256(raw).hexdigest(), EXPECTED_MANAGER_SHA256)
        self.assertEqual(raw.decode('utf-8').encode('utf-8'), raw)

    def test_02_page_targets_exist_as_legacy_bridges(self):
        for relative, target in PAGE_BRIDGES.items():
            path = ROOT / relative
            self.assertTrue(path.exists(), relative)
            text = path.read_text(encoding='utf-8')
            self.assertIn('<!doctype html>', text.lower())
            self.assertIn(target, text)
            self.assertIn('Manager stable', text)

    def test_03_page_index_documents_current_status(self):
        text = (ROOT / 'client' / 'pages' / 'README.md').read_text(encoding='utf-8')
        self.assertIn('legacy_bridge', text)
        for relative in PAGE_BRIDGES:
            self.assertIn(relative.replace('client/pages/', ''), text)

    def test_04_decomposition_notes_preserve_rollback_rule(self):
        text = (ROOT / 'docs' / 'HTML_DECOMPOSITION_SAFE_START.md').read_text(encoding='utf-8')
        self.assertIn('V1.25.11.1', text)
        self.assertIn(EXPECTED_MANAGER_SHA256, text)
        self.assertIn('client/FC_LA_COUR_Manager.html', text)
        self.assertIn('rollback', text.lower())


if __name__ == '__main__':
    unittest.main(verbosity=2)
