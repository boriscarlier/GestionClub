function renderCms(){
 const root=document.getElementById('cmsList');if(!root)return;
 const list=(state.posts||[]).filter(p=>cmsFilter==='all'||p.status===cmsFilter);
 root.innerHTML=list.map(p=>`<div class="cms-card"><strong>${escapeHtml(p.title||'Actualité')}</strong><div class="cms-meta"><span class="badge">${escapeHtml(p.category||'')}</span><span class="badge">${escapeHtml(p.status||'Brouillon')}</span></div><p class="tiny">${escapeHtml(p.text||'')}</p><div class="cms-actions">${currentAdminCan('communication','edit')?`<button class="secondary" onclick="cmsCycleStatus('${p.id}')">Changer statut</button><button class="ghost" onclick="cmsToggleFeatured('${p.id}')">À la une</button>`:''}</div></div>`).join('')||'<div class="tiny">Aucun article dans ce statut.</div>';
}
