function runMatchAutomations(){
 const now=new Date();
 (state.matches||[]).forEach(m=>{
  if(ruleEnabled('match-created')){
   addAutomationProposal({key:`matchprep:${m.id}`,ruleId:'match-created',entityType:'match',entityId:m.id,severity:'info',title:`Préparer ${m.team} - ${m.opponent}`,text:`Match prévu le ${m.date||'—'} à ${m.time||'—'}${m.place?' • '+m.place:''}.`,actionPage:'matches'});
  }
  if(ruleEnabled('match-result') && m.status==='Terminé'){
   addAutomationProposal({key:`result:${m.id}:${m.homeScore}-${m.awayScore}`,ruleId:'match-result',entityType:'match',entityId:m.id,severity:'info',title:`Résultat à publier — ${m.team}`,text:`${m.team} ${m.homeScore} - ${m.awayScore} ${m.opponent}. Proposer visuel + publication multicanale.`,actionPage:'visual'});
  }
  if(ruleEnabled('match-change') && (m.rescheduleStatus||m.rescheduleDate)){
   addAutomationProposal({key:`report:${m.id}:${m.rescheduleDate||m.rescheduleStatus}`,ruleId:'match-change',entityType:'match',entityId:m.id,severity:'warning',title:`Match reporté / rejoué — ${m.team}`,text:`${m.opponent} • ${m.rescheduleStatus||''} ${m.rescheduleDate||''}`.trim(),actionPage:'matches'});
  }
  if(ruleEnabled('match-change') && m.unresolvedTime){
   addAutomationProposal({key:`timecheck:${m.id}`,ruleId:'match-change',entityType:'match',entityId:m.id,severity:'warning',title:`Horaire à confirmer — ${m.team}`,text:`Horaire source : ${m.rawTime||m.time||'non défini'}.`,actionPage:'matches'});
  }
 });
}


