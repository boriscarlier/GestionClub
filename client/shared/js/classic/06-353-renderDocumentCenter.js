function renderDocumentCenter(){
 const root=document.getElementById('documentGrid');if(!root)return;
 renderDocumentClubReference();
 ensureDocumentCenterState();
 const docs=documentCenterAll();
 const q=norm(document.getElementById('docSearch')?.value||'');
 const cat=document.getElementById('centerDocCategoryFilter')?.value||'';
 const season=document.getElementById('centerDocSeasonFilter')?.value||'';

 const seasonSel=document.getElementById('centerDocSeasonFilter');
 if(seasonSel){
  const seasons=[...new Set(docs.map(d=>d.season).filter(Boolean))].sort().reverse();
  const previous=seasonSel.value;
  seasonSel.innerHTML='<option value="">Toutes</option>'+seasons.map(s=>`<option ${s===previous?'selected':''}>${s}</option>`).join('');
 }

 const filtered=docs.filter(d=>{
  const txt=norm([d.title,d.category,d.season,d.ref,d.description,d.source,d.status].join(' '));
  return (!q||txt.includes(q))&&(!cat||d.category===cat)&&(!season||d.season===season);
 });

 const cats=[...new Set(docs.map(d=>d.category))];
 const quick=document.getElementById('docCategoryQuick');
 if(quick)quick.innerHTML='<button class="ghost" onclick="setDocumentCategory(\'\')">Tous</button>'+cats.map(c=>`<button class="ghost ${cat===c?'active':''}" onclick="setDocumentCategory('${c.replace(/'/g,"\\'")}')">${c}</button>`).join('');

 root.innerHTML=filtered.map(d=>`
  <div class="doc-card">
   <div class="doc-meta"><span class="badge ${d.source==='LRF / FFF'?'green':'yellow'}">${d.source}</span><span class="badge">${d.category}</span><span class="badge">${d.season||'—'}</span></div>
   <h4>${d.title}</h4>
   <div class="tiny">${d.ref?`Réf. ${d.ref} • `:''}${d.description||''}</div>
   <div class="tiny">État : ${d.status||'Actif'}</div>
   <div class="doc-actions">
    <button class="ghost" onclick="openDocumentRecord('${d.id}')">Ouvrir</button>
    <button class="ghost" onclick="printDocumentRecord('${d.id}')">Imprimer</button>
    <button class="ghost" onclick="emailDocumentRecord('${d.id}')">Envoyer</button>
    ${d.source==='Club'&&d.status!=='Archivé'?`<button class="ghost" onclick="archiveDocumentRecord('${d.id}')">Archiver</button>`:''}
    ${d.source==='Club'&&d.status==='Archivé'?`<button class="ghost" onclick="restoreDocumentRecord('${d.id}')">Restaurer</button>`:''}
   </div>
  </div>`).join('')||'<div class="tiny">Aucun document correspondant.</div>';

 const archived=docs.filter(d=>d.status==='Archivé');
 const rows=document.getElementById('documentArchiveRows');
 if(rows)rows.innerHTML=archived.map(d=>`<tr><td>${typeof formatDisciplineDate==='function'?formatDisciplineDate(d.date):(d.date||'—')}</td><td>${d.title}</td><td>${d.category}</td><td>${d.season||'—'}</td><td>${d.status}</td><td><button class="ghost" onclick="restoreDocumentRecord('${d.id}')">Restaurer</button>${d.source==='Club'?` <button class="ghost" onclick="deleteDocumentRecord('${d.id}')">Supprimer</button>`:''}</td></tr>`).join('')||'<tr><td colspan="6" class="tiny">Aucune archive.</td></tr>';

 const total=document.getElementById('docStatTotal'),off=document.getElementById('docStatOfficial'),club=document.getElementById('docStatClub'),arch=document.getElementById('docStatArchived');
 if(total)total.textContent=docs.length;
 if(off)off.textContent=docs.filter(d=>d.source==='LRF / FFF').length;
 if(club)club.textContent=docs.filter(d=>d.source==='Club').length;
 if(arch)arch.textContent=archived.length;
}


let __clubLogoImage=null;

