# Index du monolithe HTML — Gestion Club

## Référence actuelle

- Fichier canonique : `client/GESTION_CLUB_Manager.html`
- Base fonctionnelle : `V1.25.11.1` stable.
- Encodage exigé : UTF-8 strict avec round-trip identique octet pour octet.
- Taille du fichier sain : `1 143 051` octets.
- Git blob SHA : `64def65ec261d3da05d855896484c4deb79da407`.
- SHA-256 du contenu : `58932c7e43d2a75882594b4a72998d96238f221579afc29dab7b1eed675b3fa6`.

Les deux empreintes ne sont pas interchangeables : le Git blob SHA est l'identifiant interne Git du blob, tandis que le SHA-256 est calcule directement sur les octets du fichier.

## Incident analysé

Le paquet physique initial contenait un HTML de `786 443` octets. La première rupture binaire se situait exactement à l'octet `393 216` (384 KiB), au milieu d'un asset PNG intégré en Base64. La suite n'était plus un flux UTF-8 valide et un bloc intermédiaire avait disparu. Le fichier ne devait donc pas être simplement réencodé : il fallait restaurer une source intacte.

La dernière base intacte avant l'incident est le Manager du commit V1.25.5 `7980ebcbdbfd25df4987834f74808a5ef8813c44`. Le même contenu sain sert de référence au chantier V1.25.12 de décomposition.

## Découpage logique

1. Shell document — doctype, head, métadonnées et body.
2. Styles — blocs style et règles d'interface.
3. Markup application — navigation, panneaux, formulaires, tableaux, modales et composants identifiés par id.
4. Assets intégrés — `data:*;base64,...`, traités comme blocs opaques.
5. JavaScript application — constantes, état, fonctions métier, événements et rendu.
6. Persistance / sauvegarde — import/export, `qaBackupPayload` et build.
7. Pont serveur — API membres/équipes et source SQL/API utilisée par `/gestion`.

## Index automatique

`scripts/index_manager_html.py` construit un index JSON depuis le fichier réel et contrôle : UTF-8 strict, round-trip, SHA-256, taille, lignes, blocs style/script, assets Base64, IDs, fonctions, constantes, endpoints API et ancres critiques.

Commande : `python scripts/index_manager_html.py`

La V1.25.12 ajoute `scripts/decompose_manager.py` et `scripts/rebuild_manager.py`. Le premier produit des blocs bruts ordonnes et un manifeste avec offsets, tailles et SHA-256 individuels. Le second ne valide la reconstruction que si elle est identique octet pour octet au Manager canonique.

Toute future modification du monolithe doit être précédée d'une reconstruction de l'index et suivie d'une validation. Cet index sert de plan pour extraire progressivement assets, CSS, JavaScript puis pages fonctionnelles sans modifier le comportement existant.
