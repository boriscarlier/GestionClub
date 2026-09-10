function coachDisciplineHtml(player){
 const ds=coachDisciplineReviewState(player);
 if(ds.status==='none')return '<div class="coach-discipline-box tiny"><span class="badge green">DISCIPLINE RAS</span></div>';

 const pending=ds.issues.filter(x=>x.review.status==='pending');
 const detail=ds.issues.map(x=>x.issue.title).join(' • ');
 const badgeClass=ds.status==='blocked'?'red':ds.status==='pending'?'yellow':ds.status==='checked'?'blue':'green';

 return `<div class="coach-discipline-box">
  <span class="badge ${badgeClass}">${escapeHtml(ds.label)}</span>
  <div class="tiny" style="margin-top:4px">${escapeHtml(detail)}</div>
  ${pending.length?`<div class="actions"><button class="ghost" onclick="coachMarkDisciplineChecked('${player.id}')">✓ Marquer vérifiée</button></div>`:''}
 </div>`;
}


