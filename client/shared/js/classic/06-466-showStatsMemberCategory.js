function showStatsMemberCategory(cat){
 const rows=(state.members||[]).filter(m=>String(m.category||m.team||m.categoryLabel||'Non classé')===cat);
 const el=document.getElementById('smCategoryMembers');if(!el)return;
 el.innerHTML=`<strong>${escapeHtml(cat)} — ${rows.length} licencié(s)</strong>`+
  (rows.length?`<div class="member-table-wrap" style="margin-top:8px"><table class="table"><thead><tr><th>Nom</th><th>Licence</th><th>Type</th><th>Statut</th></tr></thead><tbody>${rows.slice(0,100).map(m=>`<tr><td>${escapeHtml(m.fullName||`${m.last||''} ${m.first||''}`.trim())}</td><td>${escapeHtml(m.licenseNumber||'—')}</td><td>${escapeHtml(memberRoleLabel(m))}</td><td>${escapeHtml(m.status||m.license||'—')}</td></tr>`).join('')}</tbody></table></div>`:'');
}
