function findOpponentClub(name){
 const key=opponentKey(name);
 return (state.opponents||[]).find(o=>opponentKey(o.name)===key)||null;
}

