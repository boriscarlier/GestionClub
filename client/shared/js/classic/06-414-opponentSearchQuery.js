function opponentSearchQuery(){
 const name=document.getElementById('oppClubName')?.value.trim()||'';
 const city=document.getElementById('oppClubCity')?.value.trim()||'';
 return [name,city,'football club logo'].filter(Boolean).join(' ');
}
