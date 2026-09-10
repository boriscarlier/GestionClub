import http.client
import json
import tempfile
import threading
import unittest
from contextlib import closing
from pathlib import Path

import lan_server
import network_access
import server


class LanServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.path = Path(cls.temp.name) / 'lan.sqlite3'
        server.initialize(cls.path)
        server.add_user(cls.path, 'lanadmin', 'Fiction-only-password-123', 'admin')
        server.add_user(cls.path, 'lanreader', 'Fiction-only-password-123', 'reader')
        cls.host = '192.168.50.10'
        cls.srv = lan_server.make_lan_server(cls.path, 0, extra_hosts=[cls.host])
        cls.thread = threading.Thread(target=cls.srv.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.srv.shutdown()
        cls.srv.server_close()
        cls.thread.join()
        cls.temp.cleanup()

    def setUp(self):
        with closing(server.connect(self.path)) as db, db:
            db.execute('DELETE FROM attempts')
            db.execute('DELETE FROM sessions')
            db.execute('DELETE FROM revisions')
            db.execute('DELETE FROM members')
            db.execute('DELETE FROM teams')
        self.backup = {
            'format': 'FC_LA_COUR_FULL_BACKUP',
            'schemaVersion': 1,
            'build': 'V1.25.10',
            'state': {
                'members': [],
                'teams': [],
                'matches': [],
                'accounts': [],
                'clubProfile': {'official': {'affiliation': '000000'}},
            },
            'lineups': {},
        }

    def request(self, path, method='GET', data=None, session=None, host=None, origin=None, csrf=True):
        port = self.srv.server_port
        request_host = host or self.host
        conn = http.client.HTTPConnection('127.0.0.1', port, timeout=10)
        headers = {
            'Host': request_host + ':' + str(port),
            'Origin': origin or 'http://' + request_host + ':' + str(port),
            'Content-Type': 'application/json',
        }
        if session:
            headers['Cookie'] = session[0]
            if csrf:
                headers['X-CSRF-Token'] = session[1]
        body = None if data is None else json.dumps(data)
        conn.request(method, path, body, headers)
        response = conn.getresponse()
        raw = response.read()
        cookie = response.getheader('Set-Cookie')
        content_type = response.getheader('Content-Type', '')
        status = response.status
        conn.close()
        return status, json.loads(raw) if 'json' in content_type else raw, cookie

    def login(self, name='lanadmin'):
        code, data, cookie = self.request(
            '/api/login',
            'POST',
            {'name': name, 'password': 'Fiction-only-password-123'},
        )
        self.assertEqual(code, 200)
        return cookie.split(';')[0], data['csrf']

    def test_01_lan_binding_and_allowed_host(self):
        self.assertEqual(self.srv.server_address[0], '0.0.0.0')
        self.assertIn(self.host, self.srv.allowed_hosts)
        self.assertIn('127.0.0.1', self.srv.allowed_hosts)

    def test_02_login_and_session_work_through_lan_host(self):
        session = self.login()
        code, data, _ = self.request('/api/session', session=session)
        self.assertEqual(code, 200)
        self.assertEqual(data['user'], 'lanadmin')
        self.assertEqual(data['role'], 'admin')

    def test_03_foreign_host_and_origin_are_refused(self):
        port = self.srv.server_port
        self.assertEqual(self.request('/', host='evil.invalid')[0], 403)
        self.assertEqual(
            self.request(
                '/api/login',
                'POST',
                {'name': 'lanadmin', 'password': 'Fiction-only-password-123'},
                origin='http://evil.invalid:' + str(port),
            )[0],
            403,
        )
        self.assertEqual(self.request('/', host='8.8.8.8')[0], 403)

    def test_04_reader_role_stays_read_only_over_lan(self):
        session = self.login('lanreader')
        code, _, _ = self.request(
            '/api/snapshot',
            'PUT',
            {'backup': self.backup, 'expectedRevision': 0, 'confirmed': True},
            session=session,
        )
        self.assertEqual(code, 403)

    def test_05_csrf_stays_required_over_lan(self):
        session = self.login()
        code, _, _ = self.request(
            '/api/snapshot',
            'PUT',
            {'backup': self.backup, 'expectedRevision': 0, 'confirmed': True},
            session=session,
            csrf=False,
        )
        self.assertEqual(code, 403)

    def test_06_only_local_ipv4_clients_are_classified_as_lan(self):
        self.assertTrue(network_access.is_lan_address('127.0.0.1'))
        self.assertTrue(network_access.is_lan_address('192.168.1.25'))
        self.assertTrue(network_access.is_lan_address('10.0.0.25'))
        self.assertFalse(network_access.is_lan_address('8.8.8.8'))
        self.assertFalse(network_access.is_lan_address('example.invalid'))

    def test_07_windows_lan_launcher_is_explicit_and_non_destructive(self):
        root = Path(__file__).resolve().parents[1]
        root_launcher = (root / 'DEMARRER_RESEAU_LOCAL.cmd').read_text(encoding='utf-8')
        launcher = (root / 'scripts/windows/DEMARRER_RESEAU_LOCAL.cmd').read_text(encoding='utf-8')
        self.assertIn('scripts\\windows\\DEMARRER_RESEAU_LOCAL.cmd', root_launcher)
        self.assertIn('FCLC_DATA_DIR', launcher)
        self.assertIn('FCLC_DATA_PATH', launcher)
        self.assertIn('TcpClient', launcher)
        self.assertIn('server\\lan_server.py start --data "%FCLC_DATA_PATH%"', launcher)
        self.assertIn('ne redirigez pas le port 8765', launcher.lower())
        self.assertNotIn('netsh advfirewall', launcher.lower())


if __name__ == '__main__':
    unittest.main(verbosity=2)
