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
  tests.test_convocations \
  tests.test_lan_server
```

## Acces LAN V1.25.11-dev

Sous Windows, le mode reseau local se lance uniquement par :

```bat
DEMARRER_RESEAU_LOCAL.cmd
```

Le mode local `DEMARRER_SERVEUR.cmd` reste inchangé et reste le mode par defaut. Le lanceur LAN n'ouvre aucune regle de pare-feu et ne doit pas etre utilise avec une redirection du port `8765` sur le routeur.

## Archive de livraison

Les archives de livraison doivent etre generees dans `releases/` et ne sont pas suivies par Git.

Depuis Linux :

```bash
git archive --format=zip --prefix=FC_LA_COUR_GestionClub/ -o ../FC_LA_COUR_GestionClub_V1.25.10_release.zip HEAD
```

Le nom d'archive reste V1.25.10 tant que V1.25.11 n'a pas passe la validation physique LAN.

Depuis Windows, l'utilisateur garde par defaut `D:\FC_LA_COUR_GestionClub` et applique une nouvelle archive avec `METTRE_A_JOUR.cmd`. Le dossier `data` de la cible est conserve ; les tests puis le serveur sont lances apres la copie.