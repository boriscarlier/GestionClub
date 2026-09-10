function ruleEnabled(id){ensureAutomationDefaults();return !!state.automationRules.find(r=>r.id===id&&r.enabled)}
