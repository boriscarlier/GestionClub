function addAutomationProposal(p){
 const key=p.key||`${p.ruleId}|${p.entityType}|${p.entityId}|${p.title}`;
 if((state.automationProposals||[]).some(x=>x.key===key&&x.status!=='dismissed'))return;
 state.automationProposals.unshift({id:autoUid('ap'),key,status:'pending',created:new Date().toISOString(),...p});
}
