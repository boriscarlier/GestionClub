import ipaddress
import os
import re
import socket
import subprocess
from urllib.parse import urlsplit


LOCAL_IPV4_NETWORKS = tuple(
    ipaddress.ip_network(value)
    for value in (
        '127.0.0.0/8',
        '10.0.0.0/8',
        '172.16.0.0/12',
        '192.168.0.0/16',
        '169.254.0.0/16',
    )
)

ROUTE_PROBES = ('1.1.1.1', '8.8.8.8')


def is_lan_address(value):
    try:
        address = ipaddress.ip_address(value)
    except ValueError:
        return False
    return address.version == 4 and any(address in network for network in LOCAL_IPV4_NETWORKS)


def _usable_lan_address(value):
    try:
        address = ipaddress.ip_address(str(value).strip())
    except ValueError:
        return None
    if address.version != 4 or address.is_loopback or address.is_unspecified:
        return None
    if not any(address in network for network in LOCAL_IPV4_NETWORKS):
        return None
    return str(address)


def _windows_ipconfig_addresses():
    if os.name != 'nt':
        return ()
    try:
        result = subprocess.run(
            ['ipconfig'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore',
            timeout=4,
            check=False,
        )
    except (OSError, subprocess.SubprocessError):
        return ()
    values = []
    for match in re.finditer(r'IPv4[^:]*:\s*([0-9]+(?:\.[0-9]+){3})', result.stdout, re.IGNORECASE):
        value = _usable_lan_address(match.group(1))
        if value:
            values.append(value)
    return tuple(values)


def discover_lan_hosts():
    """Retourne d'abord l'adresse de la route active, puis les autres IPv4 LAN detectees."""
    preferred = []
    discovered = set()

    for target in ROUTE_PROBES:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as probe:
                probe.settimeout(0.5)
                probe.connect((target, 53))
                value = _usable_lan_address(probe.getsockname()[0])
                if value and value not in preferred:
                    preferred.append(value)
                    discovered.add(value)
        except OSError:
            pass

    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET, socket.SOCK_STREAM):
            value = _usable_lan_address(info[4][0])
            if value:
                discovered.add(value)
    except OSError:
        pass

    for value in _windows_ipconfig_addresses():
        discovered.add(value)

    normal = sorted(value for value in discovered if not value.startswith('169.254.'))
    link_local = sorted(value for value in discovered if value.startswith('169.254.'))
    ordered = []
    for value in preferred + normal + link_local:
        if value not in ordered:
            ordered.append(value)
    return tuple(ordered)


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
        raise ValueError(
            'Aucune adresse IPv4 privee detectee. Verifiez que le PC est connecte au Wi-Fi/Ethernet, puis relancez le mode reseau local.'
        )
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
