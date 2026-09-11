from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path

SOURCE_DEFAULT = Path('client/GESTION_CLUB_Manager.html')
OUTPUT_DEFAULT = Path('client/manager_parts')
EXPECTED_SHA256 = '90f4525384c8327a81da824710e64fef556acf1033892f1e18e06e10e47e5d15'
EXPECTED_GIT_BLOB_SHA = None
EXPECTED_BYTES = 1_143_987
BLOCK_RE = re.compile(br'<(style|script)\b[^>]*>.*?</\1\s*>', re.IGNORECASE | re.DOTALL)


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def validate_source(raw: bytes, expected_sha256: str | None = EXPECTED_SHA256) -> str:
    text = raw.decode('utf-8')
    if text.encode('utf-8') != raw:
        raise SystemExit('Manager: round-trip UTF-8 different du fichier source.')
    sha256 = digest(raw)
    if expected_sha256 and sha256 != expected_sha256:
        raise SystemExit(
            'Manager: SHA256 contenu inattendu. Attendu %s, obtenu %s.'
            % (expected_sha256, sha256)
        )
    if expected_sha256 == EXPECTED_SHA256 and len(raw) != EXPECTED_BYTES:
        raise SystemExit(
            'Manager: taille inattendue. Attendu %s octets, obtenu %s.'
            % (EXPECTED_BYTES, len(raw))
        )
    return sha256


def _part_name(order: int, kind: str) -> str:
    return 'raw/%04d-%s.htmlfrag' % (order, kind)


def decompose(source: Path, output_dir: Path, expected_sha256: str | None = EXPECTED_SHA256):
    raw = source.read_bytes()
    source_sha256 = validate_source(raw, expected_sha256)

    if output_dir.exists():
        shutil.rmtree(output_dir)
    (output_dir / 'raw').mkdir(parents=True, exist_ok=True)

    parts = []
    cursor = 0
    order = 0

    def add_part(kind: str, start: int, end: int):
        nonlocal order
        if end <= start:
            return
        order += 1
        payload = raw[start:end]
        relative = _part_name(order, kind)
        target = output_dir / relative
        target.write_bytes(payload)
        parts.append(
            {
                'order': order,
                'type': kind,
                'path': relative.replace('\\', '/'),
                'byte_start': start,
                'byte_end': end,
                'bytes': len(payload),
                'sha256': digest(payload),
            }
        )

    for match in BLOCK_RE.finditer(raw):
        if match.start() < cursor:
            raise SystemExit('Manager: chevauchement de blocs structurels detecte.')
        add_part('fragment', cursor, match.start())
        kind = match.group(1).decode('ascii').lower()
        add_part(kind, match.start(), match.end())
        cursor = match.end()
    add_part('fragment', cursor, len(raw))

    if not parts:
        raise SystemExit('Manager: aucun bloc structurel produit.')

    covered = sum(item['bytes'] for item in parts)
    if covered != len(raw):
        raise SystemExit('Manager: decomposition incomplete (%s/%s octets).' % (covered, len(raw)))

    manifest = {
        'format': 'GESTION_CLUB_MANAGER_DECOMPOSITION',
        'schema_version': 1,
        'source': str(source).replace('\\', '/'),
        'source_bytes': len(raw),
        'source_sha256': source_sha256,
        'source_git_blob_sha': EXPECTED_GIT_BLOB_SHA if source_sha256 == EXPECTED_SHA256 else None,
        'encoding': 'utf-8-strict',
        'strategy': 'lossless-style-script-boundaries',
        'parts_count': len(parts),
        'parts': parts,
    }
    (output_dir / 'manifest.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )
    return manifest


def main():
    parser = argparse.ArgumentParser(
        description='Decompose le Manager HTML en blocs bruts sans modifier un seul octet.'
    )
    parser.add_argument('--input', type=Path, default=SOURCE_DEFAULT)
    parser.add_argument('--output', type=Path, default=OUTPUT_DEFAULT)
    parser.add_argument(
        '--expected-sha256',
        default=EXPECTED_SHA256,
        help='SHA256 contenu attendu; utiliser une chaine vide pour desactiver ce garde-fou.',
    )
    args = parser.parse_args()
    expected = args.expected_sha256.strip() or None
    manifest = decompose(args.input, args.output, expected)
    counts = {}
    for part in manifest['parts']:
        counts[part['type']] = counts.get(part['type'], 0) + 1
    print(
        'Decomposition OK: %s octets, %s blocs (%s).'
        % (
            manifest['source_bytes'],
            manifest['parts_count'],
            ', '.join('%s=%s' % item for item in sorted(counts.items())),
        )
    )
    print('SHA256 contenu: ' + manifest['source_sha256'])
    if manifest.get('source_git_blob_sha'):
        print('Git blob SHA: ' + manifest['source_git_blob_sha'])


if __name__ == '__main__':
    main()
