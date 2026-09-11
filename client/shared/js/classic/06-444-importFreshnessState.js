function importFreshnessState(type){
 const def=IMPORT_SOURCE_DEFS[type];
 let reg=state.importRegistry?.[type]||null;
 if(type==='clubprofile' && !reg && state.clubProfile?.source){
  reg={
   type:'clubprofile',
   filename:state.clubProfile.source.filename||'Fiche club Footclubs',
   importedAt:state.clubProfile.source.importedAt||null,
   itemCount:1,
   source:'Paramétrage du club / Footclubs',
   note:state.clubProfile.source.season?`Saison ${state.clubProfile.source.season}`:''
  };
 }
 const threshold=Number(state.importFreshness?.[def?.thresholdKey]||30);
 if(reg?.reimportRequired)return {status:'stale',days:null,threshold,label:'Réimportation requise'};
 if(!reg)return {status:'stale',days:null,threshold,label:'Jamais importé'};
 const days=daysSinceImport(reg.importedAt);
 if(days===null)return {status:'stale',days:null,threshold,label:'Date inconnue'};
 if(days>threshold)return {status:'stale',days,threshold,label:'Obsolète'};
 if(days>Math.max(1,Math.floor(threshold*0.75)))return {status:'warn',days,threshold,label:'À surveiller'};
 return {status:'ok',days,threshold,label:'À jour'};
}
