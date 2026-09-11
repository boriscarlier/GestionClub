function qaBackupPayload(){
 return {format:'GESTION_CLUB_FULL_BACKUP',schemaVersion:1,build:QA_BUILD,exportedAt:new Date().toISOString(),state:JSON.parse(JSON.stringify(state)),lineups:JSON.parse(JSON.stringify(coachLineups||{})),feedback:prototypeFeedbackItems(),scenarios:prototypeScenarioState()};
}

