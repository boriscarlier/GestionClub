function openNewOpponentClub(){
 clearOpponentFullForm();
 resetClubSheetSections();
 opponentLogoDraft='';
 window.__opponentFffPendingData=null;
 const shell=document.getElementById('opponentEditorShell');
 const title=document.getElementById('opponentEditorTitle');
 const subtitle=document.getElementById('opponentEditorSubtitle');
 if(title)title.textContent='Nouveau club';
 if(subtitle)subtitle.textContent='Créer une nouvelle fiche club complète.';
 if(shell)shell.classList.add('show');
 refreshOpponentMatchOptions();
 setTimeout(()=>{
  shell?.scrollIntoView({behavior:'smooth',block:'start'});
  document.getElementById('oppClubName')?.focus();
 },0);
}

