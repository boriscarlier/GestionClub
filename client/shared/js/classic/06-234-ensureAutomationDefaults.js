function ensureAutomationDefaults(){
 if(!state.automationRules||!state.automationRules.length)state.automationRules=JSON.parse(JSON.stringify(defaultAutomationRules));
}
