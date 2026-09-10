"""Inventory source spans without serializing or changing the canonical HTML."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
from decompose_manager import BLOCK_RE, validate_source
from index_manager_pages import PAGE_CLASS_KIND, target_path

VOID = set('area base br col embed hr img input link meta param source track wbr'.split())


class PageSpans(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.text = text
        self.lines = [0]
        self.lines.extend(m.end() for m in re.finditer('\n', text))
        self.stack = []
        self.pages = []

    def byte_offset(self):
        row, col = self.getpos()
        return len(self.text[:self.lines[row-1] + col].encode('utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        kind = next((v for k, v in PAGE_CLASS_KIND.items() if k in (attrs.get('class') or '').split()), None)
        page = None
        if kind and attrs.get('id'):
            page = {'id': attrs['id'], 'kind': kind, 'start': self.byte_offset(),
                    'path': target_path(kind, attrs['id'])}
            self.pages.append(page)
        if tag not in VOID:
            self.stack.append((tag, page))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i][0] == tag:
                for _, page in self.stack[i:]:
                    if page:
                        page['end'] = self.byte_offset() + len(('</' + tag + '>').encode())
                del self.stack[i:]
                break


def inventory(source):
    raw = source.read_bytes()
    validate_source(raw)
    parser = PageSpans(raw.decode('utf-8'))
    parser.feed(raw.decode('utf-8'))
    parser.close()
    if any('end' not in p for p in parser.pages):
        raise ValueError('Unclosed page spans')
    blocks = []
    for number, match in enumerate(BLOCK_RE.finditer(raw), 1):
        opening = raw[match.start():raw.index(b'>', match.start())+1]
        start = match.start() + len(opening)
        end = raw.rfind(b'</', start, match.end())
        kind = match.group(1).decode().lower()
        blocks.append({'number': number, 'kind': kind, 'start': start, 'end': end,
            'opening': opening.decode(), 'json': b'application/json' in opening,
            'bytes': end-start})
    return raw, parser.pages, blocks


if __name__ == '__main__':
    raw, pages, blocks = inventory(Path('client/FC_LA_COUR_Manager.html'))
    print(json.dumps({'pages': pages, 'blocks': blocks}, ensure_ascii=False, indent=2))
