function qaSyncMatchSelectors(){
 for(const [id,rows]of [['coachCallupMatch',coachTeamMatches().filter(m=>!coachMatchPlayed(m))],['coachLineupMatch',qaCoachMatchesAll()]]){
  const el=document.getElementById(id);if(!el)continue;const current=el.value;
  const visible=rows.slice().sort((a,b)=>Number(coachMatchIsClosedForCoach(a))-Number(coachMatchIsClosedForCoach(b))||String(a.date||'').localeCompare(String(b.date||'')));
  el.innerHTML=visible.map(m=>`<option value="${escapeHtml(m.id)}">${formatMatchDateFr(m.date)} — ${escapeHtml(matchOpponentName(m)||'Adversaire')}${coachMatchIsClosedForCoach(m)?' — Archivé':''}</option>`).join('')||'<option value="">Aucun match</option>';
  if(visible.some(m=>m.id===current))el.value=current;
 }
}

