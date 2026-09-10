# Reprise par un autre chat

## Depot

Depot GitHub :

```text
https://github.com/boriscarlier/GestionClub
```

Branche de travail initiale :

```text
main
```

Base actuelle :

```text
V1.25.0-dev, issue de V1.24.5
```

## Message de reprise conseille

```text
Reprendre le developpement de Gestion Club depuis :
https://github.com/boriscarlier/GestionClub

Lire d'abord :
- README.md
- ARCHITECTURE.md
- ROADMAP.md
- docs/BUSINESS_INTENT.md
- docs/HANDOFF_NEXT_CHAT.md

Objectif suivant : V1.25.1.
Raccorder l'application complete au serveur commun sans perdre les donnees reelles.

Regles :
- ne jamais mettre les donnees reelles dans Git ;
- garder data/ ignore ;
- lancer les tests avant livraison ;
- ne pas repartir de donnees demo si une sauvegarde serveur existe ;
- privilegier une evolution progressive et testee.
```

## Commandes utiles

Tests Windows :

```bat
scripts\windows\LANCER_TESTS.cmd
```

Serveur Windows :

```bat
scripts\windows\DEMARRER_SERVEUR.cmd
```

Tests Linux :

```bash
./scripts/run_tests.sh
```

## Etat valide avant documentation de reprise

La restructuration GitHub a ete testee avec succes :

```text
Ran 73 tests in 8.610s
OK
```

## Suite technique recommandee

V1.25.1 doit rester conservative :

- ajouter une route serveur protegee pour le client complet ;
- charger la derniere revision serveur au demarrage ;
- ajouter une action explicite "Enregistrer sur le serveur" ;
- conserver un mode local de secours ;
- tester les roles `admin`, `editor`, `reader` ;
- tester conflit de revision entre deux sessions.

