function prototypeScenarioState(){
 try{return JSON.parse(localStorage.getItem(PROTOTYPE_SCENARIO_KEY)||'{}')}catch(e){return {}}
}
