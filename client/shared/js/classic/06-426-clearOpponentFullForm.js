function clearOpponentFullForm(){
 const ids=[
  'oppClubName','oppClubCity','oppClubColor','oppFffAffiliation','oppFffAffiliationDate','oppFffLeague','oppFffDistrict',
  'oppFffJournalDate','oppFffPrefectureNumber','oppFffYouthApprovalNumber','oppFffYouthApprovalDate','oppFffSiret','oppFffNaf','oppFffCnds','oppFffBudget',
  'oppFffAddress','oppFffAddress2','oppFffPostalCode','oppFffLocality','oppFffPhone','oppFffWorkMobile','oppFffEmail','oppFffMainEmail','oppFffOtherEmail1','oppFffOtherEmail2','oppFffWebsite','oppFffColors','oppFffLevel',
  'oppFffPresident','oppFffSecretary','oppFffTreasurer','oppFffCorrespondent','oppFffPefReferent','oppFffRefereeReferent','oppFffTechnicalSchool','oppFffU15Manager','oppFffWomenManager','oppFffVeteransManager',
  'oppFffPractitioners','oppFffPractitionersEvolution','oppFffStaffCounts','oppFffStaffEvolution','oppFffCdi','oppFffCdd','oppFffAssistedContracts','oppFffFullTime','oppFffPartTime','oppFffFederalPlayers','oppFffContractEducators','oppFffEducatorCdd','oppFffEducatorCdi',
  'oppFffVenue','oppFffNni','oppFffVenueLocality','oppFffSurface','oppFffClubhouse','oppFffMinibuses','oppFffVolunteers','oppFffActivities','oppFffEngagements','oppFffHonours','oppFffDistinctions','oppFffFoundationPilot','oppFffSuspensions'
 ];
 ids.forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
 currentOpponentEditId=null;
}

