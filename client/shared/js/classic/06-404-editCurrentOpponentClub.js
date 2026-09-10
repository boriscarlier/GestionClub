function editCurrentOpponentClub(){
 const o=opponentById(currentOpponentId);
 if(!o)return;
 editOpponentClub(o.id);
 goTo('opponents');
}
