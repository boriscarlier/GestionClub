function publicClubProfile(){
 const p=typeof clubProfileMerged==='function'?clubProfileMerged():{};
 return {
  name:p.name||'CLUB EXEMPLE',
  locality:p.locality||p.city||'Ville Exemple',
  league:p.league||'Ligue Réunion',
  affiliation:p.affiliation||'',
  stadium:p.stadium||p.venueName||'Stade Municipal'
 };
}
