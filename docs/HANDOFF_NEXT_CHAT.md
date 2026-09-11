# Reprise — Gestion Club V1.26

## Base obligatoire

La base fonctionnelle stable de référence est **V1.25.13.17**.

Ne pas repartir d'une V1.25.12.x, d'une V1.25.13-dev ni d'un ancien prototype.

Référence de clôture :

- Version : `V1.25.13.17`
- Archive : `GestionClub_V1.25.13.17_Windows_test_bandeau_admin.zip`
- SHA-256 : `52644db27f7d40abd6a43c86d6ab43491271266e47a4d12ce4bda31b5b1af6aa`
- Validation : `163 tests OK, 1 skipped`
- Date : `2026-09-11`

## Fonctionnalités validées à préserver

- Connexion administrateur serveur.
- Connexion éducateur serveur.
- Connexion licencié serveur.
- Changement de portail avec demande de déconnexion.
- Redirection du portail correspondant à la session vers `/gestion`.
- Ancien prototype de connexion hors parcours normal.
- Correction de la boucle de refresh du portail licencié.
- Bandeau serveur visible uniquement par l'administrateur.
- Comptes serveur et permissions fonctionnels.

## V1.26 — objectif

V1.26 ajoute une **architecture de données claire, robuste et préparée pour le multi-club** au socle V1.25.13.17 sans modifier son comportement fonctionnel validé.

### Ordre de travail obligatoire

1. Inventorier les données réelles et les stockages existants.
2. Définir l'arborescence logique des données.
3. Définir les entités et identifiants canoniques.
4. Définir les relations et contraintes entre club, personne, licence, compte, équipe et rôle.
5. Définir la stratégie multi-club.
6. Définir sauvegarde, restauration et migration depuis V1.25.13.17.
7. Définir la synchronisation Licences -> Comptes serveur.
8. Repenser l'écran Système > Comptes & permissions pour environ 300 comptes et plus.
9. Seulement ensuite implémenter les migrations et le code.

## Priorités fonctionnelles

- Séparer les données par domaine et par club.
- Éviter un fichier `data` unique dont l'écrasement ferait perdre toute la base.
- Rattacher strictement licences, comptes et fiches au club actif.
- Préparer plusieurs clubs sans mélange de données.
- Créer les comptes licenciés manquants lors d'une synchronisation, sans toucher aux comptes déjà existants.
- Appliquer la même logique aux éducateurs.
- Signaler les doublons, fiches incomplètes et conflits avant validation.
- Prévoir onglets Administrateurs / Éducateurs / Licenciés / Comptes incomplets / Comptes désactivés.
- Prévoir recherche, filtres, tri et actions groupées.

## Hors périmètre immédiat

- DynDNS.
- Serveur public.
- Exposition Internet.

Ces sujets restent différés jusqu'à stabilisation de la base, des comptes et des permissions.

## Règle de sécurité de développement

Aucune migration ne doit détruire ou écraser les données V1.25.13.17. Toute modification de schéma doit être testable, réversible et accompagnée d'une sauvegarde/restauration validée.
