# Intentions metier - Gestion Club

Ce document sert de contexte de reprise pour un autre chat ou un nouveau developpeur.

## Vision

Gestion Club doit devenir l'outil central du FC LA COUR pour suivre les licencies, les equipes, les contacts, les sauvegardes, les convocations, la veille publique et les documents utiles au club.

L'objectif n'est pas seulement de stocker des fichiers : l'application doit aider le club a verifier, comparer, historiser et preparer les actions administratives sans perdre la maitrise des donnees.

## Club concerne

- Club : FC LA COUR
- Affiliation : `563512`
- Saison de travail principale : `2026`
- Territoire : Saint-Joseph, La Reunion
- Terrain principal : Stade des Jacques

## Donnees reelles

Les donnees reelles du club ne doivent pas etre engagees dans Git.

Elles restent dans :

- `data/`
- les sauvegardes JSON locales
- les fichiers importes ponctuellement par l'utilisateur

Le depot GitHub contient le code, les tests, la documentation et des fixtures fictives.

## Donnees actuellement observees

Une sauvegarde serveur a deja ete validee avec :

- 298 licencies
- 11 equipes
- 0 match
- club `563512`

Le zero match etait attendu au moment de la validation.

## Principes de securite

- Le serveur reste local par defaut : `127.0.0.1:8765`.
- Pas d'ouverture Internet tant que le mode LAN et les protections ne sont pas testes.
- Les roles serveur priment sur les comptes metier contenus dans les sauvegardes.
- Les sauvegardes creeent des revisions, les anciennes restent recuperables.
- Les imports Footclubs, PDF et veille ne doivent jamais ecraser silencieusement la base.

## Modules deja presents

| Module | Etat | Intention |
| --- | --- | --- |
| Sauvegarde serveur | Fonctionnel | Deposer, historiser et telecharger des revisions completes |
| Authentification | Fonctionnelle | Proteger l'administration locale |
| Roles | Fonctionnels | `admin`, `editor`, `reader` |
| Veille publique | Fonctionnelle | Suivre mairie, ligue, documents et actualites utiles |
| Import HTML manuel | Fonctionnel | Importer une page quand le collecteur est bloque |
| Analyse PDF | Fonctionnelle | Extraire themes, dates et joueurs sans OCR |
| Convocations | Fonctionnelles | Preparer des fiches depuis PDF et les historiser |
| Client Gestion Club complet | Present | Encore largement monolithique, a raccorder au serveur commun |

## Footclubs

Le plugin et les exports Footclubs servent a consulter et comparer :

- listes de licencies
- fiches personnes
- contacts
- representants legaux
- historique de licences
- selections de rubriques

Les captures Footclubs sont partielles et temporaires. Elles ne sont pas une synchronisation directe avec la base du club. Toute application de donnees doit etre explicite et confirmee.

## Veille

Sources de veille identifiees :

- Ligue reunionnaise de football : `https://liguefoot-reunion.fff.fr/`
- Mairie de Saint-Joseph : `https://saintjoseph.re/`
- Recherche prioritaire : FC LA COUR, La Cour, Les Jacques, associations, formations, documents, convocations

La mairie peut etre surveillee de facon hebdomadaire. La Ligue peut necessiter des imports manuels lorsque le collecteur recoit un refus HTTP ou un format difficile a lire.

## PDF et convocations

Les PDF de la Ligue peuvent contenir des convocations ou selections.

Regles :

- reperage indicatif, pas d'evenement automatique sans validation ;
- les joueurs detectes doivent etre rapproches prudemment ;
- les fiches de convocation doivent conserver la reference au PDF source ;
- un changement d'analyse rend une fiche potentiellement obsolete.

## Video et Veo

Le club souhaite ajouter plus tard `https://app.veo.co/` pour les matchs filmes.

Intention :

- enregistrer les liens de matchs ;
- rattacher une video a une equipe, une date, un adversaire et eventuellement un match ;
- eviter toute connexion complexe tant que le mode public/lien partage n'est pas qualifie ;
- ne pas aspirer de contenu prive sans autorisation.

## Architecture cible V1.25

Priorite actuelle : recentrer le projet sur l'architecture client-serveur generale.

La suite doit permettre :

1. Ouvrir l'application complete depuis le serveur.
2. Charger la revision active depuis SQLite.
3. Modifier les donnees dans le navigateur sans les perdre.
4. Enregistrer explicitement une nouvelle revision serveur.
5. Tester deux sessions concurrentes.
6. Tester ensuite l'acces LAN depuis un autre appareil.

## Points d'attention

- Ne pas repartir d'une version demo si une sauvegarde reelle existe.
- Ne pas deduire un numero de licence depuis un numero personne.
- Ne pas fusionner automatiquement des imports partiels.
- Corriger les doublons de fonctions et problemes d'import avant d'etendre trop loin.
- Garder les tests automatises verts a chaque evolution.

