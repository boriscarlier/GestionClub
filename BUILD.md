# Build

Le projet ne necessite pas de compilation pour l'instant.

## Prerequis

- Windows 11 ou Linux
- Python 3.11 ou plus recent
- Aucune installation pip obligatoire pour l'etat actuel : `pypdf` est conserve dans `vendor/`

## Lancement local Linux

```bash
PYTHONPATH="$PWD/server:$PWD/vendor" python3 server/server.py start
```

## Tests Linux

```bash
PYTHONPATH="$PWD/server:$PWD/vendor" python3 -m unittest -v \
  tests.test_server \
  tests.test_watch \
  tests.test_manual_watch \
  tests.test_pdf_watch \
  tests.test_convocations
```

## Archive de livraison

Les archives de livraison doivent etre generees dans `releases/` et ne sont pas suivies par Git.

Depuis Linux :

```bash
git archive --format=zip --prefix=GESTION_CLUB_GestionClub/ -o ../GESTION_CLUB_GestionClub_V1.25.10_release.zip HEAD
```

Depuis Windows, l'utilisateur garde par defaut `D:\GESTION_CLUB_GestionClub` et applique une nouvelle archive avec `METTRE_A_JOUR.cmd`. Le dossier `data` de la cible est conserve ; les tests puis le serveur sont lances apres la copie.
