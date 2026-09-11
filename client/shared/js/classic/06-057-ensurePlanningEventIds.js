function ensurePlanningEventIds(){
 let changed=false;
 (state.planning||[]).forEach((e,idx)=>{
  if(!e.id){e.id=uid('e');changed=true;}
  if(e.day===undefined||e.day===null||e.day==='')e.day=0;
  if(!e.time)e.time='18:00';
  if(!e.duration)e.duration=60;
  if(!e.type)e.type='event';
  if(!e.title)e.title=`Événement ${idx+1}`;
 });
 if(changed)save();
}
