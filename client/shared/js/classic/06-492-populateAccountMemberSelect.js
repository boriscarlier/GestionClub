function populateAccountMemberSelect(selected=''){
 const sel=document.getElementById('accMemberLink');if(!sel)return;
 const members=[...(state.members||[])].sort((a,b)=>String(a.last||a.fullName||'').localeCompare(String(b.last||b.fullName||''),'fr'));
 sel.innerHTML='<option value="">Aucun rattachement</option>'+members.map(m=>`<option value="${m.id}">${escapeHtml(m.fullName||`${m.last||''} ${m.first||''}`.trim())} • ${escapeHtml(m.licenseNumber||'sans licence')}</option>`).join('');
 sel.value=selected||'';
}
