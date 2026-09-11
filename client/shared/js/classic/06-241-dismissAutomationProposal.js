function dismissAutomationProposal(id){
 const p=state.automationProposals.find(x=>x.id===id);if(!p)return;
 p.status='dismissed'; addAutomationLog('Proposition ignorée : '+p.title,'info'); save(); renderAutomation();
}
