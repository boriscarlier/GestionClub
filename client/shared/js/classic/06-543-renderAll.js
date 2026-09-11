function renderAll(){
 const safe=(name,fn)=>{
  try{fn();}
  catch(err){
   console.error(`Erreur de rendu ${name}`,err);
   const diag=document.getElementById('startupDiagnostics');
   if(diag)diag.textContent=`Erreur de rendu ${name} : ${err.message||err}`;
  }
 };

 if(typeof renderDocumentCenter==='function')safe('Documents',renderDocumentCenter);
 if(typeof renderStatisticsDashboard==='function')safe('Statistiques',renderStatisticsDashboard);
 if(typeof renderStatisticsSourceSummary==='function')safe('Sources statistiques',renderStatisticsSourceSummary);
 if(typeof renderStatisticsMembersDetail==='function')safe('Statistiques licenciés',renderStatisticsMembersDetail);
 if(typeof renderStatisticsMembersAdvanced==='function')safe('Statistiques licenciés avancées',renderStatisticsMembersAdvanced);
 if(typeof renderStatisticsTeams==='function')safe('Statistiques équipes',renderStatisticsTeams);
 if(typeof renderStatisticsResults==='function')safe('Statistiques résultats',renderStatisticsResults);
 if(typeof renderStatisticsDiscipline==='function')safe('Statistiques discipline',renderStatisticsDiscipline);
 if(typeof renderStatisticsOpponents==='function')safe('Statistiques adversaires',renderStatisticsOpponents);
 if(typeof renderStatisticsDataQuality==='function')safe('Qualité des données',renderStatisticsDataQuality);
 if(typeof renderAccounts==='function')safe('Comptes',renderAccounts);
 if(typeof renderPermissions==='function')safe('Permissions',renderPermissions);
 if(typeof renderPermissionSummary==='function')safe('Synthèse permissions',renderPermissionSummary);
 if(typeof renderAuditLog==='function')safe('Journal',renderAuditLog);
 if(typeof renderAuditSummary==='function')safe('Synthèse audit',renderAuditSummary);
 if(typeof renderAccessAdmin==='function')safe('Accès',renderAccessAdmin);
 if(typeof renderAccessAudit==='function')safe('Audit des accès',renderAccessAudit);
 if(typeof renderDashboard==='function')safe('Dashboard',renderDashboard);
 if(typeof renderClubProfileSettings==='function')safe('Paramétrage club',renderClubProfileSettings);

 if(document.getElementById('memberRows'))safe('Licenciés',renderMembers);
 if(document.getElementById('intraTeams'))safe('Équipes',renderAdminTeams);
 if(document.getElementById('matchRows'))safe('Matchs',renderMatchList);

 if(typeof renderPlanning==='function')safe('Planning',renderPlanning);
 if(typeof renderCms==='function')safe('CMS',renderCms);
 if(typeof renderAdvancedMedia==='function')safe('Médiathèque',renderAdvancedMedia);
 if(typeof renderCommunication==='function')safe('Communication',renderCommunication);
 if(typeof renderCommunicationWorkflowSummary==='function')safe('Workflow communication',renderCommunicationWorkflowSummary);
 if(typeof renderCommunicationChannelSummary==='function')safe('Canaux communication',renderCommunicationChannelSummary);
 if(typeof updateExpectedColumns==='function')safe('Import colonnes',updateExpectedColumns);
 if(typeof renderImportHistory==='function')safe('Historique imports',renderImportHistory);
 if(typeof renderOfficialDocs==='function')safe('Documents officiels',renderOfficialDocs);
 if(typeof renderDocRecipients==='function')safe('Destinataires documents',renderDocRecipients);
 if(typeof renderDiscipline==='function')safe('Discipline',renderDiscipline);

 const visual=document.getElementById('visualMatchSelect');
 if(visual){
  safe('Sélecteur matchs visuels',()=>{
   visual.innerHTML=(state.matches||[]).map(m=>`<option value="${m.id}">${escapeHtml(m.date||'')} — ${escapeHtml(m.team||'')} / ${escapeHtml(m.opponent||'')}</option>`).join('');
  });
 }

 const cat=document.getElementById('mCategory');
 if(cat){
  safe('Catégories formulaire licencié',()=>{
   cat.innerHTML=(state.teams||[]).map(t=>`<option>${escapeHtml(t.name)}</option>`).join('');
  });
 }

 if(typeof renderPublic==='function')safe('Site public',renderPublic);
}


let publicProgramFilter='all';
let publicProgramSection='';
let publicProgramFocusId=null;

