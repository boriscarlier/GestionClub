"""Veille publique bornée, indépendante du dépôt des sauvegardes du club."""
import hashlib
import ipaddress
import json
import re
import socket
import ssl
import sqlite3
import threading
import time
import unicodedata
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from contextlib import closing, contextmanager
from html.parser import HTMLParser
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

SOURCES = {
    'lrf': {'name': 'Ligue de football exemple', 'url': 'https://example.invalid/ligue/',
            'hosts': ('example.invalid',), 'pages': ('', 'technique/', 'formations/'),
            'description': 'Actualités, technique, formations et liens de documents publics.', 'enabled': False},
    'mairie': {'name': 'Mairie de Ville Exemple', 'url': 'https://example.invalid/mairie/',
              'hosts': ('example.invalid', 'www.example.invalid'), 'pages': ('',),
              'description': 'Associations, CLUB EXEMPLE et quartier exemple.', 'enabled': True},
}
STATUSES = ('unread', 'read', 'action', 'archived')
MAX_BYTES = 2 * 1024 * 1024
MAX_ITEMS = 150
MAX_ENTRIES = 10000
MAX_VERSIONS = 10
WEEK = 7 * 86400


class WatchError(Exception):
    def __init__(self, status, message):
        self.status, self.message = status, message
        super().__init__(message)


def connect(path):
    db = sqlite3.connect(path, timeout=15)
    db.row_factory = sqlite3.Row
    return db


def initialize(path):
    with closing(connect(path)) as db, db:
        db.executescript('''
        CREATE TABLE IF NOT EXISTS watch_sources (
          id TEXT PRIMARY KEY, enabled INTEGER NOT NULL DEFAULT 0, interval_days INTEGER NOT NULL DEFAULT 7,
          next_run REAL NOT NULL, last_success REAL, version INTEGER NOT NULL DEFAULT 1);
        CREATE TABLE IF NOT EXISTS watch_runs (
          id INTEGER PRIMARY KEY AUTOINCREMENT, source TEXT NOT NULL, actor TEXT NOT NULL,
          started REAL NOT NULL, ended REAL, status TEXT NOT NULL, summary TEXT NOT NULL DEFAULT '{}');
        CREATE TABLE IF NOT EXISTS watch_entries (
          id TEXT PRIMARY KEY, source TEXT NOT NULL, url TEXT NOT NULL, title TEXT NOT NULL,
          excerpt TEXT NOT NULL, published TEXT NOT NULL, topics TEXT NOT NULL,
          fingerprint TEXT NOT NULL, first_seen REAL NOT NULL, last_seen REAL NOT NULL,
          changed REAL NOT NULL, status TEXT NOT NULL DEFAULT 'unread', version INTEGER NOT NULL DEFAULT 1,
          origin_page TEXT NOT NULL, is_document INTEGER NOT NULL DEFAULT 0,
          UNIQUE(source,url));
        CREATE TABLE IF NOT EXISTS watch_versions (
          id INTEGER PRIMARY KEY AUTOINCREMENT, entry_id TEXT NOT NULL, observed REAL NOT NULL,
          title TEXT NOT NULL, excerpt TEXT NOT NULL, published TEXT NOT NULL, fingerprint TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS watch_actions (
          id INTEGER PRIMARY KEY AUTOINCREMENT, entry_id TEXT NOT NULL, actor TEXT NOT NULL,
          created REAL NOT NULL, old_status TEXT NOT NULL, new_status TEXT NOT NULL);
        ''')
        if 'observation_mode' not in {r[1] for r in db.execute('PRAGMA table_info(watch_entries)')}:
            db.execute("ALTER TABLE watch_entries ADD COLUMN observation_mode TEXT NOT NULL DEFAULT 'network'")
        for key, source in SOURCES.items():
            db.execute('INSERT OR IGNORE INTO watch_sources(id,enabled,next_run) VALUES(?,?,?)',
                       (key, int(source['enabled']), time.time() + WEEK))


def clean(text, limit=1200):
    return re.sub(r'\s+', ' ', str(text or '')).strip()[:limit]


def normalize(text):
    return ''.join(c for c in unicodedata.normalize('NFKD', text) if not unicodedata.combining(c)).casefold()


def topics_for(text):
    text = normalize(text)
    patterns = {
        'CLUB EXEMPLE': r'\bclub exemple\b|\bclub demo\b',
        'Quartier Exemple': r'\bquartier exemple\b|\bstade municipal\b',
        'Associations': r'\bassociati(?:on|ons|f|fs|ve|ves)\b|\bsubvention\w*|\bappel a projets\b',
        'Convocations': r'\bconvoc\w*|\bdetect\w*|\bselection\w*|\bespoirs du foot\b|\brassemblement\w*',
        'Formations': r'\bformation\w*|\brecyclage\w*|\bbmf\b|\bbef\b',
        'Réunions': r'\breunions\b|\breunion (?:de|du|des|avec|le|technique)\b|\bassemblee\w*|\bconseil municipal\b',
        'Règlements': r'\breglement\w*|\bdisciplin\w*|\bproces.verbal\b|\bderogation\w*',
    }
    return [label for label, pattern in patterns.items() if re.search(pattern, text)]


def safe_url(url, source, base=None):
    if not isinstance(source, str) or source not in SOURCES:
        raise WatchError(400, 'Source inconnue.')
    if not isinstance(url, str) or len(url) > 2048 or re.search(r'[\x00-\x20\x7f\\]', url):
        raise WatchError(400, 'Lien public invalide.')
    source_base = base or SOURCES[source]['url']
    if url.startswith('/'):
        source_path = urlsplit(SOURCES[source]['url']).path.rstrip('/')
        if source_path:
            url = source_path + url
    raw = urljoin(source_base, url)
    p = urlsplit(raw)
    try:
        port = p.port
    except ValueError:
        raise WatchError(400, 'Port invalide.')
    if p.scheme != 'https' or p.hostname not in SOURCES[source]['hosts'] or p.username or p.password or port not in (None, 443):
        raise WatchError(400, 'Lien hors du site officiel autorisé.')
    root_path = urlsplit(SOURCES[source]['url']).path.rstrip('/') + '/'
    if root_path != '/' and not ((p.path or '/') + '/').startswith(root_path):
        raise WatchError(400, 'Lien hors du périmètre public autorisé.')
    query = [(k, v) for k, v in parse_qsl(p.query, keep_blank_values=True)
             if not k.lower().startswith('utm_') and k.lower() not in ('fbclid', 'gclid', 'version')]
    return urlunsplit(('https', p.hostname, p.path or '/', urlencode(sorted(query)), ''))


def ensure_public_host(url):
    addresses = socket.getaddrinfo(urlsplit(url).hostname, 443, type=socket.SOCK_STREAM)
    if not addresses or any(not ipaddress.ip_address(row[4][0]).is_global for row in addresses):
        raise WatchError(400, 'Adresse réseau non publique refusée.')


class RestrictedRedirect(urllib.request.HTTPRedirectHandler):
    def __init__(self, source):
        self.source = source
        self.redirects = 0

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.redirects += 1
        if self.redirects > 3:
            raise WatchError(400, 'Trop de redirections.')
        url = safe_url(newurl, self.source, req.full_url)
        ensure_public_host(url)
        return super().redirect_request(req, fp, code, msg, headers, url)


def fetch_public(url, source):
    url = safe_url(url, source)
    ensure_public_host(url)
    opener = urllib.request.build_opener(RestrictedRedirect(source))
    request = urllib.request.Request(url, headers={
        'User-Agent': 'FC-LA-COUR-Veille/1.24.3 (public pages, limited collection)',
        'Accept': 'text/html,application/rss+xml,application/atom+xml,application/xml,text/xml',
        'Accept-Encoding': 'identity',
    })
    with opener.open(request, timeout=10) as response:
        mime = response.headers.get_content_type()
        if mime not in ('text/html', 'application/xhtml+xml', 'application/rss+xml',
                        'application/atom+xml', 'application/xml', 'text/xml'):
            raise WatchError(400, 'Ce contenu n’est pas une page HTML ou un flux XML.')
        deadline = time.monotonic() + 15
        chunks = []
        size = 0
        while True:
            if time.monotonic() > deadline:
                raise TimeoutError()
            chunk = response.read1(min(65536, MAX_BYTES + 1 - size))
            if not chunk:
                break
            size += len(chunk)
            if size > MAX_BYTES:
                raise WatchError(413, 'Page trop volumineuse (limite : 2 Mo).')
            chunks.append(chunk)
        charset = response.headers.get_content_charset() or 'utf-8'
        try:
            text = b''.join(chunks).decode(charset, errors='replace')
        except LookupError:
            text = b''.join(chunks).decode('utf-8', errors='replace')
        return text, mime, safe_url(response.geturl(), source)


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links, self.feeds, self.current = [], [], None
        self.skip = 0
        self.heading = False
        self.block_tags = ('script', 'style', 'noscript')

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in self.block_tags:
            self.skip += 1
        if self.skip:
            return
        if tag == 'link' and 'alternate' in a.get('rel', '').lower() and a.get('type', '') in ('application/rss+xml', 'application/atom+xml'):
            self.feeds.append(a.get('href', ''))
        if tag == 'a':
            self.current = {'url': a.get('href', ''), 'parts': [], 'fallback': a.get('title', ''), 'headings': []}
        if tag in ('h1','h2','h3','h4','h5','h6') and self.current:
            self.heading = True
        if tag == 'img' and self.current and a.get('alt'):
            self.current['parts'].append(a['alt'])

    def handle_endtag(self, tag):
        if tag in self.block_tags:
            self.skip = max(0, self.skip - 1)
        if tag in ('h1','h2','h3','h4','h5','h6'):
            self.heading = False
        if tag == 'a' and self.current:
            self.current['title'] = clean(' '.join(self.current.pop('headings')) or ' '.join(self.current.pop('parts')) or self.current.pop('fallback'), 240)
            self.links.append(self.current)
            self.current = None

    def handle_data(self, text):
        if not self.skip and self.current:
            self.current['parts'].append(text)
            if self.heading: self.current['headings'].append(text)


class TextParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = max(0, self.skip - 1)

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def plain_html(value):
    parser = TextParser()
    parser.feed(value)
    return clean(' '.join(parser.parts))


def parse_feed(text, source, page):
    if '<!DOCTYPE' in text.upper() or '<!ENTITY' in text.upper():
        raise WatchError(400, 'Déclarations XML non acceptées.')
    root = ET.fromstring(text)
    local = lambda tag: tag.split('}')[-1]
    if local(root.tag) not in ('rss', 'feed', 'RDF'):
        raise WatchError(400, 'Flux RSS/Atom non reconnu.')
    result = []
    for item in root.iter():
        if local(item.tag) not in ('item', 'entry'):
            continue
        title, link, summary, published = '', '', '', ''
        for child in item:
            tag = local(child.tag)
            val = ''.join(child.itertext())
            if tag == 'title': title = plain_html(val)[:240]
            elif tag == 'link' and child.attrib.get('rel', 'alternate') == 'alternate':
                link = child.attrib.get('href', val)
            elif tag in ('description', 'summary') and not summary: summary = plain_html(val)[:700]
            elif tag in ('pubDate', 'published', 'date') and not published: published = clean(val, 100)
        try:
            url = safe_url(link, source, page)
        except WatchError:
            continue
        if title and link:
            result.append({'url': url, 'title': title, 'excerpt': summary, 'published': published,
                           'origin_page': page, 'is_document': int(urlsplit(url).path.lower().endswith('.pdf'))})
        if len(result) >= MAX_ITEMS:
            break
    return result


def parse_links(text, source, page):
    parser = PageParser()
    parser.feed(text)
    result = []
    for link in parser.links:
        title = link['title']
        if len(title) < 15 or not link['url'] or link['url'].startswith('#'):
            continue
        try:
            url = safe_url(link['url'], source, page)
        except WatchError:
            continue
        path = urlsplit(url).path.lower()
        if path in ('', '/') or any(x in path for x in ('/category/', '/tag/', '/wp-login', '/wp-admin')):
            continue
        if re.search(r'\.(?:png|jpe?g|gif|svg|zip|mp4|css|js)$', path):
            continue
        if normalize(title) in ('politique de confidentialite', 'mentions legales', 'gestion des cookies'):
            continue
        result.append({'url': url, 'title': title, 'excerpt': '', 'published': '',
                       'origin_page': page, 'is_document': int(path.endswith('.pdf'))})
        if len(result) >= MAX_ITEMS:
            break
    return result, parser.feeds


def describe_error(error):
    """Diagnostic sans contenu de page, cookies ni détails système privés."""
    if isinstance(error, WatchError):
        return error.message
    if isinstance(error, urllib.error.HTTPError):
        labels = {403: 'Accès refusé au collecteur.', 401: 'Authentification demandée.',
                  404: 'Page introuvable.', 429: 'Trop de requêtes ; réessayer plus tard.',
                  503: 'Service temporairement indisponible.'}
        return 'HTTP ' + str(error.code) + ' — ' + labels.get(error.code, 'Réponse HTTP en erreur.')
    cause = error.reason if isinstance(error, urllib.error.URLError) else error
    if isinstance(cause, ssl.SSLCertVerificationError):
        return 'TLS_CERTIFICATE — Python ne peut pas valider le certificat HTTPS. La vérification reste active.'
    if isinstance(cause, ssl.SSLError):
        return 'TLS_CONNECTION — Échec de la connexion HTTPS.'
    if isinstance(cause, socket.gaierror):
        return 'DNS — Échec de résolution du nom du site.'
    if isinstance(cause, (TimeoutError, socket.timeout)):
        return 'TIMEOUT — Délai de connexion ou de lecture dépassé.'
    if isinstance(cause, ConnectionRefusedError):
        return 'CONNECTION_REFUSED — Connexion refusée.'
    if isinstance(cause, ConnectionResetError):
        return 'CONNECTION_RESET — Connexion interrompue.'
    if isinstance(error, ET.ParseError):
        return 'XML_PARSE — Le flux reçu ne contient pas un XML exploitable.'
    if isinstance(error, urllib.error.URLError):
        return 'NETWORK — Connexion impossible depuis Python.'
    return 'COLLECTOR_ERROR — Erreur de traitement (' + type(error).__name__ + ').'


def collect_source(source, fetcher=fetch_public):
    result, errors, coverage = {}, [], []
    deadline = time.monotonic() + 75
    for suffix in SOURCES[source]['pages']:
        if time.monotonic() > deadline:
            errors.append('Temps maximal de collecte atteint.')
            break
        page = SOURCES[source]['url'] + suffix
        try:
            text, mime, final = fetcher(page, source)
            if 'xml' in mime:
                rows = parse_feed(text, source, final)
                mode = 'Flux RSS/Atom : titres, résumés et dates déclarées'
            else:
                rows, feeds = parse_links(text, source, final)
                mode = 'Liens HTML : titres seulement, sans date de publication déduite'
                for feed in feeds[:1]:
                    try:
                        url = safe_url(feed, source, final)
                        feed_text, _, feed_final = fetcher(url, source)
                        feed_rows = parse_feed(feed_text, source, feed_final)
                        if feed_rows:
                            rows = feed_rows + rows
                            mode = 'Flux RSS/Atom et liens HTML de la page'
                    except Exception as error:
                        errors.append('Flux annoncé indisponible ; liens HTML conservés. ' + describe_error(error))
            coverage.append({'page': final, 'mode': mode, 'observed': len(rows)})
            for row in rows:
                previous = result.get(row['url'])
                if previous is None or (row.get('excerpt') and not previous.get('excerpt')):
                    result[row['url']] = row
                if len(result) >= MAX_ITEMS:
                    break
        except Exception as error:
            reason = describe_error(error)
            errors.append(page + ' — ' + reason)
    if not result:
        errors.append('Aucun lien exploitable détecté : la couverture du site n’est pas confirmée.')
    return list(result.values())[:MAX_ITEMS], {'coverage': coverage, 'errors': errors,
         'scope': 'Collecte partielle des pages configurées. Pas de parcours exhaustif, de lecture PDF, ni de contenu derrière connexion.',
         'limit': MAX_ITEMS}


@contextmanager
def observation_transaction(path, existing=None):
    if existing is not None:
        yield existing
    else:
        with closing(connect(path)) as db, db:
            db.execute('BEGIN IMMEDIATE')
            yield db


def store_observations(path, source, rows, now=None, db=None, mode='network'):
    now = time.time() if now is None else now
    counts = {'new': 0, 'updated': 0, 'unchanged': 0, 'skipped': 0}
    with observation_transaction(path, db) as db:
        total = db.execute('SELECT count(*) FROM watch_entries').fetchone()[0]
        seen = set()
        for row in rows[:MAX_ITEMS]:
            url = safe_url(row['url'], source)
            if url in seen:
                continue
            seen.add(url)
            title, excerpt, published = clean(row['title'], 240), clean(row.get('excerpt', ''), 700), clean(row.get('published', ''), 100)
            topic = topics_for(title + ' ' + excerpt)
            ident = hashlib.sha256((source + '\n' + url).encode()).hexdigest()
            old = db.execute('SELECT * FROM watch_entries WHERE id=?', (ident,)).fetchone()
            # A title-only fallback cannot establish that a prior feed summary/date was removed.
            if old and not excerpt and not published:
                excerpt, published = old['excerpt'], old['published']
                topic = topics_for(title + ' ' + excerpt)
            digest = hashlib.sha256(json.dumps([title, excerpt, published], ensure_ascii=False).encode()).hexdigest()
            if not old:
                if total >= MAX_ENTRIES:
                    counts['skipped'] += 1
                    continue
                db.execute('INSERT INTO watch_entries(id,source,url,title,excerpt,published,topics,fingerprint,first_seen,last_seen,changed,status,version,origin_page,is_document) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    (ident, source, url, title, excerpt, published, json.dumps(topic), digest, now, now, now,
                     'unread', 1, safe_url(row.get('origin_page', SOURCES[source]['url']), source), int(bool(row.get('is_document')))))
                counts['new'] += 1
                total += 1
            elif old['fingerprint'] != digest:
                db.execute('UPDATE watch_entries SET title=?,excerpt=?,published=?,topics=?,fingerprint=?,last_seen=?,changed=?,status=?,version=version+1,origin_page=?,is_document=? WHERE id=?',
                    (title, excerpt, published, json.dumps(topic), digest, now, now,
                     'action' if old['status'] == 'action' else 'unread', safe_url(row.get('origin_page', SOURCES[source]['url']), source), int(bool(row.get('is_document'))), ident))
                counts['updated'] += 1
            else:
                db.execute('UPDATE watch_entries SET last_seen=? WHERE id=?', (now, ident))
                counts['unchanged'] += 1
                db.execute('UPDATE watch_entries SET observation_mode=? WHERE id=?', (mode, ident))
                continue
            db.execute('UPDATE watch_entries SET observation_mode=? WHERE id=?', (mode, ident))
            db.execute('INSERT INTO watch_versions(entry_id,observed,title,excerpt,published,fingerprint) VALUES(?,?,?,?,?,?)',
                       (ident, now, title, excerpt, published, digest))
            db.execute('DELETE FROM watch_versions WHERE entry_id=? AND id NOT IN (SELECT id FROM watch_versions WHERE entry_id=? ORDER BY id DESC LIMIT ?)', (ident, ident, MAX_VERSIONS))
    return counts


def overview(path):
    with closing(connect(path)) as db:
        sources = []
        for config in db.execute('SELECT * FROM watch_sources ORDER BY id'):
            source = SOURCES[config['id']]
            latest = db.execute('SELECT * FROM watch_runs WHERE source=? ORDER BY id DESC LIMIT 1', (config['id'],)).fetchone()
            count = db.execute('SELECT count(*) FROM watch_entries WHERE source=?', (config['id'],)).fetchone()[0]
            sources.append({**dict(config), 'name': source['name'], 'url': source['url'], 'description': source['description'],
                            'count': count, 'latest': run_dict(latest) if latest else None})
        counts = {s: db.execute('SELECT count(*) FROM watch_entries WHERE status=?', (s,)).fetchone()[0] for s in STATUSES}
        return {'sources': sources, 'counts': counts, 'total': sum(counts.values()),
                'scope': 'Titres, résumés de flux et liens publics seulement. PDFs déposés analysables séparément ; Gmail non connecté.',
                'timezone': 'Etc/UTC', 'entryLimit': MAX_ENTRIES}


def run_dict(row):
    out = dict(row)
    out['summary'] = json.loads(out['summary'])
    return out


def entries(path, params):
    where, values = [], []
    for field in ('source', 'status'):
        val = params.get(field, [''])[0]
        if val:
            if val not in (SOURCES if field == 'source' else STATUSES):
                raise WatchError(400, 'Filtre invalide.')
            where.append(field + '=?')
            values.append(val)
    topic = params.get('topic', [''])[0]
    if topic:
        where.append('topics LIKE ?')
        # JSON uses escaped accents; parameter uses the same representation.
        values.append('%' + json.dumps(topic)[1:-1].replace('%', '').replace('_', '') + '%')
    query = params.get('q', [''])[0]
    if query:
        where.append('(title LIKE ? OR excerpt LIKE ?)')
        values.extend(['%' + query[:200] + '%'] * 2)
    try:
        offset = int(params.get('offset', ['0'])[0])
        if offset < 0 or offset > MAX_ENTRIES: raise ValueError()
    except ValueError:
        raise WatchError(400, 'Page invalide.')
    sql = ' WHERE ' + ' AND '.join(where) if where else ''
    with closing(connect(path)) as db:
        total = db.execute('SELECT count(*) FROM watch_entries' + sql, values).fetchone()[0]
        rows = db.execute('SELECT * FROM watch_entries' + sql + ' ORDER BY changed DESC,id LIMIT 50 OFFSET ?', values + [offset]).fetchall()
        items = []
        for row in rows:
            item = dict(row)
            item['topics'] = json.loads(item['topics'])
            items.append(item)
        return {'items': items, 'total': total, 'offset': offset, 'limit': 50}


def change_status(path, ident, status, version, actor):
    if not isinstance(ident, str) or status not in STATUSES or type(version) is not int:
        raise WatchError(400, 'État ou version invalide.')
    with closing(connect(path)) as db, db:
        db.execute('BEGIN IMMEDIATE')
        old = db.execute('SELECT * FROM watch_entries WHERE id=?', (ident,)).fetchone()
        if not old: raise WatchError(404, 'Information introuvable.')
        if old['version'] != version: raise WatchError(409, 'Information modifiée depuis son affichage. Actualisez la veille.')
        if old['status'] != status:
            db.execute('UPDATE watch_entries SET status=?,version=version+1 WHERE id=?', (status, ident))
            db.execute('INSERT INTO watch_actions(entry_id,actor,created,old_status,new_status) VALUES(?,?,?,?,?)',
                       (ident, actor, time.time(), old['status'], status))
        return {'ok': True}


def source_settings(path, obj):
    source, enabled, days, version = obj.get('source'), obj.get('enabled'), obj.get('days'), obj.get('version')
    if not isinstance(source, str) or source not in SOURCES or type(enabled) is not bool or type(days) is not int or not 1 <= days <= 30 or type(version) is not int:
        raise WatchError(400, 'Fréquence : 1 à 30 jours ; source et version requises.')
    with closing(connect(path)) as db, db:
        db.execute('BEGIN IMMEDIATE')
        row = db.execute('SELECT * FROM watch_sources WHERE id=?', (source,)).fetchone()
        if row['version'] != version: raise WatchError(409, 'Réglage modifié ailleurs. Actualisez.')
        db.execute('UPDATE watch_sources SET enabled=?,interval_days=?,next_run=?,version=version+1 WHERE id=?',
                   (int(enabled), days, time.time() + days * 86400, source))
    return {'ok': True}


class Controller:
    def __init__(self, path, fetcher=fetch_public):
        self.path, self.fetcher = path, fetcher
        self.lock = threading.Lock()
        self.stop = threading.Event()
        self.worker = None
        self.scheduler = None

    def launch(self, source, actor):
        if not isinstance(source, str) or source not in SOURCES:
            raise WatchError(400, 'Source inconnue.')
        if not self.lock.acquire(blocking=False):
            raise WatchError(409, 'Une collecte est déjà en cours. Actualisez son état.')
        try:
            with closing(connect(self.path)) as db, db:
                latest = db.execute('SELECT started FROM watch_runs WHERE source=? ORDER BY id DESC LIMIT 1', (source,)).fetchone()
                if latest and time.time() - latest['started'] < 60:
                    raise WatchError(429, 'Attendez une minute entre deux collectes de cette source.')
                run = db.execute('INSERT INTO watch_runs(source,actor,started,status) VALUES(?,?,?,?)', (source, actor, time.time(), 'running')).lastrowid
            self.worker = threading.Thread(target=self._run, args=(source, run), daemon=True)
            self.worker.start()
            return {'run': run, 'status': 'running'}
        except Exception:
            self.lock.release()
            raise

    def _run(self, source, run):
        try:
            rows, summary = collect_source(source, self.fetcher)
            counts = store_observations(self.path, source, rows)
            summary.update(counts)
            if counts['skipped']: summary['errors'].append('Limite de 10 000 entrées atteinte ; des liens nouveaux n’ont pas été enregistrés.')
            status = ('partial' if summary['errors'] else 'done') if rows else 'failed'
        except Exception:
            summary = {'errors': ['Collecte interrompue par une erreur de traitement ; aucune réussite confirmée.']}
            status = 'failed'
        try:
            with closing(connect(self.path)) as db, db:
                config = db.execute('SELECT interval_days FROM watch_sources WHERE id=?', (source,)).fetchone()
                now = time.time()
                db.execute('UPDATE watch_runs SET ended=?,status=?,summary=? WHERE id=?', (now, status, json.dumps(summary), run))
                # Failures wait at least an hour; successful scans respect the selected period.
                db.execute('UPDATE watch_sources SET next_run=? WHERE id=?', (now + (3600 if status == 'failed' else config['interval_days'] * 86400), source))
                if status != 'failed': db.execute('UPDATE watch_sources SET last_success=? WHERE id=?', (now, source))
        finally:
            self.lock.release()

    def tick(self, now=None):
        now = time.time() if now is None else now
        with closing(connect(self.path)) as db:
            rows = db.execute('SELECT id FROM watch_sources WHERE enabled=1 AND next_run<=? ORDER BY next_run', (now,)).fetchall()
        for row in rows:
            try:
                self.launch(row['id'], 'planification locale')
                return
            except WatchError:
                continue

    def start(self):
        with closing(connect(self.path)) as db, db:
            db.execute("UPDATE watch_runs SET status='interrupted',ended=?,summary=? WHERE status='running'",
                       (time.time(), json.dumps({'errors': ['Serveur arrêté avant la fin de la collecte.']})))
        def loop():
            while not self.stop.wait(30):
                try: self.tick()
                except Exception: pass
        self.scheduler = threading.Thread(target=loop, daemon=True)
        self.scheduler.start()


def export_watch(path):
    with closing(connect(path)) as db:
        return {'format': 'GESTION_CLUB_WATCH_EXPORT', 'schemaVersion': 1, 'exportedAt': time.time(),
                'scope': 'Veille séparée des sauvegardes métier. Export de consultation, sans import automatique.',
                'sources': [dict(r) for r in db.execute('SELECT * FROM watch_sources')],
                'entries': [dict(r) for r in db.execute('SELECT * FROM watch_entries ORDER BY id')],
                'runs': [run_dict(r) for r in db.execute('SELECT * FROM watch_runs ORDER BY id DESC LIMIT 100')],
                'versions': [dict(r) for r in db.execute('SELECT * FROM watch_versions ORDER BY id')],
                'actions': [dict(r) for r in db.execute('SELECT * FROM watch_actions ORDER BY id')]}
