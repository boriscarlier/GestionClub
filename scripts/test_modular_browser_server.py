"""Ephemeral, loopback-only fixture. Never opens the club database."""
import json
import sys
import tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'server'),str(ROOT/'vendor')]
import current_server
import server

with tempfile.TemporaryDirectory(prefix='fclc-browser-') as temp:
    db=Path(temp)/'fiction.sqlite3'
    server.initialize(db)
    server.add_user(db,'browser-fixture','Fiction-only-password-123','reader')
    srv=server.make_server(db,0)
    print(json.dumps({'port':srv.server_port}),flush=True)
    try:srv.serve_forever()
    finally:srv.server_close()
