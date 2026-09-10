function runLicenseAutomations(){
 (state.members||[]).forEach(m=>{
  if(ruleEnabled('license-incomplete')){
   const issues=administrativeIssuesForMember(m).filter(i=>i.severity!=='info');
   if(issues.length)addAutomationProposal({key:`admin:${m.id}:${issues.map(i=>i.kind).sort().join(',')}`,ruleId:'license-incomplete',entityType:'member',entityId:m.id,severity:issues.some(i=>i.severity==='critical')?'critical':'warning',title:`Dossier à régulariser — ${m.last||''} ${m.first||''}`,text:issues.map(i=>i.title).join(' • '),actionPage:'admincheck'});
  }
  if(ruleEnabled('license-birthday') && birthdayThisWeek(m)){
   addAutomationProposal({key:`birthday:${m.id}:${new Date().getFullYear()}`,ruleId:'license-birthday',entityType:'member',entityId:m.id,severity:'info',title:`Anniversaire — ${m.first||''} ${m.last||''}`,text:`Date de naissance : ${m.birthDate}. Proposer un visuel anniversaire.`,actionPage:'visual'});
  }
 });
}


