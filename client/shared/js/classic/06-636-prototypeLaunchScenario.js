function prototypeLaunchScenario(id){
 const sc=PROTOTYPE_SCENARIOS.find(x=>x.id===id);if(!sc)return;
 prototypeHideScenarios();
 try{Function(sc.action)()}catch(e){console.error(e)}
}
