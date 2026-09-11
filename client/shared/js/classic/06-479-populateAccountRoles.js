function populateAccountRoles(selected=[]){
 const sel=document.getElementById('accRoles');if(!sel)return;
 const chosen=new Set(Array.isArray(selected)?selected:[]);
 sel.innerHTML=(state.roles||[]).map(r=>`<option value="${r.id}" ${chosen.has(r.id)?'selected':''}>${escapeHtml(r.name)}</option>`).join('');
}
