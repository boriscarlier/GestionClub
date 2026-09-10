"""Documents PDF de veille : aperçu local, import explicite, original et suivi."""
import base64,hashlib,json,re,subprocess,sys,threading,time
from pathlib import Path
from contextlib import closing
import watch
MAX_BYTES=5*1024*1024
MAX_TOTAL=100*1024*1024
EXTRACT_LOCK=threading.Lock()

def initialize(path):
    with closing(watch.connect(path)) as db,db:
        db.executescript('''CREATE TABLE IF NOT EXISTS watch_pdfs(id TEXT PRIMARY KEY,name TEXT NOT NULL,source TEXT NOT NULL,created REAL NOT NULL,actor TEXT NOT NULL,raw BLOB NOT NULL,report TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'unread',version INTEGER NOT NULL DEFAULT 1);
        CREATE TABLE IF NOT EXISTS watch_pdf_actions(id INTEGER PRIMARY KEY AUTOINCREMENT,document TEXT NOT NULL,actor TEXT NOT NULL,created REAL NOT NULL,old_status TEXT NOT NULL,new_status TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS watch_pdf_analyses(id INTEGER PRIMARY KEY AUTOINCREMENT,document TEXT NOT NULL,actor TEXT NOT NULL,created REAL NOT NULL,analysis_version TEXT NOT NULL,players INTEGER NOT NULL);''')

def decode(obj):
    encoded=obj.get('file')
    if not isinstance(encoded,str) or len(encoded)>((MAX_BYTES+2)//3)*4:raise watch.WatchError(400,'Choisir un PDF de 5 Mo maximum.')
    try:raw=base64.b64decode(encoded,validate=True)
    except (ValueError,TypeError):raise watch.WatchError(400,'Fichier PDF invalide.')
    if not raw.startswith(b'%PDF-') or len(raw)>MAX_BYTES:raise watch.WatchError(400,'PDF requis, maximum 5 Mo.')
    name=re.split(r'[/\\]',str(obj.get('name','document.pdf')))[-1]
    name=watch.clean(name,160) or 'document.pdf'
    return raw,name,watch.clean(obj.get('source','Source non précisée'),200)

def preview(obj):
    raw,name,source=decode(obj)
    if not EXTRACT_LOCK.acquire(blocking=False):raise watch.WatchError(409,'Une analyse PDF est en cours. Attendez sa fin.')
    try:
        try:
            run=subprocess.run([sys.executable,'-I','-S',str(Path(__file__).with_name('pdf_worker.py'))],input=raw,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=12)
        except subprocess.TimeoutExpired:raise watch.WatchError(408,'Analyse interrompue après 12 secondes ; aucun document enregistré.')
        if run.returncode:raise watch.WatchError(400,'Extraction PDF impossible ; aucun document enregistré.')
        try:report=json.loads(run.stdout)
        except (ValueError,UnicodeError):raise watch.WatchError(400,'Résultat de lecture PDF invalide.')
        if report.get('error'):raise watch.WatchError(400,report['error'])
        return {'id':hashlib.sha256(raw).hexdigest(),'name':name,'source':source,'report':report,'size':len(raw)}
    finally:EXTRACT_LOCK.release()

def save(path,obj,actor):
    if obj.get('confirmed') is not True:raise watch.WatchError(400,'Vérifiez l’aperçu puis confirmez l’enregistrement.')
    raw,name,source=decode(obj);ident=hashlib.sha256(raw).hexdigest()
    if obj.get('digest')!=ident:raise watch.WatchError(409,'Fichier différent de l’aperçu. Relancez l’analyse.')
    with closing(watch.connect(path)) as db:
        if db.execute('SELECT 1 FROM watch_pdfs WHERE id=?',(ident,)).fetchone():return {'id':ident,'duplicate':True}
    result=preview(obj)
    with closing(watch.connect(path)) as db,db:
        db.execute('BEGIN IMMEDIATE')
        if db.execute('SELECT 1 FROM watch_pdfs WHERE id=?',(ident,)).fetchone():return {'id':ident,'duplicate':True}
        size,count=db.execute('SELECT coalesce(sum(length(raw)),0),count(*) FROM watch_pdfs').fetchone()
        if size+len(raw)>MAX_TOTAL or count>=100:raise watch.WatchError(413,'Limite des PDF atteinte : 100 documents ou 100 Mo.')
        db.execute('INSERT INTO watch_pdfs(id,name,source,created,actor,raw,report) VALUES(?,?,?,?,?,?,?)',(ident,name,source,time.time(),actor,raw,json.dumps(result['report'])))
    return {'id':ident,'duplicate':False}

def listing(path):
    with closing(watch.connect(path)) as db:
        return {'documents':[dict(r) for r in db.execute('SELECT id,name,source,created,actor,status,version,length(raw) AS size FROM watch_pdfs ORDER BY created DESC')], 'limit':100}

def detail(path,ident,download=False):
    with closing(watch.connect(path)) as db:
        r=db.execute('SELECT * FROM watch_pdfs WHERE id=?',(ident,)).fetchone()
        if not r:raise watch.WatchError(404,'Document introuvable.')
        if download:return {'name':r['name'],'file':base64.b64encode(r['raw']).decode('ascii')}
        return {**{k:r[k] for k in ('id','name','source','created','actor','status','version')},'report':json.loads(r['report']),
                'analyses':[dict(x) for x in db.execute('SELECT actor,created,analysis_version,players FROM watch_pdf_analyses WHERE document=? ORDER BY id DESC LIMIT 30',(ident,))],
                'actions':[dict(x) for x in db.execute('SELECT actor,created,old_status,new_status FROM watch_pdf_actions WHERE document=? ORDER BY id DESC LIMIT 30',(ident,))]}

def status(path,obj,actor):
    if obj.get('status') not in watch.STATUSES or type(obj.get('version')) is not int or not isinstance(obj.get('id'),str):raise watch.WatchError(400,'Suivi invalide.')
    with closing(watch.connect(path)) as db,db:
        db.execute('BEGIN IMMEDIATE');old=db.execute('SELECT status,version FROM watch_pdfs WHERE id=?',(obj['id'],)).fetchone()
        if not old:raise watch.WatchError(404,'Document introuvable.')
        if old['version']!=obj['version']:raise watch.WatchError(409,'Suivi modifié ailleurs. Actualisez les documents.')
        if old['status']!=obj['status']:
            db.execute('UPDATE watch_pdfs SET status=?,version=version+1 WHERE id=?',(obj['status'],obj['id']))
            db.execute('INSERT INTO watch_pdf_actions(document,actor,created,old_status,new_status) VALUES(?,?,?,?,?)',(obj['id'],actor,time.time(),old['status'],obj['status']))
    return {'ok':True}


def reanalyze(path,obj,actor):
    if type(obj.get('version')) is not int or not isinstance(obj.get('id'),str):
        raise watch.WatchError(400,'Référence de document invalide.')
    with closing(watch.connect(path)) as db:
        row=db.execute('SELECT raw,name,source,version FROM watch_pdfs WHERE id=?',(obj['id'],)).fetchone()
        if not row:raise watch.WatchError(404,'Document introuvable.')
        if row['version']!=obj['version']:raise watch.WatchError(409,'Document modifié ailleurs. Rouvrez-le avant de réanalyser.')
    result=preview({'file':base64.b64encode(row['raw']).decode('ascii'),'name':row['name'],'source':row['source']})
    report=result['report']
    if any(p['state']=='error' for p in report['pages']):
        raise watch.WatchError(400,'Analyse incomplète : le résultat précédent est conservé.')
    with closing(watch.connect(path)) as db,db:
        db.execute('BEGIN IMMEDIATE')
        updated=db.execute('UPDATE watch_pdfs SET report=?,version=version+1 WHERE id=? AND version=?',
                           (json.dumps(report),obj['id'],obj['version']))
        if updated.rowcount!=1:raise watch.WatchError(409,'Document modifié pendant l’analyse. Le résultat précédent est conservé ; rouvrez le document.')
        db.execute('INSERT INTO watch_pdf_analyses(document,actor,created,analysis_version,players) VALUES(?,?,?,?,?)',
                   (obj['id'],actor,time.time(),report.get('analysisVersion','inconnue'),sum(len(p.get('players',[])) for p in report['pages'])))
    return {'ok':True,'id':obj['id']}
