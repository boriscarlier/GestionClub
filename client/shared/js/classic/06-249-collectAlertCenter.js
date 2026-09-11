function collectAlertCenter(){
 const items=[];
 (state.automationProposals||[]).filter(p=>p.status==='pending').forEach(p=>items.push({kind:'automation',severity:p.severity||'info',title:p.title,text:p.text||'',actionPage:p.actionPage||'automation'}));
 allAdministrativeIssues().forEach(i=>items.push({kind:'administrative',severity:i.severity==='critical'?'critical':i.severity==='warning'?'warning':'info',title:`${i.name} — ${i.title}`,text:i.detail||'',memberId:i.memberId,actionPage:'admincheck'}));
 allRegulatoryIssues().forEach(i=>items.push({kind:'regulatory',severity:i.severity==='block'?'critical':'warning',title:`${i.name} — ${i.title}`,text:i.detail||'',memberId:i.memberId,actionPage:'regcheck'}));
 return items;
}
