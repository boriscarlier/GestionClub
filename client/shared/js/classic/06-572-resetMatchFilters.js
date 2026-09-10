function resetMatchFilters(){
 const q=document.getElementById('matchSearch');
 const s=document.getElementById('matchSort');
 const t=document.getElementById('matchTeamFilter');
 const ct=document.getElementById('matchCompetitionTypeFilter');
 const ha=document.getElementById('matchHomeAwayFilter');
 if(q)q.value='';
 if(s)s.value='date-asc';
 if(t)t.value='';
 if(ct)ct.value='';
 if(ha)ha.value='';
 matchStatusFilter='';
 document.querySelectorAll('[data-match-filter]').forEach(b=>b.classList.toggle('active',b.dataset.matchFilter===''));
 renderMatchList();
}
