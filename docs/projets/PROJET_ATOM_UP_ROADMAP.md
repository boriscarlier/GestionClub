# Projet Atom Up — Roadmap d’intégration SumUp

**Statut : EN ATTENTE / GELÉ**  
**Projet parent : Gestion Club**  
**Branche : `projet-atom-up`**  
**Objet : préparer l’intégration future de SumUp sans modifier le développement actuel de Gestion Club.**

> Aucun développement fonctionnel SumUp ne doit être engagé sur cette branche tant que Gestion Club n’a pas atteint une version jugée suffisamment stable, décomposée et fonctionnelle. Cette branche sert de dossier de conception et de point de reprise futur.

## 1. Vision

Faire de SumUp une couche de paiement connectée à Gestion Club, sans lui déléguer la logique métier. Gestion Club reste la source de vérité pour les licenciés, créances, licences, packs, boutique, stages, déplacements et autres recettes. SumUp fournit l’encaissement, les transactions, remboursements, terminaux et reversements.

Chaîne cible :

`Objet métier Gestion Club → créance → encaissement SumUp → transaction → frais → remboursement éventuel → reversement bancaire → rapprochement`

## 2. Principes d’architecture

- Aucun secret SumUp dans le navigateur, le HTML public ou le dépôt GitHub.
- Toutes les opérations sensibles passent par le serveur Gestion Club.
- Les références internes Gestion Club sont conservées dans les transactions afin de permettre le rapprochement.
- Une transaction SumUp ne suffit jamais seule à modifier un état métier critique : le serveur vérifie l’état auprès de SumUp.
- Prévoir une architecture compatible avec un compte SumUp unique dans un premier temps, puis OAuth si Gestion Club devient multi-clubs/SaaS.
- Commencer exclusivement en environnement sandbox.

## 3. Roadmap versionnée

### V0.1 — Étude technique et contrat d’intégration
**Objectif :** figer le périmètre avant tout code métier.

- Revalider la documentation SumUp au moment du démarrage effectif du projet.
- Inventorier les API nécessaires : Checkouts, Transactions, Readers/Cloud API, Payouts, Refunds, Webhooks et authentification.
- Identifier les limites, quotas, prérequis matériels et disponibilités applicables à La Réunion/France.
- Définir les objets Gestion Club pouvant générer un paiement.
- Définir le modèle de références internes (`LIC-*`, `PACK-*`, `BUS-*`, `BOUTIQUE-*`, etc.).

**Validation :** matrice API/fonction Gestion Club complète et aucune dépendance critique inconnue.

### V0.2 — Sandbox et couche serveur SumUp
**Objectif :** établir une communication sécurisée indépendante de l’interface utilisateur.

- Configuration sandbox.
- Stockage serveur sécurisé des identifiants.
- Client API SumUp isolé du front-end.
- Lecture des informations nécessaires du compte marchand.
- Gestion normalisée des erreurs, délais et indisponibilités.

**Validation :** connexion sandbox reproductible sans secret exposé côté client.

### V0.3 — Lecture des transactions et reversements
**Objectif :** rendre Gestion Club capable de lire l’activité SumUp.

- Import de l’historique des transactions.
- Lecture des statuts de paiement.
- Import des payouts/reversements.
- Identification des frais et remboursements.
- Prévention des doublons lors des synchronisations successives.

**Validation :** deux synchronisations consécutives produisent le même état sans doublon.

### V0.4 — Checkout en ligne
**Objectif :** créer un paiement depuis un objet métier Gestion Club.

- Création d’un checkout sandbox.
- Référence Gestion Club attachée au paiement.
- Hosted Checkout privilégié pour la première implémentation.
- Retour utilisateur après paiement.
- Vérification serveur du résultat avant passage de la créance à « payée ».

**Validation :** scénario complet créance → paiement sandbox → rapprochement automatique.

### V0.5 — Webhooks et synchronisation fiable
**Objectif :** supprimer la dépendance à une actualisation manuelle.

- Endpoint webhook sécurisé.
- Journalisation des événements.
- Vérification systématique de l’événement auprès de l’API SumUp.
- Idempotence.
- Reprise après erreur ou événement reçu plusieurs fois.

**Validation :** aucun double encaissement ni double changement d’état lors de répétitions d’événements.

### V0.6 — Terminal physique / Virtual Solo
**Objectif :** piloter un terminal depuis Gestion Club.

- Test Virtual Solo en sandbox.
- Inventaire et identification des Readers.
- Affectation logique : Bureau, Buvette, Boutique, Événement.
- Déclenchement d’un paiement depuis Gestion Club.
- Suivi du statut et gestion de l’annulation.

**Validation :** montant initié par Gestion Club, traité par le terminal virtuel, puis correctement rapproché.

### V0.7 — Module Finances > SumUp
**Objectif :** fournir l’interface opérationnelle.

Sous-sections prévues :
- Tableau de bord.
- Transactions.
- Terminaux.
- Rapprochement.
- Remboursements.

Indicateurs : encaissements, frais, remboursements, reversements, opérations non rapprochées et anomalies.

**Validation :** un administrateur peut comprendre l’état financier SumUp sans consulter séparément plusieurs écrans techniques.

### V0.8 — Remboursements et droits
**Objectif :** intégrer les opérations financières sensibles.

- Remboursement depuis une transaction éligible.
- Confirmation renforcée.
- Permissions par rôle.
- Journal d’audit : utilisateur, date, transaction, motif et résultat.

**Validation :** aucune opération sensible accessible à un rôle non autorisé et traçabilité complète.

### V0.9 — Rapprochement comptable
**Objectif :** relier les trois niveaux : vente Gestion Club, transaction SumUp, reversement bancaire.

- Correspondance des transactions avec les objets métier.
- Ventilation par catégorie de recette.
- Frais SumUp séparés.
- Détection des paiements non rapprochés.
- Détection des écarts.
- Préparation d’un export comptable exploitable.

**Validation :** chaque somme d’un payout peut être expliquée par les transactions et frais correspondants.

### V0.10 — Préparation multi-clubs
**Objectif :** éviter de bloquer une évolution SaaS future.

- Étude OAuth 2.0 SumUp.
- Isolation des comptes marchands par organisation.
- Suppression de toute hypothèse codée en dur concernant un compte unique.
- Permissions et séparation des données.

**Validation :** architecture documentée permettant plusieurs comptes SumUp sans mélange de données.

### V1.0 — Intégration stable
**Objectif :** rendre Atom Up exploitable en production après validation du socle Gestion Club.

- Tests fonctionnels complets.
- Tests de sécurité.
- Tests de reprise réseau/API.
- Tests Windows et réseau local Gestion Club.
- Documentation d’installation et d’exploitation.
- Procédure de rollback.
- Validation physique avec terminal réel avant activation production.

**Validation :** aucune régression structurelle de Gestion Club et chaîne de paiement entièrement traçable.

## 4. Déclencheurs de reprise du projet

Le développement d’Atom Up ne devra reprendre que lorsque :

1. la version Gestion Club de référence est déclarée stable après tests physiques ;
2. l’architecture HTML/front-end est suffisamment décomposée et ne dépend plus du monolithe comme base active de développement ;
3. la gestion des comptes, profils et permissions est stabilisée ;
4. le serveur local et son démarrage Windows sont reproductibles ;
5. la base de données et les migrations disposent d’une procédure de sauvegarde/rollback validée ;
6. les secrets peuvent être stockés côté serveur hors dépôt ;
7. une nouvelle vérification de la documentation et des conditions SumUp est effectuée avant le premier code.

## 5. Hors périmètre pendant le gel

Tant que le projet est en attente :

- aucun bouton SumUp ajouté à Gestion Club ;
- aucune clé API réelle stockée ;
- aucune migration de base de données imposée au projet principal ;
- aucun achat de terminal requis pour le développement ;
- aucune modification de la branche principale ou des branches de refactorisation au titre d’Atom Up.

## 6. Point de reprise futur

Au dégel du projet, reprendre **V0.1** et revalider les API SumUp disponibles à cette date avant de considérer cette roadmap comme techniquement définitive. Les choix d’API, SDK, authentification, tarification, matériel et disponibilité géographique peuvent évoluer.
