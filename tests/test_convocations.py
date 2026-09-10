import tempfile,unittest,json
from pathlib import Path
from contextlib import closing
import server,watch,pdf_watch,convocations
from test_pdf_watch import table_sample,payload

class ConvocationTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.path=Path(self.temp.name)/'club.sqlite3';server.initialize(self.path)
        obj=payload(table_sample());preview=pdf_watch.preview(obj)
        self.ident=pdf_watch.save(self.path,{**obj,'digest':preview['id'],'confirmed':True},'first')['id']
        self.src=convocations.detail(self.path,self.ident)['source']
    def tearDown(self):self.temp.cleanup()
    def form(self,**changes):
        return {'document':self.ident,'fingerprint':self.src['fingerprint'],'version':0,'verified':True,'title':'Détection fictive','date':'2026-09-16','arrival':'15:15','start':'15:30','end':'17:30','place':'Stade fictif','notes':'','playerKeys':['0','1','2'],**changes}
    def test_prepare_does_not_save_and_returns_source_references(self):
        out=convocations.detail(self.path,self.ident);self.assertIsNone(out['saved']);self.assertEqual(len(out['source']['players']),3)
        self.assertEqual(out['source']['players'][0]['page'],1);self.assertEqual(out['source']['timezone'],'Indian/Reunion')
    def test_save_verified_and_reopen_preserves_pdf_and_business_data(self):
        before=pdf_watch.detail(self.path,self.ident,True);convocations.save(self.path,self.form(),'editor');server.initialize(self.path)
        out=convocations.detail(self.path,self.ident);self.assertTrue(out['saved']['verified']);self.assertEqual(out['saved']['version'],1)
        self.assertEqual(out['saved']['players'][0]['surname'],'DEMO ALPHA');self.assertEqual(pdf_watch.detail(self.path,self.ident,True),before)
        with closing(watch.connect(self.path)) as db:self.assertEqual(db.execute('SELECT count(*) FROM revisions').fetchone()[0],0)
    def test_incomplete_draft_allowed_but_verified_requires_all_fields(self):
        with self.assertRaises(watch.WatchError):convocations.save(self.path,self.form(place=''),'editor')
        convocations.save(self.path,self.form(verified=False,place='',date='',playerKeys=[]),'editor')
        self.assertFalse(convocations.detail(self.path,self.ident)['saved']['verified'])
    def test_invalid_dates_times_and_order_refused(self):
        for changes in [{'date':'2026-02-30'},{'date':'20260916'},{'start':'24:00'},{'arrival':'16:00'},{'end':'15:30'},{'end':'01:00'},{'notes':'x'*2001},{'version':True}]:
            with self.subTest(changes=changes),self.assertRaises(watch.WatchError):convocations.save(self.path,self.form(**changes),'editor')
    def test_player_forgery_and_duplicate_selection_refused(self):
        for keys in [['100'],['0','0'],[{'surname':'invented'}]]:
            with self.assertRaises(watch.WatchError):convocations.save(self.path,self.form(playerKeys=keys),'editor')
        convocations.save(self.path,self.form(playerKeys=['1'],players=[{'surname':'invented'}]),'editor')
        self.assertEqual(convocations.detail(self.path,self.ident)['saved']['players'][0]['surname'],'DEMO BETA')
    def test_concurrent_save_conflict_preserves_first(self):
        convocations.save(self.path,self.form(),'first')
        with self.assertRaises(watch.WatchError) as ctx:convocations.save(self.path,self.form(title='other'),'second')
        self.assertEqual(ctx.exception.status,409);self.assertEqual(convocations.detail(self.path,self.ident)['saved']['actor'],'first')
    def test_reanalysis_change_marks_stale_and_blocks_old_form(self):
        convocations.save(self.path,self.form(),'editor')
        with closing(watch.connect(self.path)) as db,db:
            report=json.loads(db.execute('SELECT report FROM watch_pdfs WHERE id=?',(self.ident,)).fetchone()[0]);report['pages'][0]['players'].pop()
            db.execute('UPDATE watch_pdfs SET report=? WHERE id=?',(json.dumps(report),self.ident))
        self.assertTrue(convocations.detail(self.path,self.ident)['stale'])
        with self.assertRaises(watch.WatchError) as ctx:convocations.save(self.path,self.form(version=1),'editor')
        self.assertEqual(ctx.exception.status,409)
    def test_status_change_and_identical_reanalysis_keep_fiche_current(self):
        convocations.save(self.path,self.form(),'editor');pdf_watch.status(self.path,{'id':self.ident,'version':1,'status':'action'},'editor')
        pdf_watch.reanalyze(self.path,{'id':self.ident,'version':2},'editor')
        self.assertFalse(convocations.detail(self.path,self.ident)['stale'])
