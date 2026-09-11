function coachMatchScoreHtml(m){
 const result=coachMatchResultInfo(m);
 const opponent=coachMatchOpponentLabel(m);
 const raw=matchDisplayScores(m);
 if(result.has){
  return `<div class="coach-result-score">CLUB EXEMPLE&nbsp; ${escapeHtml(result.scoreText)} &nbsp;${escapeHtml(opponent)}</div>`;
 }
 if(Number.isFinite(raw?.receiver)&&Number.isFinite(raw?.visitor)){
  return `<div class="coach-result-score">${escapeHtml(String(raw.receiver))} - ${escapeHtml(String(raw.visitor))}<div class="tiny">Score recevant / visiteur — orientation CLUB EXEMPLE à vérifier</div></div>`;
 }
 return '<div class="coach-result-score">Score non renseigné</div>';
}

