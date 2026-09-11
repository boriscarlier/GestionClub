import hashlib
import http.client
import json
import subprocess
import shutil
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import patch

import manager_sources
import server
from build_manager_sources import build

ROOT = Path(__file__).resolve().parents[1]


class SourceCompositionTests(unittest.TestCase):
    def test_route_script_does_not_modify_embedded_export_templates(self):
        html = '<body><script>const template="</body>";</script></body></html>'
        result = manager_sources.select_page(html, {'id': 'public-coach', 'space': 'public'})
        self.assertTrue(result.startswith('<body><script>const template="</body>";</script>'))
        self.assertEqual(result.count('const requested='), 1)
        self.assertTrue(result.endswith('</body></html>'))

    def test_source_generation_is_reproducible(self):
        manifest = build(check=True)
        self.assertEqual(len(manifest['pages']), 70)
        self.assertEqual(len(manifest['css']), 114)
        self.assertEqual(len(manifest['javascript']), 663)

    def test_byte_identical_and_utf8(self):
        raw = manager_sources.compose(ROOT)
        self.assertEqual(raw, (ROOT/'client/GESTION_CLUB_Manager.html').read_bytes())
        self.assertEqual(hashlib.sha256(raw).hexdigest(), manager_sources.CANONICAL_SHA)
        self.assertEqual(raw.decode('utf-8').encode('utf-8'), raw)

    @unittest.skipUnless(shutil.which('node'), 'Authoring syntax check requires Node; Python byte checks remain active')
    def test_all_classic_units_compile(self):
        script = """
const fs=require('node:fs'),vm=require('node:vm');
const m=JSON.parse(fs.readFileSync('client/manager.sources.json','utf8'));
for(const part of m.javascript)new vm.Script(fs.readFileSync(part.path,'utf8'),{filename:part.path});
"""
        subprocess.run(['node', '-e', script], cwd=ROOT, capture_output=True, check=True)

    def test_tampered_file_rejected(self):
        original = Path.read_bytes
        def tampered(path):
            raw = original(path)
            return raw+b'X' if path.name=='01-tokens.css' else raw
        with patch.object(Path, 'read_bytes', tampered):
            with self.assertRaises(ValueError):
                manager_sources.compose(ROOT)

    def test_unknown_page_rejected(self):
        for path in ['/gestion-modulaire/../../server/server.py', '/gestion-modulaire/admin/absent',
                     '/gestion-modulaire/%2e%2e/settings']:
            with self.assertRaises(KeyError):
                manager_sources.page_for_route(ROOT, path)

    def test_nested_pages_have_no_duplicate_payload(self):
        parent = (ROOT/'client/pages/public/coach.html').read_text()
        self.assertIn('<!--GESTION_SOURCE:client/pages/coach/home.html-->', parent)
        self.assertNotIn('id="coach-home"', parent)
        assembled=manager_sources.compose(ROOT).decode()
        self.assertEqual(assembled.count('id="coach-home"'), 1)


class ModularHTTPTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp=tempfile.TemporaryDirectory()
        db=Path(cls.temp.name)/'fiction.sqlite3'
        server.initialize(db)
        server.add_user(db,'css-check','Fiction-only-password-123','reader')
        cls.srv=server.make_server(db,0)
        cls.thread=threading.Thread(target=cls.srv.serve_forever,daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.srv.shutdown();cls.srv.server_close();cls.thread.join();cls.temp.cleanup()

    def request(self, path, cookie=None, host=None, method='GET', payload=None):
        conn=http.client.HTTPConnection('127.0.0.1',self.srv.server_port,timeout=20)
        origin='127.0.0.1:'+str(self.srv.server_port)
        headers={'Host':host or origin,'Origin':'http://'+origin,'Content-Type':'application/json'}
        if cookie:headers['Cookie']=cookie
        conn.request(method,path,body=json.dumps(payload) if payload else None,headers=headers)
        response=conn.getresponse();raw=response.read();status=response.status
        response_headers=dict(response.getheaders());conn.close()
        return status,raw,response_headers

    def login(self):
        status,_,headers=self.request('/api/login',method='POST',payload={
            'name':'css-check','password':'Fiction-only-password-123'})
        self.assertEqual(status,200)
        return headers['Set-Cookie'].split(';')[0]

    def test_auth_required_on_modular_and_legacy(self):
        for path in ['/gestion-modulaire','/gestion-modulaire/admin/members','/gestion-legacy']:
            self.assertEqual(self.request(path)[0],401)

    def test_host_guard_preserved(self):
        self.assertEqual(self.request('/gestion-modulaire',host='evil.invalid')[0],403)

    def test_composed_http_equals_legacy_with_bridge(self):
        cookie=self.login()
        status,raw,headers=self.request('/gestion-modulaire',cookie)
        self.assertEqual(status,200)
        self.assertEqual(raw,self.request('/gestion',cookie)[1])
        self.assertEqual(raw,self.request('/gestion-legacy',cookie)[1])
        self.assertIn(b'GESTION_CLUB_SERVER_BRIDGE',raw)
        self.assertIn("frame-ancestors 'none'",headers['Content-Security-Policy'])

    def test_all_70_allowlisted_routes(self):
        cookie=self.login()
        manifest=json.loads((ROOT/'client/manager.sources.json').read_text())
        for page in manifest['pages']:
            route='/gestion-modulaire/'+page['space']+'/'+page['id']
            with self.subTest(route=route):
                status,raw,_=self.request(route,cookie)
                self.assertEqual(status,200)
                self.assertIn(('"id": "'+page['id']+'"').encode(),raw)
                self.assertIn(b'currentAdminAccount()',raw)
        self.assertEqual(self.request('/gestion-modulaire/admin/absent',cookie)[0],404)
        self.assertEqual(self.request('/client/pages/admin/members.html',cookie)[0],404)

    def test_failure_is_explicit_and_legacy_survives(self):
        cookie=self.login()
        with patch('manager_sources.compose',side_effect=ValueError('tampered')):
            self.assertEqual(self.request('/gestion-modulaire',cookie)[0],503)
            self.assertEqual(self.request('/gestion-legacy',cookie)[0],200)

    def test_modular_document_through_lan_gateway(self):
        import lan_server
        gateway=lan_server.make_lan_gateway(0,self.srv.server_port,extra_hosts=['192.168.50.10'])
        thread=threading.Thread(target=gateway.serve_forever,daemon=True);thread.start()
        try:
            cookie=self.login()
            conn=http.client.HTTPConnection('127.0.0.1',gateway.server_port,timeout=20)
            conn.request('GET','/gestion-modulaire',headers={'Cookie':cookie})
            response=conn.getresponse();raw=response.read();conn.close()
            self.assertEqual(response.status,200)
            self.assertEqual(raw,self.request('/gestion-legacy',cookie)[1])
        finally:
            gateway.shutdown();gateway.server_close();thread.join()


if __name__=='__main__':
    unittest.main()
