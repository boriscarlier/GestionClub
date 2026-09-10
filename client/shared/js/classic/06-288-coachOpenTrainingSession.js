function coachOpenTrainingSession(id){
 const s=coachTrainingSessionById(id);
 if(!qaTrainingAccess(s)){toast('Entraînement','Séance hors périmètre.');return;}
 coachCurrentTrainingSessionId=id;
 coachCurrentPage='training';
 renderCoachTrainingAttendance();
}
