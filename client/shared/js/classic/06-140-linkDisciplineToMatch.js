function linkDisciplineToMatch(rec){
 const mn=norm(rec.matchNumber);
 const m=(state.matches||[]).find(x=>norm(x.matchNumber)===mn);
 rec.matchId=m?m.id:null;
 rec.team=m?m.team:rec.team;
 return rec;
}
