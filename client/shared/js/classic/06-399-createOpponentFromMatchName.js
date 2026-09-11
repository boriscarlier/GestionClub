function createOpponentFromMatchName(name){
 const canonical=opponentNamesFromMatches().find(n=>opponentKey(n)===opponentKey(name));
 if(!canonical){
  toast('Club adverse','Cet adversaire n’existe pas dans la base Matchs.');
  return null;
 }
 let o=findOpponentClub(canonical);
 if(!o){
  o={id:uid('opp'),name:canonical,city:'',color:'',logo:''};
  state.opponents.push(o);
  save();
  toast('Club adverse','Fiche créée depuis la base Matchs.');
 }
 return o;
}
