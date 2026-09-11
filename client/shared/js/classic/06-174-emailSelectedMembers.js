function emailSelectedMembers(){
 const emails=[...new Set(memberSourceRows().filter(m=>selectedMemberIds.includes(m.id)).map(m=>m.email).filter(Boolean))];
 if(!emails.length)return toast('Licenciés','Aucune adresse email dans la sélection.');
 window.location.href='mailto:'+emails.map(encodeURIComponent).join(',');
}

