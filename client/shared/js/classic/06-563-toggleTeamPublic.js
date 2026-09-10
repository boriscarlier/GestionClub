function toggleTeamPublic(id,val){
 if(!currentAdminCan('teams','edit')){toast('Accès refusé','Modification des équipes non autorisée.');renderAdminTeams();return;}
 const t=(state.teams||[]).find(t=>t.id===id);if(!t)return;
 t.public=!!val;save();
 if(typeof logAdminAction==='function')logAdminAction('Équipes','Visibilité fiche',`${t.name} : ${val?'publique':'interne'}`);
 renderAdminTeams();
 if(typeof renderPublic==='function')renderPublic();
 toast('Équipe',val?'Visible sur le site public.':'Retirée du site public.');
}
