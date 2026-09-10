function prototypeToggleScenario(id){
 const st=prototypeScenarioState();
 st[id]=!st[id];
 prototypeSaveScenarioState(st);
 prototypeRenderScenarios();
}
