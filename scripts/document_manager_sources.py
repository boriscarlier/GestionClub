"""Generate source navigation and CSS media/override section inventory."""
import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]


def documents(root=ROOT):
    manifest=json.loads((root/'client/manager.sources.json').read_text(encoding='utf-8'))
    css=['# Cartographie CSS — C2', '',
         'Ordre de cascade strict. Les fichiers sont assemblés dans les cinq styles originaux.',
         'Les conditions ci-dessous sont extraites du texte source ; elles ne constituent pas un calcul de priorité CSS.',
         'Les règles spécifiques, les doublons et les surcharges sont conservés, jamais dédupliqués automatiquement.', '',
         '| Ordre | Fichier | Section source | Conditions responsive |','| --- | --- | --- | --- |']
    for i,node in enumerate(manifest['css'],1):
        text=(root/node['path']).read_text(encoding='utf-8')
        media=' ; '.join(re.findall(r'@media\s+([^{}]+)\{',text))
        title=node.get('title') or (['Variables de thème','Base','Composants'][i-1] if i<=3 else 'Suite du style original')
        css.append('| %d | [%s](../%s) | %s | %s |'%(i,node['path'],node['path'],title.replace('|','/'),media.replace('|','/')))
    pages=['# Index des pages assemblées — E', '',
           '70 templates source. Les pages imbriquées utilisent des inclusions explicites sans duplication.',
           'Les routes ci-dessous exigent une session serveur. Les contrôles métier restent ceux du client existant.',
           'Une fiche détaillée exige toujours la sélection de son entité. Sans session métier, le portail de connexion existant est affiché.', '',
           '| Espace | Identifiant | Source | Route |','| --- | --- | --- | --- |']
    for p in manifest['pages']:
        pages.append('| %s | %s | [%s](../%s) | `/gestion-modulaire/%s/%s` |'%
            (p['space'],p['id'],p['path'],p['path'],p['space'],p['id']))
    services={
        'load':'KEY, defaults, localStorage ; sauvegarde de secours en cas de JSON invalide',
        'save':'state, KEY, localStorage, renderAll ; conservation de la sémantique existante',
        'qaBackupPayload':'state, coachLineups, QA_BUILD, prototypeFeedbackItems, prototypeScenarioState',
        'qaRestoreBackup':'currentAdminCan, clés de stockage, state, coachLineups ; rollback des écritures',
        'currentAdminAccount':'sessionStorage, accountById',
        'currentAdminCan':'state.accounts, currentAdminAccount, accountCan',
        'refreshServerMembers':'serverMembersApi, serverMembersState, updateMemberDataSource',
        'refreshServerTeams':'état/cache équipe et API serveur existants',
        'goTo':'enforcePagePermission, DOM de toutes les pages, renderers métier',
        'showPublicPage':'contrôles de changement d’espace, DOM public et portails',
    }
    js=['# Services JavaScript — D', '',
        '663 unités syntaxiquement vérifiées, dont les fonctions du bloc principal et les extensions.',
        'Il s’agit de modules de SOURCE, pas de modules ES autonomes. Ils sont recomposés dans le même script classique et dans le même ordre.',
        'Cela préserve les déclarations anticipées, les variables globales lexicales et les dépendances entre fonctions.',
        'Ne pas charger ces fichiers avec plusieurs balises script ni ajouter type=module sans migration sémantique séparée.', '',
        '| Service | Source | Dépendances à préserver |','| --- | --- | --- |']
    for symbol,dependencies in services.items():
        matches=[p for p in manifest['javascript'] if p['symbol']==symbol]
        if len(matches)!=1:raise ValueError('Ambiguous service '+symbol)
        p=matches[0]['path']
        js.append('| %s | [%s](../%s) | %s |'%(symbol,p,p,dependencies))
    js += ['', 'Le manifeste `client/manager.sources.json` référence toutes les unités, leurs plages source et empreintes.',
           'Le bandeau API/session/sauvegarde injecté par le serveur reste commun dans `server/server.py` ; aucune copie métier par page.',
           'L’isolation ES modules et le chargement à la demande ne sont pas réalisés par cette extraction.']
    return {'docs/MANAGER_CSS_INDEX.md':'\n'.join(css)+'\n',
            'docs/MANAGER_COMPOSED_PAGES.md':'\n'.join(pages)+'\n',
            'docs/MANAGER_JS_SERVICES.md':'\n'.join(js)+'\n'}


if __name__=='__main__':
    for path,text in documents().items():
        (ROOT/path).write_text(text,encoding='utf-8')
    print('CSS, JS services and page indexes generated')
