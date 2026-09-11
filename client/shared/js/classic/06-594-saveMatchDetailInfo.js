function saveMatchDetailInfo(){
 if(!currentAdminCan('matches','edit'))return toast('Accès refusé','Modification des matchs non autorisée.');
 const m=matchById(currentMatchId);if(!m)return toast('Match','Match introuvable.');
 const val=id=>document.getElementById(id)?.value?.trim?.()||'';
 if(!val('matchEditDate'))return toast('Match','La date est obligatoire.');
 if(!val('matchEditTeam'))return toast('Match','L’équipe CLUB EXEMPLE est obligatoire.');
 if(!val('matchEditOpponent'))return toast('Match','L’adversaire est obligatoire.');
 m.date=val('matchEditDate');m.time=val('matchEditTime');m.team=val('matchEditTeam');m.sourceTeam=m.team;
 m.opponent=val('matchEditOpponent');m.opponentClub=m.opponent;m.competitionType=val('matchEditCompetitionType')||'Autre';
 m.competition=val('matchEditCompetition');m.homeAway=val('matchEditHomeAway');m.place=val('matchEditPlace');
 m.venueCity=val('matchEditCity');m.status=val('matchEditStatus')||'À venir';m.matchNumber=val('matchEditNumber');m.phase=val('matchEditPhase');
 m.updatedAt=new Date().toISOString();save();
 if(typeof logAdminAction==='function')logAdminAction('Matchs','Modification',`${m.team} / ${m.opponent}`);
 renderMatchDetail();renderMatchList();if(typeof renderDashboard==='function')renderDashboard();
 toast('Match','Informations du match enregistrées.');
}
