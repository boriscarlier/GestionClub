"""Arrete uniquement une instance CLUB EXEMPLE qui ecoute deja sur le port demande."""
import http.client
import os
import subprocess
import sys
import time

DEFAULT_PORT = 8765
SIGNATURES = ('GestionClub/', 'GestionClub-LAN/')


def is_fc_la_cour_server(port=DEFAULT_PORT):
    try:
        connection = http.client.HTTPConnection('127.0.0.1', port, timeout=1.5)
        connection.request('GET', '/', headers={'Host': '127.0.0.1:%s' % port})
        response = connection.getresponse()
        response.read(512)
        signature = response.getheader('Server', '')
        connection.close()
        return signature.startswith(SIGNATURES)
    except OSError:
        return False


def parse_listening_pids(text, port=DEFAULT_PORT):
    pids = []
    suffix = ':' + str(port)
    for line in text.splitlines():
        parts = line.split()
        if len(parts) < 5 or parts[0].upper() != 'TCP':
            continue
        local, state, raw_pid = parts[1], parts[-2].upper(), parts[-1]
        if state != 'LISTENING' or not local.endswith(suffix) or not raw_pid.isdigit():
            continue
        pid = int(raw_pid)
        if pid not in pids:
            pids.append(pid)
    return pids


def listening_pids(port=DEFAULT_PORT):
    result = subprocess.run(
        ['netstat', '-ano', '-p', 'tcp'],
        capture_output=True,
        text=True,
        encoding='utf-8',
        errors='ignore',
        check=False,
    )
    return parse_listening_pids(result.stdout, port)


def wait_until_free(port=DEFAULT_PORT, timeout=5):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with __import__('socket').create_connection(('127.0.0.1', port), timeout=0.3):
                pass
        except OSError:
            return True
        time.sleep(0.2)
    return False


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    port = int(argv[0]) if argv else DEFAULT_PORT
    if os.name != 'nt':
        print('Aucun redemarrage Windows requis sur cette plateforme.')
        return 0
    if not is_fc_la_cour_server(port):
        try:
            with __import__('socket').create_connection(('127.0.0.1', port), timeout=0.5):
                print('ERREUR : le port %s est occupe par un service qui ne signe pas CLUB EXEMPLE. Aucun processus n\'est arrete.' % port)
                return 3
        except OSError:
            print('Aucun serveur CLUB EXEMPLE actif sur le port %s.' % port)
            return 0
    pids = listening_pids(port)
    if not pids:
        print('ERREUR : serveur CLUB EXEMPLE detecte, mais PID introuvable. Aucun processus n\'est arrete.')
        return 4
    for pid in pids:
        result = subprocess.run(['taskkill', '/PID', str(pid), '/T', '/F'], capture_output=True, text=True, check=False)
        if result.returncode != 0:
            print('ERREUR : impossible d\'arreter le PID %s.' % pid)
            return 5
        print('Instance CLUB EXEMPLE arretee : PID %s, port %s.' % (pid, port))
    if not wait_until_free(port):
        print('ERREUR : le port %s reste occupe apres arret.' % port)
        return 6
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
