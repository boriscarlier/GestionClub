function statsBarsHtml(obj,limit=20){
 const e=Object.entries(obj).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'fr'));
 const max=Math.max(1,...e.map(x=>x[1]));
 return e.length?e.slice(0,limit).map(([k,v])=>`<div class="stats-bar-row"><div class="tiny">${escapeHtml(k)}</div><div class="stats-bar-track"><div class="stats-bar-fill" style="width:${Math.max(4,Math.round(v/max*100))}%"></div></div><strong>${v}</strong></div>`).join(''):'<div class="stats-empty">Aucune donnée.</div>';
}
