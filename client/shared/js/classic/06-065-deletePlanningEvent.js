function deletePlanningEvent(){
 if(!currentAdminCan('teams','edit'))return toast('Accès refusé','Modification du planning non autorisée.');
 const id=document.getElementById('planningEditId')?.value||'';if(!id)return;
 const ev=(state.planning||[]).find(e=>String(e.id)===String(id));if(!ev)return;
 state.planning=state.planning.filter(e=>String(e.id)!==String(id));save();
 if(typeof logAdminAction==='function')logAdminAction('Planning','Suppression',ev.title||id);
 closePlanningEditor();renderPlanning();toast('Planning','Élément supprimé.');
}
