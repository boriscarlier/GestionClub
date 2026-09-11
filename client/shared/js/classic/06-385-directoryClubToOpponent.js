function directoryClubToOpponent(c){
 const finalName=c.matchName||c.name;
 let o=findOpponentClub(finalName);
 if(!o){
  o={id:uid('opp'),name:finalName,city:c.coordinates.city||'',color:c.identity.colors||'',logo:''};
  state.opponents.push(o);
 }
 o.city=o.city||c.coordinates.city||'';
 o.color=o.color||c.identity.colors||'';
 o.fff={
  ...(o.fff||{}),
  affiliation:c.affiliation,
  level:cleanClubLevel(c.identity.level),
  colors:cleanClubColors(c.identity.colors),
  address:c.coordinates.address,
  website:c.coordinates.website,
  officialEmail:c.contacts.officialEmail||c.contacts.mainEmail||c.contacts.emails?.[0]||'',
  phone:c.contacts.phones?.[0]||'',
  phones:c.contacts.phones||[],
  president:c.leaders.president,
  correspondent:c.leaders.correspondent,
  venueName:c.facilities.installation,
  surface:c.facilities.surface
 };
 return o;
}

