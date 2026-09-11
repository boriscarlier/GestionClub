"""Runtime CLUB EXEMPLE Gestion Club V1.26.1 base sur le noyau serveur stabilise."""
import argparse
import getpass
import re
import secrets
import threading
import webbrowser
from contextlib import closing
from pathlib import Path
from urllib.parse import urlsplit

import server

VERSION = 'V1.26.1'
VERSION_BYTES = VERSION.encode('utf-8')
MAX_BACKUP_VERSION = (1, 26, 1, 0)
_BASE_HANDLER = server.Handler
ASSET_ROOT = server.PROJECT_ROOT / 'client' / 'assets'
STATIC_ASSETS = {
    '/assets/brand/club-logo.png': (ASSET_ROOT / 'brand' / 'club-logo.png', 'image/png'),
}


def validate(payload):
    if not isinstance(payload, dict) or not re.fullmatch(r'(?:[A-Z][A-Z0-9]*_)+FULL_BACKUP', str(payload.get('format', ''))) or payload.get('schemaVersion') != 1:
        raise server.Problem(400, 'Choisir une sauvegarde complète Gestion Club.')
    build = str(payload.get('build', ''))
    if not re.fullmatch(r'V\d+\.\d+\.\d+(?:\.\d+)?', build):
        raise server.Problem(400, 'Version de sauvegarde non reconnue.')
    parts = tuple(map(int, build[1:].split('.')))
    if parts + (0,) * (4 - len(parts)) > MAX_BACKUP_VERSION:
        raise server.Problem(400, 'Sauvegarde plus récente que ce serveur.')
    state = payload.get('state')
    if not isinstance(state, dict):
        raise server.Problem(400, 'Base invalide.')
    for key in ('members', 'matches', 'teams', 'accounts'):
        rows = state.get(key)
        if not isinstance(rows, list):
            raise server.Problem(400, 'Collection absente : ' + key)
        seen = set()
        for row in rows:
            ident = row.get('id') if isinstance(row, dict) else None
            if not isinstance(ident, str) or not ident.strip() or ident in seen:
                raise server.Problem(400, 'Identifiant absent ou dupliqué : ' + key)
            seen.add(ident)
    if not isinstance(payload.get('lineups'), dict) or not isinstance(payload.get('feedback', []), list) or not isinstance(payload.get('scenarios', {}), dict):
        raise server.Problem(400, 'Compositions, retours ou scénarios invalides.')
    club = state.get('clubProfile', {}).get('official', {}).get('affiliation', '')
    if not isinstance(club, str) or not re.fullmatch(r'\d{6}', club):
        raise server.Problem(400, 'Une affiliation à six chiffres est requise dans la sauvegarde.')
    return club


class CurrentHandler(_BASE_HANDLER):
    server_version = 'GestionClub/1.26.1'

    def send(self, status, value, cookie=None, mime='application/json; charset=utf-8', csp=None):
        if isinstance(value, bytes) and mime.startswith('text/html'):
            value = value.replace(b'V1.25.10', VERSION_BYTES).replace(b'V1.25.12.2', VERSION_BYTES).replace(b'V1.25.12.3', VERSION_BYTES)
        elif isinstance(value, dict) and value.get('serverBuild') in ('V1.25.10', 'V1.25.12.2', 'V1.25.12.3'):
            value = dict(value)
            value['serverBuild'] = VERSION
        return super().send(status, value, cookie=cookie, mime=mime, csp=csp)

    def route(self):
        path = urlsplit(self.path).path
        static = STATIC_ASSETS.get(path)
        if self.command == 'GET' and static is not None:
            origin = 'http://127.0.0.1:' + str(self.server.server_port)
            if self.headers.get('Host') != origin[7:]:
                raise server.Problem(403, 'Adresse du serveur non autorisée.')
            file_path, mime = static
            if not file_path.is_file():
                raise server.Problem(404, 'Ressource statique introuvable.')
            return self.send(200, file_path.read_bytes(), mime=mime)
        return super().route()


server.validate = validate
server.Handler = CurrentHandler


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['start', 'add-user', 'reset-password'], nargs='?', default='start')
    parser.add_argument('--data', type=Path, default=server.default_data_path())
    args = parser.parse_args()
    server.initialize(args.data)
    with closing(server.connect(args.data)) as db:
        empty = db.execute('SELECT count(*) FROM users').fetchone()[0] == 0
    if args.command in ('add-user','reset-password') or empty:
        if empty and args.command == 'start':
            print('Aucun compte serveur trouve : creez le premier compte administrateur, puis le serveur demarrera.')
        print('Comptes serveur distincts des comptes du HTML. Aucun mot de passe par défaut.')
        name=input('Identifiant serveur : ').strip()
        password=getpass.getpass('Mot de passe (12 caractères minimum, saisie invisible) : ')
        if password!=getpass.getpass('Confirmer le mot de passe : '):
            raise SystemExit('Confirmation différente.')
        if args.command=='reset-password':
            if not 12<=len(password)<=256:
                raise SystemExit('Longueur invalide.')
            salt=secrets.token_hex(16)
            with closing(server.connect(args.data)) as db,db:
                cur=db.execute('UPDATE users SET salt=?,password=? WHERE name=?',(salt,server.password_hash(password,salt),name))
                if not cur.rowcount:
                    raise SystemExit('Compte introuvable.')
                db.execute('DELETE FROM sessions WHERE user=?',(name,))
        else:
            role='admin' if empty else input('Rôle (admin/editor/reader) : ').strip()
            server.add_user(args.data,name,password,role)
        print('Compte enregistré.')
        if args.command!='start':
            return
        print('Demarrage du serveur local...')
    srv=server.make_server(args.data)
    srv.watch.start()
    print('Base de donnees : ' + str(args.data))
    print('CLUB EXEMPLE ' + VERSION + ' — http://127.0.0.1:8765 — Ctrl+C pour arrêter.')
    threading.Timer(0.5, webbrowser.open, args=('http://127.0.0.1:8765/',)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.watch.stop.set()
        srv.server_close()


if __name__=='__main__':
    main()
