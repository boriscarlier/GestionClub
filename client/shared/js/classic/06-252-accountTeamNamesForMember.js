function accountTeamNamesForMember(member){
 const account=accountLinkedToMember(member);
 if(!account)return [];
 const scope=account.scope||{};
 if(['team','category'].includes(scope.type))return (scope.teams||[]).filter(Boolean);
 return [];
}
