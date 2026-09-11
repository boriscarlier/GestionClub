function goTo(page){
 if(!adminPageExists(page)){
  console.error('Page Administration introuvable :',page);
  if(typeof toast==='function')toast('Navigation','Page Administration introuvable.');
  return false;
 }
 if(!enforcePagePermission(page))return false;

 closeAdminMobileSidebar();
 closeAdministrationTransientUI(page);

 const pages=document.querySelectorAll('#intranetApp .page');
 pages.forEach(p=>p.classList.toggle('active',p.id===page));
 const navAlias={memberdetail:'members',teamdetailadmin:'teams',matchdetail:'matches',opponentdetail:'opponents',accountdetail:'accounts',import:'importwatch'}[page]||page;
 document.querySelectorAll('#intranetApp .nav button[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===navAlias));
 syncAdminNavGroups(page);
 const title=document.getElementById('pageTitle');
 if(title)title.textContent=ADMIN_PAGE_TITLES[page]||page;
 if(page==='dashboard'&&typeof renderDashboard==='function')renderDashboard();
 if(page==='members'&&typeof refreshServerMembers==='function')refreshServerMembers().then(()=>typeof renderMembers==='function'&&renderMembers());
 if(page==='memberdetail'&&currentMemberId&&typeof renderMemberDetail==='function')renderMemberDetail();
 if(page==='visual'&&typeof renderVisualFields==='function'){renderVisualFields();if(typeof generateVisual==='function')generateVisual();}
 if(page==='import'){if(typeof updateExpectedColumns==='function')updateExpectedColumns();if(typeof renderImportHistory==='function')renderImportHistory();}
 if(page==='documents'){if(typeof renderOfficialDocs==='function')renderOfficialDocs();if(typeof renderDocRecipients==='function')renderDocRecipients();}
 if(page==='discipline'&&typeof renderDiscipline==='function')renderDiscipline();
 if(page==='admincheck'&&typeof renderAdministrativeChecks==='function')renderAdministrativeChecks();
 if(page==='regcheck'&&typeof renderRegulatoryChecks==='function')renderRegulatoryChecks();
 if(page==='automation'&&typeof renderAutomation==='function')renderAutomation();
 if(page==='alerts'&&typeof renderAlertCenter==='function')renderAlertCenter();

 if(page==='documentcenter'&&typeof renderDocumentCenter==='function')renderDocumentCenter();

 if(page==='matchdetail'&&typeof renderMatchDetail==='function')renderMatchDetail();

 if(page==='matches'&&typeof renderMatchList==='function')renderMatchList();

 if(page==='teams'&&typeof refreshServerTeams==='function')refreshServerTeams().then(()=>typeof renderAdminTeams==='function'&&renderAdminTeams());

 if(page==='teamdetailadmin'&&typeof renderAdminTeamDetail==='function')renderAdminTeamDetail();

 if(page==='opponents'&&typeof renderOpponentClubs==='function')renderOpponentClubs();

 if(page==='opponentdetail'&&typeof renderOpponentDetail==='function')renderOpponentDetail();

 if(page==='importwatch'&&typeof renderImportWatch==='function')renderImportWatch();

 if(page==='import'&&typeof configureUnifiedImportTarget==='function')configureUnifiedImportTarget();

 if(page==='statistics'&&typeof renderStatisticsDashboard==='function')renderStatisticsDashboard();

 if(page==='statistics-members'&&typeof renderStatisticsMembersDetail==='function')renderStatisticsMembersDetail();

 if(page==='statistics-members-advanced'&&typeof renderStatisticsMembersAdvanced==='function')renderStatisticsMembersAdvanced();

 if(page==='statistics-teams'&&typeof renderStatisticsTeams==='function')renderStatisticsTeams();

 if(page==='statistics-results'&&typeof renderStatisticsResults==='function')renderStatisticsResults();

 if(page==='statistics-discipline'&&typeof renderStatisticsDiscipline==='function')renderStatisticsDiscipline();

 if(page==='statistics-opponents'&&typeof renderStatisticsOpponents==='function')renderStatisticsOpponents();

 if(page==='statistics-data'&&typeof renderStatisticsDataQuality==='function')renderStatisticsDataQuality();

 if(page==='accounts'&&typeof renderAccounts==='function')renderAccounts();
 if(page==='accountdetail'&&typeof renderAccountDetail==='function')renderAccountDetail();

 if(page==='permissions'&&typeof renderPermissions==='function')renderPermissions();

 if(page==='auditlog'&&typeof renderAuditLog==='function')renderAuditLog();

 if(page==='accessadmin'&&typeof renderAccessAdmin==='function')renderAccessAdmin();

 if(page==='accessaudit'&&typeof renderAccessAudit==='function')renderAccessAudit();

 window.scrollTo({top:0,behavior:'smooth'});
 return true;

 updateStatsReturnBars(page);
 return true;

 if(page==='members'&&typeof renderMembers==='function')renderMembers();

 if(page==='teams'&&typeof renderAdminTeams==='function')renderAdminTeams();

 if(page==='planning'&&typeof renderPlanning==='function')renderPlanning();
}

