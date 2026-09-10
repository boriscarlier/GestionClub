from __future__ import annotations

import argparse
import json
from html.parser import HTMLParser
from pathlib import Path

from decompose_manager import EXPECTED_BYTES, EXPECTED_GIT_BLOB_SHA, EXPECTED_SHA256, validate_source

SOURCE_DEFAULT = Path('client/FC_LA_COUR_Manager.html')
JSON_DEFAULT = Path('docs/MANAGER_PAGES_INDEX.json')
MD_DEFAULT = Path('docs/MANAGER_PAGES_INDEX.md')

PAGE_CLASS_KIND = {
    'page': 'admin',
    'public-page': 'public',
    'coach-page': 'coach',
    'portal-page': 'member',
}


class PageInventoryParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pages = []
        self.stack = []
        self.active_pages = []
        self.active_heading = None
        self.active_nav = None
        self.nav_labels = {}

    @staticmethod
    def attrs_dict(attrs):
        return {key: value for key, value in attrs}

    def handle_starttag(self, tag, attrs):
        values = self.attrs_dict(attrs)
        classes = set((values.get('class') or '').split())
        page_index = None
        for class_name, kind in PAGE_CLASS_KIND.items():
            if class_name in classes and values.get('id'):
                page_id = values['id']
                page_index = len(self.pages)
                self.pages.append(
                    {
                        'id': page_id,
                        'kind': kind,
                        'source_class': class_name,
                        'title': '',
                        'nav_label': '',
                    }
                )
                self.active_pages.append(page_index)
                break

        heading_started = False
        if tag in ('h1', 'h2', 'h3') and self.active_pages:
            page = self.pages[self.active_pages[-1]]
            if not page['title']:
                self.active_heading = self.active_pages[-1]
                heading_started = True

        nav_started = None
        if tag in ('button', 'a') and values.get('data-page'):
            nav_started = values['data-page']
            self.active_nav = {'page_id': nav_started, 'text': []}

        self.stack.append(
            {
                'tag': tag,
                'page_index': page_index,
                'heading_started': heading_started,
                'nav_started': nav_started,
            }
        )

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_data(self, data):
        text = ' '.join(data.split())
        if not text:
            return
        if self.active_heading is not None:
            page = self.pages[self.active_heading]
            page['title'] = (page['title'] + ' ' + text).strip()
        if self.active_nav is not None:
            self.active_nav['text'].append(text)

    def handle_endtag(self, tag):
        if not self.stack:
            return
        entry = None
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]['tag'] == tag:
                entry = self.stack[index]
                del self.stack[index:]
                break
        if entry is None:
            return
        if entry['heading_started']:
            self.active_heading = None
        if entry['nav_started'] and self.active_nav is not None:
            self.nav_labels[entry['nav_started']] = ' '.join(self.active_nav['text']).strip()
            self.active_nav = None
        if entry['page_index'] is not None and entry['page_index'] in self.active_pages:
            while self.active_pages:
                value = self.active_pages.pop()
                if value == entry['page_index']:
                    break


def target_path(kind: str, page_id: str) -> str:
    clean = page_id
    prefix = {'public': 'public-', 'coach': 'coach-', 'member': 'portal-'}.get(kind)
    if prefix and clean.startswith(prefix):
        clean = clean[len(prefix):]
    return 'client/pages/%s/%s.html' % (kind, clean)


def build_inventory(source: Path):
    raw = source.read_bytes()
    sha256 = validate_source(raw)
    parser = PageInventoryParser()
    parser.feed(raw.decode('utf-8'))
    parser.close()

    for page in parser.pages:
        page['nav_label'] = parser.nav_labels.get(page['id'], '')
        page['target_path'] = target_path(page['kind'], page['id'])
        page['status'] = 'inventory_only'

    counts = {kind: 0 for kind in ('admin', 'public', 'coach', 'member')}
    for page in parser.pages:
        counts[page['kind']] += 1

    return {
        'format': 'FC_LA_COUR_MANAGER_PAGES_INDEX',
        'schema_version': 1,
        'source': str(source).replace('\\', '/'),
        'source_bytes': len(raw),
        'source_sha256': sha256,
        'source_git_blob_sha': EXPECTED_GIT_BLOB_SHA,
        'status': 'inventory_only_no_runtime_switch',
        'counts': counts,
        'total': len(parser.pages),
        'pages': parser.pages,
    }


def markdown(index):
    lines = [
        '# Index des pages fonctionnelles du Manager',
        '',
        '## Reference',
        '',
        '- Source : `%s`' % index['source'],
        '- Taille : `%s` octets' % index['source_bytes'],
        '- Git blob SHA : `%s`' % index['source_git_blob_sha'],
        '- SHA-256 contenu : `%s`' % index['source_sha256'],
        '- Statut : inventaire uniquement, aucune bascule runtime.',
        '',
        '## Comptage',
        '',
        '| Espace | Unites |',
        '| --- | ---: |',
    ]
    labels = {'admin': 'Administration', 'public': 'Public', 'coach': 'Educateur', 'member': 'Adherent'}
    for kind in ('admin', 'public', 'coach', 'member'):
        lines.append('| %s | %s |' % (labels[kind], index['counts'][kind]))
    lines += [
        '| **Total** | **%s** |' % index['total'],
        '',
        '## Regle de lecture',
        '',
        'Le chemin cible est une destination de migration, pas encore un fichier actif. '
        'Chaque unite restera sur le monolithe tant que ses dependances CSS/JS/donnees ne sont pas isolees et testees.',
        '',
    ]
    for kind in ('admin', 'public', 'coach', 'member'):
        lines += [
            '## ' + labels[kind],
            '',
            '| ID source | Libelle navigation | Titre detecte | Chemin cible | Statut |',
            '| --- | --- | --- | --- | --- |',
        ]
        for page in (item for item in index['pages'] if item['kind'] == kind):
            def esc(value):
                return str(value or '').replace('|', '\\|').replace('\n', ' ')
            lines.append(
                '| `%s` | %s | %s | `%s` | `%s` |'
                % (
                    esc(page['id']),
                    esc(page['nav_label']) or '—',
                    esc(page['title']) or '—',
                    esc(page['target_path']),
                    page['status'],
                )
            )
        lines.append('')
    return '\n'.join(lines) + '\n'


def main():
    parser = argparse.ArgumentParser(description='Indexe les unites fonctionnelles du Manager HTML.')
    parser.add_argument('--input', type=Path, default=SOURCE_DEFAULT)
    parser.add_argument('--json-output', type=Path, default=JSON_DEFAULT)
    parser.add_argument('--md-output', type=Path, default=MD_DEFAULT)
    args = parser.parse_args()
    index = build_inventory(args.input)
    args.json_output.parent.mkdir(parents=True, exist_ok=True)
    args.json_output.write_text(json.dumps(index, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    args.md_output.parent.mkdir(parents=True, exist_ok=True)
    args.md_output.write_text(markdown(index), encoding='utf-8')
    print('Index pages OK: %s unites %s' % (index['total'], index['counts']))


if __name__ == '__main__':
    main()
