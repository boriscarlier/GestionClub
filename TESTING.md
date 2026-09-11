# Tests

## Suite complete

Windows :

```bat
scripts\windows\LANCER_TESTS.cmd
```

Linux :

```bash
sh scripts/run_tests.sh
```

## Regles

- Les tests ne doivent pas acceder aux sites officiels en direct.
- Les fixtures restent fictives.
- Les bases temporaires doivent etre fermees avant nettoyage, surtout sous Windows.
- Toute evolution client-serveur doit verifier au minimum authentification, droits, revisions et concurrence.
