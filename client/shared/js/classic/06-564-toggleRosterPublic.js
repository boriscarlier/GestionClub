function toggleRosterPublic(id,val){
 if(!currentAdminCan('teams','edit')){toast('Accès refusé','Modification des équipes non autorisée.');renderAdminTeams();return;}
 const t=(state.teams||[]).find(t=>t.id===id);if(!t)return;
 t.rosterPublic=!!val;save();
 if(typeof logAdminAction==='function')logAdminAction('Équipes','Visibilité effectif',`${t.name} : ${val?'public':'privé'}`);
 renderAdminTeams();
 if(typeof renderPublic==='function')renderPublic();
 toast('Effectif',val?'Effectif visible publiquement.':'Effectif masqué du site public.');
}
