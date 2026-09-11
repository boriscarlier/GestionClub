function opponentNamesFromMatches(){
 return [...new Set((state.matches||[])
  .map(m=>String(m.opponent||m.opponentClub||'').trim())
  .filter(Boolean))]
  .sort((a,b)=>a.localeCompare(b,'fr'));
}
