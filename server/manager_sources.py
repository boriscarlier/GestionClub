"""Verified source composition; no eval, arbitrary paths, or canonical mutation."""
import hashlib
import json
import re
from pathlib import Path

INCLUDE = re.compile(br'<!--GESTION_SOURCE:([\w./-]+)-->')
CANONICAL_SHA = '90f4525384c8327a81da824710e64fef556acf1033892f1e18e06e10e47e5d15'


def page_for_route(root, route):
    if route == '/gestion-modulaire':
        return None
    manifest = json.loads((Path(root)/'client/manager.sources.json').read_text(encoding='utf-8'))
    for page in manifest['pages']:
        if route == '/gestion-modulaire/'+page['space']+'/'+page['id']:
            return page
    raise KeyError(route)


def select_page(html, page):
    # Only static manifest identifiers reach this script. No query-string code.
    requested = json.dumps({'id': page['id'], 'space': page['space']}).replace('<', '\\u003c')
    script = '''
<script>
window.addEventListener('DOMContentLoaded', function(){
 const requested=REQUESTED_PAGE;
 function select(){
  if(requested.space==='public'){showPublicPage(requested.id);return true;}
  if(requested.space==='admin'){
   if(!currentAdminAccount()){showAdminLogin();return false;}
   enterAdministrationAuthenticated();goTo(requested.id);return true;
  }
  if(requested.space==='coach'){
   showPublicPage('public-coach');
   if(typeof coachMember==='function' && coachMember()){coachGo(requested.id.replace(/^coach-/,''));return true;}
   return false;
  }
  if(requested.space==='member'){
   showPublicPage('public-member');
   if(typeof portalMember==='function' && portalMember()){portalGo(requested.id.replace(/^portal-/,''));return true;}
   return false;
  }
 }
 // Without a business session, the existing login screen remains in charge.
 // Do not intercept subsequent clicks or create an implicit account/session.
 try{select();}catch(e){console.error('Navigation modulaire',e);}
});
</script>
'''.replace('REQUESTED_PAGE', requested)
    # Embedded export templates also contain </body>; only the document's
    # final closing tag is an insertion point.
    before, closing, after = html.rpartition('</body>')
    if not closing:
        raise ValueError('Missing document body')
    return before + script + closing + after


def compose(root):
    root = Path(root).resolve()
    manifest = json.loads((root/'client/manager.sources.json').read_text(encoding='utf-8'))
    if manifest.get('format') != 'GESTION_CLUB_MODULAR_SOURCES' or manifest.get('schema_version') != 1:
        raise ValueError('Unknown modular manifest')
    if manifest.get('source_sha256') != CANONICAL_SHA:
        raise ValueError('Unexpected canonical source')
    files = manifest['files']
    visited = set()

    def read(name, chain=()):
        if name not in files or name in chain or len(chain)>100:
            raise ValueError('Unknown or cyclic include: '+name)
        target = (root/name).resolve()
        if not target.is_relative_to(root/'client'):
            raise ValueError('Include outside client')
        raw = target.read_bytes()
        spec = files[name]
        if len(raw) != spec['bytes'] or hashlib.sha256(raw).hexdigest() != spec['sha256']:
            raise ValueError('Source integrity check failed: '+name)
        raw.decode('utf-8')
        if name in visited:
            raise ValueError('Source included twice: '+name)
        visited.add(name)
        return INCLUDE.sub(lambda m: read(m[1].decode('ascii'), chain+(name,)), raw)

    assembled = read(manifest['shell'])
    if visited != set(files):
        raise ValueError('Unreferenced source files')
    if len(assembled) != manifest['source_bytes'] or hashlib.sha256(assembled).hexdigest() != CANONICAL_SHA:
        raise ValueError('Recomposition differs from canonical source')
    return assembled
