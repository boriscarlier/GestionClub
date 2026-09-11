# CLUB EXEMPLE — V1.24.5 — Fiches de convocation

Cette version ajoute une fiche préparatoire par PDF enregistré : joueurs sélectionnés, date, rendez-vous, début, fin, lieu et notes. Elle peut être enregistrée en brouillon ou marquée comme vérifiée. Les données restent sur le serveur ; aucun message ni événement de calendrier n’est envoyé.

## Installer la mise à jour sur votre poste

1. Arrêtez le serveur avec **Ctrl+C**.
2. Sauvegardez son dossier **data**, serveur arrêté.
3. Extrayez le nouveau ZIP dans un dossier temporaire. Lancez **LANCER_TESTS.cmd** : résultat attendu **Ran 73 tests**, puis **OK**.
4. Copiez tous les fichiers **et le dossier vendor** du nouveau paquet dans votre installation existante, par exemple **D:\GESTION_CLUB_Serveur_V1.24.1**. Remplacez les fichiers du programme et conservez **data**. Le dossier peut garder son ancien nom ; le programme affichera V1.24.5.
5. Lancez **DEMARRER_SERVEUR.cmd** depuis cette installation. Connectez-vous dans Brave à **http://127.0.0.1:8765/** et faites **Ctrl+F5**.
6. Vérifiez votre révision et vos informations précédentes. Si aucun nouveau dépôt n’a été effectué, votre référence reste 298 licenciés, 11 équipes et 0 match.

Le lecteur pypdf 6.10.0 est fourni dans vendor avec sa licence. Aucune commande pip ni bibliothèque supplémentaire à installer. Le lanceur Python `py` reste requis.

Si le lanceur demande un nouveau compte alors que vous en possédiez déjà un, arrêtez-le et retrouvez le dossier contenant votre data. Une installation avec l’option personnalisée --data doit conserver ce même chemin.

## Préparer votre convocation

1. Ouvrez **Veille du club**, puis votre PDF dans la liste des documents.
2. Cliquez sur **Ouvrir la fiche de convocation**.
3. Dépliez **Dates repérées dans le PDF**. Vérifiez le contexte et cliquez sur **Utiliser cette date** pour celle de la convocation. Une date repérée peut aussi être une naissance ou une référence historique.
4. Vérifiez les horaires proposés lorsque leurs libellés sont reconnus. Complétez le lieu et l’adresse en lisant le PDF original. Les horaires sont ceux de Territoire Exemple ; cette première fiche couvre un événement sur une seule journée.
5. Vérifiez les joueurs cochés et décochez ceux qui ne doivent pas figurer dans votre fiche.
6. Pour garder un **brouillon**, cliquez sur **Enregistrer la fiche** sans cocher la vérification. Les champs peuvent rester incomplets.
7. Pour marquer la fiche **vérifiée**, complétez le titre, la date, les trois horaires et le lieu, choisissez au moins un joueur, cochez la vérification et enregistrez. Cela indique uniquement votre contrôle du PDF, pas une confirmation de présence du joueur.
8. Rouvrez le document : la fiche doit être conservée. **Télécharger la fiche enregistrée (JSON)** fournit une copie de son dernier état enregistré.

Pour le PDF « Espoirs du Foot — Génération 2014 — 16 sept G2 Dept », vérifiez la date **16 septembre 2026**, le rendez-vous **15h15**, le début **15h30**, la fin **17h30** et le **stade de Casabona, 29 chemin Casabona, 97410 Saint-Pierre**, avec les trois joueurs de la page 3. Ces informations sont à comparer à votre original.

La fiche ne modifie pas la base des licenciés ni les sauvegardes métier. Il n’y a pas encore de rapprochement d’identités, de suivi des présences ni de connexion Google Agenda. L’export JSON n’est pas un fichier de calendrier ni une sauvegarde complète du serveur.

Une analyse PDF différente marque la fiche **à revoir**. Les anciennes sélections sont affichées à titre de référence et les nouvelles cases sont décochées : refaites votre sélection. Une simple modification du statut de lecture ou une réanalyse identique ne la rend pas obsolète. Les modifications concurrentes sont refusées pour éviter l’écrasement d’une fiche.

## Actualiser le PDF déjà enregistré

1. Ouvrez **Veille du club**, puis **Documents PDF — joueurs, mentions et dates**.
2. Cliquez sur votre document dans la liste.
3. Cliquez sur **Réanalyser le PDF enregistré**.
4. Le tableau des joueurs apparaît au-dessus du texte par page. Sur le document « Espoirs du Foot — Génération 2014 — 16 sept G2 Dept », le résultat attendu est **3 joueurs, page 3**.
5. Vérifiez les noms dans l’original. Le fichier, le statut et l’historique du suivi sont conservés ; le résultat d’analyse est remplacé et la réanalyse est journalisée.

Réimporter un PDF identique conserve son analyse précédente : utilisez le bouton de réanalyse pour la mettre à jour. Une erreur d’extraction ou une modification concurrente bloque cette actualisation.

## Premier essai avec un PDF réel

1. Ouvrez **Veille du club**, puis **Documents PDF — joueurs, mentions et dates**.
2. Indiquez éventuellement la source, par exemple « Ligue — convocation reçue par courriel ».
3. Choisissez un PDF déjà téléchargé sur votre ordinateur. Maximum **5 Mo et 40 pages**.
4. Attendez l’aperçu. Dépliez les pages utiles : mentions du club, des Jacques, convocations/détections, formations et réunions, puis dates repérées avec contexte.
5. Comparez le résultat avec votre PDF original. Le numéro désigne la page physique du fichier (première page = 1), pas une pagination imprimée différente.
6. Cochez la confirmation et cliquez sur **Enregistrer le document**. L’original et le résultat sont alors conservés sur le serveur.
7. Ouvrez le document dans la liste, attribuez-lui **À traiter**, puis enregistrez le suivi.
8. Utilisez **Télécharger le PDF original** : il doit être identique au fichier choisi.
9. Réimportez le même PDF : le serveur doit annoncer qu’il existe déjà, sans créer de doublon ni effacer son suivi.
10. Redémarrez le serveur et vérifiez que le document et son suivi sont conservés. Les sauvegardes du club doivent rester inchangées.

Un aperçu n’enregistre rien. Le serveur relit le fichier à la confirmation et vérifie son empreinte. Une copie strictement identique est reconnue même si son nom change ; la première source et le premier nom conservés restent alors utilisés. Un PDF dont les octets changent constitue un autre document, même si son titre semble identique.

## Ce que le repérage signifie

- Seul le texte extractible est lu. **Pas d’OCR** : un scan ou une page vide est signalé comme sans texte extractible. Cela ne signifie pas qu’il ne contient aucune information pertinente.
- Une page peut être illisible ou tronquée. Le résultat le signale ; au plus 15 000 caractères sont conservés par page.
- Les mentions sont détectées par mots-clés. Les joueurs sont relevés uniquement quand les en-têtes et les rectangles des cellules permettent de délimiter le groupe CLUB EXEMPLE. Les autres mises en page, notamment les tableaux sans bordures reconnues ou tournés, restent à vérifier manuellement. Un résultat sans joueur ne prouve pas leur absence. Aucun rapprochement automatique avec vos licenciés. Le texte brut peut rester dans un ordre différent de l’original.
- Les dates numériques jour/mois/année et les dates françaises avec année explicite sont repérées. Pas d’interprétation de « demain », des années manquantes ou de toutes les plages horaires.
- Une date peut correspondre à une naissance, une échéance ou un événement passé. **Aucun événement n’est créé automatiquement**, aucune convocation n’est considérée comme validée par cette seule analyse.
- L’analyse s’exécute dans un processus séparé, avec interruption après 12 secondes. Sous Windows, ce n’est pas un bac à sable complet ni une garantie de plafond mémoire.
- Les PDF chiffrés/protégés sont refusés dans cette version. Les scripts PDF ne sont pas exécutés par le moteur d’extraction.

## Accès et conservation

| Rôle | Documents PDF |
| --- | --- |
| admin / editor | Examiner, enregistrer, réanalyser, consulter, télécharger, modifier le suivi et préparer les fiches |
| reader | Consulter et télécharger les documents et fiches enregistrés |

Les documents peuvent contenir des données personnelles. Tous les comptes serveur autorisés peuvent les consulter, comme les sauvegardes complètes du club. Il n’existe pas encore de restriction par équipe. Les fichiers et résultats restent dans votre dossier data ; aucun envoi externe ni accès Gmail n’est effectué.

Limite du fonds documentaire : **100 PDF ou 100 Mo d’originaux**. Aucun effacement automatique. La suppression/gestion fine des archives n’est pas fournie dans ce premier bloc.

**Exporter les liens JSON** exporte uniquement la veille des pages web. Il n’inclut pas les PDF. Les sauvegardes complètes issues du HTML Gestion Club n’incluent pas non plus les comptes serveur et les documents de veille.

Pour sauvegarder le serveur entier, arrêtez-le puis copiez **data** : comptes, révisions, liens, PDF originaux, analyses et suivis sont dans **club.sqlite3**. Le stockage n’est pas chiffré ; conservez cette copie dans un emplacement protégé.

Pour revenir à la version précédente, gardez ensemble les anciens fichiers du programme et la copie de data réalisée avant la mise à jour. Une restauration de cette copie revient à cet instant et ne contient pas les opérations effectuées depuis.

## Veille web conservée

La mairie reste programmée tous les 7 jours tant que le PC est éveillé et le serveur lancé. La Ligue reste en collecte manuelle au départ ; le refus HTTP 403 de son site n’est pas corrigé par ce bloc PDF.

L’import de la page Ligue enregistrée dans Brave se trouve toujours dans **Importer une page Ligue enregistrée dans Brave**. Choisissez le HTML, examinez les liens puis confirmez. Votre capture test connue comporte 56 liens uniques. Une collecte manuelle ne vaut pas une collecte réseau réussie ; la provenance est déclarée, et la date d’import ne vaut pas date de publication.

Gmail, le téléchargement automatique des pièces jointes, l’OCR et l’intégration au calendrier restent des étapes ultérieures.

## HTML Gestion Club et première installation

Le HTML fourni porte V1.24.5 et garde ses 31 entrées de navigation. Le lien vers la veille est dans **Importations & suivi**. Pour mettre à jour votre HTML habituel, conservez une sauvegarde complète et l’ancien fichier, puis remplacez-le au même emplacement, sous le même nom et avec le même profil Brave. Ouvrir un HTML depuis un autre dossier peut présenter une autre base locale.

Pour une première installation serveur uniquement, le lanceur demande de créer le premier administrateur. Mot de passe d’au moins 12 caractères, saisie invisible. AJOUTER_COMPTE.cmd et CHANGER_MOT_DE_PASSE.cmd restent disponibles. Les comptes du HTML n’accordent pas de droits serveur.

Le serveur écoute uniquement sur **127.0.0.1:8765**. Aucun port du routeur n’est requis pour ces essais. L’accès distant demeure un chantier distinct.

## Validation

**73 tests automatisés réussis** dans l’environnement de développement. Les 64 contrôles précédents sont complétés par neuf scénarios couvrant les fiches : préparation sans écriture, sauvegarde et réouverture, brouillons, dates et horaires invalides, sélection de joueurs issue du PDF, conflits, changements d’analyse, droits et contrôle de session.

La lecture des trois joueurs du PDF réel a été vérifiée dans la version précédente. Les tests du paquet utilisent des noms fictifs. La nouvelle interface et les lanceurs Windows restent à confirmer dans Brave sur votre poste. Ces contrôles ne qualifient pas les imports métier historiques de Gestion Club.
