# Projet HelloAsso — Intégration future dans Gestion Club

> **Statut : EN ATTENTE / HORS DÉVELOPPEMENT ACTUEL**
>
> Cette branche est volontairement isolée du développement courant de Gestion Club.
> Elle ne doit pas être utilisée comme base de développement, ni fusionnée dans `main`, ni influencer les choix techniques immédiats tant que Gestion Club n'a pas atteint un niveau de stabilité, de lisibilité et de structuration suffisant.
>
> Le projet sera repris ultérieurement comme chantier dédié.

---

## 1. Objectif général

Préparer une future intégration complète de **HelloAsso** dans **Gestion Club**, en considérant HelloAsso non comme un simple moyen de paiement, mais comme un **connecteur associatif transverse** capable de couvrir plusieurs besoins métier :

- paiements de cotisations ;
- paiements en plusieurs fois ;
- adhésions ;
- campagnes de dons ;
- financement participatif ;
- billetterie / événements ;
- boutique ;
- paiements ponctuels ;
- suivi des commandes et règlements ;
- synchronisation automatique via webhooks ;
- consolidation financière avec les autres moyens de paiement du club.

Le principe directeur est le suivant :

> **Gestion Club reste le référentiel central. HelloAsso fournit les services transactionnels et associatifs.**

Gestion Club décide, organise, rapproche et consolide. HelloAsso exécute les paiements et fournit les données de transaction.

---

## 2. Priorité métier initiale : le paiement en plusieurs fois

Le besoin prioritaire identifié est la possibilité de proposer aux licenciés un paiement fractionné des cotisations.

Exemple :

```text
Cotisation : 80 €

1x : 80 €
2x : 40 € + 40 €
4x : 20 € + 20 € + 20 € + 20 €
```

Gestion Club devra à terme permettre à l'administrateur de définir les formules autorisées pour une saison, par exemple :

- paiement comptant ;
- paiement en 2 fois ;
- paiement en 3 fois ;
- paiement en 4 fois.

Le licencié ou son représentant ne choisira que parmi les échéanciers autorisés par le club.

Gestion Club devra ensuite suivre :

- le montant total ;
- le montant déjà payé ;
- le restant dû ;
- chaque échéance ;
- la date de chaque échéance ;
- le statut de paiement ;
- les refus ;
- les régularisations ;
- les remboursements éventuels.

Exemple d'affichage futur :

```text
DUPONT Jean — U15

Cotisation : 80 €
Mode : HelloAsso 4x

✓ 20 € — payé
✓ 20 € — payé
⏳ 20 € — à venir
⏳ 20 € — à venir

Total payé : 40 €
Restant dû : 40 €
```

---

## 3. Périmètre fonctionnel HelloAsso

L'intégration future ne devra pas être limitée au paiement fractionné.

### 3.1 Adhésions

Objectifs futurs :

- récupérer les campagnes d'adhésion ;
- récupérer les commandes associées ;
- rapprocher une adhésion avec un licencié Gestion Club ;
- éviter la double saisie ;
- conserver l'historique des adhésions par saison.

### 3.2 Dons

Objectifs futurs :

- récupérer les campagnes de dons ;
- afficher les montants collectés ;
- suivre l'objectif et la progression ;
- rapprocher les donateurs connus avec les personnes déjà présentes dans Gestion Club lorsque cela est pertinent et légalement justifié ;
- conserver un historique des campagnes.

Exemple :

```text
Campagne : Financement matériel jeunes
Objectif : 5 000 €
Collecté : 2 430 €
Progression : 48,6 %
```

### 3.3 Financement participatif

Objectifs futurs :

- suivre les campagnes de crowdfunding ;
- afficher les objectifs ;
- afficher la progression ;
- intégrer les résultats dans le tableau de bord financier global.

### 3.4 Billetterie / événements

Cas d'usage :

- matchs ;
- soirées du club ;
- lotos ;
- événements partenaires ;
- anniversaires du club ;
- manifestations exceptionnelles.

Gestion Club pourra à terme consolider :

- nombre de billets disponibles ;
- billets vendus ;
- billets utilisés si la donnée est disponible ;
- montant encaissé ;
- montant restant éventuel ;
- statistiques par événement.

### 3.5 Boutique

À envisager dans une phase ultérieure :

- produits supporters ;
- packs club ;
- maillots ;
- équipements ;
- commandes ;
- paiements ;
- suivi de livraison ou retrait si Gestion Club dispose d'un module logistique.

### 3.6 Paiements ponctuels

Permettre des opérations hors cotisation :

- participation à un déplacement ;
- stage ;
- tournoi ;
- repas ;
- événement ;
- contribution exceptionnelle ;
- commande spécifique.

---

## 4. Architecture cible

Architecture conceptuelle future :

```text
GESTION CLUB
│
├── LICENCIÉS
│   ├── cotisations
│   ├── paiements comptants
│   └── paiements fractionnés
│
├── HELLOASSO
│   ├── adhésions
│   ├── dons
│   ├── crowdfunding
│   ├── billetterie
│   ├── boutique
│   ├── paiements ponctuels
│   └── checkout
│
├── FINANCES
│   ├── commandes
│   ├── paiements
│   ├── échéances
│   ├── remboursements
│   └── rapprochements
│
└── TABLEAU DE BORD
    ├── encaissé
    ├── restant dû
    ├── dons
    ├── billetterie
    ├── boutique
    └── statistiques
```

HelloAsso devra être traité comme un **connecteur externe** et non comme une dépendance structurelle du cœur de Gestion Club.

Le cœur du logiciel devra rester fonctionnel même lorsque :

- HelloAsso est indisponible ;
- l'API ne répond pas ;
- aucune connexion HelloAsso n'est configurée ;
- la synchronisation est désactivée.

---

## 5. Modèle d'intégration financière

Gestion Club devra à terme consolider plusieurs canaux d'encaissement dans un modèle commun.

```text
MODULE FINANCIER
│
├── Espèces
├── Chèque
├── Virement
├── SumUp
└── HelloAsso
    ├── paiement 1x
    ├── paiement Nx
    ├── don
    ├── billet
    ├── boutique
    └── crowdfunding
```

Les connecteurs **HelloAsso** et **SumUp** devront rester séparés techniquement mais converger vers une même couche de rapprochement financier.

Objectif futur : une opération financière interne unique dans Gestion Club, indépendamment du canal d'encaissement.

---

## 6. Synchronisation et webhooks

L'intégration devra privilégier une architecture événementielle lorsque c'est possible.

Principe :

```text
HelloAsso
   ↓
Événement de paiement / commande
   ↓
Webhook
   ↓
Backend Gestion Club
   ↓
Validation
   ↓
Rapprochement
   ↓
Mise à jour de la base
   ↓
Tableau de bord
```

Le navigateur ne doit jamais porter les secrets d'API.

Les clés, jetons et informations sensibles devront rester dans une couche backend dédiée.

---

## 7. Données à prévoir dans Gestion Club

Le modèle de données futur devra probablement inclure des objets ou tables équivalentes à :

### Connecteur

- fournisseur ;
- organisation ;
- état de connexion ;
- date dernière synchronisation ;
- statut ;
- version API.

### Campagne

- identifiant externe ;
- type ;
- titre ;
- statut ;
- dates ;
- montant objectif ;
- montant collecté.

### Commande

- identifiant HelloAsso ;
- personne ;
- campagne ;
- montant ;
- date ;
- statut.

### Paiement

- identifiant externe ;
- identifiant interne ;
- commande ;
- montant ;
- canal ;
- date ;
- statut ;
- moyen de paiement ;
- référence de rapprochement.

### Échéance

- identifiant ;
- montant ;
- date prévue ;
- date réelle ;
- statut ;
- erreur ou refus ;
- régularisation.

Le modèle final devra être ajusté à l'architecture réelle de Gestion Club au moment de la reprise du projet.

---

## 8. Règle d'isolation du projet

Cette branche constitue un **bac à conception** et non une branche fonctionnelle active.

### Interdictions actuelles

Tant que Gestion Club n'est pas stabilisé :

- ne pas fusionner cette branche dans `main` ;
- ne pas importer de code HelloAsso dans le cœur actuel ;
- ne pas créer de dépendance du cœur envers HelloAsso ;
- ne pas modifier l'architecture actuelle uniquement pour préparer HelloAsso ;
- ne pas bloquer une décision actuelle à cause d'une hypothétique intégration future ;
- ne pas considérer ce document comme une spécification définitive.

### Condition de reprise

Le chantier pourra être repris lorsque :

1. l'architecture principale de Gestion Club sera stabilisée ;
2. les responsabilités des modules seront claires ;
3. le modèle de données financier sera consolidé ;
4. les mécanismes d'authentification et de configuration seront fiables ;
5. le système de sauvegarde / rollback sera validé ;
6. les tests structurels principaux seront en place.

---

## 9. Roadmap future proposée

Cette roadmap est indicative et volontairement non active.

### V0.01 — Cadrage et documentation

- documentation API ;
- analyse des droits ;
- environnement Sandbox ;
- cartographie des objets HelloAsso ;
- validation des cas d'usage.

### V0.02 — Connecteur technique

- authentification ;
- stockage sécurisé des credentials ;
- récupération d'informations organisation ;
- gestion des erreurs ;
- test de connexion.

### V0.03 — Import des campagnes

- adhésions ;
- dons ;
- crowdfunding ;
- événements ;
- boutique ;
- formulaires de paiement.

### V0.04 — Commandes et paiements

- import commandes ;
- import paiements ;
- statuts ;
- historique ;
- première couche de rapprochement.

### V0.05 — Cotisations et paiements fractionnés

- création d'échéanciers autorisés ;
- paiement initial ;
- suivi des échéances ;
- restant dû ;
- refus ;
- régularisation.

### V0.06 — Dons et crowdfunding

- campagnes ;
- objectifs ;
- progression ;
- historique ;
- statistiques.

### V0.07 — Billetterie

- événements ;
- billets ;
- ventes ;
- statistiques ;
- consolidation financière.

### V0.08 — Boutique et paiements ponctuels

- commandes ;
- produits ;
- règlements ;
- rapprochement.

### V0.09 — Webhooks

- réception d'événements ;
- validation ;
- idempotence ;
- journalisation ;
- reprise après erreur ;
- synchronisation automatique.

### V0.10 — Tableau de bord HelloAsso

- total encaissé ;
- restant dû ;
- paiements en attente ;
- échéances à venir ;
- dons ;
- billetterie ;
- boutique ;
- alertes.

### V0.11 — Consolidation financière

- HelloAsso ;
- SumUp ;
- espèces ;
- chèques ;
- virements ;
- rapprochement global ;
- vue financière unifiée.

---

## 10. Principes techniques à conserver lors de la reprise

- privilégier les API officielles ;
- développer d'abord dans l'environnement Sandbox ;
- ne jamais exposer les secrets côté client ;
- séparer clairement domaine métier et fournisseur externe ;
- prévoir l'idempotence des événements ;
- journaliser les synchronisations ;
- prévoir les erreurs réseau ;
- conserver une possibilité de resynchronisation manuelle ;
- éviter toute dépendance bloquante du logiciel envers HelloAsso ;
- respecter les contraintes RGPD et la minimisation des données ;
- conserver un identifiant interne Gestion Club distinct de l'identifiant HelloAsso.

---

## 11. Résumé décisionnel

HelloAsso est retenu comme **connecteur futur majeur** de Gestion Club pour :

1. le paiement des cotisations en plusieurs fois ;
2. les adhésions ;
3. les dons ;
4. le financement participatif ;
5. la billetterie ;
6. la boutique ;
7. les paiements ponctuels ;
8. le suivi transactionnel ;
9. la consolidation financière.

**Décision actuelle : aucune implémentation.**

Cette branche existe uniquement pour conserver le raisonnement, le périmètre et la future roadmap jusqu'à ce que Gestion Club soit suffisamment stable pour reprendre ce chantier proprement.
