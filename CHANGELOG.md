# Changelog

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
