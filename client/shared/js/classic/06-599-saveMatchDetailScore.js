function saveMatchDetailScore(){
 if(!currentAdminCan('matches','edit'))return toast('Accès refusé','Modification des matchs non autorisée.');
 const m=matchById(currentMatchId);
 if(!m)return toast('Score','Match introuvable.');
 const a=document.getElementById('matchDetailFcScore')?.value;
 const b=document.getElementById('matchDetailOppScore')?.value;
 if(a===''||b==='')return toast('Score','Les deux scores sont obligatoires.');
 const fc=Number(a),opp=Number(b);
 if(!Number.isInteger(fc)||!Number.isInteger(opp)||fc<0||opp<0)return toast('Score','Saisissez deux scores entiers positifs ou nuls.');

 // Champs normalisés : toujours CLUB EXEMPLE puis adversaire.
 m.fcScore=fc;
 m.oppScore=opp;

 // Champs historiques domicile/extérieur conservés avec la bonne orientation.
 const away=norm(m.homeAway||'').includes('ext') || norm(m.homeAway||'').includes('away');
 if(away){m.homeScore=opp;m.awayScore=fc;}
 else{m.homeScore=fc;m.awayScore=opp;}

 m.status='Terminé';
 m.updatedAt=new Date().toISOString();
 save();
 if(typeof logAdminAction==='function')logAdminAction('Matchs','Score',`${matchTeamName(m)} / ${matchOpponentName(m)} : ${fc}-${opp}`);
 renderMatchDetail();
 renderMatchList();
 if(typeof renderDashboard==='function')renderDashboard();
 toast('Résultat',`Score enregistré : ${fc} - ${opp}.`);
}
