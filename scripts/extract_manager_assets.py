from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import struct
from pathlib import Path

from decompose_manager import EXPECTED_GIT_BLOB_SHA, EXPECTED_SHA256, validate_source

SOURCE_DEFAULT = Path('client/FC_LA_COUR_Manager.html')
OUTPUT_DEFAULT = Path('client/assets/brand/club-logo.png')
INDEX_DEFAULT = Path('docs/MANAGER_ASSETS_INDEX.json')
EXPECTED_ASSET_SHA256 = 'f1152a3cb6601bb95a90f5e362119e0bde45b8da9f4bafe5dd256bba028fb6bd'
EXPECTED_ASSET_BYTES = 92_264
EXPECTED_WIDTH = 576
EXPECTED_HEIGHT = 507
PNG_SIGNATURE = b'\x89PNG\r\n\x1a\n'
LOGO_PATTERN = re.compile(
    r"const\s+CLUB_LOGO_DATA_URI\s*=\s*['\"]data:image/png;base64,([^'\"]+)['\"]\s*;?",
    re.DOTALL,
)


def sha256(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def png_dimensions(raw: bytes):
    if len(raw) < 24 or not raw.startswith(PNG_SIGNATURE) or raw[12:16] != b'IHDR':
        raise ValueError('Le logo extrait n est pas un PNG IHDR valide.')
    width, height = struct.unpack('>II', raw[16:24])
    return width, height


def extract_logo(source: Path):
    source_raw = source.read_bytes()
    source_sha = validate_source(source_raw)
    text = source_raw.decode('utf-8')
    match = LOGO_PATTERN.search(text)
    if not match:
        raise ValueError('Constante CLUB_LOGO_DATA_URI introuvable.')
    payload_text = ''.join(match.group(1).split())
    try:
        png = base64.b64decode(payload_text, validate=True)
    except Exception as exc:
        raise ValueError('Base64 du logo invalide.') from exc
    width, height = png_dimensions(png)
    asset_sha = sha256(png)
    if len(png) != EXPECTED_ASSET_BYTES:
        raise ValueError(
            'Taille du logo inattendue : %s au lieu de %s octets.'
            % (len(png), EXPECTED_ASSET_BYTES)
        )
    if asset_sha != EXPECTED_ASSET_SHA256:
        raise ValueError(
            'SHA-256 du logo inattendu : %s au lieu de %s.'
            % (asset_sha, EXPECTED_ASSET_SHA256)
        )
    if (width, height) != (EXPECTED_WIDTH, EXPECTED_HEIGHT):
        raise ValueError(
            'Dimensions du logo inattendues : %sx%s au lieu de %sx%s.'
            % (width, height, EXPECTED_WIDTH, EXPECTED_HEIGHT)
        )
    return {
        'source_sha256': source_sha,
        'source_git_blob_sha': EXPECTED_GIT_BLOB_SHA,
        'constant': 'CLUB_LOGO_DATA_URI',
        'mime': 'image/png',
        'payload_chars': len(payload_text),
        'decoded_bytes': len(png),
        'width': width,
        'height': height,
        'sha256': asset_sha,
        'match_char_start': match.start(),
        'match_char_end': match.end(),
        'png': png,
    }


def build_index(info, target: Path):
    return {
        'format': 'FC_LA_COUR_MANAGER_ASSETS_INDEX',
        'schema_version': 1,
        'source': str(SOURCE_DEFAULT).replace('\\', '/'),
        'source_sha256': info['source_sha256'],
        'source_git_blob_sha': info['source_git_blob_sha'],
        'status': 'extracted_not_active',
        'assets': [
            {
                'id': 'club-logo',
                'source_constant': info['constant'],
                'source_mime': info['mime'],
                'source_payload_chars': info['payload_chars'],
                'source_char_start': info['match_char_start'],
                'source_char_end': info['match_char_end'],
                'target_path': str(target).replace('\\', '/'),
                'bytes': info['decoded_bytes'],
                'width': info['width'],
                'height': info['height'],
                'sha256': info['sha256'],
                'runtime_active': False,
            }
        ],
    }


def extract(source: Path, output: Path, index_output: Path):
    info = extract_logo(source)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(info['png'])
    index = build_index(info, output)
    index_output.parent.mkdir(parents=True, exist_ok=True)
    index_output.write_text(json.dumps(index, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return index


def main():
    parser = argparse.ArgumentParser(
        description='Extrait les ressources binaires connues du Manager sans modifier le monolithe.'
    )
    parser.add_argument('--input', type=Path, default=SOURCE_DEFAULT)
    parser.add_argument('--logo-output', type=Path, default=OUTPUT_DEFAULT)
    parser.add_argument('--index-output', type=Path, default=INDEX_DEFAULT)
    args = parser.parse_args()
    index = extract(args.input, args.logo_output, args.index_output)
    asset = index['assets'][0]
    print(
        'Asset OK: %s, %s octets, %sx%s, SHA256 %s, runtime_active=%s'
        % (
            asset['target_path'], asset['bytes'], asset['width'], asset['height'],
            asset['sha256'], asset['runtime_active']
        )
    )


if __name__ == '__main__':
    main()
