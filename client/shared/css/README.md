# CSS commun — V1.25.12-C1

Extraction passive du préfixe commun du premier style du Manager canonique.
Ces fichiers ne sont pas encore chargés par `/gestion`.

Ordre impératif :

1. `01-tokens.css` : variables de thème.
2. `02-base.css` : normalisation, typographie, visibilité et conteneur.
3. `03-components.css` : boutons, badges, cartes, grilles, champs, tables et notifications.

Les octets, espaces, doublons et ordre originaux sont conservés volontairement.
Le manifeste fournit les plages source et empreintes de chaque fichier.
Ne pas modifier ces copies manuellement pendant cette phase.

Vérification depuis la racine : `python scripts/extract_manager_css.py --check`.
L'extracteur refuse d'écraser un fichier divergent et ne modifie jamais le HTML.

Limite : les règles spécifiques et surcharges ultérieures restent dans le monolithe.
Ce préfixe n'est donc pas encore une feuille complète équivalente visuellement.
La prochaine étape C2 doit cartographier ces surcharges et les règles responsive
avant activation sur une page pilote et comparaison visuelle Windows/local/LAN.
