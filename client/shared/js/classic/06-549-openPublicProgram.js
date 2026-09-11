function openPublicProgram(filter='all',matchId=null){
 publicProgramFilter=filter||'all';
 publicProgramFocusId=matchId||null;
 if(matchId){
  const m=(state.matches||[]).find(x=>x.id===matchId);
  if(m)publicProgramSection=publicMatchSection(m);
 }else{
  publicProgramSection='';
 }
 showPublicPage('public-programme');
 renderPublicProgram();
}
