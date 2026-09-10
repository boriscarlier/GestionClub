function accountScopeAllowsTeam(account,teamIdOrName){
 if(!account)return false;
 const scope=account.scope||{type:'club',teams:[]};
 if(scope.type==='club'||scope.type==='sport')return true;
 if(!['team','category'].includes(scope.type))return false;
 const allowed=(scope.teams||[]).map(x=>norm(x));
 return allowed.includes(norm(teamIdOrName));
}
