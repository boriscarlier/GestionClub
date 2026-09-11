function formatAccountDate(iso){
 if(!iso)return 'Jamais';
 try{return new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(iso))}
 catch(e){return iso}
}
