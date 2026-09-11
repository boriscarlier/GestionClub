function renderAdministrativeChecks(){
 const el=document.getElementById('administrativeIssues');if(!el)return;
 const all=allAdministrativeIssues(),q=norm(document.getElementById('checkQuery')?.value||''),sev=document.getElementById('checkSeverity')?.value||'',kind=document.getElementById('checkKind')?.value||'';
 const list=all.filter(i=>(!q||norm(i.name+' '+i.license+' '+i.title+' '+i.detail).includes(q))&&(!sev||i.severity===sev)&&(!kind||i.kind===kind));
 document.getElementById('checkTotal').textContent=all.length;
 document.getElementById('checkCritical').textContent=all.filter(i=>i.severity==='critical').length;
 document.getElementById('checkMedical').textContent=all.filter(i=>i.kind==='medical').length;
 document.getElementById('checkPayment').textContent=all.filter(i=>i.kind==='payment').length;
 document.getElementById('checkGuardian').textContent=all.filter(i=>i.kind==='guardian').length;
 el.innerHTML=list.length?list.map(i=>`<div class="admin-issue issue-${i.severity}">
  <div><strong>${i.name}</strong><div class="tiny">Licence ${i.license||'—'}</div></div>
  <div><span class="badge ${i.severity==='critical'?'red':i.severity==='warning'?'yellow':'blue'}">${i.severity==='critical'?'CRITIQUE':i.severity==='warning'?'À TRAITER':'INFO'}</span></div>
  <div><strong>${i.title}</strong><div class="tiny">${i.detail||''}</div></div>
  <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="ghost" onclick="openMemberDetail('${i.memberId}')">Ouvrir fiche</button><button class="ghost" onclick="openDocumentsForIssue('${i.kind}')">Document utile</button></div>
 </div>`).join(''):'<div class="tiny">Aucune anomalie correspondant aux filtres.</div>';
}


