function qaCanEditBlock(block){
 const groups={contact:'contact',finance:'finance',guardian:'guardians',discipline:'discipline'};
 if(!['identity','contact','finance','license','guardian','discipline'].includes(block))return false;
 if(!currentAdminCan('members','edit'))return false;
 if(block==='discipline'&&!currentAdminCan('discipline','edit'))return false;
 if((state.accounts||[]).length&&groups[block]&&!accountCanSeeSensitive(currentAdminAccount(),groups[block]))return false;
 const account=currentAdminAccount(),member=(state.members||[]).find(m=>m.id===currentMemberId);
 if(account&&['team','category'].includes(account.scope?.type)){
  const teams=(state.teams||[]).filter(t=>(account.scope.teams||[]).some(v=>v===t.id||norm(v)===norm(t.name)));
  if(!member||!teams.some(t=>teamMemberBelongsTo(member,t)))return false;
 }
 return true;
}

