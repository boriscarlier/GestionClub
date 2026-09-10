function createAndOpenOpponent(name){
 const o=createOpponentFromMatchName(name);
 if(!o)return;
 openOpponentDetail(o.id);
}
