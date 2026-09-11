function approveAutomationProposal(id){
 const p=state.automationProposals.find(x=>x.id===id);if(!p)return;
 p.status='approved'; addAutomationLog('Proposition validée : '+p.title,'ok'); save(); renderAutomation();
}
