"""Fixtures fictives et réseau simulé : aucun accès aux sites officiels pendant les tests."""
import copy
import http.client
import json
import sqlite3
import tempfile
import threading
import time
import unittest
from contextlib import closing
from pathlib import Path
from unittest.mock import patch
import server
import watch

ROOT='https://example.invalid/mairie/'
HTML='''<html><head><link rel="alternate" type="application/rss+xml" href="/feed"/></head><body>
<a href="/actu?utm_source=test">Association CLUB EXEMPLE : formation au stade municipal</a>
<a href="/actu#haut">Association CLUB EXEMPLE : formation au stade municipal</a>
<a href="/document.pdf">Convocation à la réunion du comité — PDF</a>
<a href="https://foreign.invalid/actu">Contenu extérieur à ne pas suivre</a>
<a href="javascript:alert(1)">Lien exécutable à refuser</a>
<script><a href="/script">Un faux titre dans un script</a></script></body></html>'''
RSS='''<rss><channel><item><title>Association CLUB EXEMPLE : formation au stade municipal</title><link>https://example.invalid/mairie/actu</link><description>&lt;b&gt;Démonstration fictive&lt;/b&gt; &lt;script&gt;alert(1)&lt;/script&gt;</description><pubDate>Mon, 01 Jan 2024 10:00:00 GMT</pubDate></item></channel></rss>'''
def fetch(url,source):
    return (RSS,'application/rss+xml',url) if url.endswith('/feed') else (HTML,'text/html',url)
def observation(title='Association CLUB EXEMPLE : formation au stade municipal',suffix='actu'):
    return {'url':ROOT+suffix,'title':title,'origin_page':ROOT,'excerpt':'Exemple fictif','published':'2024-01-01'}

class WatchTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.path=Path(self.temp.name)/'club.sqlite3';server.initialize(self.path)
    def tearDown(self): self.temp.cleanup()
    def test_url_scope_and_tracking(self):
        self.assertEqual(watch.safe_url('/actu?utm_source=x&b=2&a=1#fin','mairie'),ROOT+'actu?a=1&b=2')
        for url in ['http://example.invalid/mairie/x','https://example.invalid/mairie.evil.invalid/x','https://user:pass@example.invalid/mairie/x','https://127.0.0.1/x','https://example.invalid/mairie:8443/x','javascript:alert(1)','https://example.invalid/mairie/\\x']:
            with self.subTest(url=url),self.assertRaises(watch.WatchError):watch.safe_url(url,'mairie')
    def test_private_dns_and_redirect_denied(self):
        with patch.object(watch.socket,'getaddrinfo',return_value=[(2,1,6,'',('192.168.1.3',443))]),self.assertRaises(watch.WatchError):watch.ensure_public_host(ROOT)
        handler=watch.RestrictedRedirect('mairie')
        req=watch.urllib.request.Request(ROOT)
        with self.assertRaises(watch.WatchError):handler.redirect_request(req,None,302,'',{},'https://foreign.invalid/')
    def test_feed_and_html_safe_extraction(self):
        rows,summary=watch.collect_source('mairie',fetch)
        self.assertEqual(len(rows),2);self.assertFalse(summary['errors'])
        first=next(r for r in rows if r['url']==ROOT+'actu')
        self.assertEqual(first['excerpt'],'Démonstration fictive');self.assertEqual(first['published'],'Mon, 01 Jan 2024 10:00:00 GMT')
        self.assertEqual(sum(r['is_document'] for r in rows),1)
    def test_atom_and_unsafe_xml(self):
        text='<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Formation fictive</title><link href="/formation"/><published>2024-01-01</published></entry></feed>'
        self.assertEqual(watch.parse_feed(text,'mairie',ROOT)[0]['url'],ROOT+'formation')
        with self.assertRaises(watch.WatchError):watch.parse_feed('<!DOCTYPE rss [<!ENTITY e "x">]><rss/>','mairie',ROOT)
    def test_topic_labels(self):
        topics=watch.topics_for('CLUB EXEMPLE et le quartier exemple : associations et formations')
        self.assertTrue({'CLUB EXEMPLE','Quartier Exemple','Associations','Formations'}<=set(topics))
        self.assertNotIn('Réunions',watch.topics_for('Ligue de football de Territoire Exemple'))
    def test_first_scan_dedup_no_absence_deletion(self):
        r=observation();self.assertEqual(watch.store_observations(self.path,'mairie',[r,r],100)['new'],1)
        self.assertEqual(watch.store_observations(self.path,'mairie',[r],200)['unchanged'],1)
        watch.store_observations(self.path,'mairie',[],300)
        item=watch.entries(self.path,{})['items'][0]
        self.assertEqual(item['first_seen'],100);self.assertEqual(item['last_seen'],200);self.assertEqual(item['published'],'2024-01-01')
        self.assertEqual(len(watch.export_watch(self.path)['versions']),1)
    def test_content_history_and_conflict(self):
        r=observation();watch.store_observations(self.path,'mairie',[r],100);a=watch.entries(self.path,{})['items'][0]
        watch.change_status(self.path,a['id'],'read',1,'fiction')
        with self.assertRaises(watch.WatchError) as ctx:watch.change_status(self.path,a['id'],'archived',1,'fiction')
        self.assertEqual(ctx.exception.status,409)
        r['title']='Nouvelle formation fictive';watch.store_observations(self.path,'mairie',[r],200)
        b=watch.entries(self.path,{})['items'][0];self.assertEqual(b['status'],'unread');self.assertEqual(b['version'],3)
        out=watch.export_watch(self.path);self.assertEqual(len(out['versions']),2);self.assertEqual(out['actions'][0]['actor'],'fiction')
    def test_action_preserved_and_feed_fallback(self):
        r=observation();watch.store_observations(self.path,'mairie',[r]);a=watch.entries(self.path,{})['items'][0];watch.change_status(self.path,a['id'],'action',a['version'],'fiction')
        title_only={**r,'excerpt':'','published':''};self.assertEqual(watch.store_observations(self.path,'mairie',[title_only])['unchanged'],1)
        r['title']='Nouvelle association fictive';watch.store_observations(self.path,'mairie',[r]);self.assertEqual(watch.entries(self.path,{})['items'][0]['status'],'action')
    def test_atomic_observation_rollback(self):
        with self.assertRaises(watch.WatchError):watch.store_observations(self.path,'mairie',[observation(),{**observation(), 'url':'https://foreign.invalid/'}])
        self.assertEqual(watch.entries(self.path,{})['total'],0)
    def test_limits_filters_pagination(self):
        rows=[observation(suffix='article'+str(i)) for i in range(65)];watch.store_observations(self.path,'mairie',rows)
        out=watch.entries(self.path,{'topic':['CLUB EXEMPLE'],'source':['mairie']});self.assertEqual(out['total'],65);self.assertEqual(len(out['items']),50)
        self.assertEqual(len(watch.entries(self.path,{'offset':['50']})['items']),15)
        self.assertEqual(watch.entries(self.path,{'source':['lrf']})['total'],0)
        for params in [{'offset':['-1']},{'status':['bad']}]:
            with self.assertRaises(watch.WatchError):watch.entries(self.path,params)
        with patch.object(watch,'MAX_ENTRIES',65):self.assertEqual(watch.store_observations(self.path,'mairie',[observation(suffix='overflow')])['skipped'],1)
    def test_history_retention(self):
        for i in range(12):watch.store_observations(self.path,'mairie',[observation(title='Version fictive '+str(i))])
        self.assertEqual(len(watch.export_watch(self.path)['versions']),10)
    def test_job_success_cooldown_failure_retains_data(self):
        ctl=watch.Controller(self.path,fetch);ctl.launch('mairie','fiction');ctl.worker.join(5);self.assertFalse(ctl.worker.is_alive())
        self.assertEqual(watch.overview(self.path)['total'],2)
        with self.assertRaises(watch.WatchError) as ctx:ctl.launch('mairie','fiction')
        self.assertEqual(ctx.exception.status,429)
        with closing(watch.connect(self.path)) as db,db:db.execute('UPDATE watch_runs SET started=0')
        def broken(*args):raise TimeoutError()
        ctl.fetcher=broken;ctl.launch('mairie','fiction');ctl.worker.join(5)
        status=next(s for s in watch.overview(self.path)['sources'] if s['id']=='mairie')
        self.assertEqual(status['latest']['status'],'failed');self.assertEqual(watch.overview(self.path)['total'],2)
    def test_one_job_at_a_time(self):
        release=threading.Event();entered=threading.Event()
        def blocked(url,source):entered.set();release.wait(3);return fetch(url,source)
        ctl=watch.Controller(self.path,blocked);ctl.launch('mairie','fiction');self.assertTrue(entered.wait(2))
        try:
            with self.assertRaises(watch.WatchError) as ctx:ctl.launch('lrf','fiction')
            self.assertEqual(ctx.exception.status,409)
        finally:release.set();ctl.worker.join(5)
    def test_schedule_settings_and_restart(self):
        c=watch.Controller(self.path,fetch);sources=watch.overview(self.path)['sources'];mairie=next(s for s in sources if s['id']=='mairie');lrf=next(s for s in sources if s['id']=='lrf')
        self.assertTrue(mairie['enabled']);self.assertFalse(lrf['enabled']);self.assertEqual(mairie['interval_days'],7)
        c.tick();self.assertIsNone(c.worker)
        with closing(watch.connect(self.path)) as db,db:db.execute("UPDATE watch_sources SET next_run=0 WHERE id='mairie'")
        c.tick();c.worker.join(5);self.assertEqual(watch.overview(self.path)['total'],2)
        watch.source_settings(self.path,{'source':'mairie','enabled':False,'days':7,'version':1})
        with self.assertRaises(watch.WatchError):watch.source_settings(self.path,{'source':'mairie','enabled':True,'days':7,'version':1})
        with closing(watch.connect(self.path)) as db,db:db.execute("INSERT INTO watch_runs(source,actor,started,status) VALUES('lrf','fiction',0,'running')")
        c.start();c.stop.set();c.scheduler.join(2)
        self.assertEqual(next(s for s in watch.overview(self.path)['sources'] if s['id']=='lrf')['latest']['status'],'interrupted')
    def test_partial_collection_reports_error(self):
        def partial(url,source):
            if url.endswith('formations/'):raise TimeoutError()
            return '<a href="/simple">Formation fictive disponible</a>','text/html',url
        rows,summary=watch.collect_source('lrf',partial);self.assertEqual(len(rows),1);self.assertEqual(len(summary['errors']),1);self.assertEqual(len(summary['coverage']),2)
    def test_existing_database_migration_preserves_snapshots_users(self):
        # Recreate the old schema exactly, then migrate twice without touching its content.
        # SQLite transaction contexts do not close connections; Windows requires explicit close.
        legacy=Path(self.temp.name)/'legacy.sqlite3'
        with closing(sqlite3.connect(legacy)) as db, db:
            db.executescript('CREATE TABLE users(name TEXT PRIMARY KEY,salt TEXT,password TEXT,role TEXT); CREATE TABLE revisions(id INTEGER PRIMARY KEY AUTOINCREMENT,created REAL,actor TEXT,club TEXT,payload TEXT);')
            db.execute('INSERT INTO users VALUES(?,?,?,?)',('fiction','salt','hash','admin'));db.execute('INSERT INTO revisions VALUES(1,0,?,?,?)',('fiction','000000','{"original":true}'))
        server.initialize(legacy);server.initialize(legacy)
        with closing(sqlite3.connect(legacy)) as db, db:
            self.assertEqual(db.execute('SELECT name,salt,password,role FROM users').fetchone(),('fiction','salt','hash','admin'));self.assertEqual(db.execute('SELECT payload FROM revisions WHERE id=1').fetchone()[0],'{"original":true}')

class WatchAPITests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp=tempfile.TemporaryDirectory();cls.path=Path(cls.temp.name)/'club.sqlite3';cls.srv=server.make_server(cls.path,0)
        for name,role in [('administrator','admin'),('editor','editor'),('reader','reader')]:server.add_user(cls.path,name,'Fiction-only-password-123',role)
        cls.srv.watch.fetcher=fetch;cls.thread=threading.Thread(target=cls.srv.serve_forever,daemon=True);cls.thread.start()
    @classmethod
    def tearDownClass(cls):
        if cls.srv.watch.worker:cls.srv.watch.worker.join(5)
        cls.srv.shutdown();cls.srv.server_close();cls.thread.join();cls.temp.cleanup()
    def setUp(self):
        with closing(server.connect(self.path)) as db,db:
            for table in ['attempts','sessions','watch_entries','watch_versions','watch_actions','watch_runs']:db.execute('DELETE FROM '+table)
    def req(self,path,method='GET',data=None,session=None,csrf=True):
        c=http.client.HTTPConnection('127.0.0.1',self.srv.server_port,timeout=5);h={'Origin':'http://127.0.0.1:'+str(self.srv.server_port),'Content-Type':'application/json'}
        if session:
            h['Cookie']=session[0]
            if csrf:h['X-CSRF-Token']=session[1]
        c.request(method,path,json.dumps(data) if data is not None else None,h);r=c.getresponse();raw=r.read();code=r.status;cookie=r.getheader('Set-Cookie');mime=r.getheader('Content-Type');c.close();return code,json.loads(raw) if 'json' in mime else raw,cookie
    def login(self,name):
        code,out,cookie=self.req('/api/login','POST',{'name':name,'password':'Fiction-only-password-123'});self.assertEqual(code,200);return cookie.split(';')[0],out['csrf']
    def test_auth_and_reader_permissions(self):
        self.assertEqual(self.req('/api/watch')[0],401);s=self.login('reader')
        for path in ['/api/watch','/api/watch/items','/api/watch/export','/api/watch/history']:self.assertEqual(self.req(path,session=s)[0],200)
        for path,method in [('/api/watch/collect','POST'),('/api/watch/settings','PUT'),('/api/watch/status','PUT')]:self.assertEqual(self.req(path,method,{},s)[0],403)
    def test_editor_collect_and_admin_settings_only(self):
        s=self.login('editor');self.assertEqual(self.req('/api/watch/settings','PUT',{},s)[0],403)
        self.assertEqual(self.req('/api/watch/collect','POST',{'source':'mairie'},s,csrf=False)[0],403)
        self.assertEqual(self.req('/api/watch/collect','POST',{'source':'mairie'},s)[0],202);self.srv.watch.worker.join(5)
        out=self.req('/api/watch/items',session=s)[1];self.assertEqual(out['total'],2);item=out['items'][0]
        self.assertEqual(self.req('/api/watch/status','PUT',{'id':item['id'],'status':'action','version':item['version']},s)[0],200)
        self.assertEqual(self.req('/api/watch/status','PUT',{'id':item['id'],'status':'read','version':item['version']},s)[0],409)
        self.assertTrue(self.req('/api/watch/item?id='+item['id'],session=s)[1]['actions'])
    def test_pdf_api_permissions_and_import(self):
        from test_pdf_watch import payload
        obj=payload();reader=self.login('reader')
        for endpoint in ['/api/watch/pdf-preview','/api/watch/pdf-save','/api/watch/pdf-reanalyze']:
            self.assertEqual(self.req(endpoint,'POST',obj,reader)[0],403)
        editor=self.login('editor');self.assertEqual(self.req('/api/watch/pdf-preview','POST',obj,editor,csrf=False)[0],403)
        code,preview,_=self.req('/api/watch/pdf-preview','POST',obj,editor);self.assertEqual(code,200)
        code,result,_=self.req('/api/watch/pdf-save','POST',{**obj,'digest':preview['id'],'confirmed':True},editor);self.assertEqual(code,201)
        self.assertEqual(self.req('/api/watch/pdf?id='+result['id'],session=reader)[0],200)
        self.assertEqual(self.req('/api/watch/pdf-file?id='+result['id'],session=reader)[1]['file'],obj['file'])
        self.assertEqual(self.req('/api/watch/pdf-status','PUT',{},reader)[0],403)
        obj={'id':result['id'],'version':1}
        self.assertEqual(self.req('/api/watch/pdf-reanalyze','POST',obj,editor,csrf=False)[0],403)
        self.assertEqual(self.req('/api/watch/pdf-reanalyze','POST',obj,editor)[0],200)
        self.assertEqual(self.req('/api/watch/pdf-reanalyze','POST',obj,editor)[0],409)
        self.assertEqual(self.req('/api/watch/pdf?id='+result['id'],session=reader)[1]['analyses'][0]['analysis_version'],'1.24.4')
    def test_convocation_api_permissions_csrf_and_revision(self):
        from test_pdf_watch import payload,table_sample
        editor=self.login('editor');reader=self.login('reader');obj=payload(table_sample())
        preview=self.req('/api/watch/pdf-preview','POST',obj,editor)[1]
        ident=self.req('/api/watch/pdf-save','POST',{**obj,'digest':preview['id'],'confirmed':True},editor)[1]['id']
        code,out,_=self.req('/api/watch/convocation?id='+ident,session=reader);self.assertEqual(code,200)
        body={'document':ident,'fingerprint':out['source']['fingerprint'],'version':0,'verified':False,'playerKeys':['0']}
        self.assertEqual(self.req('/api/watch/convocation','PUT',body,reader)[0],403)
        self.assertEqual(self.req('/api/watch/convocation','PUT',body,editor,csrf=False)[0],403)
        self.assertEqual(self.req('/api/watch/convocation','PUT',body,editor)[0],200)
        self.assertEqual(self.req('/api/watch/convocation','PUT',body,editor)[0],409)
        self.assertEqual(self.req('/api/watch/convocation?id='+ident,session=reader)[1]['saved']['players'][0]['surname'],'DEMO ALPHA')
        self.assertEqual(self.req('/convocations.js')[0],200)
    def test_manual_api_permissions_and_confirmation(self):
        from test_manual_watch import HTML
        reader=self.login('reader')
        for endpoint in ['/api/watch/manual-preview','/api/watch/manual-import']:
            self.assertEqual(self.req(endpoint,'POST',{'html':HTML},reader)[0],403)
        s=self.login('editor')
        self.assertEqual(self.req('/api/watch/manual-preview','POST',{'html':HTML},s,csrf=False)[0],403)
        code,out,_=self.req('/api/watch/manual-preview','POST',{'html':HTML},s);self.assertEqual(code,200)
        obj={'html':HTML,'digest':out['digest'],'confirmed':False}
        self.assertEqual(self.req('/api/watch/manual-import','POST',obj,s)[0],400)
        obj['confirmed']=True
        self.assertEqual(self.req('/api/watch/manual-import','POST',obj,s)[0],201)
        self.assertEqual(self.req('/api/watch/items',session=s)[1]['total'],1)
    def test_admin_settings_malformed_and_static(self):
        s=self.login('administrator');source=self.req('/api/watch',session=s)[1]['sources'][0]
        self.assertEqual(self.req('/api/watch/settings','PUT',{'source':source['id'],'enabled':True,'days':7,'version':source['version']},s)[0],200)
        for data in [{'source':[]},{'source':'mairie','enabled':True,'days':0,'version':1}]:self.assertEqual(self.req('/api/watch/settings','PUT',data,s)[0],400)
        self.assertEqual(self.req('/api/watch/collect','POST',{'source':'https://foreign.invalid'},s)[0],400)
        for path in ['/watch.js','/watch.css']:self.assertEqual(self.req(path)[0],200)
        self.assertEqual(self.req('/data/club.sqlite3',session=s)[0],404)

if __name__=='__main__':unittest.main(verbosity=2)
