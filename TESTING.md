# Tests

## Suite complete

Windows :

```bat
scripts\windows\LANCER_TESTS.cmd
```

Linux :

```bash
PYTHONPATH="$PWD/server:$PWD/vendor:$PWD/tests" python3 -m unittest -v tests.test_server tests.test_watch tests.test_manual_watch tests.test_pdf_watch tests.test_convocations tests.test_lan_server
```

La suite compacte et la suite Linux incluent les tests LAN de V1.25.11.

## Validation LAN V1.25.11

Les tests automatises verifient :

- ecoute LAN IPv4 uniquement dans le lanceur dedie ;
- refus des `Host` non autorises ;
- refus des `Origin` differents du `Host` valide ;
- conservation de l'authentification, de la session, du CSRF et des roles ;
- refus des adresses clientes IPv4 globales ;
- absence de creation automatique de regle pare-feu Windows.

Avant livraison finale, effectuer aussi un test physique depuis un autre appareil du meme reseau prive. Utiliser un compte de test et ne pas ouvrir/rediriger le port `8765` sur le routeur.

## Regles

- Les tests ne doivent pas acceder aux sites officiels en direct.
- Les fixtures restent fictives.
- Les bases temporaires doivent etre fermees avant nettoyage, surtout sous Windows.
- Toute evolution client-serveur doit verifier au minimum authentification, droits, revisions et concurrence.
- Toute evolution reseau doit conserver le mode local par defaut et etre refusee hors perimetre explicitement teste.
