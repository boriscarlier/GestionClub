function matchById(id){
 return (state.matches||[]).find(m=>m.id===id)||null;
}
