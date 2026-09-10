function accountFullName(a){
 return `${a.first||''} ${a.last||''}`.trim()||a.email||'Compte sans nom';
}
