function renderAccessAudit(){
 const rows=accessAuditResults(),ok=rows.filter(x=>x.ok).length;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('auditCheckCount',rows.length);set('auditCheckOk',ok);set('auditCheckWarn',rows.length-ok);
 const box=document.getElementById('accessAuditChecks');if(box)box.innerHTML=rows.map(x=>`<div class="stats-health-row"><div><strong>${escapeHtml(x.label)}</strong><div class="tiny">${escapeHtml(x.detail)}</div></div><span class="badge ${x.ok?'green':'yellow'}">${x.ok?'OK':'À corriger'}</span></div>`).join('');
}


let dashboardWeekOffset=0;

