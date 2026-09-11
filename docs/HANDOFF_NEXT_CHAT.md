# Reprise — Gestion Club V1.25.12

Branche de reference : main. PR #3 fusionnee le 11 septembre 2026.
Base runtime : V1.25.11.1. Candidat de sources decomposees : V1.25.12.

## Etat valide

- 114 unites CSS, 663 unites JavaScript classiques, 70 templates HTML.
- Monolithe generique livre identique octet pour octet a sa recomposition.
- Nom du club retire du contenu courant, logo remplace par un embleme generique GC.
- Caches Python retires du suivi Git.
- 144 tests Python passes localement et suites GitHub reussies.
- 210 comparaisons visuelles et 70 acces directs actifs, aucune erreur JavaScript.
- Revision runtime validee : da92eace26678658e618766b10ad393f0350d451.
- Preuve CI : https://github.com/boriscarlier/GestionClub/actions/runs/34582498767

Le controle visuel compare exactement la geometrie, le texte visible et les styles avant les pixels.
Tolerance precedente : 0,01 % des pixels, delta maximum 12/255.
Arrondi d'un seul niveau de couleur : borne 0,02 %, motivee par 53 pixels de contours sur mobile.
Aucun elargissement pour les autres ecarts.

## Suite

1. Test physique Windows/LAN avec le ZIP complet. Voir LIRE_AVANT_TEST.md.
2. Verifier la conservation de la base dans l'installation existante detectee sur D:.
3. Comparer /gestion-modulaire et /gestion-legacy.
4. Ne pas basculer la route /gestion ni supprimer le monolithe avant validation physique.

Les noms des donnees reelles restent dans data/, hors Git. Aucun historique Git n'a ete reecrit.
La neutralisation a modifie intentionnellement le monolithe : ne pas le declarer identique au fichier historique V1.25.11.1.
Python seul suffit pour utiliser le paquet. Node est necessaire pour l'outillage de generation et les tests navigateur.
