# Pages sources — V1.25.12 C/D/E

Chaque fichier correspond à une unité réelle du Manager et conserve son HTML.
Ce sont des templates assemblés par Python, pas des documents autonomes à ouvrir par double-clic.
Les inclusions `GESTION_SOURCE` préservent notamment les portails imbriqués.

Depuis le serveur connecté :

- `/gestion` : version habituelle inchangée ;
- `/gestion-legacy` : même référence de repli ;
- `/gestion-modulaire` : document produit depuis les sources séparées ;
- `/gestion-modulaire/admin/members` : entrée vers les licenciés (session métier nécessaire).

Les 70 routes et leur source sont dans `docs/MANAGER_COMPOSED_PAGES.md`.
Aucun chargement partiel du DOM ni contournement des permissions n'est introduit.
La bascule par défaut et le retrait du monolithe appartiennent à F et ne sont pas réalisés.

Contrôle sans dépendance supplémentaire sous Windows :
`python scripts/build_manager_sources.py --check`.
La génération initiale et le contrôle de syntaxe JS utilisent Node uniquement côté développement/CI.
Le serveur, l'installation et les tests Python continuent de fonctionner sans Node.

Les SHA de cette étape garantissent l'identité avec la base validée.
Toute évolution fonctionnelle ultérieure des sources nécessitera une nouvelle référence
de validation et un manifeste cohérent ; ne pas supprimer les contrôles d'intégrité.
