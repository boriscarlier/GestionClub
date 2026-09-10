function toggleCoachLineup(matchId,memberId,toSelected){
 if(!qaCoachMatchesAll().some(m=>m.id===matchId))return toast('Accès refusé','Match hors périmètre.');
 const before=JSON.parse(JSON.stringify(coachLineups)),rec=coachLineupRecord(matchId);
 const player=coachTeamMembers().find(m=>m.id===memberId);
 if(toSelected&&(!player||!coachPlayerCanBeSelected(player)))return toast('Composition','Joueur indisponible ou hors effectif.');
 if(!toSelected&&!rec.players.includes(memberId))return;
 if(toSelected)rec.players=[...new Set([...rec.players,memberId])];else rec.players=rec.players.filter(id=>id!==memberId);
 rec.status='draft';rec.updatedAt=new Date().toISOString();rec.updatedBy=coachCurrentMemberId;rec.team=coachCurrentTeamName;
 rec.playerSnapshots=rec.playerSnapshots||{};
 if(player)rec.playerSnapshots[player.id]={id:player.id,first:player.first||'',last:player.last||'',personNumber:player.personNumber||''};
 if(!qaPersistLineupChange(before))return;
 logAdminAction('Portail éducateurs','Brouillon composition',`${coachCurrentTeamName} • ${matchId} • ${rec.players.length} joueurs`);
 coachCurrentPage='lineup';renderCoachPortal();
}

const OFFICIAL_FMI_PREPARATION_URL='https://fmi-core-compo.fff.fr/v2';

