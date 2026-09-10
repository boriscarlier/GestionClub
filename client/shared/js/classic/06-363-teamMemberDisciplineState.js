function teamMemberDisciplineState(member){
 const dossiers=disciplineForMember(member);

 // Réutiliser le moteur réglementaire existant lorsqu'il est disponible.
 try{
  if(typeof memberEligibilityStatus==='function'){
   const elig=memberEligibilityStatus(member);
   if(elig && elig.status==='block'){
    return {level:'suspended',label:'Suspendu / non éligible',dossiers,details:(elig.issues||[]).map(x=>x.title).filter(Boolean)};
   }
   if(elig && elig.status==='warn'){
    return {level:'warning',label:'À vérifier',dossiers,details:(elig.issues||[]).map(x=>x.title).filter(Boolean)};
   }
  }
 }catch(e){console.error('teamMemberDisciplineState eligibility',e)}

 const active=dossiers.filter(d=>{
  const s=norm(d.status||d.state||d.etat);
  return !s.includes('clos')&&!s.includes('termin')&&!s.includes('archive');
 });
 const suspended=dossiers.some(d=>{
  const txt=norm([
   d.status,d.state,d.decision,d.sanction,d.consequence,
   d.reason,d.motif,d.effect,d.endDate,d.suspension
  ].join(' '));
  return txt.includes('suspend')||txt.includes('non eligible')||txt.includes('non éligible');
 });

 if(suspended)return {level:'suspended',label:'Suspendu',dossiers,details:active.map(d=>d.decision||d.sanction||d.reason||d.motif).filter(Boolean)};
 if(active.length)return {level:'warning',label:'Alerte discipline',dossiers,details:active.map(d=>d.decision||d.sanction||d.reason||d.motif).filter(Boolean)};
 return {level:'ok',label:'RAS',dossiers,details:[]};
}
