"""Acces reseau local controle pour FC LA COUR Gestion Club V1.25.11-dev."""
from http.server import ThreadingHTTPServer

import network_access
import server


class LanHandler(server.Handler):
    """Valide le client LAN, Host et Origin avant de reutiliser le serveur local."""

    server_version = 'FCLaCour/1.25.11-lan-dev'

    def route(self):
        try:
            if not network_access.is_lan_address(self.client_address[0]):
                raise ValueError('Client hors reseau local refuse.')
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
        except ValueError as exc:
            raise server.Problem(403, str(exc)) from None

        original_host = self.headers['Host']
        original_origin = self.headers.get('Origin')
        self.headers.replace_header('Host', '127.0.0.1:' + str(self.server.server_port))
        if self.command != 'GET':
            self.headers.replace_header('Origin', 'http://127.0.0.1:' + str(self.server.server_port))
        try:
            return super().route()
        finally:
            self.headers.replace_header('Host', original_host)
            if self.command != 'GET' and original_origin is not None:
                self.headers.replace_header('Origin', original_origin)


def make_lan_server(path, port=8765, extra_hosts=None):
    server.initialize(path)
    allowed_hosts = network_access.build_allowed_hosts(True, extra_hosts)
    srv = ThreadingHTTPServer(('0.0.0.0', port), LanHandler)
    srv.db_path = path
    srv.watch = server.watch.Controller(path)
    srv.allowed_hosts = allowed_hosts
    srv.lan_enabled = True
    return srv


def install_lan_mode():
    original = server.make_server

    def factory(path, port=8765):
        srv = make_lan_server(path, port)
        print('Mode reseau local controle actif.')
        print('Acces local : http://127.0.0.1:%s/' % srv.server_port)
        for host in sorted(srv.allowed_hosts):
            if host not in ('127.0.0.1', 'localhost'):
                print('Acces LAN   : http://%s:%s/' % (host, srv.server_port))
        print('Ne pas ouvrir ni rediriger le port %s sur le routeur.' % srv.server_port)
        return srv

    server.make_server = factory
    return original


def main():
    install_lan_mode()
    server.main()


if __name__ == '__main__':
    main()
