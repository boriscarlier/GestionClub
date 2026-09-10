# FC LA COUR Gestion Club

Application locale de gestion du club, avec sauvegardes serveur, veille publique, analyse PDF et preparation progressive vers une architecture client-serveur.

## Etat actuel

- Version courante : `V1.25.4`
- Derniere version stable validee : `V1.25.3`
- Serveur local Python : authentification, revisions, depots de sauvegarde, veille, PDF, convocations, premieres API SQL metier
- Ecran Licencies : lecture serveur SQL/API en mode `/gestion`, repli local en HTML autonome
- Client principal : `client/FC_LA_COUR_Manager.html`
- Donnees reelles : conservees hors depot dans `data/`
- Tests automatises : suite `unittest`

## Demarrage Windows

Depuis la racine du depot :

```bat
scripts\windows\DEMARRER_SERVEUR.cmd
```

Puis ouvrir :

```text
http://127.0.0.1:8765/
```

## Tests Windows

```bat
scripts\windows\LANCER_TESTS.cmd
```

## Organisation

| Dossier | Role |
| --- | --- |
| `client/` | Interface HTML, JS et CSS servie par le serveur |
| `server/` | Serveur Python et modules metier cote serveur |
| `tests/` | Tests automatises |
| `vendor/` | Dependances embarquees necessaires hors pip, dont pypdf |
| `docs/` | Architecture, roadmap, validations et notes de version |
| `scripts/windows/` | Lanceurs Windows |
| `data/` | Base locale creee a l'execution, ignoree par Git |
| `releases/` | Archives construites localement, ignorees par Git |

## Reprise du contexte metier

Avant de reprendre le developpement dans un nouveau chat ou avec un nouveau contributeur, lire :

- `docs/BUSINESS_INTENT.md`
- `docs/HANDOFF_NEXT_CHAT.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`

## Regle de developpement

Chaque evolution doit garder les donnees du club hors code source, ajouter ou mettre a jour les tests utiles, puis documenter le resultat dans `CHANGELOG.md` et `docs/releases/`.
