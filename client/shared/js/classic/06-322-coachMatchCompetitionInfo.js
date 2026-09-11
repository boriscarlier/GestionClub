function coachMatchCompetitionInfo(m){
 const type=typeof matchCompetitionType==='function'?matchCompetitionType(m):'Autre';
 const name=String(m?.competition||m?.competitionName||m?.sourceCompetition||m?.shortName||'').trim();
 const phase=String(m?.phase||m?.round||m?.roundNumber||m?.phaseNumber||'').trim();
 return {type,name,phase};
}
