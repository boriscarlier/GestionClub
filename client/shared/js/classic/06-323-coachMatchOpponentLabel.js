function coachMatchOpponentLabel(m){
 return (typeof matchOpponentName==='function'?matchOpponentName(m):'') ||
  m?.opponent||m?.opponentClub||m?.shortName||'Adversaire';
}
