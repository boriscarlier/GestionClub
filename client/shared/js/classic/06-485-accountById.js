function accountById(id){
 return (state.accounts||[]).find(a=>a.id===id)||null;
}
