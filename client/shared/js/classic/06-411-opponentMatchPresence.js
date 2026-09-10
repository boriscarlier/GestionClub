function opponentMatchPresence(name){
 const count=opponentMatchCount(name);
 return {count,linked:count>0};
}

