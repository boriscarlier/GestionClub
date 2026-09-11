function deletePlanningEventById(id){
 if(!currentAdminCan('teams','edit'))return toast('Accès refusé','Modification du planning non autorisée.');
 const ev=(state.planning||[]).find(e=>String(e.id)===String(id));
 if(!ev)return toast('Planning','Événement introuvable.');
 state.planning=(state.planning||[]).filter(e=>String(e.id)!==String(id));
 save();
 if(typeof logAdminAction==='function')logAdminAction('Planning','Suppression',ev.title||id);
 renderPlanning();
 toast('Planning','Élément supprimé.');
}

