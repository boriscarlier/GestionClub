from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

MANIFEST_DEFAULT = Path('client/manager_parts/manifest.json')
OUTPUT_DEFAULT = Path('releases/rebuilt_FC_LA_COUR_Manager.html')


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def rebuild(manifest_path: Path, output: Path, compare: Path | None = None):
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    if manifest.get('format') != 'FC_LA_COUR_MANAGER_DECOMPOSITION':
        raise SystemExit('Manifest de decomposition Manager invalide.')
    parts = manifest.get('parts')
    if not isinstance(parts, list) or not parts:
        raise SystemExit('Manifest Manager sans blocs.')

    root = manifest_path.parent
    chunks = []
    expected_order = 1
    expected_start = 0
    for part in parts:
        if part.get('order') != expected_order:
            raise SystemExit('Ordre de blocs Manager invalide a %s.' % expected_order)
        if part.get('byte_start') != expected_start:
            raise SystemExit('Continuite de blocs Manager invalide a %s.' % expected_order)
        path = root / str(part.get('path', ''))
        raw = path.read_bytes()
        if len(raw) != part.get('bytes'):
            raise SystemExit('Taille de bloc differente : ' + str(path))
        if digest(raw) != part.get('sha256'):
            raise SystemExit('SHA256 de bloc different : ' + str(path))
        chunks.append(raw)
        expected_start = part.get('byte_end')
        expected_order += 1

    rebuilt = b''.join(chunks)
    if len(rebuilt) != manifest.get('source_bytes'):
        raise SystemExit('Taille reconstruite differente du monolithe source.')
    rebuilt_sha = digest(rebuilt)
    if rebuilt_sha != manifest.get('source_sha256'):
        raise SystemExit(
            'SHA256 reconstruit different. Attendu %s, obtenu %s.'
            % (manifest.get('source_sha256'), rebuilt_sha)
        )
    rebuilt.decode('utf-8')

    if compare is not None:
        canonical = compare.read_bytes()
        if canonical != rebuilt:
            raise SystemExit('Reconstruction non identique octet pour octet au Manager canonique.')

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(rebuilt)
    return rebuilt_sha, len(rebuilt), len(parts)


def main():
    parser = argparse.ArgumentParser(
        description='Reconstruit le Manager a partir des blocs et exige une identite binaire.'
    )
    parser.add_argument('--manifest', type=Path, default=MANIFEST_DEFAULT)
    parser.add_argument('--output', type=Path, default=OUTPUT_DEFAULT)
    parser.add_argument('--compare', type=Path)
    args = parser.parse_args()
    sha256, size, count = rebuild(args.manifest, args.output, args.compare)
    print('Reconstruction OK: %s blocs, %s octets.' % (count, size))
    print('SHA256 reconstruit: ' + sha256)


if __name__ == '__main__':
    main()
