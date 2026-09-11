function applyOpponentFffImport(){
 const d=opponentFffImportDraft;
 if(!d)return;
 const matchName=document.getElementById('oppFffMatchName')?.value||'';
 const finalName=matchName||d.name;
 if(!finalName)return toast('Import FFF','Nom du club non détecté.');

 document.getElementById('oppClubName').value=finalName;
 document.getElementById('oppClubCity').value=d.venueCity||'';
 document.getElementById('oppMatchClubSelect').value=matchName||'';

 // Store structured FFF data on existing/new record when saved.
 window.__opponentFffPendingData={
  affiliation:d.affiliation,
  league:d.league,
  district:d.district,
  affiliationDate:d.affiliationDate,
  prefecture:d.prefecture,
  siret:d.siret,
  naf:d.naf,
  phone:d.phone,
  officialEmail:d.officialEmail||d.primaryEmail,
  address:d.address,
  president:d.president,
  secretary:d.secretary,
  treasurer:d.treasurer,
  correspondent:d.correspondent,
  venueName:d.venueName,
  nni:d.nni,
  venueCity:d.venueCity,
  importedFrom:'Fiche club FFF PDF'
 };

 resetClubSheetSections();
 const shell=document.getElementById('opponentEditorShell');
 if(shell)shell.classList.add('show');
 const title=document.getElementById('opponentEditorTitle');if(title)title.textContent='Nouvelle fiche depuis import FFF';
 toast('Import FFF','Informations préremplies. Vérifiez puis enregistrez la fiche.');
 shell?.scrollIntoView({behavior:'smooth',block:'start'});
}
