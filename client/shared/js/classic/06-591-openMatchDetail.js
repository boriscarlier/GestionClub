function openMatchDetail(id){
 if(!currentAdminCan('matches','view'))return toast('Accès refusé','Accès aux matchs non autorisé.');
 const m=matchById(id);
 if(!m){toast('Match','Match introuvable.');return;}
 currentMatchId=id;
 if(goTo('matchdetail')!==false)renderMatchDetail();
}
