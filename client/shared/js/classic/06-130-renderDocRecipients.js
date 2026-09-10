function renderDocRecipients(){
 const sel=document.getElementById('docMemberRecipient');if(!sel)return;
 const current=sel.value;
 const people=(state.members||[]).filter(m=>m.email).sort((a,b)=>(a.last||'').localeCompare(b.last||''));
 sel.innerHTML='<option value="">Choisir un licencié</option>'+people.map(m=>`<option value="${m.id}" ${current===m.id?'selected':''}>${m.last||''} ${m.first||''} — ${m.email}</option>`).join('');
}
