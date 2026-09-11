function setMatchCompetitionTypeFilter(type){
 const el=document.getElementById('matchCompetitionTypeFilter');
 if(el)el.value=type||'';
 renderMatchList();
}


