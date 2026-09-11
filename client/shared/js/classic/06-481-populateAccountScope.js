function populateAccountScope(a=null){
 const type=document.getElementById('accScopeType');const teams=document.getElementById('accScopeTeams');if(!type||!teams)return;
 type.value=a?.scope?.type||'club';
 const chosen=new Set(a?.scope?.teams||[]);
 teams.innerHTML=(state.teams||[]).map(t=>`<option value="${escapeHtml(t.name)}" ${chosen.has(t.name)?'selected':''}>${escapeHtml(t.name)}</option>`).join('');
}
