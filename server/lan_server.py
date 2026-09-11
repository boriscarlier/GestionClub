"""Passerelle LAN controlee pour CLUB EXEMPLE Gestion Club V1.25.11.1."""
import argparse
import http.client
import json
import socket
import time
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import network_access

VERSION = 'V1.25.11.1'
DEFAULT_BACKEND_PORT = 8765
DEFAULT_LAN_PORT = 8766
MAX_BODY = 30 * 1024 * 1024


class LanGatewayHandler(BaseHTTPRequestHandler):
    server_version = 'GestionClub-LAN/1.25.11.1'
    sys_version = ''

    def log_message(self, *args):
        pass

    def _json_error(self, status, message):
        raw = json.dumps({'error': message}, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(raw)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Connection', 'close')
        self.end_headers()
        self.wfile.write(raw)
        self.wfile.flush()
        self.close_connection = True
        # Deliver the denial before closing a socket with unread request bytes.
        # Windows can otherwise reset the connection and hide the HTTP status.
        # Never wait for an untrusted Content-Length or drain without bounds.
        previous_timeout = self.connection.gettimeout()
        try:
            self.connection.shutdown(socket.SHUT_WR)
            deadline = time.monotonic() + 0.5
            remaining = 65536
            while remaining:
                timeout = deadline - time.monotonic()
                if timeout <= 0:
                    break
                self.connection.settimeout(timeout)
                chunk = self.connection.recv(min(8192, remaining))
                if not chunk:
                    break
                remaining -= len(chunk)
        except OSError:
            pass
        finally:
            self.connection.settimeout(previous_timeout)

    def _read_body(self):
        if self.command not in ('POST', 'PUT', 'PATCH'):
            return None
        if self.headers.get('Transfer-Encoding'):
            raise ValueError('Encodage de transfert non autorise.')
        raw_length = self.headers.get('Content-Length', '0')
        try:
            length = int(raw_length)
        except ValueError:
            raise ValueError('Longueur de requete invalide.') from None
        if length < 0 or length > MAX_BODY:
            raise ValueError('Requete trop volumineuse.')
        body = self.rfile.read(length)
        if len(body) != length:
            raise ValueError('Requete incomplete.')
        return body

    def _validate_request(self):
        if not network_access.is_lan_address(self.client_address[0]):
            raise PermissionError('Client hors reseau local refuse.')
        request_host = network_access.validate_host(
            self.headers.get_all('Host', []),
            self.server.server_port,
            self.server.allowed_hosts,
        )
        if self.command != 'GET':
            network_access.validate_origin(
                self.headers.get('Origin'),
                request_host,
                self.server.server_port,
            )
        return request_host

    def _forward(self):
        try:
            self._validate_request()
            body = self._read_body()
        except PermissionError as exc:
            return self._json_error(403, str(exc))
        except ValueError as exc:
            return self._json_error(403 if 'autorise' in str(exc) else 400, str(exc))

        backend_port = self.server.backend_port
        headers = {
            'Host': '127.0.0.1:' + str(backend_port),
            'Accept': self.headers.get('Accept', '*/*'),
        }
        if self.headers.get('Cookie'):
            headers['Cookie'] = self.headers['Cookie']
        if self.headers.get('Content-Type'):
            headers['Content-Type'] = self.headers['Content-Type']
        if self.headers.get('X-CSRF-Token'):
            headers['X-CSRF-Token'] = self.headers['X-CSRF-Token']
        if self.command != 'GET':
            headers['Origin'] = 'http://127.0.0.1:' + str(backend_port)

        try:
            connection = http.client.HTTPConnection('127.0.0.1', backend_port, timeout=20)
            connection.request(self.command, self.path, body=body, headers=headers)
            response = connection.getresponse()
            raw = response.read()
            response_headers = response.getheaders()
            status = response.status
            connection.close()
        except OSError:
            return self._json_error(503, 'Le serveur local 127.0.0.1:%s ne repond pas.' % backend_port)

        self.send_response(status)
        blocked = {'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailers', 'transfer-encoding', 'upgrade', 'server', 'date', 'content-length'}
        for name, value in response_headers:
            if name.lower() not in blocked:
                self.send_header(name, value)
        self.send_header('Content-Length', str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    do_GET = _forward
    do_POST = _forward
    do_PUT = _forward
    do_PATCH = _forward


def make_lan_gateway(port=DEFAULT_LAN_PORT, backend_port=DEFAULT_BACKEND_PORT, extra_hosts=None):
    allowed_hosts = network_access.build_allowed_hosts(True, extra_hosts)
    gateway = ThreadingHTTPServer(('0.0.0.0', port), LanGatewayHandler)
    gateway.backend_port = backend_port
    gateway.allowed_hosts = allowed_hosts
    return gateway


def backend_available(port):
    try:
        with socket.create_connection(('127.0.0.1', port), timeout=1):
            return True
    except OSError:
        return False


def write_log(log_dir, lines):
    log_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    text = '\n'.join(lines) + '\n'
    path = log_dir / ('reseau_local_' + stamp + '.log')
    path.write_text(text, encoding='utf-8')
    (log_dir / 'dernier_reseau_local.log').write_text(text, encoding='utf-8')
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=DEFAULT_LAN_PORT)
    parser.add_argument('--backend-port', type=int, default=DEFAULT_BACKEND_PORT)
    parser.add_argument('--log-dir', type=Path, default=Path('logs'))
    args = parser.parse_args()

    startup = [
        'CLUB EXEMPLE Gestion Club ' + VERSION,
        'Passerelle reseau local demandee.',
        'Serveur local attendu : http://127.0.0.1:%s/' % args.backend_port,
    ]
    if not backend_available(args.backend_port):
        startup.append('ECHEC : le serveur local ne repond pas. Lancez DEMARRER_SERVEUR.cmd avant le mode reseau local.')
        path = write_log(args.log_dir, startup)
        print('\n'.join(startup))
        print('Log : ' + str(path))
        raise SystemExit(2)

    try:
        gateway = make_lan_gateway(args.port, args.backend_port)
    except ValueError as exc:
        startup.append('ECHEC : ' + str(exc))
        path = write_log(args.log_dir, startup)
        print('\n'.join(startup))
        print('Log : ' + str(path))
        raise SystemExit(3)

    addresses = [host for host in network_access.discover_lan_hosts() if host in gateway.allowed_hosts]
    startup.append('Passerelle LAN active sur le port %s.' % gateway.server_port)
    for host in addresses:
        startup.append('ACCES LAN : http://%s:%s/' % (host, gateway.server_port))
    startup.append('Aucune redirection de port routeur ne doit etre configuree.')
    path = write_log(args.log_dir, startup)
    print('\n'.join(startup))
    print('Log : ' + str(path))
    try:
        gateway.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        gateway.server_close()


if __name__ == '__main__':
    main()
