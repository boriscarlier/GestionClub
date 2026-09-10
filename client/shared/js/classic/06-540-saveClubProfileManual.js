function saveClubProfileManual(){
 const get=id=>document.getElementById(id)?.value?.trim?.()||'';
 state.clubProfile=state.clubProfile||{official:{},manual:{},source:null,history:[]};
 const keys={
  name:'clubCfgName',affiliation:'clubCfgAffiliation',affiliationDate:'clubCfgAffiliationDate',
  league:'clubCfgLeague',district:'clubCfgDistrict',prefecture:'clubCfgPrefecture',
  siret:'clubCfgSiret',naf:'clubCfgNaf',address:'clubCfgAddress',phone:'clubCfgPhone',
  officialEmail:'clubCfgOfficialEmail',primaryEmail:'clubCfgMainEmail',
  president:'clubCfgPresident',secretary:'clubCfgSecretary',treasurer:'clubCfgTreasurer',
  correspondent:'clubCfgCorrespondent',pefReferent:'clubCfgPef',refereeReferent:'clubCfgReferee',
  venueName:'clubCfgVenue',nni:'clubCfgNni',venueCity:'clubCfgVenueCity',
  volunteers:'clubCfgVolunteers',notes:'clubCfgNotes'
 };
 const official=state.clubProfile.official||{};
 const manual={};
 Object.entries(keys).forEach(([key,id])=>{
  const value=get(id);
  if(value!==String(official[key]||''))manual[key]=value;
 });
 state.clubProfile.manual=manual;
 save();
 if(typeof logAdminAction==='function')logAdminAction('Paramétrage club','Modification manuelle','FC LA COUR');
 toast('Paramétrage du club','Modifications enregistrées.');
}
