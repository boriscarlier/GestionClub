function importFreshnessAlerts(){
 return Object.keys(IMPORT_SOURCE_DEFS).map(type=>{
  const def=IMPORT_SOURCE_DEFS[type],st=importFreshnessState(type);
  let reg=state.importRegistry?.[type];
  if(type==='clubprofile'&&!reg&&state.clubProfile?.source)reg=state.clubProfile.source;
  if(st.status==='ok')return null;
  return {
   id:'importfresh_'+type,
   type:'import',
   severity:st.status==='stale'?'critical':'warning',
   title:`${def.label} : ${st.label}`,
   text:reg
    ? `Dernier import il y a ${st.days} jour${st.days>1?'s':''}. Seuil configuré : ${st.threshold} jours.`
    : `Aucun import enregistré pour cette source.`,
   created:new Date().toISOString(),
   source:'Suivi des imports'
  };
 }).filter(Boolean);
}


