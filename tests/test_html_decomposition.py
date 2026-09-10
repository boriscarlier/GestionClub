import hashlib
import tempfile
import unittest
from pathlib import Path

import decompose_manager
import rebuild_manager


ROOT = Path(__file__).resolve().parents[1]
MANAGER = ROOT / 'client' / 'FC_LA_COUR_Manager.html'
EXPECTED_SHA256 = '5646baa6ab0d19c31172eeeb5270fcccc8bc719726cb2f9c06f4147677f1f45c'
EXPECTED_GIT_BLOB_SHA = '64def65ec261d3da05d855896484c4deb79da407'
EXPECTED_BYTES = 1_143_051


class HtmlDecompositionTests(unittest.TestCase):
    def test_01_stable_manager_is_exact_expected_source(self):
        raw = MANAGER.read_bytes()
        self.assertEqual(len(raw), EXPECTED_BYTES)
        self.assertEqual(hashlib.sha256(raw).hexdigest(), EXPECTED_SHA256)
        self.assertEqual(raw.decode('utf-8').encode('utf-8'), raw)

    def test_02_decompose_and_rebuild_are_byte_identical(self):
        before = MANAGER.read_bytes()
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            parts = root / 'manager_parts'
            output = root / 'rebuilt.html'
            manifest = decompose_manager.decompose(MANAGER, parts)
            sha256, size, count = rebuild_manager.rebuild(
                parts / 'manifest.json', output, compare=MANAGER
            )
            self.assertEqual(sha256, EXPECTED_SHA256)
            self.assertEqual(size, EXPECTED_BYTES)
            self.assertEqual(count, manifest['parts_count'])
            self.assertEqual(manifest['source_git_blob_sha'], EXPECTED_GIT_BLOB_SHA)
            self.assertEqual(output.read_bytes(), before)
        self.assertEqual(MANAGER.read_bytes(), before)

    def test_03_manifest_has_contiguous_lossless_parts(self):
        with tempfile.TemporaryDirectory() as temp:
            parts_dir = Path(temp) / 'manager_parts'
            manifest = decompose_manager.decompose(MANAGER, parts_dir)
            self.assertGreater(manifest['parts_count'], 2)
            self.assertEqual(manifest['encoding'], 'utf-8-strict')
            self.assertEqual(manifest['source_bytes'], EXPECTED_BYTES)
            cursor = 0
            kinds = set()
            for expected_order, part in enumerate(manifest['parts'], 1):
                self.assertEqual(part['order'], expected_order)
                self.assertEqual(part['byte_start'], cursor)
                self.assertGreater(part['byte_end'], part['byte_start'])
                cursor = part['byte_end']
                kinds.add(part['type'])
            self.assertEqual(cursor, EXPECTED_BYTES)
            self.assertIn('fragment', kinds)
            self.assertIn('style', kinds)
            self.assertIn('script', kinds)

    def test_04_modified_part_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            parts_dir = root / 'manager_parts'
            manifest = decompose_manager.decompose(MANAGER, parts_dir)
            first = parts_dir / manifest['parts'][0]['path']
            first.write_bytes(first.read_bytes() + b'X')
            with self.assertRaises(SystemExit):
                rebuild_manager.rebuild(parts_dir / 'manifest.json', root / 'rebuilt.html')

    def test_05_wrong_source_hash_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / 'wrong.html'
            source.write_bytes(MANAGER.read_bytes() + b'X')
            with self.assertRaises(SystemExit):
                decompose_manager.decompose(source, Path(temp) / 'parts')


if __name__ == '__main__':
    unittest.main(verbosity=2)
