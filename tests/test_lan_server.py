import http.client
import json
import socket
import tempfile
import threading
import unittest
from contextlib import closing
from pathlib import Path
from unittest import mock

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
        cls.backend = server.make_server(cls.path, 0)
        cls.backend_thread = threading.Thread(target=cls.backend.serve_forever, daemon=True)
        cls.backend_thread.start()
        cls.host = '192.168.50.10'
        cls.gateway = lan_server.make_lan_gateway(0, cls.backend.server_port, extra_hosts=[cls.host])
        cls.gateway_thread = threading.Thread(target=cls.gateway.serve_forever, daemon=True)
        cls.gateway_thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.gateway.shutdown()
        cls.gateway.server_close()
        cls.gateway_thread.join()
        cls.backend.shutdown()
        cls.backend.server_close()
        cls.backend_thread.join()
        cls.temp.cleanup()

    def setUp(self):
        with closing(server.connect(self.path)) as db, db:
            db.execute('DELETE FROM attempts')
            db.execute('DELETE FROM sessions')
            db.execute('DELETE FROM revisions')
            db.execute('DELETE FROM members')
            db.execute('DELETE FROM teams')
        self.backup = {
            'format': 'GESTION_CLUB_FULL_BACKUP',
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

    def request(self, path, method='GET', data=None, session=None, host=None, origin=None, csrf=True, gateway=None):
        gateway = gateway or self.gateway
        port = gateway.server_port
        request_host = host or self.host
        connection = http.client.HTTPConnection('127.0.0.1', port, timeout=10)
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
        connection.request(method, path, body, headers)
        response = connection.getresponse()
        raw = response.read()
        cookie = response.getheader('Set-Cookie')
        content_type = response.getheader('Content-Type', '')
        status = response.status
        connection.close()
        return status, json.loads(raw) if 'json' in content_type else raw, cookie

    def login(self, name='lanadmin'):
        code, data, cookie = self.request(
            '/api/login',
            'POST',
            {'name': name, 'password': 'Fiction-only-password-123'},
        )
        self.assertEqual(code, 200)
        return cookie.split(';')[0], data['csrf']

    def test_01_gateway_binding_is_separate_from_backend(self):
        self.assertEqual(self.gateway.server_address[0], '0.0.0.0')
        self.assertNotEqual(self.gateway.server_port, self.backend.server_port)
        self.assertEqual(self.gateway.backend_port, self.backend.server_port)
        self.assertIn(self.host, self.gateway.allowed_hosts)

    def test_02_login_and_session_work_through_gateway(self):
        session = self.login()
        code, data, _ = self.request('/api/session', session=session)
        self.assertEqual(code, 200)
        self.assertEqual(data['user'], 'lanadmin')
        self.assertEqual(data['role'], 'admin')

    def test_03_foreign_host_and_origin_are_refused(self):
        port = self.gateway.server_port
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

    def test_denial_is_delivered_before_a_delayed_body(self):
        import socket
        port = self.gateway.server_port
        with socket.create_connection(('127.0.0.1', port), timeout=3) as connection:
            request = (
                'POST /api/login HTTP/1.1\r\n'
                f'Host: {self.host}:{port}\r\n'
                f'Origin: http://evil.invalid:{port}\r\n'
                'Content-Length: 10\r\n\r\n'
            )
            connection.sendall(request.encode('ascii'))
            response = http.client.HTTPResponse(connection)
            response.begin()
            self.assertEqual(response.status, 403)
            self.assertEqual(response.getheader('Connection'), 'close')
            self.assertIn('error', json.loads(response.read()))
            connection.sendall(b'late-body!')
            self.assertEqual(connection.recv(1), b'')

    def test_04_reader_role_stays_read_only_over_gateway(self):
        session = self.login('lanreader')
        code, _, _ = self.request(
            '/api/snapshot',
            'PUT',
            {'backup': self.backup, 'expectedRevision': 0, 'confirmed': True},
            session=session,
        )
        self.assertEqual(code, 403)

    def test_05_csrf_stays_required_over_gateway(self):
        session = self.login()
        code, _, _ = self.request(
            '/api/snapshot',
            'PUT',
            {'backup': self.backup, 'expectedRevision': 0, 'confirmed': True},
            session=session,
            csrf=False,
        )
        self.assertEqual(code, 403)

    def test_06_only_private_or_loopback_ipv4_is_lan(self):
        self.assertTrue(network_access.is_lan_address('127.0.0.1'))
        self.assertTrue(network_access.is_lan_address('192.168.1.25'))
        self.assertTrue(network_access.is_lan_address('10.0.0.25'))
        self.assertTrue(network_access.is_lan_address('172.20.1.25'))
        self.assertFalse(network_access.is_lan_address('8.8.8.8'))
        self.assertFalse(network_access.is_lan_address('example.invalid'))

    def test_07_discovered_lan_hosts_are_added_to_allowlist(self):
        with mock.patch.object(network_access, 'discover_lan_hosts', return_value=('192.168.1.20', '10.0.0.2')):
            hosts = network_access.build_allowed_hosts(True)
        self.assertIn('192.168.1.20', hosts)
        self.assertIn('10.0.0.2', hosts)
        self.assertIn('127.0.0.1', hosts)

    def test_08_backend_unavailable_returns_503(self):
        probe = socket.socket()
        probe.bind(('127.0.0.1', 0))
        unused = probe.getsockname()[1]
        probe.close()
        gateway = lan_server.make_lan_gateway(0, unused, extra_hosts=[self.host])
        thread = threading.Thread(target=gateway.serve_forever, daemon=True)
        thread.start()
        try:
            self.assertEqual(self.request('/', gateway=gateway)[0], 503)
        finally:
            gateway.shutdown()
            gateway.server_close()
            thread.join()

    def test_09_windows_lan_launcher_uses_gateway_port_and_logs(self):
        root = Path(__file__).resolve().parents[1]
        root_launcher = (root / 'DEMARRER_RESEAU_LOCAL.cmd').read_text(encoding='utf-8')
        launcher = (root / 'scripts/windows/DEMARRER_RESEAU_LOCAL.cmd').read_text(encoding='utf-8')
        self.assertIn('scripts\\windows\\DEMARRER_RESEAU_LOCAL.cmd', root_launcher)
        self.assertIn('8765', launcher)
        self.assertIn('8766', launcher)
        self.assertIn('server\\lan_server.py --backend-port 8765 --port 8766', launcher)
        self.assertIn('dernier_reseau_local.log', launcher)
        self.assertIn('discover_lan_hosts', launcher)
        self.assertNotIn('fermez-le avant', launcher.lower())
        self.assertNotIn('netsh advfirewall', launcher.lower())


if __name__ == '__main__':
    unittest.main(verbosity=2)
