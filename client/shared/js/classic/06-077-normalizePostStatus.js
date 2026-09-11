function normalizePostStatus(status){
  if(status==='Publiée') return 'Publié';
  if(!status) return 'Brouillon';
  return status;
}

