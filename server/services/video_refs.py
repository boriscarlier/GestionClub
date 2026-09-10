"""References video de matchs pour Gestion Club V1.25.12."""
import ipaddress
import re
import secrets
import time
from urllib.parse import urlsplit

PROVIDERS = ('veo', 'external')
VISIBILITIES = ('public', 'private', 'unknown')


def initialize(db):
    db.executescript('''
    CREATE TABLE IF NOT EXISTS video_refs(
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL CHECK(provider IN ('veo','external')),
      url TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      match_id TEXT NOT NULL DEFAULT '',
      team_id TEXT NOT NULL DEFAULT '',
      match_date TEXT NOT NULL DEFAULT '',
      opponent TEXT NOT NULL DEFAULT '',
      competition TEXT NOT NULL DEFAULT '',
      visibility TEXT NOT NULL DEFAULT 'unknown' CHECK(visibility IN ('public','private','unknown')),
      created REAL NOT NULL,
      updated REAL NOT NULL,
      actor TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_video_refs_url ON video_refs(url);
    CREATE INDEX IF NOT EXISTS idx_video_refs_match ON video_refs(match_id);
    CREATE INDEX IF NOT EXISTS idx_video_refs_team ON video_refs(team_id);
    CREATE INDEX IF NOT EXISTS idx_video_refs_date ON video_refs(match_date);
    ''')


def clean_text(value, maximum=200):
    text = str(value or '').strip()
    if len(text) > maximum:
        raise ValueError('Texte trop long.')
    return text


def validate_date(value):
    text = clean_text(value, 10)
    if text and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', text):
        raise ValueError('Date attendue au format AAAA-MM-JJ.')
    return text


def classify_url(value):
    text = clean_text(value, 2048)
    try:
        parsed = urlsplit(text)
        host = (parsed.hostname or '').lower()
    except ValueError:
        raise ValueError('Lien video invalide.') from None
    if parsed.scheme != 'https' or not host or parsed.username or parsed.password or parsed.fragment:
        raise ValueError('Lien video HTTPS requis.')
    try:
        address = ipaddress.ip_address(host)
    except ValueError:
        address = None
    if address is not None and (address.is_private or address.is_loopback or address.is_link_local):
        raise ValueError('Une adresse locale ne peut pas etre enregistree comme lien video.')
    if host == 'app.veo.co':
        if not re.fullmatch(r'/matches/[^/?#]+/?', parsed.path):
            raise ValueError('Lien Veo attendu sous la forme https://app.veo.co/matches/...')
        return 'veo', text
    return 'external', text


def normalize_payload(payload):
    if not isinstance(payload, dict):
        raise ValueError('Donnees video invalides.')
    provider, url = classify_url(payload.get('url'))
    visibility = clean_text(payload.get('visibility') or 'unknown', 16).lower()
    if visibility not in VISIBILITIES:
        raise ValueError('Visibilite video invalide.')
    return {
        'provider': provider,
        'url': url,
        'title': clean_text(payload.get('title'), 200),
        'matchId': clean_text(payload.get('matchId'), 120),
        'teamId': clean_text(payload.get('teamId'), 120),
        'matchDate': validate_date(payload.get('matchDate')),
        'opponent': clean_text(payload.get('opponent'), 160),
        'competition': clean_text(payload.get('competition'), 160),
        'visibility': visibility,
    }


def row_dict(row):
    return {
        'id': row['id'],
        'provider': row['provider'],
        'url': row['url'],
        'title': row['title'],
        'matchId': row['match_id'],
        'teamId': row['team_id'],
        'matchDate': row['match_date'],
        'opponent': row['opponent'],
        'competition': row['competition'],
        'visibility': row['visibility'],
        'created': row['created'],
        'updated': row['updated'],
        'actor': row['actor'],
    }


def create(db, payload, actor):
    data = normalize_payload(payload)
    ident = 'video-' + secrets.token_hex(12)
    now = time.time()
    try:
        db.execute('''
          INSERT INTO video_refs(id,provider,url,title,match_id,team_id,match_date,opponent,competition,visibility,created,updated,actor)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
        ''', (
            ident, data['provider'], data['url'], data['title'], data['matchId'], data['teamId'],
            data['matchDate'], data['opponent'], data['competition'], data['visibility'], now, now, actor
        ))
    except Exception as exc:
        if 'UNIQUE constraint failed: video_refs.url' in str(exc):
            raise ValueError('Ce lien video est deja enregistre.') from None
        raise
    return get(db, ident)


def update(db, ident, payload, actor):
    current = db.execute('SELECT * FROM video_refs WHERE id=?', (ident,)).fetchone()
    if not current:
        return None
    merged = row_dict(current)
    if not isinstance(payload, dict):
        raise ValueError('Donnees video invalides.')
    for source, target in (
        ('url', 'url'), ('title', 'title'), ('matchId', 'matchId'), ('teamId', 'teamId'),
        ('matchDate', 'matchDate'), ('opponent', 'opponent'), ('competition', 'competition'),
        ('visibility', 'visibility')
    ):
        if source in payload:
            merged[target] = payload[source]
    data = normalize_payload(merged)
    try:
        db.execute('''
          UPDATE video_refs SET provider=?,url=?,title=?,match_id=?,team_id=?,match_date=?,opponent=?,competition=?,visibility=?,updated=?,actor=?
          WHERE id=?
        ''', (
            data['provider'], data['url'], data['title'], data['matchId'], data['teamId'], data['matchDate'],
            data['opponent'], data['competition'], data['visibility'], time.time(), actor, ident
        ))
    except Exception as exc:
        if 'UNIQUE constraint failed: video_refs.url' in str(exc):
            raise ValueError('Ce lien video est deja enregistre.') from None
        raise
    return get(db, ident)


def get(db, ident):
    row = db.execute('SELECT * FROM video_refs WHERE id=?', (ident,)).fetchone()
    return None if not row else row_dict(row)


def listing(db, params):
    q = clean_text(params.get('q', [''])[0], 200).lower()
    team_id = clean_text(params.get('teamId', [''])[0], 120)
    match_id = clean_text(params.get('matchId', [''])[0], 120)
    clauses = []
    args = []
    if team_id:
        clauses.append('team_id=?')
        args.append(team_id)
    if match_id:
        clauses.append('match_id=?')
        args.append(match_id)
    if q:
        clauses.append("lower(title||' '||opponent||' '||competition||' '||url) LIKE ?")
        args.append('%' + q + '%')
    where = (' WHERE ' + ' AND '.join(clauses)) if clauses else ''
    rows = db.execute(
        'SELECT * FROM video_refs' + where + ' ORDER BY match_date DESC, created DESC, id DESC LIMIT 500', args
    ).fetchall()
    return {'total': len(rows), 'videos': [row_dict(row) for row in rows]}
