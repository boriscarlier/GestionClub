function emailDocsForCurrentMember(){
 const m=(state.members||[]).find(x=>x.id===currentMemberId); if(!m)return;
 const docs=relevantDocsForMember(m).map(officialDocById).filter(Boolean);
 if(!docs.length)return toast('Documents','Aucun document associé.');
 window.location.href=mailtoForDocs(docs,m.email||m.guardianEmail||'');
}
