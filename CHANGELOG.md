# Changelog

## V1.25.12-dev

- C1 : extraction passive du prefixe CSS commun en trois fichiers (tokens, base, composants).
- Extracteur reproductible et manifeste avec plages source / SHA-256 ; refus des fichiers divergents.
- Six tests CSS ajoutes aux lanceurs Linux, Windows compact et CI.
- Verification locale : 6 tests CSS + 5 tests decomposition passes. Suite complete et validation visuelle non executees localement pour ce lot.
- Monolithe, routes et CSS actifs inchanges. Phase C non terminee : surcharges et responsive a cartographier.

- Demarrage de la decomposition HTML depuis la base stable V1.25.11.1.
- Monolithe canonique fige a `1 143 051` octets avec controles Git SHA, SHA-256 et UTF-8 strict.
- Decomposition deterministe en 41 blocs et recomposition identique octet pour octet.
- Cartographie de 70 unites fonctionnelles : 44 administration, 13 public, 7 educateur et 6 adherent.
- Extraction passive du logo vers `client/assets/brand/club-logo.png`, avec fallback embarque conserve.
- Ajout des index, manifestes, scripts et tests de non-regression necessaires.
- Prochaine phase active : extraction du socle CSS commun sans basculer le chemin `/gestion` legacy.

## V1.25.11.1

- Reprise depuis la base Windows V1.25.10.2 validee physiquement.
- Ajout d'un mode reseau local explicite via `DEMARRER_RESEAU_LOCAL.cmd`.
- Le serveur LAN ecoute sur `0.0.0.0` uniquement dans ce mode dedie.
- Detection et autorisation des adresses IPv4 privees du poste serveur.
- Validation stricte de `Host` et de `Origin` pour les requetes LAN.
- Refus des clients hors reseau local.
- Conservation des sessions, du jeton CSRF et des roles `admin`, `editor`, `reader`.
- Aucune regle Windows Firewall ni ouverture du routeur n'est creee automatiquement.
- Ajout de 7 tests LAN et integration aux suites standard et compacte Windows.
- Ajout d'une CI par module pour isoler les regressions.
- Ajout d'un garde-fou de packaging sur le Manager HTML : UTF-8 strict, taille minimale, ancres critiques et ressources embarquees.
- Validation physique confirmee le 10/09/2026 depuis un second appareil via `http://192.168.1.3:8766/`.
- Version declaree stable et retenue comme base canonique de V1.25.12.

## V1.25.10.2

- Base V1.25.10 restauree depuis le dernier Manager HTML intact apres detection d'une corruption binaire du monolithe.
- Correction du lanceur Windows de tests : suppression de la commande PowerShell mal echappee.
- Le flux de tests compact ecrit directement son journal depuis Python.
- En cas d'echec, le journal est conserve sous `logs\erreur_tests_<date>.log`.
- Mise a jour Windows, tests et demarrage serveur valides physiquement le 10/09/2026.

## V1.25.10

- Ajout d'un lanceur de tests compact pour Windows.
- `LANCER_TESTS.cmd` affiche une progression `Statut tests : N / X` au lieu de lister tous les tests.
- Les details restent affiches en cas d'echec ou d'erreur.
- Ajout d'un test automatise pour verifier que le lanceur Windows utilise bien ce mode compact.
- Sauvegardes completes acceptees jusqu'a `V1.25.10`.
- Tests serveur portes a 33 controles, suite totale a 89 controles.

## V1.25.9

- Le lanceur Windows vérifie si `http://127.0.0.1:8765/` répond déjà avant de démarrer le serveur.
- Si un serveur est déjà lancé, le script ouvre la page existante et ne crée pas de deuxième instance.
- Le contrôle s'applique aussi après `METTRE_A_JOUR.cmd`, car il appelle le même lanceur.
- Alignement de l'identifiant HTTP interne `FCLaCour/1.25.9`.
- Sauvegardes completes acceptees jusqu'a `V1.25.9`.
- Tests serveur maintenus a 32 controles avec verification du garde-fou Windows.

## V1.25.8

- Correction du numero de version affiche sur la page d'accueil serveur.
- Le titre HTML et le bandeau principal affichent maintenant `V1.25.8`.
- Correction d'une balise `option` invalide dans le filtre des sources de veille.
- Ajout d'un test automatise pour bloquer le retour de l'ancien libelle `V1.25.1`.
- Sauvegardes completes acceptees jusqu'a `V1.25.8`.
- Tests serveur portes a 32 controles.

## V1.25.7

- `METTRE_A_JOUR.cmd` cible par defaut `D:\FC_LA_COUR_GestionClub`.
- La mise a jour ne redemande plus le chemin quand aucun argument n'est fourni.
- Apres copie, le script lance `LANCER_TESTS.cmd`.
- Si les tests passent, le script lance `DEMARRER_SERVEUR.cmd`.
- Sauvegardes completes acceptees jusqu'a `V1.25.7`.
- Tests serveur maintenus a 31 controles avec verification du parcours Windows.

## V1.25.6

- Ajout de lanceurs Windows a la racine : `DEMARRER_SERVEUR.cmd` et `LANCER_TESTS.cmd`.
- Ajout de `METTRE_A_JOUR.cmd` pour mettre a jour un dossier stable sans toucher au dossier `data`.
- Ajout du chemin de donnees configurable par `FCLC_DATA_PATH` ou `FCLC_DATA_DIR`.
- Le demarrage Windows affiche le dossier programme et la base SQLite utilisee.
- Les tests Windows indiquent qu'ils utilisent des bases temporaires.
- Sauvegardes completes acceptees jusqu'a `V1.25.6`.
- Tests serveur portes a 31 controles.

## V1.25.5

- Ajout d'une table SQL `teams` synchronisee depuis chaque sauvegarde complete deposee.
- Ajout des API `/api/state/teams` et `/api/state/teams/{id}`.
- Extension de `/api/state/summary` avec le compteur des equipes.
- Branchement progressif de l'ecran Equipes sur l'API serveur en mode `/gestion`.
- Repli local conserve pour le HTML autonome.
- Sauvegardes completes acceptees jusqu'a `V1.25.5`.
- Tests serveur portes a 28 controles.

## V1.25.4

- Branchement progressif de l'ecran Licencies sur l'API serveur quand le client est servi par `/gestion`.
- Ajout d'un indicateur de source des donnees : base locale ou serveur SQL/API.
- Chargement de la liste via `/api/state/members?limit=500`, avec repli local si le serveur est indisponible.
- Chargement de la fiche complete via `/api/state/members/{id}` avant ouverture du detail.
- Sauvegardes completes acceptees jusqu'a `V1.25.4`.
- Tests serveur portes a 25 controles.

## V1.25.3

- Debut de la migration module par module vers SQL/API.
- Ajout du service `server/services/club_state.py`.
- Ajout d'une table SQL `members` synchronisee depuis chaque sauvegarde complete deposee.
- Migration douce au demarrage : une base existante reconstruit `members` depuis la derniere revision si necessaire.
- Ajout des API `/api/state/summary`, `/api/state/members` et `/api/state/members/{id}`.
- Sauvegardes completes acceptees jusqu'a `V1.25.3`.
- Tests serveur portes a 24 controles.

## V1.25.2

- V1.25.1 marquee comme stable.
- Ajout d'un bouton "Enregistrer sur serveur" dans le client complet servi par `/gestion`.
- Ajout d'un bouton de telechargement de la derniere revision serveur dans le bandeau du client complet.
- Le depot depuis le client complet utilise `/api/session`, `/api/status` et `/api/snapshot` avec jeton CSRF, revision attendue et confirmation explicite.
- Sauvegardes completes acceptees jusqu'a `V1.25.2`.
- Tests serveur portes a 21 controles, suite totale attendue a 77 controles.

## V1.25.1

- Ajout de la route protegee `/gestion` pour ouvrir le client complet depuis le serveur local.
- Ajout de `/api/gestion/bootstrap` pour exposer le contexte serveur et la derniere revision active.
- Ajout d'un bandeau serveur dans le client complet afin de distinguer le mode servi par le serveur du mode HTML autonome.
- Ajout d'un bouton "Ouvrir Gestion Club complet" dans l'administration serveur.
- Tests serveur portes a 19 controles, suite totale attendue a 75 controles.

## V1.25.0-dev

- Preparation d'un depot GitHub exploitable inspire de la structure Neo Toolkit.
- Separation source entre `client/`, `server/`, `tests/`, `docs/`, `scripts/windows/` et `vendor/`.
- Conservation des donnees reelles hors Git via `data/` ignore.
- Adaptation des chemins serveur pour servir le client depuis `client/`.
- Adaptation des scripts Windows au nouveau rangement.
- Ajout du contexte metier de reprise dans `docs/BUSINESS_INTENT.md` et `docs/HANDOFF_NEXT_CHAT.md`.

## V1.24.5

- Derniere archive serveur importee comme base stable.
- Tests serveur, veille, import manuel, PDF et convocations valides avant restructuration.
