function toggleClubSheetSection(btn){
 const section=btn?.closest('.club-sheet-section');
 if(!section)return;
 section.classList.toggle('closed');
}

