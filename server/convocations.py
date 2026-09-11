"""Fiches préparatoires locales liées aux PDF. Aucun envoi ni événement calendrier."""
import datetime,hashlib,json,re,time
from contextlib import closing
import watch

def initialize(path):
    with closing(watch.connect(path)) as db,db:
        db.execute('''CREATE TABLE IF NOT EXISTS watch_convocations(document TEXT PRIMARY KEY,version INTEGER NOT NULL,payload TEXT NOT NULL,actor TEXT NOT NULL,updated REAL NOT NULL)''')

def source(db,ident):
    row=db.execute('SELECT name,report FROM watch_pdfs WHERE id=?',(ident,)).fetchone()
    if not row:raise watch.WatchError(404,'PDF introuvable.')
    report=json.loads(row['report']);players=[];dates=[]
    for page in report['pages']:
        for player in page.get('players',[]):
            players.append({**player,'page':page['page'],'key':str(len(players))})
        for date in page.get('dates',[]):dates.append({**date,'page':page['page']})
    fingerprint=hashlib.sha256(json.dumps(report,sort_keys=True,ensure_ascii=True).encode()).hexdigest()
    return {'document':ident,'name':row['name'],'fingerprint':fingerprint,'players':players,'dates':dates,'timezone':'Etc/UTC'}

def detail(path,ident):
    with closing(watch.connect(path)) as db:
        src=source(db,ident);row=db.execute('SELECT * FROM watch_convocations WHERE document=?',(ident,)).fetchone()
        saved={**json.loads(row['payload']),'version':row['version'],'actor':row['actor'],'updated':row['updated']} if row else None
        return {'source':src,'saved':saved,'stale':bool(saved and saved['fingerprint']!=src['fingerprint'])}

def clean_fields(obj):
    fields={}
    for key,limit in [('title',200),('date',10),('arrival',5),('start',5),('end',5),('place',400),('notes',2000)]:
        value=obj.get(key,'')
        if not isinstance(value,str) or len(value)>limit:raise watch.WatchError(400,'Champ invalide : '+key)
        fields[key]=value.strip()
    if fields['date']:
        try:
            if not re.fullmatch(r'\d{4}-\d{2}-\d{2}',fields['date']):raise ValueError()
            datetime.date.fromisoformat(fields['date'])
        except ValueError:raise watch.WatchError(400,'Date invalide.')
    for key in ('arrival','start','end'):
        if fields[key] and not re.fullmatch(r'(?:[01]\d|2[0-3]):[0-5]\d',fields[key]):raise watch.WatchError(400,'Horaire invalide.')
    if fields['arrival'] and fields['start'] and fields['arrival']>fields['start']:raise watch.WatchError(400,'Le rendez-vous doit précéder le début ou être à la même heure.')
    if fields['start'] and fields['end'] and fields['end']<=fields['start']:raise watch.WatchError(400,'La fin doit suivre le début, le même jour.')
    return fields

def save(path,obj,actor):
    if not isinstance(obj,dict) or not isinstance(obj.get('document'),str) or type(obj.get('version')) is not int or type(obj.get('verified')) is not bool:
        raise watch.WatchError(400,'Fiche invalide.')
    fields=clean_fields(obj);keys=obj.get('playerKeys')
    if not isinstance(keys,list) or len(keys)>200 or any(not isinstance(k,str) for k in keys) or len(keys)!=len(set(keys)):
        raise watch.WatchError(400,'Sélection de joueurs invalide.')
    with closing(watch.connect(path)) as db,db:
        db.execute('BEGIN IMMEDIATE');src=source(db,obj['document'])
        if obj.get('fingerprint')!=src['fingerprint']:raise watch.WatchError(409,'L’analyse PDF a changé. Rouvrez la fiche et vérifiez les joueurs.')
        by_key={p['key']:p for p in src['players']}
        if any(k not in by_key for k in keys):raise watch.WatchError(400,'Joueur absent de l’analyse du PDF.')
        players=[by_key[k] for k in keys]
        if obj['verified'] and (not players or any(not fields[k] for k in ('title','date','arrival','start','end','place'))):
            raise watch.WatchError(400,'Pour vérifier la fiche, complétez titre, date, lieu, trois horaires et sélectionnez au moins un joueur.')
        old=db.execute('SELECT version FROM watch_convocations WHERE document=?',(obj['document'],)).fetchone()
        version=old['version'] if old else 0
        if obj['version']!=version:raise watch.WatchError(409,'Fiche modifiée ailleurs. Rouvrez-la avant de continuer.')
        payload={**fields,'fingerprint':src['fingerprint'],'verified':obj['verified'],'players':players,'timezone':src['timezone'],'document':obj['document'],'sourceName':src['name']}
        db.execute('INSERT INTO watch_convocations VALUES(?,?,?,?,?) ON CONFLICT(document) DO UPDATE SET version=excluded.version,payload=excluded.payload,actor=excluded.actor,updated=excluded.updated',
                   (obj['document'],version+1,json.dumps(payload),actor,time.time()))
    return {'ok':True,'version':version+1}
