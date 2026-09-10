function prototypeShowScenarios(){
 document.getElementById('prototypeScenarioModal')?.classList.add('show');
 document.getElementById('prototypeScenarioModal')?.setAttribute('aria-hidden','false');
 togglePrototypeTester(false);
 prototypeRenderScenarios();
}
