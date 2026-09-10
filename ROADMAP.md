# Roadmap

## V1.25.0 - Depot et architecture globale

- Stabiliser le depot GitHub.
- Lancer le serveur depuis la structure rangee.
- Garder les tests automatises au vert.
- Documenter le passage client-serveur general.

## V1.25.1 - Ouverture de Gestion Club depuis le serveur

Etat : stable.

- Ajouter une route protegee pour le client complet.
- Charger la revision serveur active.
- Ajouter une action explicite d'enregistrement serveur.
- Conserver un mode de secours local.
- Refuser le demarrage sur donnees demo lorsqu'une revision serveur existe.
- Tester les conflits entre deux sessions navigateur.

Livraison calme V1.25.1 :

- route `/gestion` protegee ;
- API de bootstrap serveur ;
- client complet visible depuis le serveur avec bandeau de mode ;
- ecritures fines du client reportees a V1.25.2 pour eviter une fusion trop large.

## V1.25.2 - Donnees communes

Etat : stable technique.

- Remplacer progressivement les ecritures navigateur directes par des appels serveur.
- Traiter membres, equipes, licences et comptes en priorite.
- Ajouter des tests de concurrence multi-sessions.

Livraison V1.25.2 :

- bouton explicite "Enregistrer sur serveur" injecte dans le client complet servi par `/gestion` ;
- telechargement de la derniere revision serveur depuis le meme bandeau ;
- controle de session, CSRF, revision attendue et confirmation avant creation d'une revision ;
- sauvegardes completes du client acceptees jusqu'a V1.25.2 ;
- les ecritures champ par champ restent un choix d'architecture a trancher plus tard.

## V1.25.3 - Socle SQL/API des licencies

Etat : stable technique.

- Creer les premiers services serveur separes.
- Synchroniser les licencies de la derniere sauvegarde vers SQLite.
- Exposer un resume d'etat serveur et les lectures licencies par API.
- Proteger la reprise des anciennes bases par migration douce au demarrage.
- Garder la sauvegarde complete comme filet de securite.

## V1.25.4 - Lecture des licencies depuis l'API serveur

Etat : stable technique.

- Utiliser `/api/state/members` pour alimenter l'ecran Licencies en mode serveur.
- Conserver le mode HTML autonome avec les donnees locales.
- Charger le detail complet d'un licencie via `/api/state/members/{id}` avant affichage.
- Afficher clairement la source utilisee par l'ecran.
- Garder les exports, filtres et selections existants.

## V1.25.5 - Lecture des equipes depuis l'API serveur

Etat : stable technique.

- Synchroniser les equipes vers SQLite avec leur fiche source complete.
- Exposer `/api/state/teams` et `/api/state/teams/{id}`.
- Alimenter l'ecran Equipes depuis le serveur en mode `/gestion`.
- Conserver le repli local du HTML autonome.
- Garder les compteurs sportifs calcules cote client pendant cette etape.

## V1.25.6 - Installation et mises a jour Windows simplifiees

Etat : stable technique.

- Ajouter des lanceurs a la racine du dossier livre.
- Permettre un chemin `data` stable, y compris sur un autre disque.
- Fournir un script de mise a jour qui remplace le programme sans recopier la base.
- Garder les tests separes de la base reelle.
- Documenter le pas a pas de test utilisateur.

## V1.25.7 - Mise a jour Windows en un geste

Etat : stable technique.

- Utiliser `D:\FC_LA_COUR_GestionClub` comme dossier stable par defaut.
- Ne plus redemander le chemin lors d'une mise a jour standard.
- Lancer les tests automatiquement apres copie.
- Demarrer le serveur automatiquement si les tests passent.

## V1.25.8 - Correction de l'accueil serveur

Etat : stable technique.

- Aligner le numero de version visible sur la page d'accueil serveur.
- Corriger les petites anomalies HTML reperees sur cette page.
- Ajouter un test pour eviter le retour d'un ancien numero visible.

## V1.25.9 - Garde-fou anti double demarrage Windows

Etat : stable technique.

- Verifier si le serveur local repond deja sur `127.0.0.1:8765`.
- Ouvrir la page existante au lieu de lancer une deuxieme instance.
- Appliquer le meme comportement apres mise a jour automatique.
- Tester le lanceur Windows par inspection automatisee.

## V1.25.10 - Tests Windows en affichage compact

Etat : stable Windows via correctif final V1.25.10.2, valide le 10/09/2026.

- Afficher une progression courte `N / X` pendant les tests.
- Conserver les details en cas d'echec.
- Garder le bilan final visible pour diagnostic.
- Corriger la journalisation Windows et valider mise a jour, tests et serveur sur l'installation reelle.

## V1.25.11 - Acces reseau local

Etat : stable via V1.25.11.1, valide physiquement le 10/09/2026.

- [x] Ajouter un mode LAN explicite sans modifier le mode local par defaut.
- [x] Conserver le serveur local sur `127.0.0.1:8765`.
- [x] Ajouter une passerelle LAN separee sur `0.0.0.0:8766`.
- [x] Detecter les IPv4 privees du poste serveur, avec repli Windows via `ipconfig`.
- [x] Restreindre les hôtes serveur aux IPv4 privees detectees/autorisees.
- [x] Refuser les clients hors reseau local.
- [x] Verifier que `Origin` correspond exactement au `Host` utilise.
- [x] Conserver sessions, CSRF et roles `admin`, `editor`, `reader`.
- [x] Ajouter les tests LAN aux suites standard et compacte Windows.
- [x] Conserver des journaux permanents de mise a jour, tests et acces LAN.
- [x] Redemarrer proprement l'ancienne instance serveur pendant une mise a jour.
- [x] Verifier la version source et la version cible pendant la mise a jour.
- [x] Tester la mise a jour Windows depuis la base stable V1.25.10.2.
- [x] Tester l'acces depuis un deuxieme appareil du meme reseau local.

Validation physique : acces LAN confirme via `http://192.168.1.3:8766/`.
Aucune redirection du port 8766 sur le routeur ne fait partie de V1.25.11.

## V1.25.12 - Veo et videos de matchs

Etat : prochaine version.

- Qualifier les liens publics Veo.
- Ajouter un modele de reference video rattache a equipe, date, adversaire et competition.
- Prevoir une integration par lien avant toute connexion compte.
