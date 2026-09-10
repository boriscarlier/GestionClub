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

Etat : en developpement.

- Utiliser `/api/state/members` pour alimenter l'ecran Licencies en mode serveur.
- Conserver le mode HTML autonome avec les donnees locales.
- Charger le detail complet d'un licencie via `/api/state/members/{id}` avant affichage.
- Afficher clairement la source utilisee par l'ecran.
- Garder les exports, filtres et selections existants.

## V1.25.5 - Acces reseau local

- Autoriser un acces LAN controle.
- Verifier les protections Host, Origin, session et role.
- Tester depuis un autre appareil du reseau avant toute ouverture routeur.

## V1.25.6 - Veo et videos de matchs

- Qualifier les liens publics Veo.
- Ajouter un modele de reference video rattache a equipe, date, adversaire et competition.
- Prevoir une integration par lien avant toute connexion compte.
