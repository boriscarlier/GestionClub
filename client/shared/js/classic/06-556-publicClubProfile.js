function publicClubProfile(){
 const p=typeof clubProfileMerged==='function'?clubProfileMerged():{};
 return {
  name:p.name||'FC LA COUR',
  locality:p.locality||p.city||'Saint-Joseph',
  league:p.league||'Ligue Réunion',
  affiliation:p.affiliation||'',
  stadium:p.stadium||p.venueName||'Stade des Jacques'
 };
}
