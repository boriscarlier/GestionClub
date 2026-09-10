# Audit de cascade CSS

Releve CSSOM Chromium du controle reussi sur 330c941 : 1264 regles, 180 selecteurs repetes (hors feuille de test). Une repetition n’est pas necessairement un conflit : media queries, specificite et ordre restent determinants. Aucune regle n’a ete supprimee ou deplacee. Voir MANAGER_CSS_INDEX.md pour les fichiers sources ordonnes.

| Selecteur | Ordre et contexte |
| --- | --- |
| :root | 1: stylesheet-0; 1104: stylesheet-0 |
| * | 2: stylesheet-0; 1135: stylesheet-0 / (prefers-reduced-motion: reduce) |
| html | 3: stylesheet-0; 1134: stylesheet-0 / (prefers-reduced-motion: reduce) |
| body | 4: stylesheet-0; 863: stylesheet-0 / (max-width: 768px) |
| button | 6: stylesheet-0; 989: stylesheet-0 / (max-width: 768px) |
| .badge | 16: stylesheet-0; 1001: stylesheet-0 / (max-width: 768px) |
| .badge.purple | 21: stylesheet-0; 22: stylesheet-0 |
| .field | 29: stylesheet-0; 991: stylesheet-0 / (max-width: 768px) |
| .table | 32: stylesheet-0; 127: stylesheet-0 / (max-width: 650px) |
| #publicApp header | 37: stylesheet-0; 894: stylesheet-0 / (max-width: 768px) |
| .brand | 39: stylesheet-0; 998: stylesheet-0 / (max-width: 768px) |
| .pub-links | 43: stylesheet-0; 115: stylesheet-0 / (max-width: 1180px); 117: stylesheet-0 / (max-width: 1050px); 152: stylesheet-0 / (max-width: 1180px); 154: stylesheet-0 / (max-width: 1050px) |
| .pub-links button | 44: stylesheet-0; 116: stylesheet-0 / (max-width: 1180px); 153: stylesheet-0 / (max-width: 1180px) |
| .hero | 46: stylesheet-0; 124: stylesheet-0 / (max-width: 650px) |
| .section | 51: stylesheet-0; 125: stylesheet-0 / (max-width: 650px) |
| .sidebar | 77: stylesheet-0; 120: stylesheet-0 / (max-width: 1050px); 520: stylesheet-0; 847: stylesheet-0 / (max-width: 1200px); 853: stylesheet-0 / (max-width: 1024px) |
| .nav | 80: stylesheet-0; 521: stylesheet-0 |
| .sidefoot | 85: stylesheet-0; 531: stylesheet-0 |
| .intra-main | 86: stylesheet-0; 121: stylesheet-0 / (max-width: 1050px); 848: stylesheet-0 / (max-width: 1200px); 852: stylesheet-0 / (max-width: 1024px) |
| .topbar | 87: stylesheet-0; 855: stylesheet-0 / (max-width: 1024px) |
| .content | 92: stylesheet-0; 122: stylesheet-0 / (max-width: 650px) |
| .intra-hero | 95: stylesheet-0; 126: stylesheet-0 / (max-width: 650px) |
| .public-page | 128: stylesheet-0; 402: stylesheet-0 |
| .public-page.active | 129: stylesheet-0; 403: stylesheet-0 |
| .mobile-toggle | 142: stylesheet-0; 155: stylesheet-0 / (max-width: 1050px) |
| .team-detail-grid | 161: stylesheet-0; 177: stylesheet-0 / (max-width: 900px); 463: stylesheet-0; 470: stylesheet-0 / (max-width: 850px); 471: stylesheet-0 / (max-width: 600px) |
| .roster-grid | 164: stylesheet-0; 178: stylesheet-0 / (max-width: 900px) |
| .fixture | 169: stylesheet-0; 180: stylesheet-0 / (max-width: 650px) |
| .fixture .score | 170: stylesheet-0; 181: stylesheet-0 / (max-width: 650px) |
| .planning-grid | 182: stylesheet-0; 192: stylesheet-0 / (max-width: 1000px); 193: stylesheet-0 / (max-width: 650px) |
| .plan-event | 185: stylesheet-0; 679: stylesheet-0 |
| .album-grid | 202: stylesheet-0; 205: stylesheet-0 / (max-width: 900px); 206: stylesheet-0 / (max-width: 650px) |
| .comm-preview | 216: stylesheet-0; 222: stylesheet-0 / (max-width: 1000px) |
| .comm-kanban, .comm-summary, .channel-status | 221: stylesheet-0 / (max-width: 1000px); 223: stylesheet-0 / (max-width: 650px) |
| .visual-templates | 224: stylesheet-0; 231: stylesheet-0 / (max-width: 950px); 232: stylesheet-0 / (max-width: 650px) |
| .import-toolbar, .import-report, .import-steps | 254: stylesheet-0 / (max-width: 900px); 255: stylesheet-0 / (max-width: 650px) |
| .docs-grid | 258: stylesheet-0; 267: stylesheet-0 / (max-width: 950px) |
| .doc-card | 259: stylesheet-0; 410: stylesheet-0 |
| .doc-card h4 | 261: stylesheet-0; 411: stylesheet-0 |
| .doc-actions | 262: stylesheet-0; 413: stylesheet-0 |
| .doc-meta | 263: stylesheet-0; 412: stylesheet-0 |
| .disc-grid | 269: stylesheet-0; 275: stylesheet-0 / (max-width: 900px); 276: stylesheet-0 / (max-width: 650px) |
| .rule-grid | 277: stylesheet-0; 286: stylesheet-0 / (max-width: 900px) |
| .member-tools | 287: stylesheet-0; 309: stylesheet-0 / (max-width: 1100px) |
| .member-kv | 303: stylesheet-0; 311: stylesheet-0 / (max-width: 780px) |
| .admin-check-grid | 316: stylesheet-0; 323: stylesheet-0 / (max-width: 1000px) |
| .admin-issue | 319: stylesheet-0; 324: stylesheet-0 / (max-width: 1000px) |
| .reg-check-grid | 325: stylesheet-0; 337: stylesheet-0 / (max-width: 900px) |
| .auto-grid | 338: stylesheet-0; 351: stylesheet-0 / (max-width: 900px); 352: stylesheet-0 / (max-width: 650px) |
| .portal-shell | 354: stylesheet-0; 371: stylesheet-0 / (max-width: 900px) |
| .portal-side | 355: stylesheet-0; 372: stylesheet-0 / (max-width: 900px) |
| .portal-grid | 359: stylesheet-0; 373: stylesheet-0 / (max-width: 900px) |
| .coach-shell | 376: stylesheet-0; 396: stylesheet-0 / (max-width: 950px) |
| .coach-side | 377: stylesheet-0; 397: stylesheet-0 / (max-width: 950px) |
| .coach-grid | 381: stylesheet-0; 398: stylesheet-0 / (max-width: 950px); 401: stylesheet-0 / (max-width: 650px) |
| .coach-player | 386: stylesheet-0; 399: stylesheet-0 / (max-width: 950px) |
| .coach-lineup | 392: stylesheet-0; 400: stylesheet-0 / (max-width: 950px); 859: stylesheet-0 / (max-width: 1024px) |
| .doc-toolbar | 408: stylesheet-0; 423: stylesheet-0 / (max-width: 1000px) |
| .doc-grid | 409: stylesheet-0; 422: stylesheet-0 / (max-width: 1000px) |
| .doc-stat-grid | 414: stylesheet-0; 424: stylesheet-0 / (max-width: 1000px) |
| .brand .logo.club-logo-holder img | 428: stylesheet-0; 438: stylesheet-0 / (max-width: 700px) |
| .club-logo-card | 436: stylesheet-0; 437: stylesheet-0 / (max-width: 700px) |
| .match-detail-grid | 441: stylesheet-0; 448: stylesheet-0 / (max-width: 850px) |
| .match-score-editor | 446: stylesheet-0; 449: stylesheet-0 / (max-width: 850px) |
| .match-toolbar | 451: stylesheet-0; 458: stylesheet-0 / (max-width: 900px); 460: stylesheet-0 / (max-width: 600px) |
| .team-player-row | 472: stylesheet-0; 476: stylesheet-0 / (max-width: 800px) |
| .home-match-columns | 477: stylesheet-0; 499: stylesheet-0 / (max-width: 800px) |
| .public-match-row | 481: stylesheet-0; 502: stylesheet-0 / (max-width: 520px) |
| .public-match-score | 487: stylesheet-0; 503: stylesheet-0 / (max-width: 520px) |
| .program-match | 492: stylesheet-0; 500: stylesheet-0 / (max-width: 800px); 504: stylesheet-0 / (max-width: 520px) |
| .program-team .club-logo-img | 497: stylesheet-0; 506: stylesheet-0 / (max-width: 520px) |
| .opponent-grid | 510: stylesheet-0; 517: stylesheet-0 / (max-width: 950px) |
| .opponent-card | 511: stylesheet-0; 548: stylesheet-0 |
| .opponent-form | 515: stylesheet-0; 518: stylesheet-0 / (max-width: 950px) |
| .logo-web-search | 532: stylesheet-0; 536: stylesheet-0 / (max-width: 650px) |
| .opponent-match-link | 537: stylesheet-0; 546: stylesheet-0 / (max-width: 800px) |
| .opponent-stats | 538: stylesheet-0; 545: stylesheet-0 / (max-width: 800px); 547: stylesheet-0 / (max-width: 520px) |
| .opponent-detail-head | 550: stylesheet-0; 559: stylesheet-0 / (max-width: 700px) |
| .opponent-detail-grid | 553: stylesheet-0; 558: stylesheet-0 / (max-width: 700px) |
| .club-fff-import-grid | 562: stylesheet-0; 568: stylesheet-0 / (max-width: 850px); 569: stylesheet-0 / (max-width: 560px) |
| .annuaire-summary, .annuaire-club-themes | 581: stylesheet-0 / (max-width: 850px); 582: stylesheet-0 / (max-width: 560px) |
| .import-watch-grid | 588: stylesheet-0; 597: stylesheet-0 / (max-width: 900px) |
| .import-watch-settings | 595: stylesheet-0; 598: stylesheet-0 / (max-width: 900px) |
| .stats-dashboard-grid | 612: stylesheet-0; 627: stylesheet-0 / (max-width: 1000px); 629: stylesheet-0 / (max-width: 560px); 850: stylesheet-0 / (max-width: 1200px); 858: stylesheet-0 / (max-width: 1024px) |
| .stats-section-grid | 616: stylesheet-0; 628: stylesheet-0 / (max-width: 1000px) |
| .stats-bar-row | 618: stylesheet-0; 631: stylesheet-0 / (max-width: 560px) |
| .stats-result-grid | 621: stylesheet-0; 630: stylesheet-0 / (max-width: 560px) |
| .account-toolbar | 637: stylesheet-0; 648: stylesheet-0 / (max-width: 950px) |
| .account-grid | 638: stylesheet-0; 647: stylesheet-0 / (max-width: 950px) |
| .team-admin-tools, .team-admin-summary | 659: stylesheet-0 / (max-width: 850px); 660: stylesheet-0 / (max-width: 560px) |
| .match-summary-grid | 661: stylesheet-0; 664: stylesheet-0 / (max-width: 950px); 665: stylesheet-0 / (max-width: 560px) |
| .match-edit-grid | 666: stylesheet-0; 669: stylesheet-0 / (max-width: 850px); 670: stylesheet-0 / (max-width: 560px) |
| .planning-toolbar, .planning-editor-grid | 681: stylesheet-0 / (max-width: 900px); 682: stylesheet-0 / (max-width: 560px) |
| .discipline-toolbar | 686: stylesheet-0; 689: stylesheet-0 / (max-width: 850px); 690: stylesheet-0 / (max-width: 560px) |
| .opponent-search-tools | 698: stylesheet-0; 699: stylesheet-0 / (max-width: 650px) |
| .club-sheet-section | 700: stylesheet-0; 712: stylesheet-0 |
| .club-sheet-grid, .club-sheet-grid.cols2 | 707: stylesheet-0 / (max-width: 850px); 708: stylesheet-0 / (max-width: 560px) |
| .club-profile-grid | 719: stylesheet-0; 724: stylesheet-0 / (max-width: 850px); 725: stylesheet-0 / (max-width: 560px) |
| .doc-club-reference | 727: stylesheet-0; 732: stylesheet-0 / (max-width: 760px) |
| .control-toolbar | 729: stylesheet-0; 731: stylesheet-0 / (max-width: 760px); 733: stylesheet-0 / (max-width: 520px) |
| .stats-source-summary | 740: stylesheet-0; 744: stylesheet-0 / (max-width: 900px); 745: stylesheet-0 / (max-width: 560px) |
| .permission-summary-grid | 748: stylesheet-0; 753: stylesheet-0 / (max-width: 850px); 754: stylesheet-0 / (max-width: 520px) |
| .audit-summary-grid | 755: stylesheet-0; 761: stylesheet-0 / (max-width: 900px) |
| .audit-toolbar | 758: stylesheet-0; 760: stylesheet-0 / (max-width: 900px) |
| .comm-channel-grid | 766: stylesheet-0; 769: stylesheet-0 / (max-width: 900px); 770: stylesheet-0 / (max-width: 520px) |
| .public-access-grid | 773: stylesheet-0; 775: stylesheet-0 / (max-width: 760px) |
| .member-mutation-controls | 785: stylesheet-0; 787: stylesheet-0 / (max-width: 700px) |
| .coach-training-form | 797: stylesheet-0; 807: stylesheet-0 / (max-width: 850px); 860: stylesheet-0 / (max-width: 1024px); 874: stylesheet-0 / (max-width: 768px) |
| .coach-training-stats | 798: stylesheet-0; 809: stylesheet-0 / (max-width: 850px) |
| .coach-attendance-row | 800: stylesheet-0; 810: stylesheet-0 / (max-width: 850px); 862: stylesheet-0 / (max-width: 1024px) |
| .coach-training-form .wide | 808: stylesheet-0 / (max-width: 850px); 861: stylesheet-0 / (max-width: 1024px); 875: stylesheet-0 / (max-width: 768px) |
| .coach-player-stats-panel | 811: stylesheet-0; 994: stylesheet-0 / (max-width: 768px) |
| .coach-player-stats-grid | 813: stylesheet-0; 819: stylesheet-0 / (max-width: 800px) |
| .coach-player-history | 816: stylesheet-0; 820: stylesheet-0 / (max-width: 800px); 876: stylesheet-0 / (max-width: 768px) |
| .sport-health-grid | 821: stylesheet-0; 831: stylesheet-0 / (max-width: 900px); 833: stylesheet-0 / (max-width: 520px); 851: stylesheet-0 / (max-width: 1200px) |
| .sport-health-bar-row | 825: stylesheet-0; 832: stylesheet-0 / (max-width: 900px); 873: stylesheet-0 / (max-width: 768px); 882: stylesheet-0 / (max-width: 430px) |
| .modal, .modal-card, .dialog, .editor-modal, .admin-modal | 846: stylesheet-0; 981: stylesheet-0 / (max-width: 768px) |
| .intra-main, .public-main, .portal-main, .coach-main | 856: stylesheet-0 / (max-width: 1024px); 864: stylesheet-0 / (max-width: 768px) |
| .page, .public-page, .portal-page, .coach-page | 865: stylesheet-0 / (max-width: 768px); 878: stylesheet-0 / (max-width: 430px) |
| .grid.stats, .stats-dashboard-grid, .sport-health-grid, .coach-player-stats-grid, .coach-training-stats | 868: stylesheet-0 / (max-width: 768px); 877: stylesheet-0 / (max-width: 430px) |
| .card, .coach-card, .portal-card | 869: stylesheet-0 / (max-width: 768px); 879: stylesheet-0 / (max-width: 430px) |
| #publicApp header .container.public-nav | 884: stylesheet-0 / (max-width: 1024px); 908: stylesheet-0 / (max-width: 430px) |
| #publicApp .mobile-toggle | 886: stylesheet-0 / (max-width: 1024px); 909: stylesheet-0 / (max-width: 430px) |
| #publicApp .hero .container | 889: stylesheet-0 / (max-width: 1024px); 898: stylesheet-0 / (max-width: 768px) |
| #publicApp .hero h2 | 890: stylesheet-0 / (max-width: 1024px); 899: stylesheet-0 / (max-width: 768px) |
| #publicApp .team-grid | 892: stylesheet-0 / (max-width: 1024px); 904: stylesheet-0 / (max-width: 768px) |
| #publicApp footer .grid.cols-3 | 893: stylesheet-0 / (max-width: 1024px); 906: stylesheet-0 / (max-width: 768px) |
| #coachApp .coach-shell | 911: stylesheet-0 / (max-width: 1024px); 1045: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-side | 912: stylesheet-0 / (max-width: 1024px); 1044: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-side .portal-id | 913: stylesheet-0 / (max-width: 1024px); 933: stylesheet-0 / (max-width: 430px) |
| #coachApp .coach-main | 917: stylesheet-0 / (max-width: 1024px); 921: stylesheet-0 / (max-width: 768px); 1046: stylesheet-0 / (max-width: 1024px); 1130: stylesheet-0 / (max-width: 1024px); 1142: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-grid | 918: stylesheet-0 / (max-width: 1024px); 922: stylesheet-0 / (max-width: 768px); 1077: stylesheet-0 / (max-width: 1024px); 1101: stylesheet-0 / (max-width: 390px) |
| #coachApp .member-tools | 919: stylesheet-0 / (max-width: 1024px); 923: stylesheet-0 / (max-width: 768px); 1080: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-player | 920: stylesheet-0 / (max-width: 1024px); 926: stylesheet-0 / (max-width: 768px); 1081: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-lineup | 924: stylesheet-0 / (max-width: 768px); 1088: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-listbox | 925: stylesheet-0 / (max-width: 768px); 1089: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-training-form | 929: stylesheet-0 / (max-width: 768px); 1092: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-attendance-actions button | 930: stylesheet-0 / (max-width: 768px); 935: stylesheet-0 / (max-width: 430px); 1095: stylesheet-0 / (max-width: 1024px) |
| #portalApp .portal-side .portal-id | 938: stylesheet-0 / (max-width: 1024px); 948: stylesheet-0 / (max-width: 430px) |
| #portalApp .portal-main | 941: stylesheet-0 / (max-width: 1024px); 943: stylesheet-0 / (max-width: 768px) |
| #portalApp .portal-grid | 942: stylesheet-0 / (max-width: 1024px); 944: stylesheet-0 / (max-width: 768px) |
| .admin-mobile-menu-btn | 950: stylesheet-0; 951: stylesheet-0 / (max-width: 1024px) |
| #intranetApp .content | 952: stylesheet-0 / (max-width: 1024px); 962: stylesheet-0 / (max-width: 430px) |
| #dashboard .grid.stats, #dashboard .sport-health-grid | 960: stylesheet-0 / (max-width: 768px); 963: stylesheet-0 / (max-width: 430px) |
| #intranetApp .member-tools, #intranetApp .filters, #intranetApp .form-grid | 967: stylesheet-0 / (max-width: 1024px); 972: stylesheet-0 / (max-width: 768px) |
| #intranetApp .team-grid | 968: stylesheet-0 / (max-width: 1024px); 973: stylesheet-0 / (max-width: 768px) |
| #intranetApp .sidebar | 996: stylesheet-0 / (max-width: 1024px); 1131: stylesheet-0 / (max-width: 1024px); 1137: stylesheet-0 / (max-width: 1024px); 1139: stylesheet-0 / (min-width: 1025px) |
| .coach-result-card | 1003: stylesheet-0; 1006: stylesheet-0 / (max-width: 600px) |
| .coach-result-score | 1004: stylesheet-0; 1007: stylesheet-0 / (max-width: 600px) |
| .member-block-edit-grid | 1010: stylesheet-0; 1015: stylesheet-0 / (max-width: 700px) |
| .prototype-tester-dock | 1017: stylesheet-0; 1031: stylesheet-0 / (max-width: 520px) |
| .prototype-tester-toggle | 1018: stylesheet-0; 1148: stylesheet-0 |
| .prototype-tester-panel | 1019: stylesheet-0; 1133: stylesheet-0 / (max-width: 1024px) |
| .prototype-tester-grid | 1022: stylesheet-0; 1030: stylesheet-0 / (max-width: 520px) |
| #coachApp .coach-mobile-topbar | 1047: stylesheet-0 / (max-width: 1024px); 1124: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-mobile-more-trigger | 1054: stylesheet-0 / (max-width: 1024px); 1109: stylesheet-0 |
| #coachApp .coach-mobile-team-row | 1055: stylesheet-0 / (max-width: 1024px); 1099: stylesheet-0 / (max-width: 390px); 1129: stylesheet-0 / (max-width: 1024px); 1146: stylesheet-0 / (max-width: 1024px); 1147: stylesheet-0 / (max-width: 390px) |
| #coachApp .coach-mobile-team-row label | 1056: stylesheet-0 / (max-width: 1024px); 1100: stylesheet-0 / (max-width: 390px) |
| #coachApp #coachMobileTeamSelect | 1057: stylesheet-0 / (max-width: 1024px); 1108: stylesheet-0 |
| #coachApp .coach-mobile-bottom-nav | 1058: stylesheet-0 / (max-width: 1024px); 1125: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-mobile-bottom-nav button small | 1061: stylesheet-0 / (max-width: 1024px); 1102: stylesheet-0 / (max-width: 390px) |
| #coachApp .coach-mobile-more-sheet | 1064: stylesheet-0 / (max-width: 1024px); 1127: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-mobile-more-sheet.open | 1065: stylesheet-0 / (max-width: 1024px); 1112: stylesheet-0 |
| #coachApp .coach-mobile-sheet-grid button | 1069: stylesheet-0 / (max-width: 1024px); 1110: stylesheet-0 |
| #coachApp .coach-mobile-sheet-secondary | 1071: stylesheet-0 / (max-width: 1024px); 1103: stylesheet-0 / (max-width: 390px) |
| #coachApp .coach-page | 1073: stylesheet-0 / (max-width: 1024px); 1143: stylesheet-0 / (max-width: 1024px) |
| #coachApp .coach-kpi strong | 1079: stylesheet-0 / (max-width: 1024px); 1114: stylesheet-0; 1144: stylesheet-0 / (max-width: 1024px) |
| .fff-kpis | 1151: stylesheet-0; 1183: stylesheet-0 / (max-width: 850px); 1188: stylesheet-0 / (max-width: 430px) |
| .fff-kpis .card strong | 1152: stylesheet-0; 1189: stylesheet-0 / (max-width: 430px) |
| .fff-kpis .card strong.fff-date | 1153: stylesheet-0; 1190: stylesheet-0 / (max-width: 430px) |
| .fff-actions | 1159: stylesheet-0; 1185: stylesheet-0 / (max-width: 850px) |
| .fff-file | 1161: stylesheet-0; 1186: stylesheet-0 / (max-width: 850px) |
| #footclubsui [hidden] | 1196: stylesheet-0; 1231: stylesheet-1 |
| #footclubsui .fcu-tabs | 1201: stylesheet-0; 1239: stylesheet-1 / (max-width: 560px) |
| #footclubsui .fcu-actions | 1203: stylesheet-0; 1235: stylesheet-1 / (max-width: 560px) |
| #footclubsui .fcu-roadmap-row | 1217: stylesheet-0; 1223: stylesheet-0 / (max-width: 560px) |
| #footclubsui button | 1225: stylesheet-0 / (max-width: 560px); 1237: stylesheet-1 / (max-width: 560px) |
| #footclubsui .fcu-actions > * | 1226: stylesheet-0 / (max-width: 560px); 1236: stylesheet-1 / (max-width: 560px) |
| .continuity-panel | 1254: stylesheet-4; 1263: stylesheet-4 / (max-width: 600px) |
| .continuity-panel button, .continuity-bar button | 1256: stylesheet-4; 1264: stylesheet-4 / (max-width: 600px) |
