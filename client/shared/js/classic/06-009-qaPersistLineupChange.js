function qaPersistLineupChange(before){
 try{saveCoachLineups();return true;}catch(e){coachLineups=before;toast('Non enregistré','Stockage indisponible : la composition n’a pas été sauvegardée.');return false;}
}

