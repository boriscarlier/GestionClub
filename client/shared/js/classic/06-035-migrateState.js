function migrateState(){
  if(!Array.isArray(state.members))state.members=[];
  if(!Array.isArray(state.matches))state.matches=[];
  if(!Array.isArray(state.opponents))state.opponents=[];
  if(!Array.isArray(state.discipline))state.discipline=[];
  state.teams.forEach(t=>{
    if(!t.group){
      t.group=t.name==='Féminines'?'feminines':(t.name.startsWith('U')?'jeunes':'seniors');
    }
    if(typeof t.rosterPublic==='undefined') t.rosterPublic=!!t.public;
    if(!t.coach) t.coach='Éducateur à renseigner';
    if(!t.assistant) t.assistant='Adjoint à renseigner';
    if(!t.manager) t.manager='Dirigeant à renseigner';
    if(!t.ground) t.ground='Stade Municipal';
    if(!t.training) t.training='Planning à renseigner';
  });
  state.members.forEach(m=>{
   if(typeof m.public==='undefined')m.public=false;
   const sd=m.sourceData&&typeof m.sourceData==='object'?m.sourceData:{};
   const sourceVal=(...names)=>{
    const wanted=names.map(norm);
    const key=Object.keys(sd).find(k=>wanted.includes(norm(k)));
    return key!==undefined?sd[key]:'';
   };
   if(!m.stampCode)m.stampCode=sourceVal('Cachet code','Code cachet')||'';
   if(!m.stampLabel)m.stampLabel=sourceVal('Cachet libellé','Cachet libelle','Libellé cachet','Libelle cachet')||'';
   if(!m.stampStartDate)m.stampStartDate=normalizeDateCell(sourceVal('Cachet date de début','Cachet date de debut','Date début cachet','Date debut cachet'))||'';
   if(!m.stampEndDate)m.stampEndDate=normalizeDateCell(sourceVal('Cachet date de fin','Date fin cachet'))||'';

   const stampEmpty=!m.stampCode&&!m.stampLabel&&!m.stampStartDate&&!m.stampEndDate;
   const hist=norm([
    m.history,m.clubHistory,m.historyClub,m.historique,m.historiqueClub,
    m.previousStatus,m.formerClubHistory,
    sd['Historique'],sd['Historique club'],sd['Historique / club']
   ].filter(Boolean).join(' '));
   const notMutated=hist.includes('non mute')||hist.includes('non muté')||hist.includes('non mutation')||hist.includes('pas mute')||hist.includes('pas muté');
   if(stampEmpty||notMutated){
    m.mutationVerificationMode='automatic';
    m.mutationVerified=true;
    if(!m.mutationVerifiedAt)m.mutationVerifiedAt=new Date().toISOString();
   }
  });
  if(!state.rankings) state.rankings=JSON.parse(JSON.stringify(defaults.rankings||{}));
  if(!state.planning) state.planning=JSON.parse(JSON.stringify(defaults.planning||[]));
  if(!state.importHistory) state.importHistory=[];
  if(!state.importRegistry) state.importRegistry={};
  if(!state.importFreshness) state.importFreshness={members:30,matches:14,discipline:14,opponents:90,clubprofile:180};
  if(state.importFreshness.clubprofile==null)state.importFreshness.clubprofile=180;
  if(!state.discipline) state.discipline=[];
  if(!state.accounts) state.accounts=[];
  state.accounts.forEach(a=>{
   if(!Array.isArray(a.roles))a.roles=[];
   if(!a.scope)a.scope={type:'club',teams:[]};
   if(!Array.isArray(a.scope.teams))a.scope.teams=[];
   if(!a.status)a.status='active';
   if(!a.createdAt)a.createdAt=new Date().toISOString();
   if(!a.updatedAt)a.updatedAt=a.createdAt;
  });

  if(!state.auditLog) state.auditLog=[];
  state.auditLog=state.auditLog.map(x=>({
   id:x.id||uid('log'),
   at:x.at||new Date().toISOString(),
   accountId:x.accountId||'',
   user:x.user||'Mode local',
   module:x.module||'Système',
   action:x.action||'Action',
   detail:x.detail||''
  }));

  if(!state.clubProfile) state.clubProfile={official:{},manual:{},source:null,history:[]};
  if(!state.clubProfile.official)state.clubProfile.official={};
  if(!state.regulatoryReviewState)state.regulatoryReviewState={};
  if(!state.clubProfile.manual)state.clubProfile.manual={};
  if(!Array.isArray(state.clubProfile.history))state.clubProfile.history=[];

  if(!state.permissionMatrix) state.permissionMatrix={
   president:'*',
   admin:'*',
   secretary:{members:['view','create','edit'],teams:['view'],matches:['view'],documents:['view','create','edit'],imports:['view'],clubsettings:['view','edit']},
   treasurer:{members:['view'],documents:['view'],statistics:['view']},
   sport:{members:['view'],teams:['view','create','edit'],matches:['view','create','edit'],discipline:['view'],statistics:['view']},
   coach:{members:['view'],teams:['view'],matches:['view'],statistics:['view']},
   manager:{members:['view'],teams:['view'],matches:['view'],statistics:['view']},
   communication:{communication:['view','create','edit','delete'],media:['view','create','edit','delete'],visual:['view','create','edit'],statistics:['view']},
   readonly:{dashboard:['view'],statistics:['view']}
  };
  if(!state.roles) state.roles=[
   {id:'president',name:'Président',system:true},
   {id:'admin',name:'Administrateur',system:true},
   {id:'secretary',name:'Secrétaire',system:true},
   {id:'treasurer',name:'Trésorier',system:true},
   {id:'sport',name:'Responsable sportif',system:true},
   {id:'coach',name:'Éducateur',system:true},
   {id:'manager',name:'Dirigeant',system:true},
   {id:'communication',name:'Communication',system:true},
   {id:'readonly',name:'Lecture seule',system:true}
  ];
  if(!state.automationRules) state.automationRules=[];
  if(!state.automationProposals) state.automationProposals=[];
  if(!state.automationLog) state.automationLog=[];
  if(!Array.isArray(state.posts))state.posts=[];
  state.posts.forEach(p=>{
   if(!p.status)p.status='Brouillon';
   if(!p.channels)p.channels={site:true,facebook:false,instagram:false,youtube:false,whatsapp:false};
   if(!p.channelVariants)p.channelVariants={};
  });


  ensurePortalDemoData();
}

