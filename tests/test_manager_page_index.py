import unittest
from pathlib import Path

import index_manager_pages


ROOT = Path(__file__).resolve().parents[1]
MANAGER = ROOT / 'client' / 'GESTION_CLUB_Manager.html'


class ManagerPageIndexTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.index = index_manager_pages.build_inventory(MANAGER)
        cls.by_id = {page['id']: page for page in cls.index['pages']}

    def test_01_expected_functional_unit_counts(self):
        self.assertEqual(self.index['total'], 70)
        self.assertEqual(
            self.index['counts'],
            {'admin': 44, 'public': 13, 'coach': 7, 'member': 6},
        )

    def test_02_core_pages_are_indexed(self):
        expected = {
            'dashboard': ('admin', 'client/pages/admin/dashboard.html'),
            'members': ('admin', 'client/pages/admin/members.html'),
            'teams': ('admin', 'client/pages/admin/teams.html'),
            'matches': ('admin', 'client/pages/admin/matches.html'),
            'public-home': ('public', 'client/pages/public/home.html'),
            'coach-home': ('coach', 'client/pages/coach/home.html'),
            'portal-home': ('member', 'client/pages/member/home.html'),
        }
        for page_id, (kind, path) in expected.items():
            self.assertIn(page_id, self.by_id)
            self.assertEqual(self.by_id[page_id]['kind'], kind)
            self.assertEqual(self.by_id[page_id]['target_path'], path)

    def test_03_target_paths_are_unique(self):
        paths = [page['target_path'] for page in self.index['pages']]
        self.assertEqual(len(paths), len(set(paths)))

    def test_04_admin_navigation_labels_are_resolved(self):
        self.assertIn('Dashboard', self.by_id['dashboard']['nav_label'])
        self.assertIn('Licenci', self.by_id['members']['nav_label'])
        self.assertIn('Équipes', self.by_id['teams']['nav_label'])
        self.assertIn('Matchs', self.by_id['matches']['nav_label'])

    def test_05_inventory_does_not_claim_pages_are_migrated(self):
        self.assertTrue(all(page['status'] == 'inventory_only' for page in self.index['pages']))
        self.assertEqual(self.index['status'], 'inventory_only_no_runtime_switch')


if __name__ == '__main__':
    unittest.main(verbosity=2)
