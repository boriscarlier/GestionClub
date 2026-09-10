# Tests

## Suite complete

Windows :

```bat
scripts\windows\LANCER_TESTS.cmd
```

Linux :

```bash
PYTHONPATH="$PWD/server:$PWD/vendor" python3 -m unittest -v tests.test_server tests.test_watch tests.test_manual_watch tests.test_pdf_watch tests.test_convocations
```

## Regles

- Les tests ne doivent pas acceder aux sites officiels en direct.
- Les fixtures restent fictives.
- Les bases temporaires doivent etre fermees avant nettoyage, surtout sous Windows.
- Toute evolution client-serveur doit verifier au minimum authentification, droits, revisions et concurrence.

