"""Import explicite de pages HTML publiques enregistrées ; aucun accès réseau."""
import hashlib
import json
import time
from contextlib import closing
from html.parser import HTMLParser
import watch

class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(); self.canonical=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='link' and 'canonical' in a.get('rel','').lower().split():
            self.canonical.append(a.get('href',''))

def prepare(html):
    if not isinstance(html,str) or not html.strip() or len(html.encode('utf-8'))>watch.MAX_BYTES:
        raise watch.WatchError(400,'Choisir un fichier HTML non vide de 2 Mo maximum.')
    meta=Metadata();meta.feed(html)
    if not meta.canonical:
        raise watch.WatchError(400,'Adresse canonique absente : enregistrer la page publique de la Ligue en HTML uniquement.')
    urls={watch.safe_url(url,'lrf') for url in meta.canonical}
    if len(urls)!=1: raise watch.WatchError(400,'Adresses de provenance contradictoires.')
    page=urls.pop()
    rows,_=watch.parse_links(html,'lrf',page)
    unique={}
    for row in rows: unique.setdefault(row['url'],row)
    rows=list(unique.values())
    if not rows: raise watch.WatchError(400,'Aucun lien public exploitable dans ce fichier.')
    return {'source':'lrf','page':page,'digest':hashlib.sha256(html.encode('utf-8')).hexdigest(),
            'count':len(rows),'items':rows,'mode':'manual-html',
            'notice':'Capture manuelle partielle, provenance déclarée par le fichier et non certifiée. Date de capture et dates de publication non établies. Aucun script exécuté, aucun flux chargé.'}

def apply(path,controller,obj,actor):
    if obj.get('confirmed') is not True: raise watch.WatchError(400,'Confirmer l’aperçu avant l’import.')
    preview=prepare(obj.get('html'))
    if obj.get('digest')!=preview['digest']: raise watch.WatchError(409,'Le fichier a changé depuis l’aperçu. Recommencer la préparation.')
    if not controller.lock.acquire(blocking=False): raise watch.WatchError(409,'Une collecte est en cours. Attendre sa fin avant l’import.')
    try:
        now=time.time()
        with closing(watch.connect(path)) as db,db:
            db.execute('BEGIN IMMEDIATE')
            counts=watch.store_observations(path,'lrf',preview['items'],now,db=db,mode='manual-html')
            summary={**counts,'mode':'manual-html','digest':preview['digest'],'scope':preview['notice'],
                     'errors': ['Limite de stockage atteinte ; certains liens ne sont pas enregistrés.'] if counts['skipped'] else [],
                     'coverage':[{'page':preview['page'],'mode':'Import HTML manuel — titres et liens','observed':preview['count']}]}
            run=db.execute('INSERT INTO watch_runs(source,actor,started,ended,status,summary) VALUES(?,?,?,?,?,?)',
                ('lrf',actor,now,now,'partial' if counts['skipped'] else 'done',json.dumps(summary))).lastrowid
        return {'run':run,**counts,'mode':'manual-html'}
    finally: controller.lock.release()
