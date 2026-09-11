function ensurePrototypeDemoLineups(){
 state.prototypeSeedVersions=state.prototypeSeedVersions||{};
 if(state.prototypeSeedVersions.lineups)return;
 state.prototypeSeedVersions.lineups=QA_BUILD;
 if((state.members||[]).some(m=>m.sourceFormat&&!['DEMO','REALISTIC_2026'].includes(m.sourceFormat)))return;

 try{
  const lineups=JSON.parse(localStorage.getItem('gestionclub_coach_lineups')||'{}');
  if(!lineups.demo_u15_played_1)lineups.demo_u15_played_1={players:['demo_u15_01','demo_u15_02','demo_u15_03','demo_u15_04','demo_u15_05'],updatedAt:new Date().toISOString(),updatedBy:'demo_member_coach',team:'U15',matchId:'demo_u15_played_1'};
  if(!lineups.demo_u15_played_2)lineups.demo_u15_played_2={players:['demo_u15_01','demo_u15_02','demo_u15_04','demo_u15_06'],updatedAt:new Date().toISOString(),updatedBy:'demo_member_coach',team:'U15',matchId:'demo_u15_played_2'};
  localStorage.setItem('gestionclub_coach_lineups',JSON.stringify(lineups));
 }catch(e){console.error('Prototype lineups',e)}
}
