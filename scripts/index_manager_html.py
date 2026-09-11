from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

DEFAULT_INPUT = Path('client/GESTION_CLUB_Manager.html')
DEFAULT_OUTPUT = Path('docs/MONOLITH_INDEX.json')


def line_of(text: str, offset: int) -> int:
    return text.count('\n', 0, offset) + 1


def positions(text: str, pattern: str, flags: int = 0, group: int = 0, limit: int | None = None):
    rows = []
    for match in re.finditer(pattern, text, flags):
        start, end = match.span(group)
        rows.append({
            'value': match.group(group),
            'char_start': start,
            'char_end': end,
            'line': line_of(text, start),
        })
        if limit and len(rows) >= limit:
            break
    return rows


def regions(text: str, tag: str):
    rows = []
    pattern = re.compile(rf'<{tag}\b[^>]*>.*?</{tag}>', re.I | re.S)
    for index, match in enumerate(pattern.finditer(text), 1):
        rows.append({
            'name': f'{tag}_{index}',
            'char_start': match.start(),
            'char_end': match.end(),
            'line_start': line_of(text, match.start()),
            'line_end': line_of(text, match.end()),
            'chars': match.end() - match.start(),
        })
    return rows


def build_index(path: Path):
    raw = path.read_bytes()
    text = raw.decode('utf-8')
    if text.encode('utf-8') != raw:
        raise SystemExit('Round-trip UTF-8 different du fichier source.')

    data_uris = []
    for index, match in enumerate(re.finditer(r"data:([^;\"']+);base64,([A-Za-z0-9+/=\r\n]+)", text), 1):
        data_uris.append({
            'name': f'data_uri_{index}',
            'mime': match.group(1),
            'char_start': match.start(),
            'char_end': match.end(),
            'line_start': line_of(text, match.start()),
            'chars': match.end() - match.start(),
            'payload_chars': len(match.group(2)),
        })

    anchors = {}
    wanted = [
        'CLUB EXEMPLE Manager',
        'qaBackupPayload',
        '/api/state/members?limit=500',
        '/api/state/teams?limit=500',
        'teamDataSource',
        'memberDataSource',
        'Source : serveur SQL/API',
        'const QA_BUILD=',
    ]
    for needle in wanted:
        offset = text.find(needle)
        anchors[needle] = None if offset < 0 else {
            'char_start': offset,
            'line': line_of(text, offset),
        }

    ids = positions(text, r"(?<=\bid=[\"'])[A-Za-z0-9_:.-]+", re.I)
    functions = positions(text, r'(?<=\bfunction\s)[A-Za-z_$][\w$]*(?=\s*\()', 0)
    constants = positions(text, r'(?<=\bconst\s)[A-Za-z_$][\w$]*(?=\s*=)', 0)
    endpoints = sorted(set(re.findall(r'/api/[A-Za-z0-9_?=&./-]+', text)))

    return {
        'format': 'GESTION_CLUB_MONOLITH_INDEX',
        'schema_version': 1,
        'source': str(path).replace('\\', '/'),
        'encoding': 'utf-8-strict',
        'bytes': len(raw),
        'characters': len(text),
        'lines': text.count('\n') + 1,
        'sha256': hashlib.sha256(raw).hexdigest(),
        'regions': {
            'style': regions(text, 'style'),
            'script': regions(text, 'script'),
        },
        'embedded_data_uris': data_uris,
        'anchors': anchors,
        'ids': ids,
        'functions': functions,
        'constants': constants,
        'api_endpoints': endpoints,
    }


def main():
    parser = argparse.ArgumentParser(description='Indexe structurellement le monolithe HTML Gestion Club.')
    parser.add_argument('--input', type=Path, default=DEFAULT_INPUT)
    parser.add_argument('--output', type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    index = build_index(args.input)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(index, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"Index OK: {index['bytes']} octets, {index['lines']} lignes, {len(index['functions'])} fonctions, {len(index['ids'])} ids")


if __name__ == '__main__':
    main()
