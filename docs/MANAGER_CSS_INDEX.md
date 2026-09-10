# Cartographie CSS — C2

Ordre de cascade strict. Les fichiers sont assemblés dans les cinq styles originaux.
Les conditions ci-dessous sont extraites du texte source ; elles ne constituent pas un calcul de priorité CSS.
Les règles spécifiques, les doublons et les surcharges sont conservés, jamais dédupliqués automatiquement.

| Ordre | Fichier | Section source | Conditions responsive |
| --- | --- | --- | --- |
| 1 | [client/shared/css/01-tokens.css](../client/shared/css/01-tokens.css) | Variables de thème |  |
| 2 | [client/shared/css/02-base.css](../client/shared/css/02-base.css) | Base |  |
| 3 | [client/shared/css/03-components.css](../client/shared/css/03-components.css) | Composants |  |
| 4 | [client/shared/css/ordered/004.css](../client/shared/css/ordered/004.css) | /* PUBLIC */ |  |
| 5 | [client/shared/css/ordered/005.css](../client/shared/css/ordered/005.css) | /* INTRANET */ |  |
| 6 | [client/shared/css/ordered/006.css](../client/shared/css/ordered/006.css) | /* ===== V1.02 : NAVIGATION PUBLIQUE COMPLETE ===== */ |  |
| 7 | [client/shared/css/ordered/007.css](../client/shared/css/ordered/007.css) | /* ===== V1.03 : EQUIPES & COMPETITIONS ===== */ |  |
| 8 | [client/shared/css/ordered/008.css](../client/shared/css/ordered/008.css) | /* V1.14 Import matchs LRF */ |  |
| 9 | [client/shared/css/ordered/009.css](../client/shared/css/ordered/009.css) | /* V1.05 CMS */ |  |
| 10 | [client/shared/css/ordered/010.css](../client/shared/css/ordered/010.css) | /* V1.06 Mediatheque avancee */ |  |
| 11 | [client/shared/css/ordered/011.css](../client/shared/css/ordered/011.css) | /* ===== V1.07 STABLE : COMMUNICATION MULTICANAL ===== */ |  |
| 12 | [client/shared/css/ordered/012.css](../client/shared/css/ordered/012.css) | /* ===== V1.08 : GENERATEUR GRAPHIQUE COMPLET ===== */ |  |
| 13 | [client/shared/css/ordered/013.css](../client/shared/css/ordered/013.css) | /* ===== V1.08.1 : IMPORTATION DES DONNEES ===== */ |  |
| 14 | [client/shared/css/ordered/014.css](../client/shared/css/ordered/014.css) | /* ===== V1.14 : DOCUMENTS OFFICIELS LRF 2026 ===== */ |  |
| 15 | [client/shared/css/ordered/015.css](../client/shared/css/ordered/015.css) | /* ===== V1.14 : IMPORT DISCIPLINE ===== */ |  |
| 16 | [client/shared/css/ordered/016.css](../client/shared/css/ordered/016.css) | /* ===== V1.14 : CONSEQUENCES REGLEMENTAIRES DISCIPLINE ===== */ |  |
| 17 | [client/shared/css/ordered/017.css](../client/shared/css/ordered/017.css) | /* ===== V1.14 : RECHERCHE & FICHE LICENCIE ===== */ |  |
| 18 | [client/shared/css/ordered/018.css](../client/shared/css/ordered/018.css) | /* ===== V1.14 : LICENCIES AVANCES ===== */ |  |
| 19 | [client/shared/css/ordered/019.css](../client/shared/css/ordered/019.css) | /* ===== V1.14 : CONTROLE ADMINISTRATIF ===== */ |  |
| 20 | [client/shared/css/ordered/020.css](../client/shared/css/ordered/020.css) | /* ===== V1.14 : CONTROLE REGLEMENTAIRE ===== */ |  |
| 21 | [client/shared/css/ordered/021.css](../client/shared/css/ordered/021.css) | /* ===== V1.09 AUTOMATISATIONS ===== */ |  |
| 22 | [client/shared/css/ordered/022.css](../client/shared/css/ordered/022.css) | /* ===== V1.14 : ESPACE ADHERENT ===== */ |  |
| 23 | [client/shared/css/ordered/023.css](../client/shared/css/ordered/023.css) | /* ===== V1.14 : PORTAIL EDUCATEURS ===== */ |  |
| 24 | [client/shared/css/ordered/024.css](../client/shared/css/ordered/024.css) | /* ===== V1.14 : NAVIGATION PUBLIQUE SUR PORTAIL EDUCATEURS ===== */ |  |
| 25 | [client/shared/css/ordered/025.css](../client/shared/css/ordered/025.css) | /* ===== V1.14 : DOCUMENTS & ADMINISTRATION ===== */ |  |
| 26 | [client/shared/css/ordered/026.css](../client/shared/css/ordered/026.css) | /* ===== V1.14.3 FIX1 : LOGO OFFICIEL OPTIMISE ===== */ |  |
| 27 | [client/shared/css/ordered/027.css](../client/shared/css/ordered/027.css) | /* ===== V1.14.4 : DETAIL & GESTION DES MATCHS ===== */ |  |
| 28 | [client/shared/css/ordered/028.css](../client/shared/css/ordered/028.css) | /* ===== V1.14.6 : RECHERCHE / TRI / SELECTION MATCHS ===== */ |  |
| 29 | [client/shared/css/ordered/029.css](../client/shared/css/ordered/029.css) | /* ===== V1.14.9 : FICHE DETAIL EQUIPE ===== */ |  |
| 30 | [client/shared/css/ordered/030.css](../client/shared/css/ordered/030.css) | /* ===== V1.14.10 : STATUT DISCIPLINAIRE DANS LES EFFECTIFS EQUIPE ===== */ |  |
| 31 | [client/shared/css/ordered/031.css](../client/shared/css/ordered/031.css) | /* ===== V1.14.11 : MATCHS PUBLICS / PROGRAMME COMPLET ===== */ |  |
| 32 | [client/shared/css/ordered/032.css](../client/shared/css/ordered/032.css) | /* ===== V1.14.12 : FILTRE SECTIONS PROGRAMME PUBLIC ===== */ |  |
| 33 | [client/shared/css/ordered/033.css](../client/shared/css/ordered/033.css) | /* ===== V1.14.13 : BASE LOGOS CLUBS ADVERSES ===== */ |  |
| 34 | [client/shared/css/ordered/034.css](../client/shared/css/ordered/034.css) | /* ===== V1.14.14 : NAVIGATION ADMINISTRATION PAR SOUS-MENUS ===== */ |  |
| 35 | [client/shared/css/ordered/035.css](../client/shared/css/ordered/035.css) | /* ===== V1.14.15 : RECHERCHE INTERNET LOGOS ADVERSES ===== */ |  |
| 36 | [client/shared/css/ordered/036.css](../client/shared/css/ordered/036.css) | /* ===== V1.14.16 : CORRESPONDANCE CLUBS ADVERSES / MATCHS ===== */ |  |
| 37 | [client/shared/css/ordered/037.css](../client/shared/css/ordered/037.css) | /* ===== V1.14.17 : FICHES CLUBS ADVERSES FONCTIONNELLES ===== */ |  |
| 38 | [client/shared/css/ordered/038.css](../client/shared/css/ordered/038.css) | /* ===== V1.14.18 : IMPORT FICHE CLUB FFF ===== */ |  |
| 39 | [client/shared/css/ordered/039.css](../client/shared/css/ordered/039.css) | /* ===== V1.14.19 : IMPORT ANNUAIRE CLUBS FFF MULTI-CLUBS ===== */ |  |
| 40 | [client/shared/css/ordered/040.css](../client/shared/css/ordered/040.css) | /* ===== V1.14.20 : DETECTION STRUCTURELLE ANNUAIRE FFF ===== */ |  |
| 41 | [client/shared/css/ordered/041.css](../client/shared/css/ordered/041.css) | /* ===== V1.14.21 : STRUCTURE FICHE CLUB SIMPLIFIEE ===== */ |  |
| 42 | [client/shared/css/ordered/042.css](../client/shared/css/ordered/042.css) | /* ===== V1.14.24 : SUIVI DE FRAICHEUR DES IMPORTS ===== */ |  |
| 43 | [client/shared/css/ordered/043.css](../client/shared/css/ordered/043.css) | /* ===== V1.14.25 : PROCEDURE DE REINITIALISATION DES BASES IMPORTEES ===== */ |  |
| 44 | [client/shared/css/ordered/044.css](../client/shared/css/ordered/044.css) | /* ===== V1.14.27 : CONFIRMATION INLINE REINITIALISATION ===== */ |  |
| 45 | [client/shared/css/ordered/045.css](../client/shared/css/ordered/045.css) | /* ===== V1.15.1 : TABLEAU DE BORD STATISTIQUE GENERAL ===== */ |  |
| 46 | [client/shared/css/ordered/046.css](../client/shared/css/ordered/046.css) | /* ===== V1.15.4 : DETAIL REPARTITION LICENCIES ===== */ |  |
| 47 | [client/shared/css/ordered/047.css](../client/shared/css/ordered/047.css) | /* ===== V1.20.1 : COMPTES UTILISATEURS ===== */ |  |
| 48 | [client/shared/css/ordered/048.css](../client/shared/css/ordered/048.css) | /* ===== V1.21.3 : DRILL-DOWN STATISTIQUES ===== */ |  |
| 49 | [client/shared/css/ordered/049.css](../client/shared/css/ordered/049.css) | /* ===== V1.21.5 : STABILISATION EQUIPES ===== */ |  |
| 50 | [client/shared/css/ordered/050.css](../client/shared/css/ordered/050.css) | /* ===== V1.21.6 : STABILISATION MATCHS ===== */ |  |
| 51 | [client/shared/css/ordered/051.css](../client/shared/css/ordered/051.css) | /* ===== V1.21.6.2 : EDITION COMPLETE DES MATCHS ===== */ |  |
| 52 | [client/shared/css/ordered/052.css](../client/shared/css/ordered/052.css) | /* ===== V1.21.6.6 : BADGES PROCHAINS MATCHS DASHBOARD ===== */ |  |
| 53 | [client/shared/css/ordered/053.css](../client/shared/css/ordered/053.css) | /* ===== V1.21.7 : STABILISATION PLANNING ===== */ |  |
| 54 | [client/shared/css/ordered/054.css](../client/shared/css/ordered/054.css) | /* ===== V1.21.7.1 : ACTIONS EXPLICITES PLANNING ===== */ |  |
| 55 | [client/shared/css/ordered/055.css](../client/shared/css/ordered/055.css) | /* ===== V1.21.8 : STABILISATION DISCIPLINE ===== */ |  |
| 56 | [client/shared/css/ordered/056.css](../client/shared/css/ordered/056.css) | /* ===== V1.21.8.1 : CYCLE DE VIE DISCIPLINE PAR DATES ===== */ |  |
| 57 | [client/shared/css/ordered/057.css](../client/shared/css/ordered/057.css) | /* ===== V1.21.9 : REORGANISATION CLUBS ADVERSES ===== */ |  |
| 58 | [client/shared/css/ordered/058.css](../client/shared/css/ordered/058.css) | /* ===== V1.21.9.3 : FICHE CLUB COMPLETE FFF ===== */ |  |
| 59 | [client/shared/css/ordered/059.css](../client/shared/css/ordered/059.css) | /* ===== V1.21.9.4 : FICHE CLUB A LA DEMANDE ===== */ |  |
| 60 | [client/shared/css/ordered/060.css](../client/shared/css/ordered/060.css) | /* ===== V1.21.9.5 : SECTIONS REPLIABLES FICHE CLUB ===== */ |  |
| 61 | [client/shared/css/ordered/061.css](../client/shared/css/ordered/061.css) | /* ===== V1.21.9.7 : PARAMETRAGE DU CLUB GESTIONNAIRE ===== */ |  |
| 62 | [client/shared/css/ordered/062.css](../client/shared/css/ordered/062.css) | /* ===== V1.21.10 : DOCUMENTS & CONTROLES ===== */ |  |
| 63 | [client/shared/css/ordered/063.css](../client/shared/css/ordered/063.css) | /* ===== V1.21.10.1 : STATUTS DES CONTROLES REGLEMENTAIRES ===== */ |  |
| 64 | [client/shared/css/ordered/064.css](../client/shared/css/ordered/064.css) | /* ===== V1.21.11 : IMPORTS & SUIVI ===== */ |  |
| 65 | [client/shared/css/ordered/065.css](../client/shared/css/ordered/065.css) | /* ===== V1.21.12 : STABILISATION STATISTIQUES ===== */ |  |
| 66 | [client/shared/css/ordered/066.css](../client/shared/css/ordered/066.css) | /* ===== V1.21.13 : STABILISATION COMPTES UTILISATEURS ===== */ |  |
| 67 | [client/shared/css/ordered/067.css](../client/shared/css/ordered/067.css) | /* ===== V1.21.14 : STABILISATION PERMISSIONS ===== */ |  |
| 68 | [client/shared/css/ordered/068.css](../client/shared/css/ordered/068.css) | /* ===== V1.21.15 : JOURNAL & AUDIT ===== */ |  |
| 69 | [client/shared/css/ordered/069.css](../client/shared/css/ordered/069.css) | /* ===== V1.21.16 : COMMUNICATION & MEDIAS ===== */ |  |
| 70 | [client/shared/css/ordered/070.css](../client/shared/css/ordered/070.css) | /* ===== V1.21.17 : STABILISATION SITE PUBLIC ===== */ |  |
| 71 | [client/shared/css/ordered/071.css](../client/shared/css/ordered/071.css) | /* ===== V1.21.18 : ESPACE ADHERENT & PORTAIL EDUCATEURS ===== */ |  |
| 72 | [client/shared/css/ordered/072.css](../client/shared/css/ordered/072.css) | /* ===== V1.21.18.1 : ACCES DE TEST ===== */ |  |
| 73 | [client/shared/css/ordered/073.css](../client/shared/css/ordered/073.css) | /* ===== V1.21.18.2 : STATUT SPORTIF EDUCATEUR ===== */ |  |
| 74 | [client/shared/css/ordered/074.css](../client/shared/css/ordered/074.css) | /* ===== V1.21.18.3 : PERIMETRE CATEGORIE + MUTATION ===== */ |  |
| 75 | [client/shared/css/ordered/075.css](../client/shared/css/ordered/075.css) | /* ===== V1.21.18.7 : VERIFICATION DISCIPLINAIRE EDUCATEUR ===== */ |  |
| 76 | [client/shared/css/ordered/076.css](../client/shared/css/ordered/076.css) | /* ===== V1.21.18.10 : COMPOSITIONS PERSISTANTES + MATCHS JOUES ===== */ |  |
| 77 | [client/shared/css/ordered/077.css](../client/shared/css/ordered/077.css) | /* ===== V1.21.18.11 : PREPARATION FMI FFF ===== */ |  |
| 78 | [client/shared/css/ordered/078.css](../client/shared/css/ordered/078.css) | /* ===== V1.21.18.13 : ENTRAINEMENTS + PRESENCES ===== */ |  |
| 79 | [client/shared/css/ordered/079.css](../client/shared/css/ordered/079.css) | /* ===== V1.21.18.16 : STATISTIQUES INDIVIDUELLES JOUEUR ===== */ |  |
| 80 | [client/shared/css/ordered/080.css](../client/shared/css/ordered/080.css) | /* ===== V1.21.18.18 : DASHBOARD PRESENCES & EFFECTIFS ===== */ |  |
| 81 | [client/shared/css/ordered/081.css](../client/shared/css/ordered/081.css) | /* ===== V1.21.19.1 : FONDATIONS RESPONSIVE GENERALES ===== */ |  |
| 82 | [client/shared/css/ordered/082.css](../client/shared/css/ordered/082.css) | /* Sécurité globale contre les débordements */ |  |
| 83 | [client/shared/css/ordered/083.css](../client/shared/css/ordered/083.css) | /* Contenus principaux */ |  |
| 84 | [client/shared/css/ordered/084.css](../client/shared/css/ordered/084.css) | /* Textes longs / identifiants */ |  |
| 85 | [client/shared/css/ordered/085.css](../client/shared/css/ordered/085.css) | /* Cibles tactiles communes */ |  |
| 86 | [client/shared/css/ordered/086.css](../client/shared/css/ordered/086.css) | /* Grilles génériques */ |  |
| 87 | [client/shared/css/ordered/087.css](../client/shared/css/ordered/087.css) | /* Tableaux : le conteneur peut défiler sans faire déborder la page */ |  |
| 88 | [client/shared/css/ordered/088.css](../client/shared/css/ordered/088.css) | /* Modales / panneaux flottants */ |  |
| 89 | [client/shared/css/ordered/089.css](../client/shared/css/ordered/089.css) | /* ===== Laptop / petit desktop ===== */ | (max-width:1200px) |
| 90 | [client/shared/css/ordered/090.css](../client/shared/css/ordered/090.css) | /* ===== Tablette ===== */ | (max-width:1024px) |
| 91 | [client/shared/css/ordered/091.css](../client/shared/css/ordered/091.css) | /* ===== Mobile ===== */ | (max-width:768px) |
| 92 | [client/shared/css/ordered/092.css](../client/shared/css/ordered/092.css) | /* ===== Petit mobile ===== */ | (max-width:430px) |
| 93 | [client/shared/css/ordered/093.css](../client/shared/css/ordered/093.css) | /* ===== V1.21.19.2 : SITE PUBLIC RESPONSIVE ===== */ |  |
| 94 | [client/shared/css/ordered/094.css](../client/shared/css/ordered/094.css) | /* ===== V1.21.19.3 : PORTAIL EDUCATEURS RESPONSIVE ===== */ |  |
| 95 | [client/shared/css/ordered/095.css](../client/shared/css/ordered/095.css) | /* ===== V1.21.19.4 : ESPACE ADHERENT RESPONSIVE ===== */ |  |
| 96 | [client/shared/css/ordered/096.css](../client/shared/css/ordered/096.css) | /* ===== V1.21.19.5 : DASHBOARD ADMINISTRATION RESPONSIVE ===== */ |  |
| 97 | [client/shared/css/ordered/097.css](../client/shared/css/ordered/097.css) | /* ===== V1.21.19.6 : MODULES ADMINISTRATION RESPONSIVE ===== */ |  |
| 98 | [client/shared/css/ordered/098.css](../client/shared/css/ordered/098.css) | /* ===== V1.21.19.7 : TABLEAUX, FORMULAIRES ET MODALES ===== */ |  |
| 99 | [client/shared/css/ordered/099.css](../client/shared/css/ordered/099.css) | /* ===== V1.21.19.8 : ERGONOMIE TACTILE ===== */ |  |
| 100 | [client/shared/css/ordered/100.css](../client/shared/css/ordered/100.css) | /* ===== V1.21.19.9 : AUDIT RESPONSIVE FINAL ===== */ |  |
| 101 | [client/shared/css/ordered/101.css](../client/shared/css/ordered/101.css) | /* ===== V1.21.20.1 : HISTORIQUE MATCHS EDUCATEUR ===== */ |  |
| 102 | [client/shared/css/ordered/102.css](../client/shared/css/ordered/102.css) | /* ===== V1.21.20.3 : EDITION PAR BLOC LICENCIE ===== */ |  |
| 103 | [client/shared/css/ordered/103.css](../client/shared/css/ordered/103.css) | /* ===== V1.22.0 : PROTOTYPE AUTONOME TABLETTE ===== */ |  |
| 104 | [client/shared/css/ordered/104.css](../client/shared/css/ordered/104.css) | /* ===== V1.22.2 : SCENARIOS DE TEST GUIDES ===== */ |  |
| 105 | [client/shared/css/ordered/105.css](../client/shared/css/ordered/105.css) | /* ===== V1.22.3 : RETOURS TESTEURS ===== */ |  |
| 106 | [client/shared/css/ordered/106.css](../client/shared/css/ordered/106.css) | /* ===== V1.22.4 : EXPORT RETOURS TESTEURS ===== */ |  |
| 107 | [client/shared/css/ordered/107.css](../client/shared/css/ordered/107.css) | /* ================================================================= |  |
| 108 | [client/shared/css/ordered/108.css](../client/shared/css/ordered/108.css) | /* V1.22.7.1 — Affichage isolé par espace et correctifs tactiles */ | print |
| 109 | [client/shared/css/ordered/109.css](../client/shared/css/ordered/109.css) | /* V1.22.7.1 — FFF control center, no global layout override. */ |  |
| 110 | [client/shared/css/ordered/110.css](../client/shared/css/ordered/110.css) | /* V1.22.8 — Module Footclubs UI, styles limités à son périmètre. */ |  |
| 111 | [client/shared/css/ordered/111.css](../client/shared/css/ordered/111.css) | Suite du style original |  |
| 112 | [client/shared/css/ordered/112.css](../client/shared/css/ordered/112.css) | Suite du style original |  |
| 113 | [client/shared/css/ordered/113.css](../client/shared/css/ordered/113.css) | #footclubsui button:disabled{opacity:.45;cursor:not-allowed;filter:saturate(.35)} |  |
| 114 | [client/shared/css/ordered/114.css](../client/shared/css/ordered/114.css) | Suite du style original |  |
