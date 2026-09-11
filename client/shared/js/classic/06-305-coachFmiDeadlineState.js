function coachFmiDeadlineState(match){
 if(coachMatchPlayed(match))return {status:'past',label:'Match terminé',hours:null};
 const kickoff=coachMatchKickoffDate(match);if(!kickoff)return {status:'unknown',label:'Date/heure à vérifier',hours:null};
 const hours=(+kickoff-Date.now())/3600000;
 return {status:hours<0?'past':hours<=48?'due':'ahead',label:hours<0?'Match commencé — statut à vérifier':hours<=48?'Rappel interne J−2 atteint':'Préparation à anticiper',hours};
}
