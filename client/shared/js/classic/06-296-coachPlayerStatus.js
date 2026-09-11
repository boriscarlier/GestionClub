function coachPlayerStatus(m){
 const elig=memberEligibilityStatus(m);
 if(elig.status==='block')return {status:'blocked',label:'Bloqué',source:'regulatory'};
 const op=state.coachPlayerAvailability?.[m.id]||null;
 if(op?.status==='injured')return {status:'injured',label:'Blessé',source:'coach',updatedAt:op.updatedAt};
 if(op?.status==='absent')return {status:'absent',label:'Absent',source:'coach',updatedAt:op.updatedAt};
 if(elig.status==='warn')return {status:'warning',label:'À vérifier',source:'regulatory'};
 return {status:'available',label:'Disponible',source:'coach',updatedAt:op?.updatedAt||null};
}
