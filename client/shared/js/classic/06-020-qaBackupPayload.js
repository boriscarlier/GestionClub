function qaBackupPayload(){
 return {format:'FC_LA_COUR_FULL_BACKUP',schemaVersion:1,build:QA_BUILD,exportedAt:new Date().toISOString(),state:JSON.parse(JSON.stringify(state)),lineups:JSON.parse(JSON.stringify(coachLineups||{})),feedback:prototypeFeedbackItems(),scenarios:prototypeScenarioState()};
}

