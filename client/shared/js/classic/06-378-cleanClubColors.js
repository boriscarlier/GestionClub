function cleanClubColors(value){
 const raw=cleanFffValue(value||'');
 if(!raw)return '';

 // Stop before labels that PDF extraction may concatenate.
 const cut=raw.split(/\b(?:Niveau|Type|Si[eè]ge social|Email|Mob\.|T[eé]l\.|President|Président|Correspondant|Installation)\b/i)[0];

 // Colors in Footclubs are typically separated by / or -.
 const parts=cut
  .replace(/_/g,' ')
  .split(/[\/-]+/)
  .map(x=>cleanFffValue(x))
  .filter(Boolean)
  .slice(0,3);

 return parts.join(' / ');
}

