function parseClubProfileExtra(text,data){
 const flat=String(text||'').replace(/\r/g,'\n');
 const first=(patterns)=>firstFffMatch(flat,patterns);
 return {
  ...data,
  pefReferent:first([/REFERENT PROGRAMME\s+EDUCATIF FEDERAL\s*:\s*([^\n]+)/i]),
  refereeReferent:first([/REFERENT ARBITRE\s*:\s*([^\n]+)/i]),
  volunteers:first([/Nombre de personnes bénévoles[^:]*:\s*([0-9]+)/i]),
  season:first([/Fiche club FFF\s*-\s*Saison\s*([0-9]{4})/i])
 };
}
