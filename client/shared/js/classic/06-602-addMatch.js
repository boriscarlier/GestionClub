function addMatch(){
 if(!currentAdminCan('matches','create'))return toast('Accès refusé','Création de match non autorisée.');
 const firstTeam=(state.teams||[])[0]?.name||'Seniors 1',id=uid('g');
 state.matches.push({id,date:new Date().toISOString().slice(0,10),time:'18:00',team:firstTeam,sourceTeam:firstTeam,opponent:'Nouvel adversaire',opponentClub:'Nouvel adversaire',competitionType:'Championnat',competition:'',homeAway:'Domicile',place:'Stade des Jacques',venueCity:'Saint-Joseph',fcScore:null,oppScore:null,homeScore:null,awayScore:null,status:'À venir',sourceFormat:'MANUAL'});
 save();if(typeof logAdminAction==='function')logAdminAction('Matchs','Création',firstTeam);
 currentMatchId=id;
 if(goTo('matchdetail')!==false){renderMatchDetail();setTimeout(()=>document.getElementById('matchEditOpponent')?.focus(),0);}
 toast('Match','Nouveau match créé. Complétez puis enregistrez les informations.');
}
