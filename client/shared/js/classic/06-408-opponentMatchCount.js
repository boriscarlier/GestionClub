function opponentMatchCount(name){
 const key=opponentKey(name);
 return (state.matches||[]).filter(m=>opponentKey(m.opponent||m.opponentClub)===key).length;
}
