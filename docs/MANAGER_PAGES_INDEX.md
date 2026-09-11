# Index des pages fonctionnelles du Manager

## Reference

- Source : `client/GESTION_CLUB_Manager.html`
- Taille : `1143320` octets
- Git blob SHA : `None`
- SHA-256 contenu : `4ebddc93e4cca037d365a0890ef794a9e8e87cb1aad063d280b1ac5106fddaec`
- Statut : inventaire uniquement, aucune bascule runtime.

## Comptage

| Espace | Unites |
| --- | ---: |
| Administration | 44 |
| Public | 13 |
| Educateur | 7 |
| Adherent | 6 |
| **Total** | **70** |

## Regle de lecture

Le chemin cible est une destination de migration, pas encore un fichier actif. Chaque unite restera sur le monolithe tant que ses dependances CSS/JS/donnees ne sont pas isolees et testees.

## Administration

| ID source | Libelle navigation | Titre detecte | Chemin cible | Statut |
| --- | --- | --- | --- | --- |
| `dashboard` | 🏠 Dashboard | CLUB EXEMPLE Manager | `client/pages/admin/dashboard.html` | `inventory_only` |
| `statistics` | 📊 Statistiques | Tableau de bord statistique | `client/pages/admin/statistics.html` | `inventory_only` |
| `statistics-members` | — | Détail de la répartition des licenciés | `client/pages/admin/statistics-members.html` | `inventory_only` |
| `statistics-members-advanced` | — | Statistiques licenciés avancées | `client/pages/admin/statistics-members-advanced.html` | `inventory_only` |
| `statistics-teams` | — | Statistiques sportives par équipe | `client/pages/admin/statistics-teams.html` | `inventory_only` |
| `statistics-results` | — | Analyse des résultats | `client/pages/admin/statistics-results.html` | `inventory_only` |
| `statistics-discipline` | — | Statistiques discipline | `client/pages/admin/statistics-discipline.html` | `inventory_only` |
| `statistics-opponents` | — | Statistiques adversaires | `client/pages/admin/statistics-opponents.html` | `inventory_only` |
| `statistics-data` | — | Qualité des données | `client/pages/admin/statistics-data.html` | `inventory_only` |
| `members` | 👥 Licenciés | Licenciés | `client/pages/admin/members.html` | `inventory_only` |
| `memberdetail` | — | Licencié | `client/pages/admin/memberdetail.html` | `inventory_only` |
| `teams` | 🧩 Équipes | Équipes | `client/pages/admin/teams.html` | `inventory_only` |
| `teamdetailadmin` | — | Détail équipe | `client/pages/admin/teamdetailadmin.html` | `inventory_only` |
| `matches` | 🗓️ Matchs | Matchs | `client/pages/admin/matches.html` | `inventory_only` |
| `matchdetail` | — | Détail du match | `client/pages/admin/matchdetail.html` | `inventory_only` |
| `opponents` | 🛡️ Clubs adverses | Clubs adverses | `client/pages/admin/opponents.html` | `inventory_only` |
| `opponentdetail` | — | Club adverse | `client/pages/admin/opponentdetail.html` | `inventory_only` |
| `planning` | 📆 Planning global | Planning global | `client/pages/admin/planning.html` | `inventory_only` |
| `cms` | 📰 Actualités CMS | Actualités & CMS | `client/pages/admin/cms.html` | `inventory_only` |
| `communication` | 📢 Multicanal | Communication multicanal | `client/pages/admin/communication.html` | `inventory_only` |
| `media` | 🖼️ Médiathèque | Médiathèque avancée | `client/pages/admin/media.html` | `inventory_only` |
| `visual` | 🎨 Générateur visuel | Générateur graphique complet | `client/pages/admin/visual.html` | `inventory_only` |
| `transfer` | ⇄ Comparer avant transfert | Comparer avant transfert — V1.23.3 | `client/pages/admin/transfer.html` | `inventory_only` |
| `readiness` | 🔎 Diagnostic & partage | Diagnostic & partage — V1.24.5 | `client/pages/admin/readiness.html` | `inventory_only` |
| `continuity` | 💾 Données & sauvegarde | Données & sauvegarde — V1.24.5 | `client/pages/admin/continuity.html` | `inventory_only` |
| `import` | — | Importation Excel / CSV | `client/pages/admin/import.html` | `inventory_only` |
| `footclubsui` | 🧩 Plugin d’interface | Plugin d’interface · Footclubs UI | `client/pages/admin/footclubsui.html` | `inventory_only` |
| `fffcontrol` | 🔗 Sources FFF | Sources FFF & contrôle des matchs | `client/pages/admin/fffcontrol.html` | `inventory_only` |
| `importwatch` | 📥 Importations & suivi | Importations & suivi | `client/pages/admin/importwatch.html` | `inventory_only` |
| `documents` | 📄 Documents LRF / FFF | Documents officiels LRF — Saison 2026 | `client/pages/admin/documents.html` | `inventory_only` |
| `discipline` | 🟥 Discipline | Discipline du club | `client/pages/admin/discipline.html` | `inventory_only` |
| `admincheck` | ✅ Contrôle administratif | Contrôle administratif | `client/pages/admin/admincheck.html` | `inventory_only` |
| `regcheck` | ⚖️ Contrôle réglementaire | Contrôle réglementaire des licenciés | `client/pages/admin/regcheck.html` | `inventory_only` |
| `accounts` | 👤 Comptes utilisateurs | Comptes utilisateurs | `client/pages/admin/accounts.html` | `inventory_only` |
| `accountdetail` | — | Compte | `client/pages/admin/accountdetail.html` | `inventory_only` |
| `permissions` | 🔑 Permissions | Matrice des permissions | `client/pages/admin/permissions.html` | `inventory_only` |
| `auditlog` | 🧾 Journal des actions | Journal & audit | `client/pages/admin/auditlog.html` | `inventory_only` |
| `accessadmin` | 🛂 Comptes & permissions | Administration des accès | `client/pages/admin/accessadmin.html` | `inventory_only` |
| `accessaudit` | 🧪 Audit des accès | Audit des accès & préparation backend | `client/pages/admin/accessaudit.html` | `inventory_only` |
| `automation` | 🤖 Automatisations | Automatisations CLUB EXEMPLE | `client/pages/admin/automation.html` | `inventory_only` |
| `alerts` | 🚨 Centre des alertes | Centre des alertes | `client/pages/admin/alerts.html` | `inventory_only` |
| `clubsettings` | 🏟️ Paramétrage du club | Paramétrage du club | `client/pages/admin/clubsettings.html` | `inventory_only` |
| `settings` | ⚙️ Paramètres | Configuration | `client/pages/admin/settings.html` | `inventory_only` |
| `documentcenter` | 🗂️ Centre documentaire | Documents & administration | `client/pages/admin/documentcenter.html` | `inventory_only` |

## Public

| ID source | Libelle navigation | Titre detecte | Chemin cible | Statut |
| --- | --- | --- | --- | --- |
| `public-home` | — | CLUB EXEMPLE UN CLUB, UN ÉCOSYSTÈME. | `client/pages/public/home.html` | `inventory_only` |
| `public-coach` | — | Connexion éducateur | `client/pages/public/coach.html` | `inventory_only` |
| `public-news` | — | Actualités | `client/pages/public/news.html` | `inventory_only` |
| `public-programme` | — | Programme & résultats | `client/pages/public/programme.html` | `inventory_only` |
| `public-teams` | — | Nos équipes & compétitions | `client/pages/public/teams.html` | `inventory_only` |
| `public-teamdetail` | — | Équipe | `client/pages/public/teamdetail.html` | `inventory_only` |
| `public-history` | — | Notre Histoire | `client/pages/public/history.html` | `inventory_only` |
| `public-charter` | — | Notre Charte | `client/pages/public/charter.html` | `inventory_only` |
| `public-actions` | — | Nos actions | `client/pages/public/actions.html` | `inventory_only` |
| `public-shop` | — | Boutique | `client/pages/public/shop.html` | `inventory_only` |
| `public-coach-entry` | — | Portail éducateurs | `client/pages/public/coach-entry.html` | `inventory_only` |
| `public-member` | — | Connexion adhérent | `client/pages/public/member.html` | `inventory_only` |
| `public-links` | — | Liens utiles | `client/pages/public/links.html` | `inventory_only` |

## Educateur

| ID source | Libelle navigation | Titre detecte | Chemin cible | Statut |
| --- | --- | --- | --- | --- |
| `coach-home` | — | Tableau de bord | `client/pages/coach/home.html` | `inventory_only` |
| `coach-roster` | — | Effectif | `client/pages/coach/roster.html` | `inventory_only` |
| `coach-matches` | — | Matchs de l’équipe | `client/pages/coach/matches.html` | `inventory_only` |
| `coach-callups` | — | Convocations | `client/pages/coach/callups.html` | `inventory_only` |
| `coach-lineup` | — | Composition d’équipe | `client/pages/coach/lineup.html` | `inventory_only` |
| `coach-training` | — | Entraînements & présences | `client/pages/coach/training.html` | `inventory_only` |
| `coach-contacts` | — | Contacts familles | `client/pages/coach/contacts.html` | `inventory_only` |

## Adherent

| ID source | Libelle navigation | Titre detecte | Chemin cible | Statut |
| --- | --- | --- | --- | --- |
| `portal-home` | — | Bienvenue | `client/pages/member/home.html` | `inventory_only` |
| `portal-profile` | — | Mon profil | `client/pages/member/profile.html` | `inventory_only` |
| `portal-matches` | — | Matchs & convocations | `client/pages/member/matches.html` | `inventory_only` |
| `portal-documents` | — | Mes documents | `client/pages/member/documents.html` | `inventory_only` |
| `portal-payments` | — | Mes paiements | `client/pages/member/payments.html` | `inventory_only` |
| `portal-messages` | — | Messages du club | `client/pages/member/messages.html` | `inventory_only` |

