function deleteMatchById(id){
 if(!currentAdminCan('matches','delete'))return toast('Accès refusé','Suppression de match non autorisée.');
 const m=matchById(id);if(!m)return;
 currentMatchId=id;
 if(goTo('matchdetail')!==false){renderMatchDetail();requestDeleteCurrentMatch();}
}
