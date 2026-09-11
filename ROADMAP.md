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

- Utiliser `D:\GESTION_CLUB_GestionClub` comme dossier stable par defaut.
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

Etat : termine, garde-fous automatises verts.

- [x] Figer le Manager canonique V1.25.11.1 : `1 143 051` octets, Git blob SHA `64def65ec261d3da05d855896484c4deb79da407`, SHA-256 contenu `5646baa6ab0d19c31172eeeb5270fcccc8bc719726cb2f9c06f4147677f1f45c`.
- [x] Ajouter un decomposeur binaire deterministe des blocs HTML/style/script.
- [x] Ajouter un recomposeur qui exige une identite octet pour octet.
- [x] Ajouter les tests de continuite, SHA, UTF-8 et alteration de bloc.
- [x] Ajouter une CI dediee qui produit un artefact d'inspection sans modifier l'application.
- [x] Generer et inspecter l'index structurel et le manifeste de decomposition : 41 blocs (`21` fragments, `5` styles de premier niveau, `15` scripts).
- [x] Etablir la cartographie des pages fonctionnelles a partir des IDs et ancres reels : 70 unites (`44` administration, `13` public, `7` educateur, `6` adherent).

### V1.25.12-B - Extraction des ressources embarquees

Etat : extraction passive terminee, validation CI finale en cours.

- [x] Extraire le gros `CLUB_LOGO_DATA_URI` PNG vers `client/assets/brand/club-logo.png`.
- [x] Verifier la ressource par SHA-256, taille et dimensions : `92 264` octets, `576x507`, SHA-256 `f1152a3cb6601bb95a90f5e362119e0bde45b8da9f4bafe5dd256bba028fb6bd`.
- [x] Indexer l'asset dans `docs/MANAGER_ASSETS_INDEX.json` avec `runtime_active: false`.
- [x] Tester que le PNG versionne dans GitHub est identique octet pour octet au PNG embarque.
- [x] Introduire une desserte statique controlee `/assets/brand/club-logo.png` et verifier son contenu par HTTP.
- [x] Conserver le monolithe canonique strictement intact : son Base64 devient le fallback/legacy de reference et n'est pas modifie pendant la refactorisation.
- [ ] Faire utiliser l'asset externe uniquement par les nouvelles pages multi-pages lorsqu'elles seront creees.

### V1.25.12-C - Socle commun CSS

Extraction source et cartographie realisees : 114 unites dans l'ordre original.
Voir `docs/MANAGER_CSS_INDEX.md`. Pas de reordonnancement ni suppression de surcharges.
La route optionnelle `/gestion-modulaire` les assemble dans les cinq styles originaux.
La validation visuelle est encore requise avant de declarer la phase finalisee.

C1 : extraction passive du prefixe commun (tokens, base, composants), controles locaux 11/11.
Les fichiers ne sont pas actifs dans `/gestion`. La phase C reste en cours.
C2 : cartographier les surcharges et styles responsive avant activation et comparaison visuelle.
Voir `client/shared/css/README.md`.

- [ ] Extraire les styles globaux vers `client/shared/css/`.
- [ ] Distinguer styles communs et styles propres a chaque page.
- [ ] Conserver la compatibilite avec `/gestion` pendant la migration.

### V1.25.12-D - Socle commun JavaScript

Extraction source realisee : 663 unites verifiees syntaxiquement, dont les services communs.
Voir `docs/MANAGER_JS_SERVICES.md`. Les scripts classiques sont recomposes sans changer leur portee.
Ce n'est pas une conversion en ES modules autonomes ; aucune nouvelle logique metier dupliquee.

- [ ] Extraire les services communs : etat, stockage, API, sauvegarde, session et utilitaires.
- [ ] Definir des modules stables sous `client/shared/js/`.
- [ ] Interdire les duplications de logique metier entre pages.

### V1.25.12-E - Pages fonctionnelles

70 templates extraits, inclusions imbriquees et routes optionnelles raccordees.
Voir `docs/MANAGER_COMPOSED_PAGES.md` et `client/pages/README.md`.
Les 70 routes passent les controles HTTP ; le document modulaire de base est identique au legacy.
141 tests Python passes localement, dont passerelle LAN. 210 comparaisons navigateur passees sur 330c941 (70 pages x trois largeurs).
Les 70 acces directs ont ensuite revele une injection dans des chaines HTML d'export : corrigee avec test de regression. Revalidation navigateur bloquee par GitHub Actions (jobs sans etapes ni journaux). E reste ouverte ; ne pas fusionner avant ce resultat.

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
