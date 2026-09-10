"""Extract editable source files; build an identical document, preserving scope."""
import argparse
import json
import re
import subprocess
from pathlib import Path

from decompose_manager import digest
from extract_manager_css import collect
from map_manager_sources import inventory

ROOT = Path(__file__).resolve().parents[1]
TOKEN = b'<!--FCLC_SOURCE:'


def css_boundaries(payload):
    """Split only at top-level comments. Never cut a rule, string or media query."""
    result = [0]
    depth = 0
    quote = None
    i = 0
    while i < len(payload):
        char = payload[i:i+1]
        if quote:
            if char == b'\\':
                i += 2
                continue
            if char == quote:
                quote = None
        elif payload[i:i+2] == b'/*':
            end = payload.find(b'*/', i+2)
            if end < 0:
                raise ValueError('Unclosed CSS comment')
            if depth == 0 and i:
                result.append(i)
            i = end+2
            continue
        elif char in (b'"', b"'"):
            quote = char
        elif char == b'{':
            depth += 1
        elif char == b'}':
            depth -= 1
            if depth < 0:
                raise ValueError('Unbalanced CSS')
        i += 1
    if depth or quote:
        raise ValueError('Unclosed CSS rule/string')
    return sorted(set(result + [len(payload)]))


def build(root=ROOT, check=False):
    raw, pages, blocks = inventory(root / 'client/FC_LA_COUR_Manager.html')
    if check:
        # End-user Windows checks require Python only. Node is an authoring tool.
        import sys
        sys.path.insert(0, str(ROOT/'server'))
        from manager_sources import compose
        manifest = json.loads((root/'client/manager.sources.json').read_text(encoding='utf-8'))
        if compose(root) != raw:
            raise ValueError('Source reconstruction changed')
        if {p['id'] for p in manifest['pages']} != {p['id'] for p in pages}:
            raise ValueError('Page inventory differs')
        for node in manifest['css'] + manifest['javascript']:
            if (root/node['path']).read_bytes() != raw[node['start']:node['end']]:
                raise ValueError('Source span differs: '+node['path'])
        return manifest
    if TOKEN in raw:
        raise ValueError('Source contains reserved include marker')
    files = {}
    spans = []
    css_index, js_index = [], []

    def add(path, start, end, kind, **meta):
        if not re.fullmatch(r'[\w./-]+', path) or '..' in Path(path).parts:
            raise ValueError('Unsafe source path')
        node = dict(path=path, start=start, end=end, kind=kind, **meta)
        spans.append(node)
        return node

    common, _ = collect(raw)
    for name, payload, info in common:
        node = add('client/shared/css/'+name, info['byte_start'], info['byte_end'], 'css')
        css_index.append(node)
    css_count = 3
    for block in blocks:
        start, end = block['start'], block['end']
        if block['kind'] == 'style':
            if block['number'] == 1:
                start = common[-1][2]['byte_end']
            payload = raw[start:end]
            limits = css_boundaries(payload)
            for a, b in zip(limits, limits[1:]):
                if a == b:
                    continue
                css_count += 1
                title = payload[a:b].decode('utf-8').splitlines()[0][:160]
                node = add('client/shared/css/ordered/%03d.css' % css_count,
                    start+a, start+b, 'css', title=title, style_block=block['number'])
                css_index.append(node)
        elif block['json']:
            add('client/shared/data/fff-example.json', start, end, 'json')
        else:
            if block['number'] == 6:
                result = subprocess.run(['node', str(ROOT/'scripts/split_manager_js.cjs')],
                    input=raw[start:end], capture_output=True, check=True)
                parts = json.loads(result.stdout)
            else:
                parts = [{'name': 'extension', 'start': 0, 'end': end-start}]
            for order, part in enumerate(parts, 1):
                node = add('client/shared/js/classic/%02d-%03d-%s.js' %
                    (block['number'], order, part['name']), start+part['start'],
                    start+part['end'], 'js', script_block=block['number'],
                    symbol=part['name'], scope='original-classic-script')
                js_index.append(node)
    for page in pages:
        add(page['path'], page['start'], page['end'], 'page', id=page['id'], space=page['kind'])

    # Arrange nested source intervals as a tree. Reject partial overlaps.
    top = dict(path='client/manager.shell.html', start=0, end=len(raw), kind='shell', children=[])
    stack = [top]
    for node in sorted(spans, key=lambda n: (n['start'], -n['end'])):
        while node['start'] >= stack[-1]['end']:
            stack.pop()
        parent = stack[-1]
        if node['end'] > parent['end']:
            raise ValueError('Overlapping source ranges: '+node['path'])
        parent['children'].append(node)
        node['children'] = []
        stack.append(node)

    def materialize(node):
        cursor = node['start']
        chunks = []
        for child in node['children']:
            chunks.extend([raw[cursor:child['start']], TOKEN+child['path'].encode()+b'-->'])
            materialize(child)
            cursor = child['end']
        chunks.append(raw[cursor:node['end']])
        files[node['path']] = b''.join(chunks)

    materialize(top)
    def clean(node):
        return {k:v for k,v in node.items() if k != 'children'}
    manifest = dict(format='FCLC_MODULAR_SOURCES', schema_version=1,
        source_sha256=digest(raw), source_bytes=len(raw),
        shell=top['path'], runtime='opt-in-composed-document',
        files={p:dict(bytes=len(c),sha256=digest(c)) for p,c in sorted(files.items())},
        css=[clean(n) for n in css_index], javascript=[clean(n) for n in js_index],
        pages=[clean(n) for n in spans if n['kind']=='page'])
    files['client/manager.sources.json'] = (json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode()
    for path, content in files.items():
        target = root/path
        if target.exists() and target.read_bytes() != content:
            raise ValueError('Divergent source, refused overwrite: '+path)
        if check and not target.is_file():
            raise ValueError('Missing source: '+path)
    if not check:
        for path, content in files.items():
            target = root/path
            if not target.exists():
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(content)
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    manifest = build(check=args.check)
    print('Sources: %d CSS, %d JS, %d pages; canonical HTML unchanged' %
        (len(manifest['css']), len(manifest['javascript']), len(manifest['pages'])))
