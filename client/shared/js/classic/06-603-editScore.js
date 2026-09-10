function editScore(id){
 if(!currentAdminCan('matches','edit'))return toast('Accès refusé','Modification des matchs non autorisée.');
 const m=matchById(id);
 if(!m)return toast('Score','Match introuvable.');
 currentMatchId=id;
 if(goTo('matchdetail')!==false)renderMatchDetail();
 setTimeout(()=>document.getElementById('matchDetailFcScore')?.focus(),0);
}
