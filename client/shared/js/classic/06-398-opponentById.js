function opponentById(id){
 return (state.opponents||[]).find(o=>o.id===id)||null;
}
