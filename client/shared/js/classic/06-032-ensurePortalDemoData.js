function ensurePortalDemoData(){
 state.prototypeSeedVersions=state.prototypeSeedVersions||{};
 if(state.prototypeSeedVersions.base)return;
 state.prototypeSeedVersions.base=QA_BUILD;
 if((state.members||[]).some(m=>m.sourceFormat&&!['DEMO','REALISTIC_2026'].includes(m.sourceFormat)))return;

 if(!Array.isArray(state.members))state.members=[];
 if(!Array.isArray(state.matches))state.matches=[];
 if(!Array.isArray(state.posts))state.posts=[];
 if(!Array.isArray(state.accounts))state.accounts=[];

 const memberId='demo_member_adherent';
 const coachId='demo_member_coach';

 if(!state.members.some(m=>m.id===memberId)){
  state.members.push({
   id:memberId,first:'Alex',last:'DÉMO',fullName:'DÉMO Alex',
   licenseNumber:'TEST-ADHERENT-001',personNumber:'DEMO-PERSON-001',
   birthDate:'2008-05-15',type:'Joueur',licenseType:'Joueur',category:'U17',
   email:'demo.adherent@example.test',phone:'0600000001',public:false,
   paymentState:'Réglé',license:'Validée',status:'Validée',sourceFormat:'DEMO'
  });
 }

 if(!state.members.some(m=>m.id===coachId)){
  state.members.push({
   id:coachId,first:'Camille',last:'DÉMO',fullName:'DÉMO Camille',
   licenseNumber:'TEST-EDUC-001',personNumber:'DEMO-PERSON-002',
   birthDate:'1985-02-10',type:'Éducateur',licenseType:'Éducateur',category:'U15',
   email:'demo.educateur@example.test',phone:'0600000002',public:false,
   license:'Validée',status:'Validée',sourceFormat:'DEMO'
  });
 }

 const u15=(state.teams||[]).find(t=>t.id==='t5'||norm(t.name)==='u15');

 if(!state.matches.some(m=>m.id==='demo_match_u15')){
  state.matches.push({
   id:'demo_match_u15',team:'U15',opponent:'Équipe Démo',
   date:'2026-09-12',time:'14:00',place:'Stade des Jacques',
   competition:'Championnat U15',status:'À venir',public:false,sourceFormat:'DEMO'
  });
 }

 if(!state.posts.some(p=>p.id==='demo_post_portal')){
  state.posts.push({
   id:'demo_post_portal',title:'Message de démonstration',
   text:'Bienvenue dans l’espace de test du FC LA COUR.',
   status:'Publié',
   channels:{site:false,facebook:false,instagram:false,youtube:false,whatsapp:false},
   team:'U15',sourceFormat:'DEMO'
  });
 }

 if(!state.accounts.some(a=>a.id==='demo_account_coach')){
  state.accounts.push({
   id:'demo_account_coach',first:'Camille',last:'DÉMO',
   email:'demo.educateur@example.test',function:'Éducateur U15',
   status:'active',memberId:coachId,roles:['coach'],
   scope:{type:'team',teams:['U15']},
   note:'Compte de démonstration local — ne pas utiliser en production.',
   createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),lastLoginAt:null
  });
 }


 // Jeu de données enrichi pour les tests tablette.
 const demoPlayers=[
  ['demo_u15_01','Lina','PAYET','2011-04-11'],
  ['demo_u15_02','Noah','ROBERT','2011-07-02'],
  ['demo_u15_03','Evan','HOARAU','2012-01-19'],
  ['demo_u15_04','Maya','FONTAINE','2011-11-28'],
  ['demo_u15_05','Lucas','LEBON','2012-03-07'],
  ['demo_u15_06','Emma','CADET','2011-08-15']
 ];
 demoPlayers.forEach((p,index)=>{
  if(!state.members.some(m=>m.id===p[0])){
   state.members.push({
    id:p[0],first:p[1],last:p[2],fullName:`${p[2]} ${p[1]}`,
    licenseNumber:`DEMO-U15-${String(index+1).padStart(2,'0')}`,
    personNumber:`DEMO-P-U15-${String(index+1).padStart(2,'0')}`,
    birthDate:p[3],type:'Joueur',licenseType:'Joueur',category:'U15',
    email:`${p[1].toLowerCase()}.${p[2].toLowerCase()}@example.test`,
    phone:`06000001${String(index+1).padStart(2,'0')}`,
    paymentState:index<4?'Réglé':'À suivre',status:'Validée',license:'Validée',
    public:false,sourceFormat:'DEMO'
   });
  }
 });

 const demoMatches=[
  {id:'demo_u15_played_1',team:'U15',opponent:'AS Démo Sud',date:'2026-08-22',time:'14:00',place:'Stade des Jacques',competition:'Championnat U15 Élite',competitionType:'Championnat',homeAway:'Domicile',fcScore:3,oppScore:1,status:'Terminé'},
  {id:'demo_u15_played_2',team:'U15',opponent:'Olympique Démo',date:'2026-08-29',time:'15:30',place:'Terrain Démo',competition:'Championnat U15 Élite',competitionType:'Championnat',homeAway:'Extérieur',fcScore:2,oppScore:2,status:'Terminé'},
  {id:'demo_u15_upcoming_2',team:'U15',opponent:'FC Horizon TEST',date:'2026-09-19',time:'14:00',place:'Stade des Jacques',competition:'Coupe U15',competitionType:'Coupe',homeAway:'Domicile',status:'À venir'}
 ];
 demoMatches.forEach(dm=>{
  if(!state.matches.some(m=>m.id===dm.id))state.matches.push({...dm,public:false,sourceFormat:'DEMO'});
 });

 if(!state.coachTrainingSessions)state.coachTrainingSessions=[];
 if(!state.coachTrainingSessions.some(s=>s.id==='demo_training_u15_1')){
  const pids=demoPlayers.map(p=>p[0]);
  state.coachTrainingSessions.push({
   id:'demo_training_u15_1',team:'U15',title:'Entraînement technique',date:'2026-09-01',time:'17:00',place:'Stade des Jacques',
   playerIds:pids,
   attendance:{
    demo_u15_01:'present',demo_u15_02:'present',demo_u15_03:'absent',
    demo_u15_04:'present',demo_u15_05:'excused',demo_u15_06:'injured'
   },
   createdAt:new Date().toISOString(),createdBy:coachId,updatedAt:new Date().toISOString()
  });
 }

 if(!state.accounts.some(a=>a.id==='demo_account_admin')){
  state.accounts.push({
   id:'demo_account_admin',first:'Morgan',last:'TEST',
   email:'admin.prototype@example.test',function:'Administrateur prototype',
   status:'active',memberId:'',roles:['admin'],
   scope:{type:'club',teams:[]},
   note:'Compte administrateur de démonstration local — V1.22.0.',
   createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),lastLoginAt:null
  });
 }

 if(!state.permissionMatrix)state.permissionMatrix={};
 if(!state.permissionMatrix.coach){
  state.permissionMatrix.coach={
   dashboard:['view'],members:['view'],teams:['view'],matches:['view'],discipline:['view']
  };
 }

 try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){console.error('Sauvegarde données démo',e)}
}

