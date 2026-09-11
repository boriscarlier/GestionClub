function runDocumentAutomations(){
 if(!ruleEnabled('document-suggest'))return;
 (state.members||[]).forEach(m=>{
  const ids=relevantDocsForMember(m),docs=ids.map(officialDocById).filter(Boolean);
  if(!docs.length)return;
  const issues=administrativeIssuesForMember(m);
  const relevant=issues.filter(i=>['medical','guardian','license','transfer'].includes(i.kind));
  if(relevant.length){
   addAutomationProposal({key:`docs:${m.id}:${ids.sort().join(',')}`,ruleId:'document-suggest',entityType:'member',entityId:m.id,severity:relevant.some(i=>i.severity==='critical')?'critical':'warning',title:`Documents à proposer — ${m.last||''} ${m.first||''}`,text:`${docs.map(d=>d.title).join(' • ')}`,actionPage:'documents'});
  }
 });
}

