function samePractice(a,b){
 const aa=norm(a.competition||a.phase||''),bb=norm(b.competition||b.phase||'');
 if(!aa||!bb)return true;
 return aa===bb || (a.team&&b.team&&norm(a.team)===norm(b.team));
}
