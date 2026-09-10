async function refreshServerMembers(force=false){
 if(!serverMembersEnabled()||serverMembersState.loading)return false;
 if(serverMembersState.loaded&&!force&&Date.now()-serverMembersState.requestedAt<30000)return true;
 serverMembersState.loading=true;serverMembersState.error='';updateMemberDataSource();
 try{
  const [summary,listing]=await Promise.all([
   serverMembersApi('/api/state/summary'),
   serverMembersApi('/api/state/members?limit=500')
  ]);
  serverMembersState={loaded:true,loading:false,error:'',items:listing.members||[],total:listing.total||0,revision:summary.revision||0,requestedAt:Date.now()};
  return true;
 }catch(e){
  serverMembersState.loading=false;serverMembersState.loaded=false;serverMembersState.items=[];serverMembersState.total=0;serverMembersState.error=e.message||String(e);
  return false;
 }finally{
  updateMemberDataSource();
 }
}
