function fillDocRecipientEmail(){
 const id=document.getElementById('docMemberRecipient')?.value;
 const m=(state.members||[]).find(x=>x.id===id);
 if(m&&document.getElementById('docRecipientEmail'))document.getElementById('docRecipientEmail').value=m.email||'';
}
