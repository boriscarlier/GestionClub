function emailOfficialDoc(id){
 const d=officialDocById(id);if(!d)return;
 const email=document.getElementById('docRecipientEmail')?.value||'';
 window.location.href=mailtoForDocs([d],email);
}
