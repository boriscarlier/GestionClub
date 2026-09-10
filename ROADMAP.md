# Roadmap

## V1.25.0 - Depot et architecture globale

- Stabiliser le depot GitHub.
- Lancer le serveur depuis la structure rangee.
- Garder les tests automatises au vert.
- Documenter le passage client-serveur general.

## V1.25.1 - Ouverture de Gestion Club depuis le serveur

Etat : en cours de validation.

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

- Remplacer progressivement les ecritures navigateur directes par des appels serveur.
- Traiter membres, equipes, licences et comptes en priorite.
- Ajouter des tests de concurrence multi-sessions.

## V1.25.3 - Acces reseau local

- Autoriser un acces LAN controle.
- Verifier les protections Host, Origin, session et role.
- Tester depuis un autre appareil du reseau avant toute ouverture routeur.

## V1.25.4 - Veo et videos de matchs

- Qualifier les liens publics Veo.
- Ajouter un modele de reference video rattache a equipe, date, adversaire et competition.
- Prevoir une integration par lien avant toute connexion compte.
