# Reprise par un autre chat

## Depot de reference

Depot GitHub :

```text
https://github.com/boriscarlier/GestionClub
```

Branche stable de reference :

```text
main
```

Version presente sur `main` :

```text
V1.25.10
```

Dernier commit de reference au lancement de V1.25.11 :

```text
97718432357c960156ffecc42eb9ac5fb96b4a4f
Release Gestion Club V1.25.10 compact Windows tests
```

Branche de developpement active :

```text
dev/v1.25.11-lan
```

## Etat fonctionnel acquis

- V1.25.1 : ouverture du client complet depuis le serveur.
- V1.25.2 : sauvegarde complete vers le serveur avec revision et CSRF.
- V1.25.3 : socle SQL/API licencies.
- V1.25.4 : ecran Licencies branche progressivement sur l'API.
- V1.25.5 : equipes synchronisees et lues par API.
- V1.25.6 : installation/mise a jour Windows simplifiee.
- V1.25.7 : mise a jour vers `D:\FC_LA_COUR_GestionClub` en un geste, tests puis serveur.
- V1.25.8 : version d'accueil serveur corrigee et protegee par test.
- V1.25.9 : garde-fou contre le double demarrage du serveur.
- V1.25.10 : tests Windows en affichage compact `Statut tests : N / X`.

Les donnees reelles restent hors Git dans `data/` et le dossier stable Windows reste :

```text
D:\FC_LA_COUR_GestionClub
```

## Developpement en cours - V1.25.11

Objectif : acces reseau local controle, sans exposition Internet.

La branche `dev/v1.25.11-lan` ajoute :

- `server/network_access.py` pour la detection IPv4 LAN et les controles `Host` / `Origin` ;
- `server/lan_server.py` pour un mode LAN explicite reutilisant le serveur stable ;
- `DEMARRER_RESEAU_LOCAL.cmd` et son lanceur Windows interne ;
- 7 tests LAN, portant la suite attendue de 89 a 96 controles ;
- une CI GitHub Actions pour les branches `dev/**`, `main` et les pull requests.

Le mode local V1.25.10 n'est pas remplace. Le numero visible reste V1.25.10 tant que la validation physique LAN n'est pas terminee.

## Validation bloquante avant release V1.25.11

Depuis le PC Windows de test :

1. Conserver la base dans `D:\FC_LA_COUR_GestionClub\data`.
2. Fermer tout serveur deja lance sur le port `8765`.
3. Utiliser un compte de test, de preference `reader` pour le premier essai.
4. Lancer `DEMARRER_RESEAU_LOCAL.cmd`.
5. Relever l'IPv4 privee affichee.
6. Depuis un deuxieme appareil sur le meme reseau prive, ouvrir `http://IP_PRIVEE:8765/`.
7. Verifier la connexion et que le compte `reader` ne peut pas ecrire.
8. Ne pas ouvrir ni rediriger le port `8765` sur le routeur.

Apres validation physique et CI verte, finaliser V1.25.11 sur `main`, mettre a jour le numero de version visible, puis poursuivre V1.25.12 (Veo et videos de matchs).

## Regles de reprise

- GitHub est la source de verite du code.
- Ne pas repartir d'anciennes archives ou couches RC locales obsoletes.
- Ne jamais mettre les donnees reelles dans Git.
- Garder `data/` ignore.
- Lancer les tests avant toute livraison.
- Ne pas repartir de donnees demo lorsqu'une revision serveur existe.
- Privilegier une evolution progressive, versionnee et testee.
- Ne pas ouvrir le serveur sur Internet dans V1.25.11.

## Commandes utiles

Tests Windows :

```bat
LANCER_TESTS.cmd
```

Serveur Windows local :

```bat
DEMARRER_SERVEUR.cmd
```

Serveur Windows LAN de test :

```bat
DEMARRER_RESEAU_LOCAL.cmd
```

Tests Linux :

```bash
./scripts/run_tests.sh
```
