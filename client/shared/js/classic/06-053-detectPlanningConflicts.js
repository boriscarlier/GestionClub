function detectPlanningConflicts(events){
 const list=events||state.planning||[],conflicts=[];
 for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
  const a=list[i],b=list[j];
  if(Number(a.day)!==Number(b.day)||norm(a.place||'')!==norm(b.place||''))continue;
  const as=eventMinutes(a),ae=as+Number(a.duration||60),bs=eventMinutes(b),be=bs+Number(b.duration||60);
  if(as<be&&bs<ae)conflicts.push([a,b]);
 }
 return conflicts;
}
