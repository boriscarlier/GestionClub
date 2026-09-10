function matchIsFinished(m){
 if(!m)return false;
 const status=norm(m.status);
 if(/annul|non joue|a jouer|reporte|arret|interromp|en cours|forfait/.test(status))return false;
 return hasMatchScore(m)||/termin|^joue$|^clos$|^played$|^finished$/.test(status);
}
