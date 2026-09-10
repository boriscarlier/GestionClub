function addAutomationLog(text,type='info'){
 state.automationLog.unshift({id:autoUid('al'),date:new Date().toLocaleString('fr-FR'),text,type});
 state.automationLog=state.automationLog.slice(0,100);
}
