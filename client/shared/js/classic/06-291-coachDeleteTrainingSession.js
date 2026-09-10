function coachDeleteTrainingSession(id){
 const s=coachTrainingSessionById(id);
 if(!qaTrainingAccess(s)){toast('Entraînement','Séance hors périmètre.');return;}
 if(!confirm('Supprimer cette séance et sa fiche de présence ?'))return;
 state.coachTrainingSessions=(state.coachTrainingSessions||[]).filter(x=>x.id!==id);
 if(coachCurrentTrainingSessionId===id)coachCurrentTrainingSessionId=null;
 localStorage.setItem(KEY,JSON.stringify(state));
 if(typeof logAdminAction==='function')logAdminAction('Portail éducateurs','Suppression entraînement',`${s.team} • ${s.date} • ${s.title}`);
 renderCoachPortal();
 toast('Entraînement','Séance supprimée.');
}
