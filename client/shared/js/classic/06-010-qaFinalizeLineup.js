function qaFinalizeLineup(matchId){
 if(!qaCoachMatchesAll().some(m=>m.id===matchId))return false;
 const before=JSON.parse(JSON.stringify(coachLineups)),r=coachLineupRecord(matchId);
 if(!r.players.length){toast('Composition','Ajoutez au moins un joueur avant de valider.');return false;}
 r.status='final';r.finalizedAt=new Date().toISOString();r.updatedAt=r.finalizedAt;r.updatedBy=coachCurrentMemberId;
 if(!qaPersistLineupChange(before))return false;
 logAdminAction('Portail éducateurs','Validation composition',`${r.team} • ${matchId}`);renderCoachPortal();return true;
}

