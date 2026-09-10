# Index du monolithe HTML — Gestion Club

## Référence actuelle

- Fichier canonique : `client/FC_LA_COUR_Manager.html`
- Version de travail : `V1.25.10`
- Encodage exigé : UTF-8 strict avec round-trip identique octet pour octet.
- Blob sain restauré : `64def65ec261d3da05d855896484c4deb79da407`.
- Taille du blob sain : `1 143 051` octets.

## Incident analysé

Le paquet physique initial contenait un HTML de `786 443` octets. La première rupture binaire se situait exactement à l'octet `393 216` (384 KiB), au milieu d'un asset PNG intégré en Base64. La suite n'était plus un flux UTF-8 valide et un bloc intermédiaire avait disparu. Le fichier ne devait donc pas être simplement réencodé : il fallait restaurer une source intacte.

La dernière base intacte avant l'incident est le Manager du commit V1.25.5 `7980ebcbdbfd25df4987834f74808a5ef8813c44`. Ce blob contient les ponts membres et équipes attendus par les tests V1.25.10.

## Découpage logique

1. Shell document — doctype, head, métadonnées et body.
2. Styles — blocs style et règles d'interface.
3. Markup application — navigation, panneaux, formulaires, tableaux, modales et composants identifiés par id.
4. Assets intégrés — `data:*;base64,...`, traités comme blocs opaques.
5. JavaScript application — constantes, état, fonctions métier, événements et rendu.
6. Persistance / sauvegarde — import/export, `qaBackupPayload` et build.
7. Pont serveur — API membres/équipes et source SQL/API utilisée par `/gestion`.

## Index automatique

`scripts/index_manager_html.py` construit `docs/MONOLITH_INDEX.json` depuis le fichier réel et contrôle : UTF-8 strict, round-trip, SHA-256, taille, lignes, blocs style/script, assets Base64, IDs, fonctions, constantes, endpoints API et ancres critiques.

Commande : `python scripts/index_manager_html.py`

Toute future modification du monolithe doit être précédée d'une reconstruction de l'index et suivie d'une validation. Cet index servira aussi de plan pour extraire progressivement CSS, assets et JavaScript hors du monolithe sans modifier le comportement fonctionnel.
