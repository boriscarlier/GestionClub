function openOpponentDetail(id){
 const o=opponentById(id);
 if(!o){
  toast('Club adverse','Fiche introuvable.');
  return;
 }
 currentOpponentId=id;
 renderOpponentDetail();
 goTo('opponentdetail');
}
