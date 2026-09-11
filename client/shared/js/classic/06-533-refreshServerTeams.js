async function refreshServerTeams(force=false){
 if(!serverTeamsEnabled()||serverTeamsState.loading)return false;
 if(serverTeamsState.loaded&&!force&&Date.now()-serverTeamsState.requestedAt<30000)return true;
 serverTeamsState.loading=true;serverTeamsState.error='';updateTeamDataSource();
 try{
  const [summary,listing]=await Promise.all([
   serverTeamsApi('/api/state/summary'),
   serverTeamsApi('/api/state/teams?limit=500')
  ]);
  serverTeamsState={loaded:true,loading:false,error:'',items:listing.teams||[],total:listing.total||0,revision:summary.revision||0,requestedAt:Date.now()};
  return true;
 }catch(e){
  serverTeamsState.loading=false;serverTeamsState.loaded=false;serverTeamsState.items=[];serverTeamsState.total=0;serverTeamsState.error=e.message||String(e);
  return false;
 }finally{
  updateTeamDataSource();
 }
}
