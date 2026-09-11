function updateReimportProgress(type){
 const reg=state.importRegistry?.[type];
 if(reg?.importedAt){
  reg.reimportRequired=false;
 }

 if(state.reimportMode?.active){
  const order=state.reimportMode.order||['members','matches','discipline','opponents'];
  const done=order.every(t=>{
   const r=state.importRegistry?.[t];
   return !!r?.importedAt && r?.reimportRequired===false;
  });
  if(done){
   state.reimportMode.active=false;
   state.reimportMode.completedAt=new Date().toISOString();
  }
 }

 localStorage.setItem(KEY,JSON.stringify(state));
 if(typeof renderResetImportModeBanner==='function')renderResetImportModeBanner();
}

const IMPORT_SOURCE_DEFS={
 members:{label:'Licenciés',icon:'👥',thresholdKey:'members',target:'members'},
 matches:{label:'Matchs',icon:'🗓️',thresholdKey:'matches',target:'matches'},
 discipline:{label:'Dossiers / Discipline',icon:'🟥',thresholdKey:'discipline',target:'discipline'},
 opponents:{label:'Annuaire clubs adverses',icon:'🛡️',thresholdKey:'opponents',target:'opponents'},
 clubprofile:{label:'Fiche club Footclubs',icon:'🏟️',thresholdKey:'clubprofile',target:'clubsettings'}
};

