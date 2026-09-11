import base64
import hashlib
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

import extract_manager_assets


ROOT = Path(__file__).resolve().parents[1]
MANAGER = ROOT / 'client' / 'GESTION_CLUB_Manager.html'
REPO_ASSET = ROOT / 'client' / 'assets' / 'brand' / 'club-logo.png'
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

    def test_06_repository_asset_is_exact_embedded_logo(self):
        self.assertTrue(REPO_ASSET.exists())
        repo_raw = REPO_ASSET.read_bytes()
        embedded = extract_manager_assets.extract_logo(MANAGER)['png']
        self.assertEqual(len(repo_raw), EXPECTED_BYTES)
        self.assertEqual(hashlib.sha256(repo_raw).hexdigest(), EXPECTED_SHA256)
        self.assertEqual(repo_raw, embedded)

    def test_07_static_asset_route_serves_exact_logo_without_touching_gestion(self):
        code = r'''
import hashlib
import http.client
import tempfile
import threading
from pathlib import Path
import current_server
import server
with tempfile.TemporaryDirectory() as temp:
    path=Path(temp)/'asset-route.sqlite3'
    srv=server.make_server(path,0)
    thread=threading.Thread(target=srv.serve_forever,daemon=True)
    thread.start()
    try:
        port=srv.server_port
        conn=http.client.HTTPConnection('127.0.0.1',port,timeout=5)
        conn.request('GET','/assets/brand/club-logo.png',headers={'Host':'127.0.0.1:'+str(port)})
        response=conn.getresponse(); raw=response.read(); ctype=response.getheader('Content-Type',''); conn.close()
        assert response.status == 200
        assert ctype == 'image/png'
        assert len(raw) == 92264
        assert hashlib.sha256(raw).hexdigest() == 'f1152a3cb6601bb95a90f5e362119e0bde45b8da9f4bafe5dd256bba028fb6bd'
        conn=http.client.HTTPConnection('127.0.0.1',port,timeout=5)
        conn.request('GET','/assets/brand/club-logo.png',headers={'Host':'foreign.invalid:'+str(port)})
        foreign=conn.getresponse(); foreign.read(); conn.close()
        assert foreign.status == 403
        print('asset-route-ok')
    finally:
        srv.shutdown(); srv.server_close(); thread.join()
'''
        env = os.environ.copy()
        env['PYTHONPATH'] = os.pathsep.join([str(ROOT / 'server'), str(ROOT / 'vendor')])
        result = subprocess.run([sys.executable, '-c', code], cwd=ROOT, env=env, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('asset-route-ok', result.stdout)


if __name__ == '__main__':
    unittest.main(verbosity=2)
