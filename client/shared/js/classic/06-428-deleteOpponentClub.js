function deleteOpponentClub(id){
 const o=(state.opponents||[]).find(x=>x.id===id);
 if(!o)return;
 if(!confirm(`Supprimer ${o.name} de la base des clubs adverses ?`))return;
 state.opponents=state.opponents.filter(x=>x.id!==id);
 save();
 toast('Club adverse','Club supprimé du référentiel.');
}
