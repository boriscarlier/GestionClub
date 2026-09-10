import concurrent.futures, http.client, json, tempfile, threading, unittest
from pathlib import Path
from contextlib import closing
import server

class ServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp=tempfile.TemporaryDirectory();cls.path=Path(cls.temp.name)/'test.sqlite3'
        server.initialize(cls.path)
        for name,role in [('administrator','admin'),('writer','editor'),('reader','reader')]:
            server.add_user(cls.path,name,'Fiction-only-password-123',role)
        cls.srv=server.make_server(cls.path,0);cls.thread=threading.Thread(target=cls.srv.serve_forever,daemon=True);cls.thread.start()
    @classmethod
    def tearDownClass(cls):
        cls.srv.shutdown();cls.srv.server_close();cls.thread.join();cls.temp.cleanup()
    def setUp(self):
        with closing(server.connect(self.path)) as db,db:
            db.execute('DELETE FROM attempts');db.execute('DELETE FROM sessions');db.execute('DELETE FROM revisions')
        self.p={'format':'FC_LA_COUR_FULL_BACKUP','schemaVersion':1,'build':'V1.23.3','state':{'members':[{'id':'fiction-only','name':'FICTIF'}],'teams':[],'matches':[],'accounts':[],'clubProfile':{'official':{'affiliation':'000000'}}},'lineups':{}}
    def request(self,path,method='GET',data=None,session=None,origin=None,host=None,csrf=True):
        port=self.srv.server_port;conn=http.client.HTTPConnection('127.0.0.1',port,timeout=10)
        headers={'Host':host or f'127.0.0.1:{port}','Origin':origin or f'http://127.0.0.1:{port}','Content-Type':'application/json'}
        if session:
            headers['Cookie']=session[0]
            if csrf:headers['X-CSRF-Token']=session[1]
        conn.request(method,path,None if data is None else json.dumps(data),headers);r=conn.getresponse();raw=r.read();cookie=r.getheader('Set-Cookie');status=r.status;ctype=r.getheader('Content-Type','');conn.close()
        return status,json.loads(raw) if 'json' in ctype else raw,cookie
    def raw_request(self,path,method='GET',data=None,session=None):
        port=self.srv.server_port;conn=http.client.HTTPConnection('127.0.0.1',port,timeout=10)
        headers={'Host':f'127.0.0.1:{port}','Origin':f'http://127.0.0.1:{port}','Content-Type':'application/json'}
        if session:
            headers['Cookie']=session[0]
            if method!='GET':headers['X-CSRF-Token']=session[1]
        conn.request(method,path,None if data is None else json.dumps(data),headers);r=conn.getresponse();raw=r.read();headers=dict(r.getheaders());status=r.status;conn.close()
        return status,raw,headers
    def login(self,name='administrator'):
        code,r,cookie=self.request('/api/login','POST',{'name':name,'password':'Fiction-only-password-123'});self.assertEqual(code,200)
        self.assertIn('HttpOnly',cookie);self.assertIn('SameSite=Strict',cookie)
        return cookie.split(';')[0],r['csrf']
    def deposit(self,s,expected=0,p=None):
        return self.request('/api/snapshot','PUT',{'backup':p or self.p,'expectedRevision':expected,'confirmed':True},s)
    def test_01_auth_required(self):
        self.assertEqual(self.request('/api/snapshot')[0],401)
    def test_02_wrong_password(self):
        self.assertEqual(self.request('/api/login','POST',{'name':'administrator','password':'wrong'})[0],401)
    def test_03_deposit_and_download(self):
        s=self.login();code,r,_=self.deposit(s);self.assertEqual(code,201);out=self.request('/api/snapshot',session=s)[1];self.assertEqual(out['backup'],self.p)
    def test_04_reader_denied_write(self):
        self.assertEqual(self.deposit(self.login('reader'))[0],403)
    def test_05_csrf_required(self):
        s=self.login();self.assertEqual(self.request('/api/snapshot','PUT',{},s,csrf=False)[0],403)
    def test_06_origin_and_host(self):
        self.assertEqual(self.request('/api/login','POST',{},origin='https://foreign.invalid')[0],403)
        self.assertEqual(self.request('/',host='foreign.invalid')[0],403)
    def test_07_duplicate_refused(self):
        s=self.login();self.p['state']['members']*=2;self.assertEqual(self.deposit(s)[0],400);self.assertEqual(self.request('/api/status',session=s)[1]['revision'],0)
    def test_08_club_mismatch(self):
        s=self.login();r=self.deposit(s)[1]['revision'];self.p['state']['clubProfile']['official']['affiliation']='111111';self.assertEqual(self.deposit(s,r)[0],409)
    def test_09_concurrent_writes(self):
        a=self.login();b=self.login('writer')
        with concurrent.futures.ThreadPoolExecutor(2) as ex:
            results=list(ex.map(lambda s:self.deposit(s)[0],[a,b]))
        self.assertEqual(sorted(results),[201,409]);self.assertEqual(len(self.request('/api/history',session=a)[1]['revisions']),1)
    def test_10_history_preserves_content(self):
        s=self.login();first=self.deposit(s)[1]['revision'];self.p['state']['members'][0]['name']='NOUVEAU';second=self.deposit(s,first)[1]['revision'];self.assertGreater(second,first);old=self.request('/api/snapshot?revision='+str(first),session=s)[1]['backup'];self.assertEqual(old['state']['members'][0]['name'],'FICTIF')
    def test_11_logout(self):
        s=self.login();self.assertEqual(self.request('/api/logout','POST',{},s)[0],200);self.assertEqual(self.request('/api/status',session=s)[0],401)
    def test_12_secret_storage_and_path(self):
        s=self.login()
        with closing(server.connect(self.path)) as db:
            self.assertNotEqual(db.execute('SELECT password FROM users LIMIT 1').fetchone()[0],'Fiction-only-password-123')
            self.assertNotEqual(db.execute('SELECT token FROM sessions LIMIT 1').fetchone()[0],s[0].split('=')[1])
        self.assertEqual(self.request('/data/club.sqlite3',session=s)[0],404)
    def test_13_future_and_malformed(self):
        s=self.login();self.p['build']='V2.0.0';self.assertEqual(self.deposit(s)[0],400);self.p['build']='V1.23.3';self.p['state']['clubProfile']=[];self.assertEqual(self.deposit(s)[0],400)
    def test_14_confirmation(self):
        s=self.login();self.assertEqual(self.request('/api/snapshot','PUT',{'backup':self.p,'expectedRevision':0},s)[0],400)
    def test_15_persistent_reopen(self):
        s=self.login();self.deposit(s)
        with closing(server.connect(self.path)) as db:
            self.assertEqual(json.loads(db.execute('SELECT payload FROM revisions').fetchone()[0]),self.p)
    def test_16_rate_limit(self):
        for _ in range(8):self.request('/api/login','POST',{'name':'no-user','password':'wrong'})
        self.assertEqual(self.request('/api/login','POST',{'name':'no-user','password':'wrong'})[0],429)
    def test_17_session_expiry(self):
        s=self.login()
        with closing(server.connect(self.path)) as db,db:db.execute('UPDATE sessions SET expires=0')
        self.assertEqual(self.request('/api/status',session=s)[0],401)
    def test_18_gestion_requires_session_and_serves_manager(self):
        self.assertEqual(self.raw_request('/gestion')[0],401)
        s=self.login();code,raw,headers=self.raw_request('/gestion',session=s)
        self.assertEqual(code,200)
        self.assertIn(b'FC_LA_COUR_SERVER_BRIDGE',raw)
        self.assertIn(b'FC LA COUR Manager',raw)
        self.assertIn("'unsafe-inline'",headers['Content-Security-Policy'])
    def test_19_gestion_bootstrap_latest_revision(self):
        s=self.login();revision=self.deposit(s)[1]['revision']
        code,r,_=self.request('/api/gestion/bootstrap',session=s)
        self.assertEqual(code,200)
        self.assertEqual(r['serverBuild'],'V1.25.1')
        self.assertEqual(r['mode'],'server-bridge')
        self.assertEqual(r['latest']['revision'],revision)
        self.assertEqual(r['latest']['backup'],self.p)

if __name__=='__main__':unittest.main(verbosity=2)
