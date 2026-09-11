# Gestion Club V1.25.12 — HTML decompose, candidat de test

1. Fermer les anciennes fenetres du serveur local et de la passerelle LAN.
2. Decompresser ce ZIP dans un dossier temporaire.
3. Lancer METTRE_A_JOUR.cmd. L'installation avec base existante sur D: est retrouvee automatiquement. Verifier le chemin affiche ; data et logs sont conserves.
4. Les tests affichent une progression compacte. Le serveur demarre si les tests passent.
5. Se connecter sur http://127.0.0.1:8765/ puis lancer OUVRIR_VERSION_DECOMPOSEE.cmd.
6. Comparer avec http://127.0.0.1:8765/gestion-legacy pour le repli monolithique.

Python 3.11 ou plus recent avec le lanceur Windows `py` est requis. Aucun npm/pip requis pour utiliser l'application.

Le moteur serveur affiche encore V1.25.11.1 : c'est la base stable du candidat modulaire V1.25.12. La route habituelle /gestion n'est pas basculee automatiquement.

La neutralisation du nom a modifie la reference HTML : elle n'est pas identique au monolithe historique V1.25.11.1. Le monolithe neutralise livre et sa recomposition modulaire sont identiques octet pour octet. L'historique Git conserve les versions anterieures.

Validation du lot : 144 tests Python passes, recomposition exacte, syntaxe JS verifiee par la suite, scan textuel des fichiers versionnes. Validation navigateur et test physique Windows/LAN encore requis. Ne pas considerer ce candidat comme une nouvelle version stable.
