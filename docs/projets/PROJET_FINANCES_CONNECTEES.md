# Projet — Finances connectées

> Statut : EN ATTENTE / étude d'architecture
>
> Branche dédiée : `finances-connectees`
>
> Ce chantier est isolé du développement courant de GestionClub. Il sera repris lorsque le socle principal sera suffisamment stable.

## Objectif

Construire une chaîne financière unifiée :

**Encaissement → Banque → Rapprochement → Comptabilité → Tableau de bord**

## Connecteurs prévus

### SumUp
- paiements CB ;
- TPE ;
- encaissements ;
- suivi des transactions ;
- rapprochement avec les règlements attendus.

### HelloAsso
- cotisations ;
- paiements en plusieurs fois ;
- dons ;
- billetterie ;
- campagnes associatives ;
- rapprochement avec les licenciés, adhérents, événements et opérations comptables.

### Crédit Agricole La Réunion–Mayotte
- consultation des mouvements bancaires ;
- récupération des soldes si l'API/agrégateur le permet ;
- rapprochement bancaire ;
- détection des virements reçus ;
- association des mouvements aux licenciés, fournisseurs, subventions et autres écritures.

## Règles de sécurité bancaire

GestionClub ne devra jamais stocker :
- identifiant bancaire ;
- mot de passe bancaire ;
- code SécuriPass ;
- secret d'authentification bancaire utilisateur.

La connexion bancaire automatique devra passer par une solution Open Banking / DSP2 conforme et, lorsque nécessaire, par un prestataire agréé.

## Architecture cible

```text
HelloAsso ---------\
                    \
SumUp --------------- > Moteur financier GestionClub
                    /          |
Crédit Agricole ----/           +-- Rapprochement bancaire
                               +-- Comptabilité
                               +-- Tableau de bord
                               +-- Alertes / anomalies
```

Le cœur de GestionClub doit rester indépendant des fournisseurs : chaque service externe est traité comme un connecteur interchangeable.

## Roadmap indicative

### V0.1 — Modèle financier commun
Définir les objets : paiement, encaissement, mouvement bancaire, règlement attendu, rapprochement, anomalie, source externe.

### V0.2 — Import bancaire manuel
Importer un relevé bancaire et tester le moteur de rapprochement sans dépendre d'une API bancaire.

### V0.3 — Connecteur SumUp
Préparer la synchronisation des transactions et le rapprochement avec les règlements attendus.

### V0.4 — Connecteur HelloAsso
Préparer cotisations, paiements fractionnés, dons et billetterie.

### V0.5 — Connecteur Crédit Agricole / Open Banking
Ajouter la synchronisation bancaire via une voie conforme DSP2.

### V0.6 — Rapprochement automatique
Proposer automatiquement la correspondance entre mouvements, paiements, licenciés, factures, fournisseurs et subventions.

### V0.7 — Comptabilité consolidée
Centraliser les flux financiers et produire les écritures ou exports utiles à la comptabilité associative.

### V0.8 — Tableau de bord financier
Solde, encaissements, impayés, anomalies, rapprochements à valider, ventilation par source et période.

## Principe de développement

Aucune de ces intégrations ne doit être activée dans la branche principale avant validation fonctionnelle, technique, réglementaire et de sécurité.
