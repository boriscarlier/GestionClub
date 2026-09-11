# Gestion Club V1.25.12.3 — correctif versions affichees et candidat de test

1. Fermer les anciennes fenetres du serveur local et de la passerelle LAN.
2. Decompresser ce ZIP dans un dossier temporaire.
3. Lancer METTRE_A_JOUR.cmd. La cible est D:\GestionClub\FC_LA_COUR_GestionClub. Verifier le chemin affiche ; data et logs sont conserves.
4. Les tests affichent une progression compacte. Le serveur demarre si les tests passent.
5. Se connecter sur http://127.0.0.1:8765/ puis lancer OUVRIR_VERSION_DECOMPOSEE.cmd.
6. Comparer avec http://127.0.0.1:8765/gestion-legacy pour le repli monolithique.

Python 3.11 ou plus recent avec le lanceur Windows `py` est requis. Aucun npm/pip requis pour utiliser l'application.

Le moteur serveur et les scripts Windows affichent maintenant V1.25.12.3. La route habituelle /gestion n'est pas basculee automatiquement.

La neutralisation du nom a modifie la reference HTML : elle n'est pas identique au monolithe historique V1.25.12.3. Le monolithe neutralise livre et sa recomposition modulaire sont identiques octet pour octet. L'historique Git conserve les versions anterieures.

Validation du lot : 146 tests Python passes localement, recomposition exacte, scan textuel des anciens numeros V1.25.11.1 et V1.24.5, ZIP verifie. Correctif valide par l'utilisateur pour publication sur main.

Correctif Windows : copie du sous-dossier client/shared/data, manifeste CSS portable et lectures UTF-8 explicites. Les mentions du club sont limitees au chemin technique impose.

Correctif V1.25.12.2 : fermeture bornee des requetes LAN refusees pour eviter les reinitialisations TCP Windows. Les controles Host et Origin restent actifs.

Priorite suivante V1.25.13 : creation et separation des profils administrateur, educateur et licencie joueur, avec droits adaptes aux licences et aux informations personnelles.
