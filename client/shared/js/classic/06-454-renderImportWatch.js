function renderImportWatch(){
 const grid=document.getElementById('importWatchGrid');
 if(!grid)return;
 loadImportFreshnessSettings();
 renderResetImportModeBanner();

 const rows=Object.keys(IMPORT_SOURCE_DEFS).map(type=>{
  const def=IMPORT_SOURCE_DEFS[type];
  let reg=state.importRegistry?.[type]||null;
  if(type==='clubprofile'&&!reg&&state.clubProfile?.source){
   reg={filename:state.clubProfile.source.filename,importedAt:state.clubProfile.source.importedAt,itemCount:1,source:'Paramétrage du club / Footclubs',note:state.clubProfile.source.season?`Saison ${state.clubProfile.source.season}`:''};
  }
  const st=importFreshnessState(type);
  return {type,def,reg,st};
 });
 const counts={
  total:rows.length,
  ok:rows.filter(r=>r.st.status==='ok').length,
  warn:rows.filter(r=>r.st.status==='warn').length,
  stale:rows.filter(r=>r.st.status==='stale').length
 };
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
 set('importWatchTotal',counts.total);set('importWatchOk',counts.ok);set('importWatchWarn',counts.warn);set('importWatchStale',counts.stale);

 grid.innerHTML=rows.map(({type,def,reg,st})=>`
  <div class="import-watch-card ${st.status}">
   <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
    <div><strong>${def.icon} ${def.label}</strong><div class="tiny">${reg?.filename||'Aucun fichier enregistré'}</div></div>
    ${importStatusBadge(st)}
   </div>
   <div class="import-watch-meta tiny">
    <div><strong>Dernier import :</strong> ${formatImportDate(reg?.importedAt)}</div>
    <div><strong>Âge :</strong> <span class="import-age">${st.days===null?'—':st.days+' jour'+(st.days>1?'s':'')}</span> / seuil ${st.threshold} j</div>
    <div><strong>Éléments :</strong> ${reg?.itemCount??0}</div>
    <div><strong>Source :</strong> ${reg?.source||'—'}</div>
   </div>
   ${reg?.note?`<div class="import-watch-note tiny">${escapeHtml(reg.note)}</div>`:''}
   <div class="import-watch-actions">
    ${type==='clubprofile'
      ? `<button class="ghost" onclick="goTo('clubsettings')">Ouvrir le paramétrage</button>`
      : `<button class="ghost" onclick="openImportForTarget('${type}')">Nouvel import</button>`}
   </div>
  </div>`).join('');
}
