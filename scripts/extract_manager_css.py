"""Passive, byte-preserving extraction of the first shared CSS foundation."""
import argparse
import json
from pathlib import Path

from decompose_manager import BLOCK_RE, SOURCE_DEFAULT, digest, validate_source

OUTPUT = Path('client/shared/css')


def collect(raw):
    validate_source(raw)
    first = next(BLOCK_RE.finditer(raw))
    if first.group(1).lower() != b'style':
        raise ValueError('Expected the canonical leading stylesheet')
    start = raw.index(b'>', first.start()) + 1
    markers = [b'\n*{box-sizing:border-box}', b'\n.primary,.secondary,.danger,.ghost', b'/* PUBLIC */']
    boundaries = [start] + [raw.index(m, start, first.end()) for m in markers]
    names = ['01-tokens.css', '02-base.css', '03-components.css']
    items = []
    for i, name in enumerate(names):
        a, b = boundaries[i:i+2]
        payload = raw[a:b]
        items.append((name, payload, {'path': name, 'order': i + 1,
            'byte_start': a, 'byte_end': b, 'bytes': len(payload),
            'sha256': digest(payload)}))
    manifest = {'format': 'GESTION_CLUB_SHARED_CSS', 'schema_version': 1,
        'source': str(SOURCE_DEFAULT), 'source_sha256': digest(raw),
        'runtime_active': False, 'phase': 'V1.25.12-C1',
        'scope': 'Leading shared foundation only; later overrides remain in canonical HTML',
        'parts': [item[2] for item in items]}
    return items, manifest


def extract(source=SOURCE_DEFAULT, output=OUTPUT, check=False):
    items, manifest = collect(source.read_bytes())
    files = {name: payload for name, payload, _ in items}
    files['manifest.json'] = (json.dumps(manifest, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    # Check all existing targets before writing anything. Never overwrite divergent edits.
    for name, payload in files.items():
        target = output / name
        if target.exists() and target.read_bytes() != payload:
            raise ValueError('Divergent CSS extraction: ' + str(target))
        if check and not target.is_file():
            raise ValueError('Missing CSS extraction: ' + str(target))
    if not check:
        output.mkdir(parents=True, exist_ok=True)
        for name, payload in files.items():
            target = output / name
            if not target.exists():
                target.write_bytes(payload)
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', type=Path, default=SOURCE_DEFAULT)
    parser.add_argument('--output', type=Path, default=OUTPUT)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    result = extract(args.input, args.output, args.check)
    print('CSS OK: %s passive files; canonical source unchanged' % len(result['parts']))
