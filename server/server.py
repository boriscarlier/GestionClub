"""FC LA COUR V1.25.7: sauvegardes, veille publique et API metier serveur."""
import argparse, getpass, hashlib, hmac, json, os, re, secrets, sqlite3, time
from contextlib import closing
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
import watch
import manual_watch
import pdf_watch
import convocations
from services import club_state

SERVER_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = SERVER_ROOT.parent
CLIENT_ROOT = PROJECT_ROOT / 'client'
DATA_ROOT = PROJECT_ROOT / 'data'
LIMIT = 30 * 1024 * 1024
ROLES = ('admin', 'editor', 'reader')

class Problem(Exception):
    def __init__(self, status, message):
        self.status, self.message = status, message

def encode(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'), allow_nan=False)

def validate(p):
    if not isinstance(p, dict) or p.get('format') != 'FC_LA_COUR_FULL_BACKUP' or p.get('schemaVersion') != 1:
        raise Problem(400, 'Choisir une sauvegarde complète Gestion Club.')
    if not re.fullmatch(r'V\d+\.\d+\.\d+(?:\.\d+)?', str(p.get('build', ''))):
        raise Problem(400, 'Version de sauvegarde non reconnue.')
    v = tuple(map(int, p['build'][1:].split('.')))
    if v + (0,) * (4-len(v)) > (1,25,7,0):
        raise Problem(400, 'Sauvegarde plus récente que ce serveur.')
    s = p.get('state')
    if not isinstance(s, dict):
        raise Problem(400, 'Base invalide.')
    for key in ('members', 'matches', 'teams', 'accounts'):
        rows = s.get(key)
        if not isinstance(rows, list):
            raise Problem(400, 'Collection absente : ' + key)
        seen = set()
        for row in rows:
            ident = row.get('id') if isinstance(row, dict) else None
            if not isinstance(ident, str) or not ident.strip() or ident in seen:
                raise Problem(400, 'Identifiant absent ou dupliqué : ' + key)
            seen.add(ident)
    if not isinstance(p.get('lineups'), dict) or not isinstance(p.get('feedback', []), list) or not isinstance(p.get('scenarios', {}), dict):
        raise Problem(400, 'Compositions, retours ou scénarios invalides.')
    club = s.get('clubProfile', {}).get('official', {}).get('affiliation', '')
    if not isinstance(club, str) or not re.fullmatch(r'\d{6}', club):
        raise Problem(400, 'Une affiliation à six chiffres est requise dans la sauvegarde.')
    return club

def connect(path):
    db = sqlite3.connect(path, timeout=15)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    return db

def default_data_path():
    configured = os.environ.get('FCLC_DATA_PATH')
    if configured:
        return Path(configured)
    root = os.environ.get('FCLC_DATA_DIR')
    if root:
        return Path(root) / 'club.sqlite3'
    return DATA_ROOT / 'club.sqlite3'

def initialize(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with closing(connect(path)) as db, db:
        db.executescript('''
        CREATE TABLE IF NOT EXISTS users(name TEXT PRIMARY KEY, salt TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','editor','reader')));
        CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user TEXT NOT NULL REFERENCES users(name),csrf TEXT NOT NULL,expires REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS revisions(id INTEGER PRIMARY KEY AUTOINCREMENT,created REAL NOT NULL,actor TEXT NOT NULL,club TEXT NOT NULL,payload TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY,created REAL NOT NULL);
        ''')
        club_state.initialize(db)
        club_state.bootstrap_latest(db)
    watch.initialize(path)
    pdf_watch.initialize(path)
    convocations.initialize(path)

def password_hash(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt), 600000).hex()

def add_user(path, name, password, role):
    if not re.fullmatch(r'[a-zA-Z0-9_.-]{3,40}', name) or role not in ROLES or not 12 <= len(password) <= 256:
        raise ValueError('Identifiant : 3–40 lettres/chiffres/._- ; mot de passe : 12–256 caractères.')
    salt = secrets.token_hex(16)
    with closing(connect(path)) as db, db:
        db.execute('INSERT INTO users VALUES(?,?,?,?)', (name, salt, password_hash(password, salt), role))

def manager_page():
    html = (CLIENT_ROOT / 'FC_LA_COUR_Manager.html').read_text(encoding='utf-8')
    marker = '<body'
    pos = html.find(marker)
    if pos < 0:
        return html.encode('utf-8')
    end = html.find('>', pos)
    if end < 0:
        return html.encode('utf-8')
    banner = """
<div id="serverBridgeBanner" style="position:sticky;top:0;z-index:99999;background:#102516;color:#fffbe6;border-bottom:2px solid #2ecc71;padding:10px 16px;font:14px/1.35 system-ui,Segoe UI,sans-serif">
    <strong>Gestion Club servi par le serveur local V1.25.7.</strong>
  Les donnees reelles restent dans la base serveur ; l'enregistrement complet est volontaire et confirme.
  <button id="serverBridgeSave" type="button" style="margin-left:12px;border:1px solid #2ecc71;border-radius:10px;background:#2ecc71;color:#06100a;font-weight:800;padding:7px 10px;cursor:pointer">Enregistrer sur serveur</button>
  <button id="serverBridgeDownload" type="button" style="margin-left:6px;border:1px solid #9df7b9;border-radius:10px;background:transparent;color:#9df7b9;font-weight:700;padding:7px 10px;cursor:pointer">Telecharger revision serveur</button>
  <a href="/" style="color:#9df7b9;margin-left:12px">Retour administration serveur</a>
  <span id="serverBridgeStatus" style="display:block;margin-top:6px;color:#c8f7d8"></span>
</div>
<script>
window.FC_LA_COUR_SERVER_BRIDGE={build:"V1.25.7",mode:"server-bridge",bootstrapUrl:"/api/gestion/bootstrap"};
(function(){
  async function api(path,method,body,csrf){
    const response=await fetch(path,{method:method||"GET",credentials:"same-origin",cache:"no-store",headers:Object.assign({"Content-Type":"application/json"},csrf?{"X-CSRF-Token":csrf}:{}),body:body===undefined?undefined:JSON.stringify(body)});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||"Operation serveur refusee.");
    return data;
  }
  function status(text){const node=document.getElementById("serverBridgeStatus");if(node)node.textContent=text;}
  function download(name,payload){
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  window.addEventListener("DOMContentLoaded",function(){
    const save=document.getElementById("serverBridgeSave"),dl=document.getElementById("serverBridgeDownload");
    if(save)save.addEventListener("click",async function(){
      try{
        if(typeof window.qaBackupPayload!=="function")throw new Error("Sauvegarde complete indisponible dans ce client.");
        if(!confirm("Creer une nouvelle revision serveur avec la base actuellement affichee ?"))return;
        save.disabled=true;status("Controle serveur en cours...");
        const session=await api("/api/session"),state=await api("/api/status"),backup=window.qaBackupPayload();
        const result=await api("/api/snapshot","PUT",{backup:backup,expectedRevision:state.revision,confirmed:true},session.csrf);
        status("Revision serveur "+result.revision+" enregistree.");
      }catch(e){status(e.message);}finally{save.disabled=false;}
    });
    if(dl)dl.addEventListener("click",async function(){
      try{
        dl.disabled=true;status("Lecture de la derniere revision...");
        const result=await api("/api/snapshot");
        download("FC_LA_COUR_serveur_revision_"+result.revision+".json",result.backup);
        status("Telechargement demande pour la revision "+result.revision+".");
      }catch(e){status(e.message);}finally{dl.disabled=false;}
    });
  });
})();
</script>
"""
    return (html[:end+1] + banner + html[end+1:]).encode('utf-8')

class Handler(BaseHTTPRequestHandler):
    server_version = 'FCLaCour/1.25.7'
    sys_version = ''
    def log_message(self, *args):
        pass
    def setup(self):
        super().setup()
        self.connection.settimeout(20)
    def send(self, status, value, cookie=None, mime='application/json; charset=utf-8', csp=None):
        raw = value if isinstance(value, bytes) else encode(value).encode()
        self.send_response(status)
        policy = csp or "default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
        for k,v in {'Content-Type':mime, 'Content-Length':str(len(raw)), 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'X-Frame-Options':'DENY', 'Referrer-Policy':'no-referrer', 'Content-Security-Policy':policy}.items():
            self.send_header(k,v)
        if cookie:
            self.send_header('Set-Cookie', cookie)
        self.end_headers()
        self.wfile.write(raw)
    def session(self, db):
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get('Cookie', ''))
            token = cookie['fclc_session'].value
        except (KeyError, ValueError):
            raise Problem(401, 'Connexion requise.')
        digest = hashlib.sha256(token.encode()).hexdigest()
        row = db.execute('SELECT s.*,u.role FROM sessions s JOIN users u ON u.name=s.user WHERE token=? AND expires>?', (digest,time.time())).fetchone()
        if not row:
            raise Problem(401, 'Session expirée. Reconnectez-vous.')
        return row
    def body(self):
        if self.headers.get('Transfer-Encoding') or len(self.headers.get_all('Content-Length', [])) != 1:
            raise Problem(400, 'Longueur de requête requise.')
        try:
            n = int(self.headers['Content-Length'])
        except ValueError:
            raise Problem(400, 'Longueur invalide.')
        if n < 0 or n > LIMIT:
            raise Problem(413, 'Fichier trop volumineux : maximum 30 Mo.')
        if self.headers.get_content_type() != 'application/json':
            raise Problem(415, 'JSON requis.')
        try:
            raw = self.rfile.read(n)
            if len(raw) != n:
                raise ValueError()
            obj = json.loads(raw, parse_constant=lambda x: (_ for _ in ()).throw(ValueError()))
            if not isinstance(obj, dict):
                raise ValueError()
            return obj
        except (ValueError, RecursionError):
            raise Problem(400, 'JSON invalide.')
    def route(self):
        origin = 'http://127.0.0.1:' + str(self.server.server_port)
        if self.headers.get('Host') != origin[7:]:
            raise Problem(403, 'Adresse du serveur non autorisée.')
        if self.command != 'GET' and self.headers.get('Origin') != origin:
            raise Problem(403, 'Origine non autorisée.')
        path = urlsplit(self.path).path
        static = {'/':'index.html','/app.js':'app.js','/style.css':'style.css','/watch.js':'watch.js','/watch.css':'watch.css','/pdf_watch.js':'pdf_watch.js','/convocations.js':'convocations.js'}
        if self.command == 'GET' and path in static:
            mime = ('text/javascript' if path.endswith('.js') else 'text/css' if path.endswith('.css') else 'text/html') + '; charset=utf-8'
            return self.send(200,(CLIENT_ROOT/static[path]).read_bytes(),mime=mime)
        with closing(connect(self.server.db_path)) as db:
            if path == '/api/login' and self.command == 'POST':
                obj=self.body();name=obj.get('name','');password=obj.get('password','')
                if not isinstance(name,str) or not isinstance(password,str) or len(name)>40 or len(password)>256:
                    raise Problem(400,'Identifiants invalides.')
                with db:
                    db.execute('BEGIN IMMEDIATE')
                    db.execute('DELETE FROM attempts WHERE created<?',(time.time()-60,))
                    if db.execute('SELECT count(*) FROM attempts').fetchone()[0] >= 8:
                        raise Problem(429,'Trop de tentatives. Attendez une minute.')
                    db.execute('INSERT INTO attempts(created) VALUES(?)',(time.time(),))
                user=db.execute('SELECT * FROM users WHERE name=?',(name,)).fetchone()
                valid=hmac.compare_digest(password_hash(password,user['salt'] if user else '00'*16),user['password'] if user else '00'*32)
                if not user or not valid:
                    raise Problem(401,'Identifiant ou mot de passe incorrect.')
                token=secrets.token_urlsafe(32);csrf=secrets.token_urlsafe(32)
                with db:
                    db.execute('DELETE FROM sessions WHERE expires<?',(time.time(),))
                    db.execute('INSERT INTO sessions VALUES(?,?,?,?)',(hashlib.sha256(token.encode()).hexdigest(),name,csrf,time.time()+3600))
                return self.send(200,{'user':name,'role':user['role'],'csrf':csrf},'fclc_session='+token+'; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600')
            user=self.session(db)
            if self.command != 'GET' and not hmac.compare_digest(self.headers.get('X-CSRF-Token',''),user['csrf']):
                raise Problem(403,'Jeton de session invalide.')
            if path == '/api/session' and self.command == 'GET':
                return self.send(200,{'user':user['user'],'role':user['role'],'csrf':user['csrf']})
            if path == '/gestion' and self.command == 'GET':
                csp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
                return self.send(200, manager_page(), mime='text/html; charset=utf-8', csp=csp)
            if path == '/api/gestion/bootstrap' and self.command == 'GET':
                row=db.execute('SELECT id,created,actor,club,payload FROM revisions ORDER BY id DESC LIMIT 1').fetchone()
                latest = None if not row else {'revision':row['id'],'created':row['created'],'actor':row['actor'],'club':row['club'],'backup':json.loads(row['payload'])}
                return self.send(200,{'serverBuild':'V1.25.7','mode':'server-bridge','user':user['user'],'role':user['role'],'latest':latest})
            if path == '/api/state/summary' and self.command == 'GET':
                return self.send(200, club_state.summary(db))
            if path == '/api/state/members' and self.command == 'GET':
                return self.send(200, club_state.members(db, parse_qs(urlsplit(self.path).query)))
            if path.startswith('/api/state/members/') and self.command == 'GET':
                ident = path.rsplit('/', 1)[-1]
                member = club_state.member(db, ident)
                if not member:
                    raise Problem(404, 'Licencié introuvable.')
                return self.send(200, {'member': member})
            if path == '/api/state/teams' and self.command == 'GET':
                return self.send(200, club_state.teams(db, parse_qs(urlsplit(self.path).query)))
            if path.startswith('/api/state/teams/') and self.command == 'GET':
                ident = path.rsplit('/', 1)[-1]
                team = club_state.team(db, ident)
                if not team:
                    raise Problem(404, 'Équipe introuvable.')
                return self.send(200, {'team': team})
            if path.startswith('/api/watch'):
                params=parse_qs(urlsplit(self.path).query)
                if self.command == 'GET':
                    if path == '/api/watch/convocation': return self.send(200,convocations.detail(self.server.db_path,params.get('id',[''])[0]))
                    if path == '/api/watch/pdfs': return self.send(200,pdf_watch.listing(self.server.db_path))
                    if path in ('/api/watch/pdf','/api/watch/pdf-file'): return self.send(200,pdf_watch.detail(self.server.db_path,params.get('id',[''])[0],path.endswith('pdf-file')))
                    if path == '/api/watch': return self.send(200,watch.overview(self.server.db_path))
                    if path == '/api/watch/items': return self.send(200,watch.entries(self.server.db_path,params))
                    if path == '/api/watch/history':
                        return self.send(200,{'runs':[watch.run_dict(r) for r in db.execute('SELECT * FROM watch_runs ORDER BY id DESC LIMIT 100')]})
                    if path == '/api/watch/item':
                        ident=params.get('id',[''])[0]
                        if not db.execute('SELECT 1 FROM watch_entries WHERE id=?',(ident,)).fetchone(): raise Problem(404,'Information introuvable.')
                        return self.send(200,{'versions':[dict(r) for r in db.execute('SELECT observed,title,excerpt,published FROM watch_versions WHERE entry_id=? ORDER BY id DESC LIMIT 10',(ident,))], 'actions':[dict(r) for r in db.execute('SELECT actor,created,old_status,new_status FROM watch_actions WHERE entry_id=? ORDER BY id DESC LIMIT 30',(ident,))]})
                    if path == '/api/watch/export': return self.send(200,watch.export_watch(self.server.db_path))
                else:
                    if user['role'] not in ('admin','editor'): raise Problem(403,'Ce compte est en lecture seule.')
                    if path == '/api/watch/convocation' and self.command == 'PUT': return self.send(200,convocations.save(self.server.db_path,self.body(),user['user']))
                    if path == '/api/watch/pdf-reanalyze' and self.command == 'POST': return self.send(200,pdf_watch.reanalyze(self.server.db_path,self.body(),user['user']))
                    if path == '/api/watch/pdf-preview' and self.command == 'POST': return self.send(200,pdf_watch.preview(self.body()))
                    if path == '/api/watch/pdf-save' and self.command == 'POST': return self.send(201,pdf_watch.save(self.server.db_path,self.body(),user['user']))
                    if path == '/api/watch/pdf-status' and self.command == 'PUT': return self.send(200,pdf_watch.status(self.server.db_path,self.body(),user['user']))
                    if path == '/api/watch/manual-preview' and self.command == 'POST':
                        return self.send(200,manual_watch.prepare(self.body().get('html')))
                    if path == '/api/watch/manual-import' and self.command == 'POST':
                        return self.send(201,manual_watch.apply(self.server.db_path,self.server.watch,self.body(),user['user']))
                    if path == '/api/watch/collect' and self.command == 'POST':
                        return self.send(202,self.server.watch.launch(self.body().get('source'),user['user']))
                    if path == '/api/watch/status' and self.command == 'PUT':
                        obj=self.body()
                        return self.send(200,watch.change_status(self.server.db_path,obj.get('id'),obj.get('status'),obj.get('version'),user['user']))
                    if path == '/api/watch/settings' and self.command == 'PUT':
                        if user['role'] != 'admin': raise Problem(403,'Réglage réservé à l’administration.')
                        return self.send(200,watch.source_settings(self.server.db_path,self.body()))
                raise Problem(404,'Ressource de veille inexistante.')
            if path == '/api/logout' and self.command == 'POST':
                with db:
                    db.execute('DELETE FROM sessions WHERE token=?',(user['token'],))
                return self.send(200,{'ok':True},'fclc_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0')
            if path == '/api/status' and self.command == 'GET':
                row=db.execute('SELECT id,created,actor,club,payload FROM revisions ORDER BY id DESC LIMIT 1').fetchone()
                return self.send(200,{'revision':row['id'] if row else 0,'club':row['club'] if row else None,'counts':{k:len(json.loads(row['payload'])['state'][k]) for k in ('members','teams','matches','accounts')} if row else {}})
            if path == '/api/history' and self.command == 'GET':
                rows=db.execute('SELECT id,created,actor FROM revisions ORDER BY id DESC LIMIT 100').fetchall()
                return self.send(200,{'revisions':[dict(r) for r in rows]})
            if path == '/api/snapshot' and self.command == 'GET':
                value=parse_qs(urlsplit(self.path).query).get('revision',[None])[0]
                if value is not None and not value.isdigit():
                    raise Problem(400,'Révision invalide.')
                row=db.execute('SELECT id,payload FROM revisions '+('WHERE id=?' if value else 'ORDER BY id DESC LIMIT 1'),(int(value),) if value else ()).fetchone()
                if not row:
                    raise Problem(404,'Aucune sauvegarde pour cette révision.')
                return self.send(200,{'revision':row['id'],'backup':json.loads(row['payload'])})
            if path == '/api/snapshot' and self.command == 'PUT':
                if user['role'] not in ('admin','editor'):
                    raise Problem(403,'Ce compte est en lecture seule.')
                obj=self.body();p=obj.get('backup');club=validate(p);expected=obj.get('expectedRevision')
                if type(expected) is not int or expected<0 or obj.get('confirmed') is not True:
                    raise Problem(400,'Révision attendue et confirmation requises.')
                raw=encode(p)
                with db:
                    db.execute('BEGIN IMMEDIATE')
                    current=db.execute('SELECT id,club FROM revisions ORDER BY id DESC LIMIT 1').fetchone()
                    if expected != (current['id'] if current else 0):
                        raise Problem(409,'Une autre session a changé la révision. Rechargez le fichier pour revoir le dépôt.')
                    if current and current['club'] != club:
                        raise Problem(409,'Affiliation différente de la base serveur.')
                    cur=db.execute('INSERT INTO revisions(created,actor,club,payload) VALUES(?,?,?,?)',(time.time(),user['user'],club,raw))
                    revision=cur.lastrowid
                    club_state.sync_all(db, revision, p)
                return self.send(201,{'revision':revision})
            raise Problem(404,'Ressource inexistante.')
    def handle_request(self):
        try:
            self.route()
        except (Problem, watch.WatchError) as e:
            self.send(e.status,{'error':e.message})
        except (BrokenPipeError, ConnectionResetError, TimeoutError):
            pass
        except (ValueError,TypeError,AttributeError,RecursionError):
            self.send(400,{'error':'Structure de données invalide.'})
        except Exception:
            self.send(500,{'error':'Opération impossible. Aucune confirmation de dépôt ; actualisez le statut avant de réessayer.'})
    do_GET=handle_request
    do_POST=handle_request
    do_PUT=handle_request

def make_server(path,port=8765):
    initialize(path)
    srv=ThreadingHTTPServer(('127.0.0.1',port),Handler)
    srv.db_path=path
    srv.watch=watch.Controller(path)
    return srv

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command',choices=['start','add-user','reset-password'],nargs='?',default='start')
    parser.add_argument('--data',type=Path,default=default_data_path())
    args=parser.parse_args();initialize(args.data)
    with closing(connect(args.data)) as db:
        empty=db.execute('SELECT count(*) FROM users').fetchone()[0]==0
    if args.command in ('add-user','reset-password') or empty:
        print('Comptes serveur distincts des comptes du HTML. Aucun mot de passe par défaut.')
        name=input('Identifiant serveur : ').strip()
        password=getpass.getpass('Mot de passe (12 caractères minimum, saisie invisible) : ')
        if password!=getpass.getpass('Confirmer le mot de passe : '):
            raise SystemExit('Confirmation différente.')
        if args.command=='reset-password':
            if not 12<=len(password)<=256:
                raise SystemExit('Longueur invalide.')
            salt=secrets.token_hex(16)
            with closing(connect(args.data)) as db,db:
                cur=db.execute('UPDATE users SET salt=?,password=? WHERE name=?',(salt,password_hash(password,salt),name))
                if not cur.rowcount:
                    raise SystemExit('Compte introuvable.')
                db.execute('DELETE FROM sessions WHERE user=?',(name,))
        else:
            role='admin' if empty else input('Rôle (admin/editor/reader) : ').strip()
            add_user(args.data,name,password,role)
        print('Compte enregistré.')
        if args.command!='start':
            return
    srv=make_server(args.data)
    srv.watch.start()
    print('Base de donnees : ' + str(args.data))
    print('FC LA COUR V1.25.7 — http://127.0.0.1:8765 — Ctrl+C pour arrêter.')
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.watch.stop.set()
        srv.server_close()

if __name__=='__main__':
    main()
