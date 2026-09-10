import tempfile
import unittest
from pathlib import Path

import extract_manager_css as css

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / css.SOURCE_DEFAULT


class ManagerCssTests(unittest.TestCase):
    def test_committed_files_match_canonical_bytes(self):
        css.extract(SOURCE, ROOT / css.OUTPUT, check=True)

    def test_roundtrip_preserves_whole_html(self):
        raw = SOURCE.read_bytes()
        items, manifest = css.collect(raw)
        start = manifest['parts'][0]['byte_start']
        end = manifest['parts'][-1]['byte_end']
        rebuilt = raw[:start] + b''.join(p for _, p, _ in items) + raw[end:]
        self.assertEqual(rebuilt, raw)
        self.assertFalse(manifest['runtime_active'])
        self.assertEqual([m['order'] for m in manifest['parts']], [1, 2, 3])
        self.assertTrue(raw[end:].startswith(b'/* PUBLIC */'))

    def test_utf8_and_source_unchanged(self):
        before = SOURCE.read_bytes()
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp)
            css.extract(SOURCE, output)
            css.extract(SOURCE, output, check=True)
            for file in output.glob('*.css'):
                self.assertEqual(file.read_bytes().decode('utf-8').encode('utf-8'), file.read_bytes())
        self.assertEqual(SOURCE.read_bytes(), before)

    def test_corrupt_source_rejected_before_writes(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / 'bad.html'
            source.write_bytes(SOURCE.read_bytes() + b'X')
            output = Path(temp) / 'css'
            with self.assertRaises(SystemExit):
                css.extract(source, output)
            self.assertFalse(output.exists())

    def test_divergent_file_not_overwritten(self):
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp)
            css.extract(SOURCE, output)
            target = output / '02-base.css'
            target.write_bytes(b'user edit')
            with self.assertRaises(ValueError):
                css.extract(SOURCE, output)
            self.assertEqual(target.read_bytes(), b'user edit')

    def test_check_does_not_create_missing_files(self):
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp) / 'missing'
            with self.assertRaises(ValueError):
                css.extract(SOURCE, output, check=True)
            self.assertFalse(output.exists())
