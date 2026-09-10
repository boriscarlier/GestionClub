function teamPlayerCount(team){
 return (state.members||[]).filter(m=>teamMemberBelongsTo(m,team) && (norm(m.type||m.licenseType||'').includes('joueur') || !String(m.type||m.licenseType||'').trim())).length;
}
