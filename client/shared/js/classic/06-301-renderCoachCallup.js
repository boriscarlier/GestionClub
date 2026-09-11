function renderCoachCallup(){
 const sel=document.getElementById('coachCallupMatch'),root=document.getElementById('coachCallupList');if(!sel||!root)return;
 const match=coachTeamMatches().find(m=>m.id===sel.value&&!coachMatchPlayed(m));if(!match){root.innerHTML='<div class="tiny">Aucun match à convoquer.</div>';return;}
 const selected=state.coachCallups?.[match.id]||[];
 const players=coachTeamMembers();
 root.innerHTML=players.map(p=>{const st=coachPlayerStatus(p),checked=selected.includes(p.id);return `<div class="coach-callup"><label><input type="checkbox" ${checked?'checked':''} ${!checked&&!coachPlayerCanBeSelected(p)?'disabled':''} onchange="toggleCoachCallup('${match.id}','${p.id}',this.checked)"> <strong>${escapeHtml(`${p.last||''} ${p.first||''}`)}</strong></label><span class="badge">${escapeHtml(st.label)}</span></div>`;}).join('');
}
