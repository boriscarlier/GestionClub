function findOpponentForMatch(m){
 const name=norm(matchOpponentName(m));
 if(!name)return null;
 return (state.opponents||[]).find(o=>norm(o.name||o.clubName||o.title||'')===name) || null;
}


