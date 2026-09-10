import base64
import hashlib
import tempfile
import unittest
from pathlib import Path

import extract_manager_assets


ROOT = Path(__file__).resolve().parents[1]
MANAGER = ROOT / 'client' / 'FC_LA_COUR_Manager.html'
EXPECTED_SHA256 = 'f1152a3cb6601bb95a90f5e362119e0bde45b8da9f4bafe5dd256bba028fb6bd'
EXPECTED_BYTES = 92_264


class ManagerAssetTests(unittest.TestCase):
    def test_01_embedded_logo_has_expected_identity(self):
        info = extract_manager_assets.extract_logo(MANAGER)
        self.assertEqual(info['decoded_bytes'], EXPECTED_BYTES)
        self.assertEqual(info['sha256'], EXPECTED_SHA256)
        self.assertEqual((info['width'], info['height']), (576, 507))
        self.assertEqual(info['mime'], 'image/png')

    def test_02_extraction_writes_exact_png_and_non_active_index(self):
        info = extract_manager_assets.extract_logo(MANAGER)
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            asset = root / 'assets' / 'club-logo.png'
            index_path = root / 'MANAGER_ASSETS_INDEX.json'
            index = extract_manager_assets.extract(MANAGER, asset, index_path)
            raw = asset.read_bytes()
            self.assertEqual(raw, info['png'])
            self.assertEqual(hashlib.sha256(raw).hexdigest(), EXPECTED_SHA256)
            self.assertTrue(index_path.exists())
            self.assertEqual(index['status'], 'extracted_not_active')
            self.assertFalse(index['assets'][0]['runtime_active'])

    def test_03_invalid_base64_is_rejected(self):
        text = MANAGER.read_text(encoding='utf-8')
        marker = 'const CLUB_LOGO_DATA_URI'
        self.assertIn(marker, text)
        start = text.index('data:image/png;base64,', text.index(marker)) + len('data:image/png;base64,')
        broken = text[:start] + '!' + text[start + 1:]
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / 'broken.html'
            source.write_text(broken, encoding='utf-8')
            with self.assertRaises(SystemExit):
                extract_manager_assets.extract_logo(source)

    def test_04_monolith_still_contains_embedded_logo(self):
        text = MANAGER.read_text(encoding='utf-8')
        self.assertIn('const CLUB_LOGO_DATA_URI', text)
        self.assertIn('data:image/png;base64,', text)

    def test_05_known_png_payload_roundtrip(self):
        info = extract_manager_assets.extract_logo(MANAGER)
        encoded = base64.b64encode(info['png']).decode('ascii')
        self.assertEqual(len(encoded), info['payload_chars'])
        self.assertEqual(base64.b64decode(encoded, validate=True), info['png'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
