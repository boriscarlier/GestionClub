import ipaddress
import socket
from urllib.parse import urlsplit


def is_lan_address(value):
    try:
        address = ipaddress.ip_address(value)
    except ValueError:
        return False
    return address.version == 4 and (address.is_loopback or address.is_private or address.is_link_local)


def discover_lan_hosts():
    hosts = set()
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET, socket.SOCK_STREAM):
            value = info[4][0]
            if is_lan_address(value) and not ipaddress.ip_address(value).is_loopback:
                hosts.add(value)
    except OSError:
        pass
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as probe:
            probe.connect(('192.0.2.1', 9))
            value = probe.getsockname()[0]
            if is_lan_address(value) and not ipaddress.ip_address(value).is_loopback:
                hosts.add(value)
    except OSError:
        pass
    return tuple(sorted(hosts))


def build_allowed_hosts(lan=False, extra_hosts=None):
    hosts = {'127.0.0.1', 'localhost'}
    candidates = set(extra_hosts or ())
    if lan:
        candidates.update(discover_lan_hosts())
    for value in candidates:
        text = str(value).strip().lower()
        if not is_lan_address(text) or ipaddress.ip_address(text).is_loopback:
            raise ValueError('Adresse LAN autorisee invalide : ' + text)
        hosts.add(text)
    if lan and len(hosts) == 2:
        raise ValueError('Aucune adresse IPv4 privee detectee pour le mode reseau local.')
    return frozenset(hosts)


def validate_host(values, port, allowed_hosts):
    if len(values) != 1:
        raise ValueError('Adresse du serveur non autorisee.')
    raw = values[0].strip()
    try:
        parsed = urlsplit('//' + raw)
        host = (parsed.hostname or '').lower()
        request_port = parsed.port
    except ValueError:
        raise ValueError('Adresse du serveur non autorisee.') from None
    if parsed.username or parsed.password or parsed.path or parsed.query or parsed.fragment:
        raise ValueError('Adresse du serveur non autorisee.')
    if request_port != port or host not in allowed_hosts:
        raise ValueError('Adresse du serveur non autorisee.')
    return host


def validate_origin(value, host, port):
    try:
        parsed = urlsplit(value or '')
        origin_host = (parsed.hostname or '').lower()
        origin_port = parsed.port
    except ValueError:
        raise ValueError('Origine non autorisee.') from None
    if (
        parsed.scheme != 'http'
        or parsed.username
        or parsed.password
        or parsed.path
        or parsed.query
        or parsed.fragment
        or origin_host != host
        or origin_port != port
    ):
        raise ValueError('Origine non autorisee.')
    return True
