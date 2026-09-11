function publicVisibleMatches(){
 return (state.matches||[]).filter(m=>m.public!==false);
}

