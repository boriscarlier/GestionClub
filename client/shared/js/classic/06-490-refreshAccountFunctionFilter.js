function refreshAccountFunctionFilter(){
 const sel=document.getElementById('accountFunctionFilter');if(!sel)return;
 const current=sel.value;
 const vals=[...new Set((state.accounts||[]).map(a=>String(a.function||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
 sel.innerHTML='<option value="">Toutes fonctions</option>'+vals.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
 if(vals.includes(current))sel.value=current;
}
