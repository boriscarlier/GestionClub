import sys,io,base64,json,tempfile,unittest,subprocess
from pathlib import Path
from contextlib import closing
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).parent/'vendor'))
from pypdf import PdfWriter
from pypdf.generic import DictionaryObject,NameObject,DecodedStreamObject
import pdf_watch,pdf_worker,server,watch

def sample(text='CLUB EXEMPLE : convocation le 25/09/2026. Formation au stade municipal.',blank=False,pages=1,encrypted=False):
    w=PdfWriter()
    for i in range(pages):
        page=w.add_blank_page(width=595,height=842)
        if not blank:
            font=DictionaryObject({NameObject('/Type'):NameObject('/Font'),NameObject('/Subtype'):NameObject('/Type1'),NameObject('/BaseFont'):NameObject('/Helvetica'),NameObject('/Encoding'):NameObject('/WinAnsiEncoding')})
            page[NameObject('/Resources')]=DictionaryObject({NameObject('/Font'):DictionaryObject({NameObject('/F1'):w._add_object(font)})})
            stream=DecodedStreamObject();escaped=text.replace('\\','\\\\').replace('(','\\(').replace(')','\\)')
            stream.set_data(('BT /F1 12 Tf 40 780 Td ('+escaped+') Tj ET').encode('cp1252'));page[NameObject('/Contents')]=w._add_object(stream)
    if encrypted:w.encrypt('fiction',algorithm='RC4-128')
    buf=io.BytesIO();w.write(buf);return buf.getvalue()
def payload(raw=None):return {'file':base64.b64encode(sample() if raw is None else raw).decode(),'name':'fiche_fictive.pdf','source':'Source fictive de test'}
def table_sample(headers=True,borders=True,missing=False,transformed=False,ambiguous=False):
    w=PdfWriter();page=w.add_blank_page(width=595,height=842)
    font=DictionaryObject({NameObject('/Type'):NameObject('/Font'),NameObject('/Subtype'):NameObject('/Type1'),NameObject('/BaseFont'):NameObject('/Helvetica')})
    page[NameObject('/Resources')]=DictionaryObject({NameObject('/Font'):DictionaryObject({NameObject('/F1'):w._add_object(font)})})
    ops=[]
    if transformed:ops.append('1 0 0 1 10 10 cm')
    def rect(x,y,width,height):ops.append(f'{x} {y} {width} {height} re S')
    def text(x,y,t):ops.append(f'q BT /F1 10 Tf 1 0 0 1 {x} {y} Tm ({t}) Tj ET Q')
    if headers:
        for x,width in [(50,150),(200,150),(350,200)]:rect(x,700,width,30)
        text(70,710,'CLUBS');text(220,710,'NOM')
        text(370,710,'PR');text(384,710,'E');text(391,710,'NOM')
    if borders:
        for y in [640,580,520]:rect(50,y,150,60)
    if ambiguous:rect(50,570,150,80)
    for y,club in [(665,'AUTRE CLUB'),(605,'CLUB EXEMPLE'),(545,'CLUB VOISIN')]:text(70,y,club)
    for i,y in enumerate([685,665,645,625,605,585,565,545,525]):
        text(220,y,['AVANT A','AVANT B','AVANT C','DEMO ALPHA','DEMO BETA','DEMO GAMMA','APRES A','APRES B','APRES C'][i])
        if not (missing and i==4):text(370,y,['Alex','Camille','Claude','Enfant Alpha','Enfant Beta','Enfant Gamma','Morgan','Sam','Lou'][i])
    stream=DecodedStreamObject();stream.set_data('\n'.join(ops).encode('ascii'));page[NameObject('/Contents')]=w._add_object(stream)
    buf=io.BytesIO();w.write(buf);return buf.getvalue()

class PDFTests(unittest.TestCase):
    def setUp(self):self.temp=tempfile.TemporaryDirectory();self.path=Path(self.temp.name)/'test.sqlite3';server.initialize(self.path)
    def tearDown(self):self.temp.cleanup()
    def ready(self,obj=None):
        obj=payload() if obj is None else obj;out=pdf_watch.preview(obj);return {**obj,'digest':out['id'],'confirmed':True}
    def test_extract_page_and_mentions(self):
        out=pdf_watch.preview(payload());page=out['report']['pages'][0];self.assertEqual(page['page'],1);self.assertIn('CLUB EXEMPLE',page['terms']);self.assertIn('Quartier Exemple',page['terms']);self.assertEqual(page['dates'][0]['date'],'2026-09-25')
    def test_invalid_dates_and_french_months(self):
        terms,dates=pdf_worker.marks('Réunion du club le 31/02/2026, puis le 1er octobre 2026 et le 29/02/2024.')
        self.assertIn('Réunion',terms);self.assertEqual([x['date'] for x in dates],['2026-10-01','2024-02-29'])
    def test_blank_page_explicit(self):
        out=pdf_watch.preview(payload(sample(blank=True)));self.assertEqual(out['report']['pages'][0]['state'],'no-text');self.assertTrue(out['report']['warnings'])
    def test_encrypted_rejected(self):
        with self.assertRaises(watch.WatchError) as ctx:pdf_watch.preview(payload(sample(encrypted=True)))
        self.assertIn('chiffré',ctx.exception.message)
    def test_invalid_and_oversize(self):
        for obj in [{'file':'***'},payload(b'not pdf'),payload(b'%PDF-invalid'),payload(b'%PDF-'+b'x'*pdf_watch.MAX_BYTES)]:
            with self.assertRaises(watch.WatchError):pdf_watch.preview(obj)
        self.assertEqual(pdf_watch.listing(self.path)['documents'],[])
    def test_page_limit(self):
        with self.assertRaises(watch.WatchError) as ctx:pdf_watch.preview(payload(sample(blank=True,pages=41)))
        self.assertIn('40 pages',ctx.exception.message)
    def test_timeout_releases_lock(self):
        with patch.object(pdf_watch.subprocess,'run',side_effect=subprocess.TimeoutExpired('worker',12)):
            with self.assertRaises(watch.WatchError) as ctx:pdf_watch.preview(payload())
        self.assertEqual(ctx.exception.status,408);self.assertFalse(pdf_watch.EXTRACT_LOCK.locked())
    def test_preview_no_write_confirmation_and_digest(self):
        obj=self.ready();self.assertFalse(pdf_watch.listing(self.path)['documents'])
        for bad in [{**obj,'confirmed':False},{**obj,'digest':'wrong'}]:
            with self.assertRaises(watch.WatchError):pdf_watch.save(self.path,bad,'fiction')
        self.assertFalse(pdf_watch.listing(self.path)['documents'])
    def test_save_duplicate_and_original_preserved(self):
        obj=self.ready();a=pdf_watch.save(self.path,obj,'fiction');b=pdf_watch.save(self.path,obj,'fiction');self.assertFalse(a['duplicate']);self.assertTrue(b['duplicate'])
        out=pdf_watch.detail(self.path,a['id'],True);self.assertEqual(out['file'],obj['file']);self.assertEqual(len(pdf_watch.listing(self.path)['documents']),1)
        server.initialize(self.path);self.assertEqual(pdf_watch.detail(self.path,a['id'])['report']['pageCount'],1)
    def test_tracking_conflict_and_reimport(self):
        obj=self.ready();a=pdf_watch.save(self.path,obj,'fiction');pdf_watch.status(self.path,{'id':a['id'],'status':'action','version':1},'fiction')
        with self.assertRaises(watch.WatchError) as ctx:pdf_watch.status(self.path,{'id':a['id'],'status':'read','version':1},'fiction')
        self.assertEqual(ctx.exception.status,409);pdf_watch.save(self.path,obj,'fiction');out=pdf_watch.detail(self.path,a['id']);self.assertEqual(out['status'],'action');self.assertEqual(len(out['actions']),1)
    def test_storage_quota_no_insertion(self):
        obj=self.ready()
        with patch.object(pdf_watch,'MAX_TOTAL',1):
            with self.assertRaises(watch.WatchError):pdf_watch.save(self.path,obj,'fiction')
        self.assertFalse(pdf_watch.listing(self.path)['documents'])
    def test_business_snapshot_unchanged(self):
        with closing(watch.connect(self.path)) as db,db:db.execute('INSERT INTO revisions(created,actor,club,payload) VALUES(0,?,?,?)',('fiction','000000','{"original":true}'))
        pdf_watch.save(self.path,self.ready(),'fiction')
        with closing(watch.connect(self.path)) as db:self.assertEqual(db.execute('SELECT payload FROM revisions').fetchone()[0],'{"original":true}')

    def test_merged_club_cell_includes_above_and_below_label(self):
        report=pdf_worker.extract(table_sample());players=report['pages'][0]['players']
        self.assertEqual([p['surname'] for p in players],['DEMO ALPHA','DEMO BETA','DEMO GAMMA'])
        self.assertEqual([p['givenNames'] for p in players],['Enfant Alpha','Enfant Beta','Enfant Gamma'])
        self.assertEqual(report['analysisVersion'],'1.24.4')
    def test_unestablished_table_never_guesses_names(self):
        for options in [{'headers':False},{'borders':False},{'missing':True},{'transformed':True},{'ambiguous':True}]:
            with self.subTest(options=options):
                report=pdf_worker.extract(table_sample(**options))
                self.assertEqual(report['pages'][0]['players'],[]);self.assertTrue(report['warnings'])
    def test_reanalysis_upgrades_legacy_report_preserves_original_and_followup(self):
        obj=self.ready(payload(table_sample()));ident=pdf_watch.save(self.path,obj,'first')['id']
        pdf_watch.status(self.path,{'id':ident,'status':'action','version':1},'first')
        with closing(watch.connect(self.path)) as db,db:db.execute('UPDATE watch_pdfs SET report=? WHERE id=?',(json.dumps({'pages':[],'pageCount':1}),ident))
        pdf_watch.reanalyze(self.path,{'id':ident,'version':2},'second')
        out=pdf_watch.detail(self.path,ident)
        self.assertEqual(len(out['report']['pages'][0]['players']),3);self.assertEqual(out['status'],'action');self.assertEqual(out['version'],3)
        self.assertEqual(len(out['actions']),1);self.assertEqual(out['actor'],'first');self.assertEqual(out['analyses'][0]['actor'],'second')
        self.assertEqual(pdf_watch.detail(self.path,ident,True)['file'],obj['file']);self.assertEqual(len(pdf_watch.listing(self.path)['documents']),1)
        server.initialize(self.path);self.assertEqual(pdf_watch.detail(self.path,ident)['analyses'][0]['players'],3)
    def test_reanalysis_stale_version_and_missing_document(self):
        ident=pdf_watch.save(self.path,self.ready(),'first')['id']
        for obj,code in [({'id':ident,'version':0},409),({'id':'absent','version':1},404),({'id':ident,'version':True},400)]:
            with self.assertRaises(watch.WatchError) as ctx:pdf_watch.reanalyze(self.path,obj,'second')
            self.assertEqual(ctx.exception.status,code)
    def test_reanalysis_concurrent_followup_does_not_overwrite(self):
        ident=pdf_watch.save(self.path,self.ready(),'first')['id'];original=pdf_watch.detail(self.path,ident)['report'];real=pdf_watch.preview
        def concurrent(obj):
            result=real(obj);pdf_watch.status(self.path,{'id':ident,'status':'read','version':1},'other');return result
        with patch.object(pdf_watch,'preview',side_effect=concurrent):
            with self.assertRaises(watch.WatchError) as ctx:pdf_watch.reanalyze(self.path,{'id':ident,'version':1},'second')
        self.assertEqual(ctx.exception.status,409);out=pdf_watch.detail(self.path,ident)
        self.assertEqual(out['report'],original);self.assertEqual(out['status'],'read');self.assertEqual(out['analyses'],[])
    def test_failed_reanalysis_preserves_previous_report(self):
        ident=pdf_watch.save(self.path,self.ready(),'first')['id'];before=pdf_watch.detail(self.path,ident)
        with patch.object(pdf_watch,'preview',return_value={'report':{'pages':[{'state':'error'}]}}):
            with self.assertRaises(watch.WatchError):pdf_watch.reanalyze(self.path,{'id':ident,'version':1},'second')
        self.assertEqual(pdf_watch.detail(self.path,ident),before)
