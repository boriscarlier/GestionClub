function renderOfficialDocs(){
 const grid=document.getElementById('officialDocsGrid');if(!grid)return;
 const q=norm(document.getElementById('docQuery')?.value||'');
 const cat=document.getElementById('docCategoryFilter')?.value||'';
 const docs=officialLrfDocs2026.filter(d=>(!q||norm(d.title+' '+d.desc+' '+d.category).includes(q))&&(!cat||d.category===cat));
 grid.innerHTML=docs.map(d=>`<div class="doc-card ${selectedOfficialDocs.includes(d.id)?'selected':''}">
  <label class="doc-check"><input type="checkbox" ${selectedOfficialDocs.includes(d.id)?'checked':''} onchange="toggleOfficialDoc('${d.id}',this.checked)"><div><h4>${d.title}</h4><div class="doc-meta"><span class="badge green">${d.category}</span><span class="badge">${typeof d.pages==='number' ? d.pages+' page'+(d.pages>1?'s':'') : d.pages}</span></div></div></label>
  <p class="tiny">${d.desc}</p>
  <div class="doc-actions">
   <button class="secondary" onclick="openOfficialDoc('${d.id}')">Ouvrir</button>
   <button class="ghost" onclick="printOfficialDoc('${d.id}')">Imprimer</button>
   <button class="ghost" onclick="emailOfficialDoc('${d.id}')">Envoyer par mail</button>
  </div>
 </div>`).join('');
 renderDocSelectionSummary();
}
