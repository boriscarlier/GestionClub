function teamMatchCount(team){
 return (state.matches||[]).filter(m=>norm(m.team||m.sourceTeam||'')===norm(team.name||'')).length;
}
let serverTeamsState={loaded:false,loading:false,error:'',items:[],total:0,revision:0,requestedAt:0};
