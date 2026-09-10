import http.client
import importlib
import json
import tempfile
import threading
import unittest
from contextlib import closing
from pathlib import Path

import server


class VideoReferenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        importlib.import_module('current_server')
        cls.temp = tempfile.TemporaryDirectory()
        cls.path = Path(cls.temp.name) / 'videos.sqlite3'
        server.initialize(cls.path)
        server.add_user(cls.path, 'videoadmin', 'Fiction-only-password-123', 'admin')
        server.add_user(cls.path, 'videoreader', 'Fiction-only-password-123', 'reader')
        cls.srv = server.make_server(cls.path, 0)
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
            db.execute('DELETE FROM video_refs')

    def request(self, path, method='GET', data=None, session=None, csrf=True):
        port = self.srv.server_port
        conn = http.client.HTTPConnection('127.0.0.1', port, timeout=10)
        headers = {
            'Host': '127.0.0.1:' + str(port),
            'Origin': 'http://127.0.0.1:' + str(port),
            'Content-Type': 'application/json',
        }
        if session:
            headers['Cookie'] = session[0]
            if csrf:
                headers['X-CSRF-Token'] = session[1]
        conn.request(method, path, None if data is None else json.dumps(data), headers)
        response = conn.getresponse()
        raw = response.read()
        cookie = response.getheader('Set-Cookie')
        ctype = response.getheader('Content-Type', '')
        status = response.status
        conn.close()
        return status, json.loads(raw) if 'json' in ctype else raw, cookie

    def login(self, name='videoadmin'):
        code, data, cookie = self.request(
            '/api/login', 'POST', {'name': name, 'password': 'Fiction-only-password-123'}
        )
        self.assertEqual(code, 200)
        return cookie.split(';')[0], data['csrf']

    def sample(self, url='https://app.veo.co/matches/fc-la-cour-test-match/'):
        return {
            'url': url,
            'title': 'FC LA COUR - Adversaire',
            'matchId': 'match-2026-09-10',
            'teamId': 'team-r3',
            'matchDate': '2026-09-10',
            'opponent': 'Adversaire',
            'competition': 'R3',
            'visibility': 'public',
        }

    def test_01_create_veo_reference(self):
        session = self.login()
        code, data, _ = self.request('/api/videos', 'POST', self.sample(), session)
        self.assertEqual(code, 201)
        video = data['video']
        self.assertEqual(video['provider'], 'veo')
        self.assertEqual(video['matchId'], 'match-2026-09-10')
        self.assertEqual(video['teamId'], 'team-r3')
        self.assertEqual(video['visibility'], 'public')

    def test_02_list_and_filter_by_team(self):
        session = self.login()
        self.request('/api/videos', 'POST', self.sample(), session)
        code, data, _ = self.request('/api/videos?teamId=team-r3', session=session)
        self.assertEqual(code, 200)
        self.assertEqual(data['total'], 1)
        self.assertEqual(data['videos'][0]['competition'], 'R3')

    def test_03_reader_cannot_write(self):
        session = self.login('videoreader')
        self.assertEqual(self.request('/api/videos', 'POST', self.sample(), session)[0], 403)

    def test_04_csrf_required(self):
        session = self.login()
        self.assertEqual(self.request('/api/videos', 'POST', self.sample(), session, csrf=False)[0], 403)

    def test_05_veo_link_shape_is_validated(self):
        session = self.login()
        bad = self.sample('https://app.veo.co/library/example')
        code, data, _ = self.request('/api/videos', 'POST', bad, session)
        self.assertEqual(code, 400)
        self.assertIn('https://app.veo.co/matches/', data['error'])

    def test_06_external_https_reference_is_allowed(self):
        session = self.login()
        code, data, _ = self.request(
            '/api/videos', 'POST', self.sample('https://video.example.test/match/123'), session
        )
        self.assertEqual(code, 201)
        self.assertEqual(data['video']['provider'], 'external')

    def test_07_duplicate_url_is_rejected(self):
        session = self.login()
        self.assertEqual(self.request('/api/videos', 'POST', self.sample(), session)[0], 201)
        code, data, _ = self.request('/api/videos', 'POST', self.sample(), session)
        self.assertEqual(code, 400)
        self.assertIn('deja enregistre', data['error'])

    def test_08_update_reference(self):
        session = self.login()
        video = self.request('/api/videos', 'POST', self.sample(), session)[1]['video']
        code, data, _ = self.request(
            '/api/videos/' + video['id'],
            'PUT',
            {'opponent': 'Nouvel adversaire', 'visibility': 'private'},
            session,
        )
        self.assertEqual(code, 200)
        self.assertEqual(data['video']['opponent'], 'Nouvel adversaire')
        self.assertEqual(data['video']['visibility'], 'private')

    def test_09_video_page_requires_session_and_is_served(self):
        self.assertEqual(self.request('/videos')[0], 401)
        session = self.login()
        code, raw, _ = self.request('/videos', session=session)
        self.assertEqual(code, 200)
        self.assertIn('Vidéos de matchs'.encode('utf-8'), raw)
        self.assertIn(b'id="videoForm"', raw)
        self.assertIn(b'/videos.js', raw)
        self.assertEqual(self.request('/videos.js', session=session)[0], 200)

    def test_10_local_video_urls_are_rejected(self):
        session = self.login()
        code, data, _ = self.request(
            '/api/videos', 'POST', self.sample('https://127.0.0.1/video'), session
        )
        self.assertEqual(code, 400)
        self.assertIn('adresse locale', data['error'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
