function disciplineLifecycle(d){
 const today=disciplineToday();
 const effect=disciplineDateOnly(d.effectDate);
 const end=disciplineDateOnly(d.endDate);

 const imported=norm([d.importedStatus,d.status,d.state].filter(Boolean).join(' '));
 const hasOfficialDecision=!!String(d.decision||'').trim();
 const officialClosed=
  imported.includes('clos') ||
  imported.includes('termine') || imported.includes('terminé') ||
  imported.includes('archive') ||
  imported.includes('valide') || imported.includes('validé');

 if(effect && end && end < effect){
  return {
   code:'check',
   label:'À contrôler',
   active:false,
   closureType:'',
   reason:'Date de fin antérieure à la date d’effet.'
  };
 }

 // Clôture officielle : priorité si le statut importé indique explicitement la clôture.
 if(officialClosed && hasOfficialDecision){
  return {
   code:'closed_official',
   label:'Clos — Ligue',
   active:false,
   closureType:'official',
   reason:'Dossier clôturé officiellement selon le statut/décision importé(e).'
  };
 }

 // Clôture automatique uniquement par dépassement de la date de fin.
 if(end && end < today){
  return {
   code:'closed_expired',
   label:'Clos — échéance dépassée',
   active:false,
   closureType:'expired',
   reason:`Date de fin dépassée : ${formatDisciplineDate(d.endDate)}. Cette clôture est calculée par l’application et ne vaut pas décision de la Ligue.`
  };
 }

 if(effect && effect > today){
  return {
   code:'future',
   label:'À venir',
   active:false,
   closureType:'',
   reason:`Prend effet le ${formatDisciplineDate(d.effectDate)}.`
  };
 }

 if(effect && (!end || end >= today)){
  return {
   code:'active',
   label:'Actif',
   active:true,
   closureType:'',
   reason:end?`Actif jusqu’au ${formatDisciplineDate(d.endDate)}.`:`Actif depuis le ${formatDisciplineDate(d.effectDate)}.`
  };
 }

 if(!effect && end && end >= today){
  return {
   code:'check',
   label:'À contrôler',
   active:false,
   closureType:'',
   reason:`Date de fin renseignée (${formatDisciplineDate(d.endDate)}) sans date d’effet exploitable.`
  };
 }

 if(officialClosed){
  return {
   code:'closed_official',
   label:'Clos — Ligue',
   active:false,
   closureType:'official',
   reason:'Statut de clôture présent dans les données importées.'
  };
 }

 if(d.isActive===true || imported.includes('actif')){
  return {code:'active',label:'Actif',active:true,closureType:'',reason:'Statut actif présent dans les données importées.'};
 }

 return {
  code:'check',
  label:'À contrôler',
  active:false,
  closureType:'',
  reason:'Dates d’effet et de fin insuffisantes pour reclasser automatiquement le dossier.'
 };
}

