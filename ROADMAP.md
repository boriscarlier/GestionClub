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

## V1.25.12 - Decomposition HTML et architecture multi-pages

Etat : en developpement depuis V1.25.11.1 stable.

Objectif : remplacer progressivement le monolithe par une architecture HTML indexee, lisible et extensible, sans regression fonctionnelle ni perte de donnees.

### V1.25.12-A - Inventaire et reconstruction sans perte

- [x] Figer le Manager canonique V1.25.11.1 : `1 143 051` octets, Git blob SHA `64def65ec261d3da05d855896484c4deb79da407`, SHA-256 contenu `5646baa6ab0d19c31172eeeb5270fcccc8bc719726cb2f9c06f4147677f1f45c`.
- [x] Ajouter un decomposeur binaire deterministe des blocs HTML/style/script.
- [x] Ajouter un recomposeur qui exige une identite octet pour octet.
- [x] Ajouter les tests de continuite, SHA, UTF-8 et alteration de bloc.
- [x] Ajouter une CI dediee qui produit un artefact d'inspection sans modifier l'application.
- [ ] Generer et inspecter l'index structurel et le manifeste de decomposition.
- [ ] Etablir la cartographie des pages fonctionnelles a partir des IDs et ancres reels.

### V1.25.12-B - Extraction des ressources embarquees

- [ ] Extraire en premier les gros `data:*;base64` vers `client/assets/`.
- [ ] Verifier chaque ressource par SHA et conserver un fallback tant que la bascule n'est pas validee.
- [ ] Revalider le rendu et tous les tests avant suppression des donnees embarquees.

### V1.25.12-C - Socle commun CSS

- [ ] Extraire les styles globaux vers `client/shared/css/`.
- [ ] Distinguer styles communs et styles propres a chaque page.
- [ ] Conserver la compatibilite avec `/gestion` pendant la migration.

### V1.25.12-D - Socle commun JavaScript

- [ ] Extraire les services communs : etat, stockage, API, sauvegarde, session et utilitaires.
- [ ] Definir des modules stables sous `client/shared/js/`.
- [ ] Interdire les duplications de logique metier entre pages.

### V1.25.12-E - Pages fonctionnelles

- [ ] Creer les pages uniquement a partir de la cartographie reelle du Manager.
- [ ] Fournir une navigation/index unique et un referencement clair dans GitHub.
- [ ] Migrer une page a la fois avec tests et fallback legacy.
- [ ] Ne supprimer le monolithe qu'apres validation de toutes les pages equivalentes.

### V1.25.12-F - Bascule et nettoyage

- [ ] Faire de l'architecture multi-pages le chemin principal.
- [ ] Conserver temporairement `/gestion-legacy` pour comparaison/rollback.
- [ ] Valider sous Windows, serveur local et passerelle LAN.
- [ ] Archiver puis retirer le monolithe uniquement apres validation physique complete.

## V1.25.13 - Veo et videos de matchs

Etat : reporte apres stabilisation de l'architecture multi-pages.

- Qualifier les liens publics Veo.
- Ajouter un modele de reference video rattache a equipe, date, adversaire et competition.
- Prevoir une integration par lien avant toute connexion compte.
