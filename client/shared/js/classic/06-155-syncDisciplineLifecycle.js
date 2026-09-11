function syncDisciplineLifecycle(){
 let changed=false;
 (state.discipline||[]).forEach(d=>{
  if(d.importedStatus===undefined){
   d.importedStatus=d.status||d.state||'';
   changed=true;
  }

  const lc=disciplineLifecycle(d);
  const nextStatus=lc.label;
  const nextActive=lc.active;

  if(d.status!==nextStatus){
   d.status=nextStatus;
   changed=true;
  }
  if(d.isActive!==nextActive){
   d.isActive=nextActive;
   changed=true;
  }

  const shouldAutoClose=lc.code==='closed_expired';
  if(shouldAutoClose && !d.closedAutomatically){
   d.closedAutomatically=true;
   d.closedAt=new Date().toISOString();
   changed=true;
  }
  if(!shouldAutoClose && d.closedAutomatically){
   d.closedAutomatically=false;
   d.closedAt='';
   changed=true;
  }

  d.closureType=lc.closureType||'';
  d.lifecycleCode=lc.code;
  d.lifecycleReason=lc.reason;
 });

 if(changed)save();
}

