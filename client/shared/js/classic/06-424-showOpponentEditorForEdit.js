function showOpponentEditorForEdit(o){
 resetClubSheetSections();
 const shell=document.getElementById('opponentEditorShell');
 const title=document.getElementById('opponentEditorTitle');
 const subtitle=document.getElementById('opponentEditorSubtitle');
 if(title)title.textContent=`Modifier — ${o.name||'Club'}`;
 if(subtitle)subtitle.textContent='Toutes les rubriques de la fiche sont modifiables.';
 if(shell)shell.classList.add('show');
 setTimeout(()=>shell?.scrollIntoView({behavior:'smooth',block:'start'}),0);
}

