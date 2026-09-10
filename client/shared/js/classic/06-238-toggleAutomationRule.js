function toggleAutomationRule(id,enabled){
 ensureAutomationDefaults();const r=state.automationRules.find(x=>x.id===id);if(r)r.enabled=enabled;save();renderAutomation();
}
