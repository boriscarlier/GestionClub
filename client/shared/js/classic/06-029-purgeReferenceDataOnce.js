function purgeReferenceDataOnce(){
 // Ne jamais supprimer une base existante lors d'une simple ouverture/changement de version.
 try{localStorage.setItem(DATA_RESET_MARKER,'done');}catch(e){}return false;
}

purgeReferenceDataOnce();
