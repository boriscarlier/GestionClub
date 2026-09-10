function deleteCurrentOpponentClub(){
 const id=currentOpponentId;
 if(!id)return;
 deleteOpponentClub(id);
 if(!opponentById(id)){
  currentOpponentId=null;
  goTo('opponents');
 }
}

