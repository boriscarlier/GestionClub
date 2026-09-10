"""API HTTP et interface des references video V1.25.12."""
import hmac
from contextlib import closing
from urllib.parse import parse_qs, urlsplit

import server
from services import video_refs

UI_FILES = {
    '/videos': ('videos.html', 'text/html; charset=utf-8'),
    '/videos.js': ('videos.js', 'text/javascript; charset=utf-8'),
    '/videos.css': ('videos.css', 'text/css; charset=utf-8'),
}


def is_video_path(raw_path):
    path = urlsplit(raw_path).path
    return path in UI_FILES or path == '/api/videos' or path.startswith('/api/videos/')


def initialize(path):
    with closing(server.connect(path)) as db, db:
        video_refs.initialize(db)


def _check_local_origin(handler):
    origin = 'http://127.0.0.1:' + str(handler.server.server_port)
    if handler.headers.get('Host') != origin[7:]:
        raise server.Problem(403, 'Adresse du serveur non autorisee.')
    if handler.command != 'GET' and handler.headers.get('Origin') != origin:
        raise server.Problem(403, 'Origine non autorisee.')


def route(handler):
    _check_local_origin(handler)
    parsed = urlsplit(handler.path)
    path = parsed.path
    with closing(server.connect(handler.server.db_path)) as db:
        user = handler.session(db)
        if handler.command != 'GET' and not hmac.compare_digest(
            handler.headers.get('X-CSRF-Token', ''), user['csrf']
        ):
            raise server.Problem(403, 'Jeton de session invalide.')

        if path in UI_FILES and handler.command == 'GET':
            filename, mime = UI_FILES[path]
            return handler.send(200, (server.CLIENT_ROOT / filename).read_bytes(), mime=mime)

        if path == '/api/videos' and handler.command == 'GET':
            return handler.send(200, video_refs.listing(db, parse_qs(parsed.query)))

        if path == '/api/videos' and handler.command == 'POST':
            if user['role'] not in ('admin', 'editor'):
                raise server.Problem(403, 'Ce compte est en lecture seule.')
            try:
                with db:
                    video = video_refs.create(db, handler.body(), user['user'])
            except ValueError as exc:
                raise server.Problem(400, str(exc)) from None
            return handler.send(201, {'video': video})

        if path.startswith('/api/videos/'):
            ident = path.rsplit('/', 1)[-1]
            if not ident or '/' in ident:
                raise server.Problem(404, 'Reference video inexistante.')
            if handler.command == 'GET':
                video = video_refs.get(db, ident)
                if not video:
                    raise server.Problem(404, 'Reference video inexistante.')
                return handler.send(200, {'video': video})
            if handler.command == 'PUT':
                if user['role'] not in ('admin', 'editor'):
                    raise server.Problem(403, 'Ce compte est en lecture seule.')
                try:
                    with db:
                        video = video_refs.update(db, ident, handler.body(), user['user'])
                except ValueError as exc:
                    raise server.Problem(400, str(exc)) from None
                if not video:
                    raise server.Problem(404, 'Reference video inexistante.')
                return handler.send(200, {'video': video})

    raise server.Problem(404, 'Reference video inexistante.')
