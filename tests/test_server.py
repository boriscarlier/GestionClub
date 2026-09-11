import concurrent.futures, http.client, json, os, tempfile, threading, unittest
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
            db.execute('DELETE FROM attempts');db.execute('DELETE FROM sessions');db.execute('DELETE FROM revisions');db.execute('DELETE FROM members');db.execute('DELETE FROM teams')
        self.p={'format':'GESTION_CLUB_FULL_BACKUP','schemaVersion':1,'build':'V1.23.3','state':{'members':[{'id':'fiction-only','name':'FICTIF'}],'teams':[],'matches':[],'accounts':[],'clubProfile':{'official':{'affiliation':'000000'}}},'lineups':{}}
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
        self.assertIn(b'GESTION_CLUB_SERVER_BRIDGE',raw)
        self.assertIn(b'CLUB EXEMPLE Manager',raw)
        self.assertIn("'unsafe-inline'",headers['Content-Security-Policy'])
    def test_19_gestion_bootstrap_latest_revision(self):
        s=self.login();revision=self.deposit(s)[1]['revision']
        code,r,_=self.request('/api/gestion/bootstrap',session=s)
        self.assertEqual(code,200)
        self.assertEqual(r['serverBuild'],'V1.25.10')
        self.assertEqual(r['mode'],'server-bridge')
        self.assertEqual(r['latest']['revision'],revision)
        self.assertEqual(r['latest']['backup'],self.p)
    def test_20_gestion_bridge_actions_are_visible(self):
        s=self.login();code,raw,_=self.raw_request('/gestion',session=s)
        self.assertEqual(code,200)
        self.assertIn(b'Enregistrer sur serveur',raw)
        self.assertIn(b'Telecharger revision serveur',raw)
        self.assertIn(b'/api/snapshot',raw)
        self.assertIn(b'expectedRevision:state.revision',raw)
    def test_21_current_manager_backup_version_accepted(self):
        s=self.login();self.p['build']='V1.25.10'
        code,r,_=self.deposit(s)
        self.assertEqual(code,201)
        self.assertGreaterEqual(r['revision'],1)
        out=self.request('/api/snapshot',session=s)[1]['backup']
        self.assertEqual(out['build'],'V1.25.10')
    def test_22_members_synced_to_sql_and_listed_by_api(self):
        s=self.login()
        self.p['state']['members']=[
            {'id':'m-1','licenseNumber':'9601','personNumber':'p-1','last':'ABAR','first':'Mylan','birthDate':'2015-07-25','category':'U11','email':'mylan@example.test'},
            {'id':'m-2','licenseNumber':'9602','personNumber':'p-2','last':'OLIVAR','first':'Teddy','birthDate':'2019-10-08','category':'U7','phone':'0000000000'}
        ]
        revision=self.deposit(s)[1]['revision']
        code,summary,_=self.request('/api/state/summary',session=s)
        self.assertEqual(code,200)
        self.assertEqual(summary['revision'],revision)
        self.assertEqual(summary['counts']['members'],2)
        code,listing,_=self.request('/api/state/members?q=olivar',session=s)
        self.assertEqual(code,200)
        self.assertEqual(listing['total'],1)
        self.assertEqual(listing['members'][0]['id'],'m-2')
        self.assertEqual(listing['members'][0]['fullName'],'OLIVAR Teddy')
    def test_23_member_detail_api_returns_source_payload(self):
        s=self.login()
        self.p['state']['members']=[{'id':'m-1','licenseNumber':'9601','last':'ABAR','first':'Mylan','sourceData':{'raw':'kept'}}]
        self.deposit(s)
        code,r,_=self.request('/api/state/members/m-1',session=s)
        self.assertEqual(code,200)
        self.assertEqual(r['member']['payload']['sourceData']['raw'],'kept')
        self.assertEqual(self.request('/api/state/members/missing',session=s)[0],404)
    def test_24_existing_revision_bootstraps_members_sql(self):
        with tempfile.TemporaryDirectory() as temp:
            path=Path(temp)/'legacy.sqlite3'
            server.initialize(path)
            backup={**self.p,'state':{**self.p['state'],'members':[{'id':'legacy-member','last':'LEGACY','first':'SQL'}]}}
            with closing(server.connect(path)) as db,db:
                db.execute('INSERT INTO revisions(created,actor,club,payload) VALUES(?,?,?,?)',(1,'legacy','000000',json.dumps(backup)))
            server.initialize(path)
            with closing(server.connect(path)) as db:
                row=db.execute('SELECT full_name FROM members WHERE id=?',('legacy-member',)).fetchone()
                self.assertEqual(row['full_name'],'LEGACY SQL')
    def test_25_gestion_members_api_bridge_is_visible(self):
        s=self.login();code,raw,_=self.raw_request('/gestion',session=s)
        self.assertEqual(code,200)
        self.assertIn(b'V1.25.10',raw)
        self.assertIn(b'/api/state/members?limit=500',raw)
        self.assertIn(b'Source : serveur SQL/API',raw)
    def test_26_teams_synced_to_sql_and_listed_by_api(self):
        s=self.login()
        self.p['state']['teams']=[
            {'id':'t-u11','name':'U11','competition':'Plateau','group':'Jeunes','coach':'Coach A','ground':'Stade Municipal','public':True,'rosterPublic':False},
            {'id':'t-r3','name':'Seniors 1','competition':'R3','group':'Seniors','coach':'Coach B','ground':'Stade principal','public':False,'rosterPublic':False}
        ]
        revision=self.deposit(s)[1]['revision']
        code,summary,_=self.request('/api/state/summary',session=s)
        self.assertEqual(code,200)
        self.assertEqual(summary['revision'],revision)
        self.assertEqual(summary['counts']['teams'],2)
        code,listing,_=self.request('/api/state/teams?q=r3',session=s)
        self.assertEqual(code,200)
        self.assertEqual(listing['total'],1)
        self.assertEqual(listing['teams'][0]['id'],'t-r3')
        self.assertEqual(listing['teams'][0]['name'],'Seniors 1')
    def test_27_team_detail_api_returns_source_payload(self):
        s=self.login()
        self.p['state']['teams']=[{'id':'t-u7','name':'U7','competition':'Animation','extra':{'kept':True}}]
        self.deposit(s)
        code,r,_=self.request('/api/state/teams/t-u7',session=s)
        self.assertEqual(code,200)
        self.assertEqual(r['team']['payload']['extra']['kept'],True)
        self.assertEqual(self.request('/api/state/teams/missing',session=s)[0],404)
    def test_28_gestion_teams_api_bridge_is_visible(self):
        s=self.login();code,raw,_=self.raw_request('/gestion',session=s)
        self.assertEqual(code,200)
        self.assertIn(b'/api/state/teams?limit=500',raw)
        self.assertIn(b'teamDataSource',raw)
    def test_29_default_data_path_can_use_environment_path(self):
        with tempfile.TemporaryDirectory() as temp:
            previous_path=os.environ.get('GESTION_CLUB_DATA_PATH')
            previous_dir=os.environ.get('GESTION_CLUB_DATA_DIR')
            try:
                custom=Path(temp)/'external.sqlite3'
                os.environ['GESTION_CLUB_DATA_PATH']=str(custom)
                os.environ['GESTION_CLUB_DATA_DIR']=str(Path(temp)/'ignored')
                self.assertEqual(server.default_data_path(),custom)
                os.environ.pop('GESTION_CLUB_DATA_PATH')
                self.assertEqual(server.default_data_path(),Path(temp)/'ignored'/'club.sqlite3')
            finally:
                if previous_path is None: os.environ.pop('GESTION_CLUB_DATA_PATH',None)
                else: os.environ['GESTION_CLUB_DATA_PATH']=previous_path
                if previous_dir is None: os.environ.pop('GESTION_CLUB_DATA_DIR',None)
                else: os.environ['GESTION_CLUB_DATA_DIR']=previous_dir
    def test_30_root_windows_launchers_are_packaged(self):
        root=Path(__file__).resolve().parents[1]
        start=(root/'DEMARRER_SERVEUR.cmd').read_text(encoding='utf-8')
        tests=(root/'LANCER_TESTS.cmd').read_text(encoding='utf-8')
        update=(root/'METTRE_A_JOUR.cmd').read_text(encoding='utf-8').lower()
        self.assertIn('scripts\\windows\\DEMARRER_SERVEUR.cmd',start)
        self.assertIn('scripts\\windows\\LANCER_TESTS.cmd',tests)
        self.assertIn('robocopy',update)
        self.assertIn('%source_full%\\data',update)
        self.assertIn('resolve_installation.py',update)
        self.assertIn('lancer_tests.cmd',update)
        self.assertIn('demarrer_serveur.cmd',update)
    def test_31_windows_start_script_preserves_data_path(self):
        root=Path(__file__).resolve().parents[1]
        text=(root/'scripts/windows/DEMARRER_SERVEUR.cmd').read_text(encoding='utf-8')
        self.assertIn('GESTION_CLUB_DATA_DIR',text)
        self.assertIn('GESTION_CLUB_DATA_PATH',text)
        self.assertIn('--data "%GESTION_CLUB_DATA_PATH%"',text)
        self.assertIn('TcpClient',text)
        self.assertIn('deja lance',text)
        self.assertIn('127.0.0.1:8765',text)
    def test_32_homepage_displays_current_server_version(self):
        code,raw,_=self.raw_request('/')
        self.assertEqual(code,200)
        self.assertIn(b'Serveur V1.25.10',raw)
        self.assertIn('CLUB EXEMPLE · V1.25.10'.encode('utf-8'),raw)
        self.assertNotIn(b'Serveur V1.25.1<',raw)
        self.assertNotIn('CLUB EXEMPLE · V1.25.1<'.encode('utf-8'),raw)
    def test_33_windows_tests_use_compact_status(self):
        root=Path(__file__).resolve().parents[1]
        launcher=(root/'scripts/windows/LANCER_TESTS.cmd').read_text(encoding='utf-8')
        compact=(root/'scripts/run_tests_compact.py').read_text(encoding='utf-8')
        self.assertIn('scripts\\run_tests_compact.py',launcher)
        self.assertIn('Statut tests :',compact)
        self.assertIn('self.current',compact)

if __name__=='__main__':unittest.main(verbosity=2)
