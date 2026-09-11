function opponentFullFormValues(){
 const v=id=>document.getElementById(id)?.value?.trim?.()||'';
 return {
  name:v('oppClubName'),city:v('oppClubCity'),color:v('oppClubColor'),
  fff:{
   affiliation:v('oppFffAffiliation'),affiliationDate:v('oppFffAffiliationDate'),
   league:v('oppFffLeague'),district:v('oppFffDistrict'),
   journalPublicationDate:v('oppFffJournalDate'),prefectureNumber:v('oppFffPrefectureNumber'),
   youthSportsApprovalNumber:v('oppFffYouthApprovalNumber'),youthSportsApprovalDate:v('oppFffYouthApprovalDate'),
   siret:v('oppFffSiret'),naf:v('oppFffNaf'),cndsNumber:v('oppFffCnds'),budget:v('oppFffBudget'),
   address:v('oppFffAddress'),address2:v('oppFffAddress2'),postalCode:v('oppFffPostalCode'),
   locality:v('oppFffLocality'),phone:v('oppFffPhone'),workMobile:v('oppFffWorkMobile'),
   officialEmail:v('oppFffEmail'),mainEmail:v('oppFffMainEmail'),otherEmail1:v('oppFffOtherEmail1'),
   otherEmail2:v('oppFffOtherEmail2'),website:v('oppFffWebsite'),colors:v('oppFffColors'),level:v('oppFffLevel'),
   president:v('oppFffPresident'),secretary:v('oppFffSecretary'),treasurer:v('oppFffTreasurer'),
   correspondent:v('oppFffCorrespondent'),pefReferent:v('oppFffPefReferent'),refereeReferent:v('oppFffRefereeReferent'),
   technicalSchoolManager:v('oppFffTechnicalSchool'),u15Manager:v('oppFffU15Manager'),
   womenManager:v('oppFffWomenManager'),veteransManager:v('oppFffVeteransManager'),
   practitioners:v('oppFffPractitioners'),practitionersEvolution:v('oppFffPractitionersEvolution'),
   staffCounts:v('oppFffStaffCounts'),staffEvolution:v('oppFffStaffEvolution'),
   cdi:v('oppFffCdi'),cdd:v('oppFffCdd'),assistedContracts:v('oppFffAssistedContracts'),
   fullTime:v('oppFffFullTime'),partTime:v('oppFffPartTime'),federalPlayers:v('oppFffFederalPlayers'),
   contractEducators:v('oppFffContractEducators'),educatorCdd:v('oppFffEducatorCdd'),educatorCdi:v('oppFffEducatorCdi'),
   venueName:v('oppFffVenue'),nni:v('oppFffNni'),venueLocality:v('oppFffVenueLocality'),surface:v('oppFffSurface'),
   clubhouse:v('oppFffClubhouse'),minibuses:v('oppFffMinibuses'),volunteers:v('oppFffVolunteers'),
   activities:v('oppFffActivities'),engagements:v('oppFffEngagements'),honours:v('oppFffHonours'),
   distinctions:v('oppFffDistinctions'),foundationPilot:v('oppFffFoundationPilot'),suspensions:v('oppFffSuspensions')
  }
 };
}
