# Methode de developpement

1. Partir de la version stable connue.
2. Isoler la modification dans le dossier concerne.
3. Ajouter ou adapter les tests.
4. Lancer la suite complete.
5. Documenter la version dans `CHANGELOG.md`.
6. Produire une archive de validation uniquement apres tests.

Les donnees du club ne doivent jamais etre engagees dans Git. Les fichiers de sauvegarde utilises pour tester restent dans `data/`, `releases/` ou dans un dossier de travail local ignore.

