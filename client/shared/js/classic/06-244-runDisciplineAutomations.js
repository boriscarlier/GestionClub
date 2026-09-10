function runDisciplineAutomations(){
 (state.discipline||[]).forEach(d=>{
  if(ruleEnabled('discipline-red')&&d.redCard){
   addAutomationProposal({key:`redcheck:${d.dossierNumber||d.id}`,ruleId:'discipline-red',entityType:'discipline',entityId:d.id,severity:'warning',title:`Exclusion à vérifier — ${d.personName||'Licencié'}`,text:`Carton rouge enregistré sur le match ${d.matchNumber||'—'}. Vérifier le dossier officiel avant toute conclusion sur la sanction.`,actionPage:'discipline'});
  }
  if(ruleEnabled('discipline-yellow')&&Number(d.yellowCards||0)>0){
   addAutomationProposal({key:`yellowcheck:${d.dossierNumber||d.id}:${d.yellowCards}`,ruleId:'discipline-yellow',entityType:'discipline',entityId:d.id,severity:'info',title:`Avertissement(s) à suivre — ${d.personName||'Licencié'}`,text:`${Number(d.yellowCards||0)} avertissement(s) enregistré(s) dans ce dossier. Aucun calcul automatique de suspension.`,actionPage:'discipline'});
  }
  if(d.decision){
   addAutomationProposal({key:`decision:${d.dossierNumber}:${d.decision}`,ruleId:'discipline-red',entityType:'discipline',entityId:d.id,severity:/suspension/i.test(String(d.decision))?'critical':'warning',title:`Décision disciplinaire enregistrée — ${d.personName||'Licencié'}`,text:`${d.decision}${d.effectDate?' • effet '+formatDisciplineDate(d.effectDate):''}${d.endDate?' → '+formatDisciplineDate(d.endDate):''}`,actionPage:'discipline'});
  }
 });
}


