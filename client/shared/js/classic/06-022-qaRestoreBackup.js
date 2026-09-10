function qaRestoreBackup(payload){
 if(!currentAdminCan('settings','edit'))throw new Error('Restauration non autorisée.');
 if(payload?.format!=='FC_LA_COUR_FULL_BACKUP'||payload.schemaVersion!==1||!payload.state||['members','matches','teams','accounts'].some(k=>!Array.isArray(payload.state[k])))throw new Error('Format de sauvegarde incorrect.');
 if(!payload.lineups||typeof payload.lineups!=='object'||Array.isArray(payload.lineups))throw new Error('Compositions invalides.');
 const writes={};writes[KEY]=JSON.stringify(payload.state);writes.fclc_coach_lineups=JSON.stringify(payload.lineups);writes[PROTOTYPE_FEEDBACK_KEY]=JSON.stringify(Array.isArray(payload.feedback)?payload.feedback:[]);writes[PROTOTYPE_SCENARIO_KEY]=JSON.stringify(payload.scenarios||{});
 const old=Object.fromEntries(Object.keys(writes).map(k=>[k,localStorage.getItem(k)]));
 try{Object.entries(writes).forEach(([k,v])=>localStorage.setItem(k,v));}catch(err){Object.entries(old).forEach(([k,v])=>{try{v===null?localStorage.removeItem(k):localStorage.setItem(k,v);}catch(e){}});throw err;}
 state=payload.state;coachLineups=payload.lineups;return true;
}

