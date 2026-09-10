function editOpponentClub(id){
 const o=(state.opponents||[]).find(x=>x.id===id);
 if(!o)return;
 currentOpponentEditId=id;
 showOpponentEditorForEdit(o);
 const f=o.fff||{};
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v??''};
 set('oppClubName',o.name);set('oppClubCity',o.city);set('oppClubColor',o.color);
 const map={
  oppFffAffiliation:'affiliation',oppFffAffiliationDate:'affiliationDate',oppFffLeague:'league',oppFffDistrict:'district',
  oppFffJournalDate:'journalPublicationDate',oppFffPrefectureNumber:'prefectureNumber',oppFffYouthApprovalNumber:'youthSportsApprovalNumber',
  oppFffYouthApprovalDate:'youthSportsApprovalDate',oppFffSiret:'siret',oppFffNaf:'naf',oppFffCnds:'cndsNumber',oppFffBudget:'budget',
  oppFffAddress:'address',oppFffAddress2:'address2',oppFffPostalCode:'postalCode',oppFffLocality:'locality',
  oppFffPhone:'phone',oppFffWorkMobile:'workMobile',oppFffEmail:'officialEmail',oppFffMainEmail:'mainEmail',
  oppFffOtherEmail1:'otherEmail1',oppFffOtherEmail2:'otherEmail2',oppFffWebsite:'website',oppFffColors:'colors',oppFffLevel:'level',
  oppFffPresident:'president',oppFffSecretary:'secretary',oppFffTreasurer:'treasurer',oppFffCorrespondent:'correspondent',
  oppFffPefReferent:'pefReferent',oppFffRefereeReferent:'refereeReferent',oppFffTechnicalSchool:'technicalSchoolManager',
  oppFffU15Manager:'u15Manager',oppFffWomenManager:'womenManager',oppFffVeteransManager:'veteransManager',
  oppFffPractitioners:'practitioners',oppFffPractitionersEvolution:'practitionersEvolution',oppFffStaffCounts:'staffCounts',
  oppFffStaffEvolution:'staffEvolution',oppFffCdi:'cdi',oppFffCdd:'cdd',oppFffAssistedContracts:'assistedContracts',
  oppFffFullTime:'fullTime',oppFffPartTime:'partTime',oppFffFederalPlayers:'federalPlayers',oppFffContractEducators:'contractEducators',
  oppFffEducatorCdd:'educatorCdd',oppFffEducatorCdi:'educatorCdi',oppFffVenue:'venueName',oppFffNni:'nni',
  oppFffVenueLocality:'venueLocality',oppFffSurface:'surface',oppFffClubhouse:'clubhouse',oppFffMinibuses:'minibuses',
  oppFffVolunteers:'volunteers',oppFffActivities:'activities',oppFffEngagements:'engagements',oppFffHonours:'honours',
  oppFffDistinctions:'distinctions',oppFffFoundationPilot:'foundationPilot',oppFffSuspensions:'suspensions'
 };
 Object.entries(map).forEach(([id,key])=>set(id,f[key]));
 opponentLogoDraft=o.logo||'';
 set('oppClubLogoUrl',o.logo&&/^https?:/i.test(o.logo)?o.logo:'');
 const web=document.getElementById('oppWebLogoPreview');if(web)web.innerHTML='';
 const box=document.getElementById('oppLogoPreview');
 if(box)box.innerHTML=o.logo?`<img src="${o.logo}" alt="Aperçu logo" style="width:60px;height:60px;object-fit:contain;background:#fff;border-radius:10px;padding:4px">`:'';

 toast('Club adverse','Fiche complète chargée : toutes les rubriques sont modifiables.');
}
