function renderDocSelectionSummary(){
 const el=document.getElementById('docSelectionSummary');if(!el)return;
 const docs=selectedOfficialDocs.map(officialDocById).filter(Boolean);
 el.innerHTML=docs.length?docs.map(d=>`<div>• ${d.title}</div>`).join(''):'Aucun document sélectionné.';
}
