function prototypeRenderFeedback(){
 const items=prototypeFeedbackItems();
 const root=document.getElementById('prototypeFeedbackList');
 const count=document.getElementById('prototypeFeedbackCount');
 if(count)count.textContent=items.length;
 if(!root)return;
 root.innerHTML=items.length?items.map(x=>`<div class="prototype-feedback-item">
  <strong>${escapeHtml(x.title)}</strong>
  <div class="prototype-feedback-meta"><span class="badge">${escapeHtml(x.type)}</span><span class="badge">${escapeHtml(x.area)}</span><span class="badge ${x.priority==='Bloquante'?'red':x.priority==='Haute'?'yellow':'blue'}">${escapeHtml(x.priority)}</span></div>
  <p>${escapeHtml(x.description||'—')}</p>
  <div class="tiny">${escapeHtml(x.tester)} • ${formatDisciplineDateTime(x.createdAt)} • ${escapeHtml(x.viewport||'')}</div>
  <button class="ghost" style="margin-top:6px" onclick="prototypeDeleteFeedback('${x.id}')">Supprimer</button>
 </div>`).join(''):'<div class="tiny">Aucun retour enregistré.</div>';
}


