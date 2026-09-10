function coachOpenPlayerStats(memberId){
 const player=coachTeamMembers().find(p=>p.id===memberId);
 if(!player){toast('Statistiques joueur','Joueur hors périmètre.');return;}
 coachCurrentStatsPlayerId=memberId;
 renderCoachPlayerStats();
 const panel=document.getElementById('coachPlayerStatsPanel');
 if(panel)panel.scrollIntoView({behavior:'smooth',block:'start'});
}
