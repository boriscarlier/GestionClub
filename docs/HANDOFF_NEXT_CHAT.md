# Reprise — V1.25.12 C/D/E

Depot : https://github.com/boriscarlier/GestionClub
Branche : `refactor/v1.25.12-c1-shared-css`, PR #3. Travail publie, pas fusionne dans main.
Base fonctionnelle conservee : V1.25.11.1 (famille V1.25.11, pas V16).

## Travail effectue

- 114 fichiers CSS ordonnes ; MANAGER_CSS_INDEX.md et MANAGER_CSS_CASCADE.md.
- 663 unites JavaScript classiques ; MANAGER_JS_SERVICES.md. Pas des ES modules autonomes.
- 70 templates HTML imbriques ; MANAGER_COMPOSED_PAGES.md.
- Assemblage Python par manifeste : resultat identique octet pour octet au monolithe.
- Route optionnelle `/gestion-modulaire` et 70 entrees directes. `/gestion` inchange ; repli `/gestion-legacy`.
- Aucun changement des donnees ou de la logique metier du monolithe, aucune bascule F.

## Verification et blocage

141 tests Python passes localement, dont authentification, Host, LAN, corruption et syntaxe JS.
210 comparaisons visuelles (70 pages, largeurs 1440/1024/390) passees sur `330c94128abe28c335f2a56283001066cd4247e4`, run Actions `34507785787`.
Tolerance raster : au plus 0,01 % des pixels et ecart maximal 12/255 ; maximum observe 24 pixels, ecart 10. CSSOM identique.

Les controles supplementaires des 70 acces directs ont revele une injection dans les chaines HTML d'export. Corrigee par insertion sur la derniere fermeture du document dans `bd6d35a157e44a684085f423de40409017510287`, avec test de regression.

Nouvelle CI : echec avant toute etape (run `34508751055`), aucun journal disponible. Cause non determinee. Chromium local indisponible et telechargement expire. Ne pas declarer les 70 entrees directes validees ; ne pas fusionner avant verification navigateur.

## Prochaine action

1. Retablir le demarrage des jobs Actions puis relancer la CI sur la tete de PR #3.
2. Verifier 210 comparaisons, 70 acces directs et absence d'erreurs JS dans l'artefact `modular-browser-report`.
3. Corriger tout echec reel ; fusionner seulement apres CI reussie.
4. Avant F : validation physique Windows/LAN et decision de bascule. Ne pas supprimer le monolithe.

## Commandes

```bash
PYTHONPATH=server:vendor:tests:scripts python -m unittest discover -s tests -q
python scripts/build_manager_sources.py --check
```

Node sert a la generation/syntaxe et aux tests navigateur ; l'execution Windows reste Python seulement.
Ne jamais versionner les donnees reelles. Tests sur donnees fictives et bases temporaires.
