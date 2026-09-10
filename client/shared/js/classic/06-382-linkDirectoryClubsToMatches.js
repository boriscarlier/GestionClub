function linkDirectoryClubsToMatches(clubs){
 const matchNames=opponentNamesFromMatches();
 clubs.forEach(c=>{
  const exact=matchNames.find(n=>opponentKey(n)===opponentKey(c.name));
  const approximate=matchNames.find(n=>{
   const a=opponentKey(n),b=opponentKey(c.name);
   return a&&b&&(a.includes(b)||b.includes(a));
  });
  c.matchName=exact||approximate||'';
 });
}

