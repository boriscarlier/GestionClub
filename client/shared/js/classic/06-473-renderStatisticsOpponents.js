function renderStatisticsOpponents(){
 const q=norm(document.getElementById('soQuery')?.value||'');const rows=opponentStatsRows().filter(x=>!q||norm(x.name).includes(q));
 const body=document.getElementById('soRows');if(!body)return;
 body.innerHTML=rows.map(s=>{
  const club=(state.opponents||[]).find(o=>norm(o.name||o.matchName||'')===norm(s.name));
  return `<tr><td><strong>${escapeHtml(s.name)}</strong></td><td>${s.matches}</td><td>${s.w}</td><td>${s.d}</td><td>${s.l}</td><td>${s.gf}</td><td>${s.ga}</td><td>${club?`<button class="ghost" onclick="openOpponentDetail('${club.id}')">Ouvrir</button>`:'—'}</td></tr>`;
 }).join('')||'<tr><td colspan="8" class="tiny">Aucun adversaire trouvé.</td></tr>';
}


