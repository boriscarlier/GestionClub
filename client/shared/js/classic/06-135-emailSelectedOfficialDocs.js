function emailSelectedOfficialDocs(){
 const docs=selectedOfficialDocs.map(officialDocById).filter(Boolean);
 if(!docs.length)return toast('Documents','Sélectionne au moins un document.');
 const email=document.getElementById('docRecipientEmail')?.value||'';
 window.location.href=mailtoForDocs(docs,email);
}
