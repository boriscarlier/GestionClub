function disciplineMatchForCase(d){
 if(d.matchId){const found=matchById(d.matchId);if(found)return found;}
 if(d.matchNumber)return (state.matches||[]).find(m=>String(m.matchNumber||'')===String(d.matchNumber||''))||null;
 return null;
}
