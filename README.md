# CLUB EXEMPLE Gestion Club

Application locale de gestion du club, avec sauvegardes serveur, veille publique, analyse PDF et preparation progressive vers une architecture client-serveur.

## Etat actuel

- Version en developpement : `V1.25.12-dev`
- Derniere version stable validee sous Windows et sur le reseau local : `V1.25.11.1`
- Serveur local Python : authentification, revisions, depots de sauvegarde, veille, PDF, convocations, premieres API SQL metier
- Mode LAN V1.25.11.1 valide : acces reseau local explicite avec filtrage IP, Host et Origin ; aucune ouverture routeur automatique
- Chantier V1.25.12 : decomposition HTML indexee, recomposition sans perte et migration multi-pages progressive
- Ecran Licencies : lecture serveur SQL/API en mode `/gestion`, repli local en HTML autonome
- Ecran Equipes : lecture serveur SQL/API en mode `/gestion`, repli local en HTML autonome
- Client principal : `client/GESTION_CLUB_Manager.html`
- Donnees reelles : conservees hors depot dans `data/`
- Tests automatises : suite `unittest`

## Sources modulaires V1.25.12 — validation en cours

Le lancement habituel et `/gestion` restent inchanges.
Apres connexion au serveur, `/gestion-modulaire` assemble les sources CSS, JavaScript et les 70 templates.
`/gestion-legacy` conserve la reference de comparaison.
Index : `docs/MANAGER_CSS_INDEX.md`, `docs/MANAGER_JS_SERVICES.md`, `docs/MANAGER_COMPOSED_PAGES.md`.
Les templates ne sont pas des HTML autonomes ; voir `client/pages/README.md`.
141 tests Python locaux passes. 210 comparaisons visuelles reussies sur le lot precedent ; revalidation des 70 acces directs bloquee par le demarrage de GitHub Actions. Validation Windows avant bascule par defaut.

## Demarrage Windows local

Depuis la racine du dossier :

```bat
DEMARRER_SERVEUR.cmd
```

Puis ouvrir :

```text
http://127.0.0.1:8765/
```

Si un serveur est deja lance sur ce port, le script ouvre la page existante et ne demarre pas une deuxieme instance.

## Demarrage Windows sur le reseau local — V1.25.11

Le mode LAN est volontairement separe du mode local :

```bat
DEMARRER_RESEAU_LOCAL.cmd
```

Le serveur affiche les adresses IPv4 privees detectees et autorisees. Depuis un autre appareil connecte au meme reseau, ouvrir l'adresse affichee avec le port `8765`.

Le mode LAN :

- conserve la meme base `data\club.sqlite3` ;
- conserve authentification, sessions, CSRF et roles ;
- refuse les hôtes et origines non autorises ;
- n'ajoute aucune regle Windows Firewall automatiquement ;
- ne doit pas etre expose par redirection du port `8765` sur le routeur.

Si Windows demande une autorisation pare-feu pendant le test, autoriser uniquement le reseau prive utilise pour ce test.

## Tests Windows

```bat
LANCER_TESTS.cmd
```

## Mise a jour simple Windows

Conservez le dossier stable `D:\GESTION_CLUB_GestionClub`. Votre base reste dans `D:\GESTION_CLUB_GestionClub\data\club.sqlite3`.

Pour tester une nouvelle version :

1. Decompresser le nouveau zip dans un dossier temporaire.
2. Lancer `METTRE_A_JOUR.cmd` depuis ce dossier temporaire.
3. Le script met a jour automatiquement `D:\GESTION_CLUB_GestionClub`.
4. Les tests sont lances automatiquement.
5. Si les tests passent, le serveur local est demarre automatiquement.

Pour tester ensuite le mode LAN, fermer le serveur local puis lancer `DEMARRER_RESEAU_LOCAL.cmd` depuis `D:\GESTION_CLUB_GestionClub`.

Le script de mise a jour remplace les fichiers programme et conserve le dossier `data` de la cible.

Si vous voulez placer les donnees sur un autre disque, definir une fois :

```bat
setx GESTION_CLUB_DATA_DIR "E:\GESTION_CLUB_DATA"
```

Puis rouvrir une invite de commande. Le serveur utilisera `E:\GESTION_CLUB_DATA\club.sqlite3`.

## Organisation

| Dossier | Role |
| --- | --- |
| `client/` | Interface HTML, JS et CSS servie par le serveur |
| `server/` | Serveur Python et modules metier cote serveur |
| `tests/` | Tests automatises |
| `vendor/` | Dependances embarquees necessaires hors pip, dont pypdf |
| `docs/` | Architecture, roadmap, validations et notes de version |
| `scripts/windows/` | Lanceurs Windows internes |
| `data/` | Base locale creee a l'execution, ignoree par Git |
| `releases/` | Archives construites localement, ignorees par Git |

## Reprise du contexte metier

Avant de reprendre le developpement dans un nouveau chat ou avec un nouveau contributeur, lire :

- `docs/BUSINESS_INTENT.md`
- `docs/HANDOFF_NEXT_CHAT.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`

## Regle de developpement

Chaque evolution doit garder les donnees du club hors code source, ajouter ou mettre a jour les tests utiles, puis documenter le resultat dans `CHANGELOG.md` et `docs/releases/`.
