function renderCommunication(){
 renderCommunicationWorkflowSummary();
 renderCommunicationChannelSummary();
  if(!document.getElementById('commBoard')) return;

  var statuses = ['Brouillon','À valider','Programmé','Publié'];
  var counts = {};
  statuses.forEach(function(s){ counts[s]=0; });

  state.posts.forEach(function(p){
    var s = normalizePostStatus(p.status);
    if(typeof counts[s] !== 'undefined') counts[s]++;
  });

  document.getElementById('commDraft').textContent = counts['Brouillon'];
  document.getElementById('commReview').textContent = counts['À valider'];
  document.getElementById('commScheduled').textContent = counts['Programmé'];
  document.getElementById('commPublished').textContent = counts['Publié'];

  document.getElementById('commBoard').innerHTML = statuses.map(function(status){
    var items = state.posts.filter(function(p){ return normalizePostStatus(p.status)===status; });
    var inner = items.length ? items.map(function(p){
      var buttons = '';
      if(status!=='Publié'){
        buttons += '<button class="secondary" onclick="advancePostStatus(\''+p.id+'\')">Étape suivante</button>';
      }
      return '<div class="comm-item"><strong>'+p.title+'</strong><div class="tiny">'+qaChannels(p).join(' • ')+'</div><div class="comm-actions">'+buttons+'</div></div>';
    }).join('') : '<div class="tiny">Aucun contenu.</div>';
    return '<div class="comm-col"><h4>'+status+'</h4>'+inner+'</div>';
  }).join('');

  var p = state.posts.length ? state.posts[0] : null;
  if(!p){
    document.getElementById('commPreview').innerHTML = '<div class="tiny">Aucun contenu disponible.</div>';
    return;
  }

  var channels = ['Site','Facebook','Instagram'];
  document.getElementById('commPreview').innerHTML = channels.map(function(c){
    var badgeClass = c==='Instagram' ? 'purple' : (c==='Facebook' ? 'blue' : 'green');
    return '<div class="box"><span class="badge '+badgeClass+'">'+c+'</span><p>'+adaptPostText(p,c)+'</p></div>';
  }).join('');
}


let importWorkbook=null;
let importRawRows=[];
let importRows=[];
let importFileName='';

const importSchemas={
 members:{
  label:'Licenciés',
  fields:[
   {key:'personNumber',label:'Numéro personne',aliases:['numero personne','numéro personne']},
   {key:'licenseNumber',label:'Numéro licence',aliases:['numero licence','numéro licence']},
   {key:'last',label:'Nom',aliases:['nom']},
   {key:'first',label:'Prénom',aliases:['prenom','prénom']},
   {key:'title',label:'Civilité',aliases:['civilite','civilité']},
   {key:'fullName',label:'Nom, prénom',aliases:['nom, prénom','nom prenom']},
   {key:'birthDate',label:'Né(e) le',aliases:['ne(e) le','né(e) le']},
   {key:'birthPlace',label:'Lieu de naissance',aliases:['lieu de naissance']},
   {key:'sex',label:'Sexe',aliases:['sexe']},
   {key:'nationality',label:'Nationalité',aliases:['nationalite','nationalité']},
   {key:'photoStatus',label:'Statut photo',aliases:['statut photo']},
   {key:'photoUploadDate',label:'Date photo',aliases:['date mise en ligne photo']},
   {key:'medicalValidity',label:'Certificat médical N+1',aliases:['validite certif medic n+1','validité certif médic n+1']},
   {key:'addressExtra',label:'Complément',aliases:['complement','complément']},
   {key:'street',label:'Voie-rue',aliases:['voie-rue']},
   {key:'locality',label:'Lieu-dit',aliases:['lieu-dit']},
   {key:'postalCode',label:'Code postal',aliases:['code postal']},
   {key:'postOffice',label:'Bureau distributeur',aliases:['bureau distributeur_2']},
   {key:'country',label:'Pays ou DOM-TOM',aliases:['pays ou dom-tom']},
   {key:'inseeCode',label:'Code INSEE',aliases:['code insee']},
   {key:'registrationDate',label:'Enregistrement',aliases:['enregistrement']},
   {key:'licenseIssueDate',label:'Date édition licence',aliases:['date edition licence','date édition licence']},
   {key:'categoryCode',label:'Code catégorie',aliases:['code categorie','code catégorie']},
   {key:'subcategory',label:'Sous catégorie',aliases:['sous categorie','sous catégorie']},
   {key:'status',label:'Statut',aliases:['statut']},
   {key:'nextStatus',label:'Statut suivant',aliases:['statut suivant']},
   {key:'clubChangeNature',label:'Nature changement de club',aliases:['nature changement de club']},
   {key:'requestNature',label:'Nature de demande',aliases:['nature de demande']},
   {key:'stampCode',label:'Cachet code',aliases:['cachet code','code cachet','Cachet (code)']},
   {key:'stampLabel',label:'Cachet libellé',aliases:['cachet libelle','cachet libellé','libelle cachet','libellé cachet','Cachet (libellé)']},
   {key:'stampStartDate',label:'Cachet date de début',aliases:['cachet date de debut','cachet date de début','date debut cachet','date début cachet','Cachet (date de début)']},
   {key:'stampEndDate',label:'Cachet date de fin',aliases:['cachet date de fin','date fin cachet','Cachet (date de fin)']},
   {key:'licenseType',label:'Type licence',aliases:['type licence']},
   {key:'formerClub',label:'Club quitté',aliases:['club quitte','club quitté']},
   {key:'formerClubSeason',label:'Saison club quitté',aliases:['saison club quitte','saison club quitté']},
   {key:'priceApplied',label:'Prix appliqué',aliases:['prix applique','prix appliqué']},
   {key:'clubPrice',label:'Prix club',aliases:['prix club']},
   {key:'paymentAmount',label:'Montant règlement',aliases:['montant reglement','montant règlement']},
   {key:'paymentState',label:'Etat règlement',aliases:['etat reglement','état règlement']},
   {key:'paymentDate',label:'Date règlement',aliases:['date reglement','date règlement']},
   {key:'paymentLabel',label:'Libellé règlement',aliases:['libelle reglement','libellé règlement']},
   {key:'paymentMode',label:'Mode de règlement',aliases:['mode de reglement','mode de règlement']},
   {key:'homePhone',label:'Téléphone domicile',aliases:['telephone domicile','téléphone domicile']},
   {key:'workPhone',label:'Téléphone travail',aliases:['telephone travail','téléphone travail']},
   {key:'mobile',label:'Mobile personnel',aliases:['mobile personnel']},
   {key:'email',label:'Email principal',aliases:['email principal']},
   {key:'emailStatus',label:'Statut email principal',aliases:['statut email principal']},
   {key:'otherEmail',label:'Email autre',aliases:['email autre']},
   {key:'refereeCategory',label:'Catégorie arbitre',aliases:['categorie arbitre','catégorie arbitre']},
   {key:'refereeRemovalDate',label:'Date radiation arbitre',aliases:['date radiation arbitre']},
   {key:'refereeFirstLicenseDate',label:'Première licence arbitre',aliases:['date premiere licence arbitre','date première licence arbitre']},
   {key:'refereeDesignation',label:'Désignation',aliases:['designation','désignation']},
   {key:'clubNumber',label:'Numéro club',aliases:['numero','numéro']},
   {key:'clubName',label:'Nom du club',aliases:['nom du club']},
   {key:'guardian1Name',label:'Représentant légal 1',aliases:['nom, prénom repr légal 1','nom, prenom repr legal 1']},
   {key:'guardian1Mobile',label:'Mobile repr légal 1',aliases:['tel mobile repr legal 1','tel mobile repr légal 1']},
   {key:'guardian1Email',label:'Email repr légal 1',aliases:['email repr legal 1','email repr légal 1']},
   {key:'guardian2Name',label:'Représentant légal 2',aliases:['nom, prénom repr légal 2','nom, prenom repr legal 2']},
   {key:'guardian2Mobile',label:'Mobile repr légal 2',aliases:['tel mobile repr legal 2','tel mobile repr légal 2']},
   {key:'guardian2Email',label:'Email repr légal 2',aliases:['email repr legal 2','email repr légal 2']}
  ],
  required:['licenseNumber','last','first'],
  identity:r=>r.licenseNumber?`lic:${norm(r.licenseNumber)}`:`fallback:${norm(r.personNumber)}|${norm(r.last)}|${norm(r.first)}|${norm(r.licenseType)}`
 }, teams:{
  label:'Équipes',
  fields:[
   {key:'name',label:'Nom équipe',aliases:['equipe','équipe','nom equipe','nom équipe','name']},
   {key:'competition',label:'Compétition',aliases:['competition','compétition','championnat']},
   {key:'group',label:'Groupe',aliases:['groupe','group','type']},
   {key:'coach',label:'Éducateur',aliases:['educateur','éducateur','coach','entraineur','entraîneur']},
   {key:'assistant',label:'Adjoint',aliases:['adjoint','assistant']},
   {key:'manager',label:'Dirigeant',aliases:['dirigeant','manager']},
   {key:'ground',label:'Terrain',aliases:['terrain','stade','ground']},
   {key:'training',label:'Entraînement',aliases:['entrainement','entraînement','training']},
   {key:'public',label:'Public',aliases:['public','publier','visible']}
  ],
  required:['name'],
  identity:r=>norm(r.name)
 },
 matches:{
  label:'Matchs',
  fields:[
   {key:'matchNumber',label:'Numéro match',aliases:['numero match','numéro match']},
   {key:'competition',label:'Compétition',aliases:['competition','compétition','competition / phase','compétition / phase']},
   {key:'phaseNumber',label:'Numéro phase',aliases:['numero phase','numéro phase']},
   {key:'phase',label:'Phase',aliases:['phase']},
   {key:'poolCode',label:'Code poule',aliases:['poule(code)','code poule']},
   {key:'pool',label:'Poule',aliases:['poule']},
   {key:'dayNumber',label:'Numéro journée',aliases:['numero de journee','numéro de journée']},
   {key:'roundNumber',label:'Numéro tour',aliases:['numero de tour','numéro de tour']},
   {key:'round',label:'Tour',aliases:['tour']},
   {key:'shortName',label:'Nom abrégé',aliases:['nom abrege','nom abrégé']},
   {key:'date',label:'Date',aliases:['date','jour','date du match']},
   {key:'time',label:'Heure',aliases:['heure','time','horaire','heure du match']},
   {key:'leg',label:'Aller / Retour',aliases:['aller-retour','aller retour']},
   {key:'homeAway',label:'Recevant / visiteur',aliases:['recevant-visiteur','recevant / visiteur']},
   {key:'team',label:'Équipe interne',aliases:['equipe','équipe','team']},
   {key:'sourceTeam',label:'Équipe source',aliases:['equipe locale','équipe locale']},
   {key:'opponentClub',label:'Club adverse',aliases:['club adverse']},
   {key:'opponent',label:'Équipe adverse',aliases:['equipe adverse','équipe adverse','adversaire','opponent']},
   {key:'opponentCity',label:'Localité adverse',aliases:['localite club adverse','localité club adverse']},
   {key:'teamsLabel',label:'Affiche',aliases:['equipes','équipes']},
   {key:'place',label:'Installation',aliases:["nom de l'installation",'terrain','stade','lieu','place']},
   {key:'venueCity',label:'Localité installation',aliases:['localite installation','localité installation']},
   {key:'addressExtra',label:'Complément',aliases:['complement','complément']},
   {key:'street',label:'Voie-rue',aliases:['voie-rue','voie rue']},
   {key:'locality',label:'Lieu-dit',aliases:['lieu-dit','lieu dit']},
   {key:'postalCode',label:'Code postal',aliases:['code postal']},
   {key:'postOffice',label:'Bureau distributeur',aliases:['bureau distributeur']},
   {key:'receiverScore',label:'Résultat recevant',aliases:['resultat recevant','résultat recevant']},
   {key:'visitorScore',label:'Résultat visiteur',aliases:['resultat visiteur','résultat visiteur']},
   {key:'receiverPens',label:'TAB recevant',aliases:['tirs au but recevant']},
   {key:'visitorPens',label:'TAB visiteur',aliases:['tirs au but visiteur']},
   {key:'shortestDistance',label:'Distance aller courte',aliases:['distance aller la plus courte']},
   {key:'fastestDistance',label:'Distance aller rapide',aliases:['distance aller la plus rapide']},
   {key:'rescheduleStatus',label:'Reporté / rejoué',aliases:['reporte-rejoue','reporté-rejoué']},
   {key:'rescheduleDate',label:'Date report',aliases:['date report']}
  ],
  required:['date','team','opponent'],
  identity:r=>r.matchNumber?`match:${norm(r.matchNumber)}`:`fallback:${norm(r.date)}|${norm(r.team)}|${norm(r.opponent)}|${norm(r.competition)}`
 }, planning:{
  label:'Planning',
  fields:[
   {key:'day',label:'Jour',aliases:['jour','day','jour semaine','jour_semaine']},
   {key:'time',label:'Heure',aliases:['heure','time','horaire']},
   {key:'duration',label:'Durée min',aliases:['duree','durée','duration','minutes']},
   {key:'type',label:'Type',aliases:['type','nature']},
   {key:'title',label:'Titre',aliases:['titre','title','objet']},
   {key:'team',label:'Équipe',aliases:['equipe','équipe','team']},
   {key:'place',label:'Lieu',aliases:['lieu','terrain','place']},
   {key:'public',label:'Public',aliases:['public','publier','visible']}
  ],
  required:['day','time','title'],
  identity:r=>`${norm(r.day)}|${norm(r.time)}|${norm(r.title)}`
 },
 posts:{
  label:'Actualités',
  fields:[
   {key:'title',label:'Titre',aliases:['titre','title']},
   {key:'text',label:'Texte',aliases:['texte','text','contenu','content']},
   {key:'category',label:'Catégorie',aliases:['categorie','catégorie','category']},
   {key:'status',label:'Statut',aliases:['statut','status']},
   {key:'featured',label:'À la une',aliases:['a la une','à la une','featured']},
   {key:'channels',label:'Canaux',aliases:['canaux','channels','diffusion']}
  ],
  required:['title'],
  identity:r=>norm(r.title)
 }
};

