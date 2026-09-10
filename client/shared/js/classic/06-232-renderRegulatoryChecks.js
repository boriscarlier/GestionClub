function renderRegulatoryChecks(){
 const el=document.getElementById('regulatoryIssues');if(!el)return;
 closeExpiredRegulatoryReviews();
 const all=allRegulatoryIssues();
 const q=norm(document.getElementById('regQuery')?.value||'');
 const sev=document.getElementById('regSeverity')?.value||'';
 const kind=document.getElementById('regKind')?.value||'';
 const reviewFilter=document.getElementById('regReviewStatus')?.value||'';

 const enriched=all.map(i=>{
  const review=regulatoryReviewForIssue(i);
  const dateState=regulatoryIssueDateState(i);
  return {...i,review,dateState};
 });

 const list=enriched.filter(i=>
  (!q||norm(i.name+' '+i.license+' '+i.title+' '+i.detail+' '+i.ref+' '+(i.review.note||'')).includes(q)) &&
  (!sev||i.severity===sev) &&
  (!kind||i.kind===kind) &&
  (!reviewFilter||i.review.status===reviewFilter)
 );

 document.getElementById('regTotal').textContent=all.length;
 document.getElementById('regBlocks').textContent=all.filter(i=>i.severity==='block').length;
 document.getElementById('regDiscipline').textContent=all.filter(i=>i.kind==='discipline').length;
 document.getElementById('regLicense').textContent=all.filter(i=>i.kind==='license').length;
 document.getElementById('regOther').textContent=all.filter(i=>['upgrade','transfer'].includes(i.kind)).length;

 const statusLabel={pending:'À VÉRIFIER',checked:'VÉRIFIÉ',validated:'VALIDÉ',closed:'CLOS'};
 el.innerHTML=list.length?list.map(i=>{
  const keyArgs=`'${String(i.memberId).replace(/'/g,"\\'")}','${String(i.kind).replace(/'/g,"\\'")}','${String(i.title).replace(/'/g,"\\'")}'`;
  const badgeClass=i.review.status==='validated'||i.review.status==='closed'?'green':i.review.status==='checked'?'blue':i.severity==='block'?'red':'yellow';
  return `<div class="reg-issue ${i.severity}">
   <div class="top">
    <div><strong>${escapeHtml(i.name)}</strong><div class="tiny">Licence ${escapeHtml(i.license||'—')}</div></div>
    <span class="badge ${badgeClass}">${statusLabel[i.review.status]||'À VÉRIFIER'}</span>
   </div>
   <div class="eligibility ${i.severity}">
    <strong>${escapeHtml(i.title)}</strong>
    <div class="tiny">${escapeHtml(i.detail)}</div>
    <div class="reg-rule">${escapeHtml(i.ref)}</div>
    ${i.effectDate||i.endDate?`<div class="reg-review-meta tiny"><strong>Période :</strong> ${i.effectDate?formatDisciplineDate(i.effectDate):'—'} → ${i.endDate?formatDisciplineDate(i.endDate):'—'}${i.dateState.label?` • ${escapeHtml(i.dateState.label)}`:''}</div>`:''}
   </div>
   <div class="reg-review-actions">
    <select onchange="setRegulatoryReviewStatus(${keyArgs},this.value)">
     <option value="pending" ${i.review.status==='pending'?'selected':''}>À vérifier</option>
     <option value="checked" ${i.review.status==='checked'?'selected':''}>Vérifié</option>
     <option value="validated" ${i.review.status==='validated'?'selected':''}>Validé</option>
     <option value="closed" ${i.review.status==='closed'?'selected':''}>Clos</option>
    </select>
    <input value="${escapeHtml(i.review.note||'')}" placeholder="Note de vérification…" onchange="setRegulatoryReviewNote(${keyArgs},this.value)">
   </div>
   ${i.review.updatedAt?`<div class="tiny" style="margin-top:6px">Dernière mise à jour : ${formatDisciplineDateTime(i.review.updatedAt)}${i.review.autoClosed?' • clôture automatique sur échéance':''}</div>`:''}
   <div class="member-quick-actions">
    <button class="ghost" onclick="openMemberDetail('${i.memberId}')">Fiche licencié</button>
    <button class="ghost" onclick="goTo('discipline')">Discipline</button>
    <button class="ghost" onclick="openDocumentsForIssue('${i.kind}')">Document utile</button>
    <button class="ghost" onclick="openOfficialDoc('reglement2026')">Règlement</button>
   </div>
  </div>`;
 }).join(''):'<div class="tiny">Aucune situation réglementaire correspondant aux filtres.</div>';
}
