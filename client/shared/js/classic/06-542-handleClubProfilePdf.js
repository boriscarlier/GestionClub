async function handleClubProfilePdf(event){
 const file=event.target.files?.[0];
 const status=document.getElementById('clubProfileImportStatus');
 if(!file)return;
 if(status)status.textContent='Analyse de la fiche Footclubs en cours…';
 try{
  const pages=await extractPdfPagesFromFile(file);
  const fullText=pages.map(p=>p.text).join('\n');
  const parsed=parseClubProfileExtra(fullText,parseFffClubText(fullText));
  if(!parsed.affiliation)throw new Error("Numéro d’affiliation non détecté");
  state.clubProfile=state.clubProfile||{official:{},manual:{},source:null,history:[]};
  state.clubProfile.official={
   ...(state.clubProfile.official||{}),
   name:parsed.name||'',affiliation:parsed.affiliation||'',affiliationDate:parsed.affiliationDate||'',
   league:parsed.league||'',district:parsed.district||'',prefecture:parsed.prefecture||'',
   siret:parsed.siret||'',naf:parsed.naf||'',address:parsed.address||'',phone:parsed.phone||'',
   officialEmail:parsed.officialEmail||'',primaryEmail:parsed.primaryEmail||'',
   president:parsed.president||'',secretary:parsed.secretary||'',treasurer:parsed.treasurer||'',
   correspondent:parsed.correspondent||'',pefReferent:parsed.pefReferent||'',refereeReferent:parsed.refereeReferent||'',
   venueName:parsed.venueName||'',nni:parsed.nni||'',venueCity:parsed.venueCity||'',
   volunteers:parsed.volunteers||''
  };
  const record={filename:file.name,importedAt:new Date().toISOString(),season:parsed.season||'',affiliation:parsed.affiliation};
  state.clubProfile.source=record;
  state.clubProfile.history=[record,...(state.clubProfile.history||[])].slice(0,12);
  if(typeof logAdminAction==='function')logAdminAction('Imports','Fiche Footclubs',file.name||'Fiche club Footclubs');
  recordImport('clubprofile',{
   filename:file.name||'Fiche club Footclubs',
   itemCount:1,
   source:'Paramétrage du club / Footclubs',
   note:parsed.season?`Saison ${parsed.season}`:''
  });
  localStorage.setItem(KEY,JSON.stringify(state));
  renderClubProfileSettings();
  if(status)status.textContent=`Fiche officielle intégrée : ${file.name}. Les compléments manuels ont été conservés.`;
  if(typeof logAdminAction==='function')logAdminAction('Paramétrage club','Import fiche Footclubs',file.name);
  toast('Paramétrage du club','Fiche Footclubs importée.');
 }catch(err){
  console.error('Import fiche club gestionnaire',err);
  if(status)status.textContent='Échec de lecture : '+String(err.message||err);
 }
}

