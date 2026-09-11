function renderAlertCenter(){
 const __importFreshAlerts=typeof importFreshnessAlerts==='function'?importFreshnessAlerts():[];

 const el=document.getElementById('alertCenterList');if(!el)return;
 const all=collectAlertCenter(),q=norm(document.getElementById('alertQuery')?.value||''),sev=document.getElementById('alertSeverity')?.value||'',kind=document.getElementById('alertKind')?.value||'';
 const list=all.filter(a=>(!q||norm(a.title+' '+a.text).includes(q))&&(!sev||a.severity===sev)&&(!kind||a.kind===kind));
 document.getElementById('alertCritical').textContent=all.filter(a=>a.severity==='critical').length;
 document.getElementById('alertWarning').textContent=all.filter(a=>a.severity==='warning').length;
 document.getElementById('alertInfo').textContent=all.filter(a=>a.severity==='info').length;
 document.getElementById('alertTotal').textContent=all.length;
 el.innerHTML=list.length?list.map(a=>`<div class="auto-proposal ${a.severity}"><strong>${a.severity==='critical'?'🔴':a.severity==='warning'?'🟠':'🟡'} ${a.title}</strong><div class="tiny">${a.text}</div><div class="auto-actions">${a.memberId?`<button class="ghost" onclick="openMemberDetail('${a.memberId}')">Fiche licencié</button>`:''}<button class="ghost" onclick="goTo('${a.actionPage}')">Ouvrir le module</button></div></div>`).join(''):'<div class="tiny">Aucune alerte correspondant aux filtres.</div>';
}



