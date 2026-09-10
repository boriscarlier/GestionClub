function matchSearchText(m){
 return norm([
  m.matchNumber,m.date,m.time,m.team,m.opponent,m.opponentClub,m.competition,
  m.phase,m.pool,m.place,m.venueCity,m.status,m.homeAway,m.teamsLabel
 ].join(' '));
}
