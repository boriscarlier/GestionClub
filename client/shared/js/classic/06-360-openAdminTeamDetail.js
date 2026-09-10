async function openAdminTeamDetail(id){
 if(!currentAdminCan('teams','view')){toast('Accès refusé','Accès aux équipes non autorisé.');return;}
 await ensureServerTeamDetail(id);
 const t=adminTeamById(id);
 if(!t){toast('Équipe','Équipe introuvable.');return;}
 currentAdminTeamId=id;
 if(goTo('teamdetailadmin')!==false)renderAdminTeamDetail();
}
