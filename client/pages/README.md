# Pages Gestion Club

Ce dossier contient les pages cibles de la decomposition progressive du Manager HTML.

## Statuts

| Statut | Role |
| --- | --- |
| `legacy_bridge` | Page creee, redirection ou lien vers le monolithe `/gestion` conserve. |
| `extraction_candidate` | IDs, JS, CSS et donnees cartographies. |
| `extracted_shadow` | Page extraite testable, pas encore chemin principal. |
| `runtime_active` | Page servie comme chemin principal apres validation. |

## Regle de rollback

Tant qu'une page n'est pas `runtime_active`, `client/FC_LA_COUR_Manager.html` reste la reference de fonctionnement et de retour arriere.

## Premier lot

| Page | Chemin | Statut |
| --- | --- | --- |
| Dashboard admin | `admin/dashboard.html` | `extracted_shadow` |
| Licencies admin | `admin/members.html` | `legacy_bridge` |
| Equipes admin | `admin/teams.html` | `legacy_bridge` |
| Accueil public | `public/home.html` | `legacy_bridge` |
| Accueil educateur | `coach/home.html` | `legacy_bridge` |
| Accueil adherent | `member/home.html` | `legacy_bridge` |

## Dashboard admin

`admin/dashboard.html` est la premiere page extraite en mode shadow. Elle lit uniquement :

- `/api/session`
- `/api/state/summary`

Elle ne modifie aucune donnee et conserve un lien visible vers `/gestion#dashboard`.
