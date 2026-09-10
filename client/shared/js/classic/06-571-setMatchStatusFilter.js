function setMatchStatusFilter(filter,el){
 matchStatusFilter=filter||'';
 document.querySelectorAll('[data-match-filter]').forEach(b=>b.classList.toggle('active',b===el));
 renderMatchList();
}
