function resetClubSheetSections(){
 document.querySelectorAll('#opponentEditorShell .club-sheet-section').forEach((section,index)=>{
  section.classList.toggle('closed',index>=3);
 });
}

