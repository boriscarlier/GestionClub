import os
import subprocess
import sys
import unittest
from pathlib import Path

import restart_local_server


ROOT = Path(__file__).resolve().parents[1]


class WindowsRuntimeTests(unittest.TestCase):
    def test_01_update_keeps_logs_and_checks_versions(self):
        text = (ROOT / 'METTRE_A_JOUR.cmd').read_text(encoding='utf-8').lower()
        self.assertIn('derniere_mise_a_jour.log', text)
        self.assertIn('version source', text)
        self.assertIn('version cible', text)
        self.assertIn('restart_local_server.py', text)
        self.assertIn('8765', text)
        self.assertIn('8766', text)

    def test_02_test_launcher_keeps_latest_log_even_on_success(self):
        text = (ROOT / 'scripts/windows/LANCER_TESTS.cmd').read_text(encoding='utf-8').lower()
        self.assertIn('dernier_test.log', text)
        self.assertIn('tests_%stamp%.log', text)
        self.assertNotIn('del /q "%err_log%"', text)

    def test_03_windows_server_launcher_uses_current_runtime(self):
        text = (ROOT / 'scripts/windows/DEMARRER_SERVEUR.cmd').read_text(encoding='utf-8')
        self.assertIn('server\\current_server.py start', text)
        self.assertIn('V1.26.1', text)
        self.assertNotIn('server\\server.py start', text)
        runtime = (ROOT / 'server/current_server.py').read_text(encoding='utf-8')
        self.assertIn("webbrowser.open('http://127.0.0.1:8765/')", runtime)

    def test_04_current_runtime_accepts_its_backup_version(self):
        code = r'''
import current_server
payload={
 'format':'GESTION_CLUB_FULL_BACKUP','schemaVersion':1,'build':'V1.26.1',
 'state':{'members':[],'matches':[],'teams':[],'accounts':[],
          'clubProfile':{'official':{'affiliation':'000000'}}},
 'lineups':{},'feedback':[],'scenarios':{}
}
print(current_server.VERSION)
print(current_server.validate(payload))
'''
        env = os.environ.copy()
        env['PYTHONPATH'] = os.pathsep.join([str(ROOT / 'server'), str(ROOT / 'vendor')])
        result = subprocess.run([sys.executable, '-c', code], cwd=ROOT, env=env, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('V1.26.1', result.stdout)
        self.assertIn('000000', result.stdout)

    def test_05_current_runtime_rejects_future_backup(self):
        code = r'''
import current_server
payload={
 'format':'GESTION_CLUB_FULL_BACKUP','schemaVersion':1,'build':'V1.26.2',
 'state':{'members':[],'matches':[],'teams':[],'accounts':[],
          'clubProfile':{'official':{'affiliation':'000000'}}},
 'lineups':{},'feedback':[],'scenarios':{}
}
try:
    current_server.validate(payload)
except Exception as exc:
    print(type(exc).__name__, getattr(exc,'status',None))
    raise SystemExit(0)
raise SystemExit(1)
'''
        env = os.environ.copy()
        env['PYTHONPATH'] = os.pathsep.join([str(ROOT / 'server'), str(ROOT / 'vendor')])
        result = subprocess.run([sys.executable, '-c', code], cwd=ROOT, env=env, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('Problem 400', result.stdout)

    def test_06_netstat_parser_finds_listener_pid(self):
        sample = '''
  TCP    127.0.0.1:8765       0.0.0.0:0       LISTENING       4321
  TCP    0.0.0.0:8766         0.0.0.0:0       LISTENING       9876
  TCP    127.0.0.1:9999       0.0.0.0:0       LISTENING       1111
'''
        self.assertEqual(restart_local_server.parse_listening_pids(sample, 8765), [4321])
        self.assertEqual(restart_local_server.parse_listening_pids(sample, 8766), [9876])

    def test_07_current_runtime_serves_new_version(self):
        code = r'''
import http.client
import tempfile
import threading
from pathlib import Path
import current_server
import server
with tempfile.TemporaryDirectory() as temp:
    path=Path(temp)/'runtime.sqlite3'
    srv=server.make_server(path,0)
    thread=threading.Thread(target=srv.serve_forever,daemon=True)
    thread.start()
    try:
        port=srv.server_port
        conn=http.client.HTTPConnection('127.0.0.1',port,timeout=5)
        conn.request('GET','/',headers={'Host':'127.0.0.1:'+str(port)})
        response=conn.getresponse(); raw=response.read(); conn.close()
        assert response.status == 200
        assert b'V1.26.1' in raw
        assert b'Serveur V1.25.10' not in raw
        print('runtime-version-ok')
    finally:
        srv.shutdown(); srv.server_close(); thread.join()
'''
        env = os.environ.copy()
        env['PYTHONPATH'] = os.pathsep.join([str(ROOT / 'server'), str(ROOT / 'vendor')])
        result = subprocess.run([sys.executable, '-c', code], cwd=ROOT, env=env, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('runtime-version-ok', result.stdout)


if __name__ == '__main__':
    unittest.main(verbosity=2)
