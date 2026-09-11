function openDocsForCurrentMember(){
 const m=(state.members||[]).find(x=>x.id===currentMemberId); if(!m)return;
 selectedOfficialDocs=relevantDocsForMember(m); goTo('documents'); renderOfficialDocs(); renderDocRecipients();
 const sel=document.getElementById('docMemberRecipient'); if(sel){sel.value=m.id; fillDocRecipientEmail();}
}
