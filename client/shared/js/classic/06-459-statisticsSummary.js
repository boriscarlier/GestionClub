function statisticsSummary(){
 const members=Array.isArray(state.members)?state.members:[];
 const teams=Array.isArray(state.teams)?state.teams:[];
 const matches=Array.isArray(state.matches)?state.matches:[];
 const discipline=Array.isArray(state.discipline)?state.discipline:[];
 const opponents=Array.isArray(state.opponents)?state.opponents:[];

 let played=0,wins=0,draws=0,losses=0,gf=0,ga=0,unknown=0;
 matches.forEach(m=>{
  const hasScore=(typeof hasMatchScore==='function')?hasMatchScore(m):
   (Number.isFinite(Number(m.homeScore))&&Number.isFinite(Number(m.awayScore)));
  if(!hasScore||!matchIsFinished(m))return;
  played++;
  const pair=statisticsScorePair(m);
  if(!pair){unknown++;return;}
  gf+=pair.fc;ga+=pair.opp;
  if(pair.fc>pair.opp)wins++;
  else if(pair.fc<pair.opp)losses++;
  else draws++;
 });

 const remaining=matches.filter(m=>{
  const finished=(typeof publicMatchIsFinished==='function')
   ? publicMatchIsFinished(m)
   : ((typeof hasMatchScore==='function'&&hasMatchScore(m)) || norm(m.status||'').includes('termin'));
  return !finished;
 }).length;

 const activeDisc=discipline.filter(d=>{
  if(typeof disciplineLifecycle==='function'){
   try{return disciplineLifecycle(d).code==='active'}catch(e){}
  }
  if(typeof d.isActive==='boolean')return d.isActive;
  return norm(d.status||'').includes('actif');
 });

 const discPeople=new Set(discipline.map(d=>String(d.personNumber||d.memberId||'').trim()).filter(Boolean));
 const discMatches=new Set(discipline.map(d=>String(d.matchNumber||d.matchId||'').trim()).filter(Boolean));

 const categories={};
 members.forEach(m=>{
  const cat=String(m.category||m.team||m.categoryLabel||'Non classé').trim()||'Non classé';
  categories[cat]=(categories[cat]||0)+1;
 });

 const women=members.filter(typeof memberIsFemale==='function'?memberIsFemale:()=>false).length;

 const coreImportTypes=['members','matches','discipline','opponents'];
 const importStates=coreImportTypes.map(type=>({
  type,
  state:typeof importFreshnessState==='function'?importFreshnessState(type):{status:'stale'}
 }));
 const importsOk=importStates.filter(x=>x.state.status==='ok').length;
 const availableBases=[
  members.length>0,
  matches.length>0,
  discipline.length>0,
  opponents.length>0
 ].filter(Boolean).length;

 return {
  members:members.length,
  women,
  teams:teams.length,
  matches:matches.length,
  played,
  remaining,
  wins,draws,losses,gf,ga,goalDiff:gf-ga,unknown,
  discipline:discipline.length,
  activeDisc:activeDisc.length,
  discPeople:discPeople.size,
  discMatches:discMatches.size,
  opponents:opponents.length,
  importsOk,
  importStates,
  completeness:Math.round((availableBases/coreImportTypes.length)*100),
  categories
 };
}


