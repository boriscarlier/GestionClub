# Decomposition HTML securisee - demarrage

## Base canonique

La decomposition repart de `dev/v1.25.11-lan-stable-base`, validee comme `V1.25.11.1`.

Le fichier de rollback reste :

- `client/FC_LA_COUR_Manager.html`
- taille attendue : `1 143 051` octets
- SHA-256 attendu : `5646baa6ab0d19c31172eeeb5270fcccc8bc719726cb2f9c06f4147677f1f45c`
- Git blob SHA attendu : `64def65ec261d3da05d855896484c4deb79da407`

Aucune extraction ne doit modifier ce fichier tant que la page cible n'a pas ete testee.

## Principe V1.25.12-safe

La premiere etape cree les chemins cibles et les documents d'indexation, mais chaque page reste en mode `legacy_bridge` : elle renvoie vers le Manager monolithique servi par `/gestion` avec l'ancre de page correspondante.

Cela permet de commencer la structure multi-pages sans retirer le chemin stable.

## Structure cible initialisee

```text
client/pages/
  README.md
  admin/
    dashboard.html
    members.html
    teams.html
  public/
    home.html
  coach/
    home.html
  member/
    home.html
```

## Regles de progression

1. Une page commence toujours en `legacy_bridge`.
2. Son contenu reel est extrait seulement apres identification de ses IDs, fonctions JS, styles et donnees.
3. Une page extraite doit conserver un lien de retour vers `/gestion`.
4. Le monolithe reste le rollback jusqu'a validation Windows et LAN.
5. Les tests doivent verifier les pages creees et la reference du Manager.

## Premiere cible fonctionnelle

Ordre recommande :

1. `admin/dashboard.html` : page de synthese, faible risque metier.
2. `admin/members.html` : deja partiellement reliee a l'API `/api/state/members`.
3. `admin/teams.html` : deja partiellement reliee a l'API `/api/state/teams`.

Les pages publiques, educateur et adherent restent en pont legacy avant extraction.