function renderImportHistory(){
 const el=document.getElementById('importHistory');if(!el)return;
 const h=state.importHistory||[];
 el.innerHTML=h.length?h.slice(0,20).map(x=>`<div class="import-history-item"><strong>${x.file}</strong><div class="tiny">${x.date} • ${x.target} • ${x.strategy} • lus ${x.read}, +${x.added}, maj ${x.updated}, ignorés ${x.skipped}</div></div>`).join(''):'<div class="tiny">Aucun import enregistré.</div>';
}
