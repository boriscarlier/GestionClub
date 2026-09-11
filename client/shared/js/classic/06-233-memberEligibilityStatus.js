function memberEligibilityStatus(m){
 const issues=regulatoryIssuesForMember(m).filter(i=>{
  const review=regulatoryReviewForIssue(i);
  return !['validated','closed'].includes(review.status);
 });
 if(issues.some(i=>i.severity==='block'))return {status:'block',label:'NON ÉLIGIBLE / CONTRÔLE',issues};
 if(issues.length)return {status:'warn',label:'À VÉRIFIER',issues};
 return {status:'ok',label:'ÉLIGIBLE',issues:[]};
}


const defaultAutomationRules=[
 {id:'match-created',name:'Nouveau match',kind:'match',enabled:true,severity:'info',desc:'Proposer la préparation du match et la communication associée.'},
 {id:'match-result',name:'Résultat détecté',kind:'match',enabled:true,severity:'info',desc:'Proposer un visuel résultat et une publication.'},
 {id:'match-change',name:'Match modifié / reporté',kind:'match',enabled:true,severity:'warning',desc:'Alerter en cas de report, changement d’horaire ou terrain.'},
 {id:'discipline-red',name:'Carton rouge',kind:'discipline',enabled:true,severity:'warning',desc:'Signaler une exclusion et demander la vérification du dossier officiel.'},
 {id:'discipline-yellow',name:'Avertissements',kind:'discipline',enabled:true,severity:'info',desc:'Signaler les avertissements enregistrés sans déduire automatiquement une sanction.'},
 {id:'license-incomplete',name:'Licence incomplète',kind:'license',enabled:true,severity:'warning',desc:'Alerter sur les dossiers administratifs incomplets.'},
 {id:'license-birthday',name:'Anniversaire',kind:'license',enabled:true,severity:'info',desc:'Proposer une communication anniversaire.'},
 {id:'document-suggest',name:'Document à fournir',kind:'document',enabled:true,severity:'warning',desc:'Associer automatiquement les documents officiels adaptés.'}
];
