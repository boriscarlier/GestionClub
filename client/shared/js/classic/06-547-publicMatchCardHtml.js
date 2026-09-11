function publicMatchCardHtml(m,isResult=false){
 const score=publicMatchScoreText(m);
 return `<div class="public-match-row" onclick="openPublicProgram('${isResult?'results':'upcoming'}','${m.id}')">
  <img class="club-logo-img" data-club-logo alt="Logo CLUB EXEMPLE">
  <div class="public-match-main">
   <strong>${m.team||'CLUB EXEMPLE'} — ${m.opponent||'Adversaire'}</strong>
   <div class="public-match-meta">${formatMatchDateFr(m.date)}${m.time?' • '+m.time:''}${m.place?' • '+m.place:''}</div>
  </div>
  <div style="display:grid;justify-items:end;gap:4px">
   ${opponentLogoHtml(m.opponent)}
   <div class="public-match-score">${score||'VS'}</div>
   <div class="public-match-status">${matchStatusValue(m)}</div>
  </div>
 </div>`;
}
