function normalizeClubTitle(s){
 return cleanFffValue(s)
  .replace(/\s{2,}/g,' ')
  .replace(/^[-–—\s]+|[-–—\s]+$/g,'')
  .trim();
}


