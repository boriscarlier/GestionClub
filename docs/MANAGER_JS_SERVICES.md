# Services JavaScript — D

663 unités syntaxiquement vérifiées, dont les fonctions du bloc principal et les extensions.
Il s’agit de modules de SOURCE, pas de modules ES autonomes. Ils sont recomposés dans le même script classique et dans le même ordre.
Cela préserve les déclarations anticipées, les variables globales lexicales et les dépendances entre fonctions.
Ne pas charger ces fichiers avec plusieurs balises script ni ajouter type=module sans migration sémantique séparée.

| Service | Source | Dépendances à préserver |
| --- | --- | --- |
| load | [client/shared/js/classic/06-030-load.js](../client/shared/js/classic/06-030-load.js) | KEY, defaults, localStorage ; sauvegarde de secours en cas de JSON invalide |
| save | [client/shared/js/classic/06-031-save.js](../client/shared/js/classic/06-031-save.js) | state, KEY, localStorage, renderAll ; conservation de la sémantique existante |
| qaBackupPayload | [client/shared/js/classic/06-020-qaBackupPayload.js](../client/shared/js/classic/06-020-qaBackupPayload.js) | state, coachLineups, QA_BUILD, prototypeFeedbackItems, prototypeScenarioState |
| qaRestoreBackup | [client/shared/js/classic/06-022-qaRestoreBackup.js](../client/shared/js/classic/06-022-qaRestoreBackup.js) | currentAdminCan, clés de stockage, state, coachLineups ; rollback des écritures |
| currentAdminAccount | [client/shared/js/classic/06-037-currentAdminAccount.js](../client/shared/js/classic/06-037-currentAdminAccount.js) | sessionStorage, accountById |
| currentAdminCan | [client/shared/js/classic/06-565-currentAdminCan.js](../client/shared/js/classic/06-565-currentAdminCan.js) | state.accounts, currentAdminAccount, accountCan |
| refreshServerMembers | [client/shared/js/classic/06-165-refreshServerMembers.js](../client/shared/js/classic/06-165-refreshServerMembers.js) | serverMembersApi, serverMembersState, updateMemberDataSource |
| refreshServerTeams | [client/shared/js/classic/06-533-refreshServerTeams.js](../client/shared/js/classic/06-533-refreshServerTeams.js) | état/cache équipe et API serveur existants |
| goTo | [client/shared/js/classic/06-338-goTo.js](../client/shared/js/classic/06-338-goTo.js) | enforcePagePermission, DOM de toutes les pages, renderers métier |
| showPublicPage | [client/shared/js/classic/06-026-showPublicPage.js](../client/shared/js/classic/06-026-showPublicPage.js) | contrôles de changement d’espace, DOM public et portails |

Le manifeste `client/manager.sources.json` référence toutes les unités, leurs plages source et empreintes.
Le bandeau API/session/sauvegarde injecté par le serveur reste commun dans `server/server.py` ; aucune copie métier par page.
L’isolation ES modules et le chargement à la demande ne sont pas réalisés par cette extraction.
