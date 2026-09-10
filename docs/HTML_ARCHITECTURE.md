# Architecture HTML — V1.25.12

## Avancement C/D/E

Sources separees : 114 CSS, 663 unites JavaScript classiques, 70 templates de page.
Assemblage verifie par `server/manager_sources.py`, sans modification des octets du Manager.
Entree optionnelle `/gestion-modulaire` ; `/gestion` et `/gestion-legacy` restent les references.
Index techniques : `MANAGER_CSS_INDEX.md`, `MANAGER_JS_SERVICES.md`, `MANAGER_COMPOSED_PAGES.md`.
L'assemblage conserve toute la structure DOM et la portee des scripts, donc pas encore de chargement a la demande ni d'ES modules.
Les 141 tests Python et les 70 routes HTTP passent. 210 comparaisons visuelles ont passe sur 330c941. La verification supplementaire des 70 acces directs reste a relancer apres correction de l'injection dans les exports embarques : les derniers jobs GitHub Actions echouent avant leur premiere etape. Ne pas clore E ni fusionner avant ce controle.

## Base de reference

La decomposition repart exclusivement de la version stable `V1.25.11.1`.

Fichier canonique conserve pendant toute la migration :

- `client/FC_LA_COUR_Manager.html`
- taille : `1 143 051` octets
- Git blob SHA : `64def65ec261d3da05d855896484c4deb79da407`
- SHA-256 du contenu : `5646baa6ab0d19c31172eeeb5270fcccc8bc719726cb2f9c06f4147677f1f45c`
- encodage : UTF-8 strict

Le monolithe reste executable et sert de reference de comparaison jusqu'a validation physique complete de l'architecture multi-pages.

## Regle de non-regression

Une extraction n'est acceptee que si :

1. le Manager canonique de depart passe le controle SHA-256/UTF-8 ;
2. tous les octets sont couverts par un manifeste ordonne ;
3. chaque bloc possede son propre SHA-256 ;
4. la recomposition est identique octet pour octet au fichier canonique ;
5. tous les tests historiques restent verts ;
6. la nouvelle page est testee avant de devenir le chemin principal ;
7. un fallback legacy reste disponible tant que la migration n'est pas terminee.

## Outils de reference

- `scripts/index_manager_html.py` : index structurel du monolithe.
- `scripts/decompose_manager.py` : decomposition sans perte sur les frontieres `style` / `script` / fragments HTML.
- `scripts/rebuild_manager.py` : recomposition avec verification de continuite, taille et SHA-256.
- `tests/test_html_decomposition.py` : garde-fous automatiques sur le vrai Manager stable.
- `.github/workflows/html-decomposition.yml` : produit un artefact d'inspection sans modifier l'application.

## Architecture cible

```text
client/
  index.html                    # portail/navigation principal
  pages/                        # pages metier, une responsabilite principale par page
  shared/
    css/                        # styles communs
    js/                         # etat, stockage, API, session, navigation, utilitaires
  assets/                       # images, logos et autres ressources binaires
  legacy/
    FC_LA_COUR_Manager.html     # seulement apres bascule; reference de rollback
```

Aucun de ces deplacements n'est effectue en bloc. Les repertoires cibles sont remplis progressivement apres validation de chaque extraction.

## Phases de migration

### A — Inventaire sans modification fonctionnelle

Le monolithe reste exactement identique. L'index structurel et le manifeste de decomposition servent a cartographier les dependances reelles.

### B — Ressources embarquees

Les gros `data:*;base64` sont extraits en premier vers `client/assets/`, avec SHA individuel. Cette priorite est liee a l'incident de corruption observe sur le monolithe V1.25.10.

### C — CSS partage

Les styles communs sont extraits dans `client/shared/css/`. Les styles specifiques restent proches de leur page tant que leur perimetre n'est pas stabilise.

### D — JavaScript partage

Les fonctions communes sont classees par responsabilite : etat, stockage, API, sauvegarde, session, navigation et utilitaires. La logique metier ne doit pas etre dupliquee entre pages.

### E — Pages metier

Les pages sont creees uniquement apres cartographie des IDs, fonctions et dependances du monolithe. Chaque page dispose d'une entree dans `docs/MANAGER_PAGES_INDEX.md` avec ses fichiers, routes, donnees et tests.

### F — Bascule

L'architecture multi-pages devient le chemin principal seulement quand les equivalences fonctionnelles sont validees. Le monolithe passe alors en mode legacy/rollback, puis peut etre archive apres validation physique Windows + LAN.

## Regle pour les nouvelles fonctions

A partir de la bascule multi-pages, toute nouvelle fonction doit etre ajoutee :

- a une page metier existante si elle appartient clairement a son perimetre ; ou
- dans une nouvelle page declaree dans l'index des pages ;
- avec les services communs sous `client/shared/` lorsque la logique est reutilisee ;
- avec tests et documentation de route/dependances.

Le fichier monolithique ne doit plus redevenir le point d'ajout par defaut.
