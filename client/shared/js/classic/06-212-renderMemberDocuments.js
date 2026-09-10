function renderMemberDocuments(m){
 const el=document.getElementById('memberDocumentsBlock'); if(!el)return;
 const ids=relevantDocsForMember(m);
 const docs=ids.map(officialDocById).filter(Boolean);
 el.innerHTML=docs.length?docs.map(d=>`<div class="member-doc"><strong>${d.title}</strong><div class="tiny">${d.category}</div><div class="member-quick-actions"><button class="ghost" onclick="openOfficialDoc('${d.id}')">Ouvrir</button><button class="ghost" onclick="emailOfficialDoc('${d.id}')">Envoyer</button></div></div>`).join(''):'<div class="tiny">Aucun document automatiquement associé.</div>';
}
