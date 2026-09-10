function coachPlayerCanBeSelected(player){
 const st=coachPlayerStatus(player);
 return !['blocked','injured','absent'].includes(st.status);
}

