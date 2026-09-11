function fillPlanningEditorTeams(current){
 const sel=document.getElementById('planningEditTeam');if(!sel)return;
 const teams=['Club',...(state.teams||[]).map(t=>t.name)].filter(Boolean);
 const unique=[...new Set(teams)];
 sel.innerHTML=unique.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
 if(current&&!unique.includes(current))sel.innerHTML+=`<option value="${escapeHtml(current)}">${escapeHtml(current)}</option>`;
 sel.value=current||'Club';
}
