function searchCurrentOpponentLogo(){
 const o=opponentById(currentOpponentId);
 if(!o)return;
 prepareOpponentWebSearch(o.id);
 goTo('opponents');
}
