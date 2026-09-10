function runAutomationEngine(){
 ensureAutomationDefaults();
 state.automationProposals=(state.automationProposals||[]).filter(p=>p.status==='approved'||p.status==='pending');
 runMatchAutomations?.();
 runDisciplineAutomations?.();
 runLicenseAutomations?.();
 runDocumentAutomations?.();
 state.automationLastRun=new Date().toLocaleString('fr-FR');
 addAutomationLog('Moteur d’automatisation exécuté.','ok');
 save();renderAutomation();
}

