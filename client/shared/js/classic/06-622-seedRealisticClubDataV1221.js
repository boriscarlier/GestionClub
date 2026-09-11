function seedRealisticClubDataV1221(){
 state.prototypeSeedVersions=state.prototypeSeedVersions||{};
 if(state.prototypeSeedVersions.sports)return;
 state.prototypeSeedVersions.sports=QA_BUILD;
 if((state.members||[]).some(m=>m.sourceFormat&&!['DEMO','REALISTIC_2026'].includes(m.sourceFormat)))return;

 try{
  if(!Array.isArray(state.teams))state.teams=[];
  const teamNames=['Seniors 1','Seniors 2','Féminines','U17','U15','U14','U13','U11','U9','U7','Vétérans'];
  teamNames.forEach((name,i)=>{
   if(!state.teams.some(t=>norm(t.name)===norm(name))){
    state.teams.push({
     id:'real_team_'+i,name,
     competition:name==='Seniors 1'?'R3':name==='Seniors 2'?'R3 Réserve':name==='Féminines'?'R1 Féminine':name==='Vétérans'?'Vétérans 42 ans':name,
     group:(/^U/.test(name)?'jeunes':'seniors'),
     ground:'Stade Municipal',public:true,rosterPublic:false,sourceFormat:'REALISTIC_2026'
    });
   }
  });

  const realMatches=[
   {id:'real_r3_20260329',team:'Seniors 1',opponent:'F.C. Plaine des Grègues',date:'2026-03-29',time:'15:30',homeAway:'Extérieur',competition:'R3',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r3_20260405',team:'Seniors 1',opponent:'US Pierrefonds',date:'2026-04-05',time:'15:30',homeAway:'Domicile',place:'Stade Municipal',competition:'R3',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r3_20260426',team:'Seniors 1',opponent:'Vaovao Sport Culturel',date:'2026-04-26',time:'15:30',homeAway:'Domicile',place:'Stade Municipal',competition:'R3',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r3_20260530',team:'Seniors 1',opponent:'FC Ligne Paradis',date:'2026-05-30',time:'20:00',homeAway:'Extérieur',competition:'R3',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r3_20260816',team:'Seniors 1',opponent:'Vaovao Sport Culturel',date:'2026-08-16',time:'15:30',homeAway:'Extérieur',competition:'R3',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r3_20260926',team:'Seniors 1',opponent:'ASC Grands Bois',date:'2026-09-26',time:'20:00',homeAway:'Extérieur',competition:'R3',competitionType:'Championnat',status:'À venir'},

   {id:'real_r3r_20260405',team:'Seniors 2',opponent:'FC Ligne Paradis 2',date:'2026-04-05',time:'13:30',competition:'R3 Réserve',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r3r_20260426',team:'Seniors 2',opponent:'AJ Ligne des Bambous 2',date:'2026-04-26',time:'13:30',competition:'R3 Réserve',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r3r_20260816',team:'Seniors 2',opponent:'AJ Ligne des Bambous 2',date:'2026-08-16',time:'18:00',competition:'R3 Réserve',competitionType:'Championnat',status:'Terminé'},

   {id:'real_r1f_20260328',team:'Féminines',opponent:'AS Saint-Louisienne',date:'2026-03-28',time:'19:00',homeAway:'Domicile',place:'Stade Municipal',competition:'R1 Féminine',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r1f_20260404',team:'Féminines',opponent:'SDEFA',date:'2026-04-04',time:'19:00',homeAway:'Extérieur',competition:'R1 Féminine',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r1f_20260411',team:'Féminines',opponent:'Saint-Pauloise FC',date:'2026-04-11',time:'19:00',homeAway:'Domicile',place:'Stade Municipal',competition:'R1 Féminine',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r1f_20260425',team:'Féminines',opponent:'Saint-Denis FC',date:'2026-04-25',time:'19:00',homeAway:'Extérieur',competition:'R1 Féminine',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r1f_20260502',team:'Féminines',opponent:'La Tamponnaise',date:'2026-05-02',time:'19:00',homeAway:'Domicile',place:'Stade Municipal',competition:'R1 Féminine',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r1f_20260509',team:'Féminines',opponent:"A.S. Jeanne d'Arc",date:'2026-05-09',time:'19:00',homeAway:'Domicile',place:'Stade Municipal',competition:'R1 Féminine',competitionType:'Championnat',status:'Terminé'},
   {id:'real_r1f_20260523',team:'Féminines',opponent:'AF Possession',date:'2026-05-23',time:'19:00',homeAway:'Extérieur',competition:'R1 Féminine',competitionType:'Championnat',status:'Terminé'},

   {id:'real_u17_20260404',team:'U17',opponent:'AS 12ème Km',date:'2026-04-04',time:'15:30',homeAway:'Extérieur',place:'Stade de la Saline les Bains',competition:'U17 Excellence - Poule D',competitionType:'Championnat',fcScore:6,oppScore:0,status:'Terminé'},
   {id:'real_u15_risk_20260905',team:'U15',opponent:'Red Star',date:'2026-09-05',time:'14:00',competition:'U15 Élite Régionale',competitionType:'Championnat',status:'À venir'},
   {id:'real_u17_risk_20260905',team:'U17',opponent:'Red Star',date:'2026-09-05',time:'15:30',competition:'U17 Élite / Excellence',competitionType:'Championnat',status:'À venir'}
  ];

  realMatches.forEach(r=>{
   if(!state.matches.some(m=>m.id===r.id)){
    state.matches.push({...r,public:true,sourceFormat:'REALISTIC_2026'});
   }
  });

  // Résultats sportifs connus, utilisés comme contexte de démonstration sans inventer de score.
  const resultNotes=[
   {id:'real_note_s1',team:'Seniors 1',label:'Classement / bilan',value:'2e'},
   {id:'real_note_s2',team:'Seniors 2',label:'Classement / bilan',value:'5e'},
   {id:'real_note_f',team:'Féminines',label:'Bilan 2025',value:'Montée en R1'},
   {id:'real_note_u15',team:'U15',label:'Classement / bilan',value:'4e'},
   {id:'real_note_vet',team:'Vétérans',label:'Classement / bilan',value:'5e'}
  ];
  state.prototypeRealisticNotes=resultNotes;

  // Planning hebdomadaire réaliste issu des contraintes club.
  const planningSeed=[
   {id:'real_plan_sat_am',day:5,time:'08:00',duration:180,type:'training',title:'École de foot — Baby Foot / U7 / U9 / U10-U11 / U12-U13',team:'École de foot',place:'Stade Municipal',public:true},
   {id:'real_plan_sat_pm_u14',day:5,time:'14:00',duration:120,type:'match',title:'Créneau U14 / jeunes',team:'U14',place:'Stade Municipal',public:true},
   {id:'real_plan_sat_pm_u15',day:5,time:'14:00',duration:120,type:'match',title:'Créneau U15',team:'U15',place:'Stade Municipal',public:true},
   {id:'real_plan_sat_pm_u17',day:5,time:'15:30',duration:120,type:'match',title:'Créneau U17',team:'U17',place:'Stade Municipal',public:true},
   {id:'real_plan_sat_r1f',day:5,time:'19:00',duration:120,type:'match',title:'Créneau R1 Féminine',team:'Féminines',place:'Stade Municipal',public:true},
   {id:'real_plan_sun_r3',day:6,time:'15:30',duration:120,type:'match',title:'Créneau R3 Seniors',team:'Seniors 1',place:'Stade Municipal',public:true}
  ];
  planningSeed.forEach(p=>{
   if(!state.planning.some(x=>x.id===p.id))state.planning.push(p);
  });

  // Des présences réalistes mais anonymisées pour rendre les indicateurs parlants.
  if(!Array.isArray(state.coachTrainingSessions))state.coachTrainingSessions=[];
  const u15Players=(state.members||[]).filter(m=>norm(m.category)==='u15' && norm(m.type||m.licenseType).includes('joueur')).slice(0,10);
  const addSession=(id,date,statuses)=>{
   if(state.coachTrainingSessions.some(s=>s.id===id))return;
   const pids=u15Players.map(p=>p.id);
   const attendance={};
   pids.forEach((pid,i)=>attendance[pid]=statuses[i%statuses.length]);
   state.coachTrainingSessions.push({
    id,team:'U15',title:'Entraînement U15',date,time:'17:00',place:'Stade Municipal',
    playerIds:pids,attendance,createdAt:new Date().toISOString(),createdBy:'demo_member_coach',updatedAt:new Date().toISOString()
   });
  };
  addSession('real_training_u15_0901','2026-09-01',['present','present','present','absent','excused']);
  addSession('real_training_u15_0903','2026-09-03',['present','present','injured','present','present']);

  localStorage.setItem(KEY,JSON.stringify(state));
 }catch(err){
  console.error('Seed realistic data V1.22.1',err);
 }
}
seedRealisticClubDataV1221();

// ===== V1.22.0 — OUTILS DE TEST TABLETTE =====
