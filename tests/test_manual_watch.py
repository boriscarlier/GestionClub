"""Import HTML manuel : données fictives, aucune connexion aux sites."""
import json
import tempfile
import unittest
from pathlib import Path
from contextlib import closing
from unittest.mock import patch
import server,watch,manual_watch
HTML='''<html><head><link rel="canonical" href="https://example.invalid/ligue/"/></head><body>
<a href="/simple/formation/"><p>Rubrique parasite</p><h2>Formation des éducateurs</h2></a>
<a href="/simple/formation/">Formation des éducateurs</a>
<a href="https://foreign.invalid/">Lien extérieur à refuser</a>
<script>fetch('https://foreign.invalid/')</script></body></html>'''
class ManualTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.path=Path(self.temp.name)/'club.sqlite3';server.initialize(self.path);self.ctl=watch.Controller(self.path)
 def tearDown(self):self.temp.cleanup()
 def obj(self,html=HTML):return {'html':html,'digest':manual_watch.prepare(html)['digest'],'confirmed':True}
 def test_preview_dedup_heading_no_network(self):
  with patch.object(watch,'fetch_public',side_effect=AssertionError('Network')):
   r=manual_watch.prepare(HTML)
  self.assertEqual(r['count'],1);self.assertEqual(r['items'][0]['title'],'Formation des éducateurs');self.assertEqual(watch.overview(self.path)['total'],0)
 def test_reject_missing_foreign_conflicting_canonical(self):
  for html in [HTML.replace('canonical','stylesheet'),HTML.replace('https://example.invalid/ligue/','https://foreign.invalid/'),HTML.replace('</head>','<link rel="canonical" href="https://example.invalid/ligue/autre/"/></head>')]:
   with self.assertRaises(watch.WatchError):manual_watch.prepare(html)
 def test_empty_oversize_and_no_links(self):
  for html in ['',None,'x'*(watch.MAX_BYTES+1),'<link rel="canonical" href="https://example.invalid/ligue/"/>']:
   with self.assertRaises(watch.WatchError):manual_watch.prepare(html)
 def test_confirmation_digest_and_busy(self):
  for obj in [{**self.obj(),'confirmed':False},{**self.obj(),'digest':'wrong'}]:
   with self.assertRaises(watch.WatchError):manual_watch.apply(self.path,self.ctl,obj,'fiction')
  self.ctl.lock.acquire()
  try:
   with self.assertRaises(watch.WatchError):manual_watch.apply(self.path,self.ctl,self.obj(),'fiction')
  finally:self.ctl.lock.release()
  self.assertEqual(watch.overview(self.path)['total'],0)
 def test_import_provenance_no_html_retention(self):
  result=manual_watch.apply(self.path,self.ctl,self.obj(),'fiction');self.assertEqual(result['new'],1)
  item=watch.entries(self.path,{})['items'][0];self.assertEqual(item['observation_mode'],'manual-html');self.assertEqual(item['published'],'')
  out=watch.export_watch(self.path);self.assertEqual(out['runs'][0]['summary']['mode'],'manual-html');self.assertNotIn('<script>',json.dumps(out))
  lrf=next(s for s in watch.overview(self.path)['sources'] if s['id']=='lrf');self.assertIsNone(lrf['last_success'])
 def test_reimport_preserves_tracking(self):
  manual_watch.apply(self.path,self.ctl,self.obj(),'fiction');item=watch.entries(self.path,{})['items'][0];watch.change_status(self.path,item['id'],'action',item['version'],'fiction')
  r=manual_watch.apply(self.path,self.ctl,self.obj(),'fiction');self.assertEqual(r['new'],0);self.assertEqual(r['unchanged'],1);self.assertEqual(watch.entries(self.path,{})['items'][0]['status'],'action')
 def test_history_failure_rolls_back(self):
  original=json.dumps
  def dump(obj,*args,**kwargs):
   if isinstance(obj,dict) and obj.get('mode')=='manual-html':raise RuntimeError('simulated history error')
   return original(obj,*args,**kwargs)
  with patch.object(manual_watch.json,'dumps',side_effect=dump):
   with self.assertRaises(RuntimeError):manual_watch.apply(self.path,self.ctl,self.obj(),'fiction')
  self.assertEqual(watch.overview(self.path)['total'],0);self.assertFalse(self.ctl.lock.locked())
 def test_business_snapshot_preserved(self):
  with closing(watch.connect(self.path)) as db,db:db.execute('INSERT INTO revisions(created,actor,club,payload) VALUES(0,?,?,?)',('fiction','000000','{"original":true}'))
  manual_watch.apply(self.path,self.ctl,self.obj(),'fiction')
  with closing(watch.connect(self.path)) as db:self.assertEqual(db.execute('SELECT payload FROM revisions').fetchone()[0],'{"original":true}')
