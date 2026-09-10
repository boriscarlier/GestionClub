function coachMember(){
 return (state.members||[]).find(m=>m.id===coachCurrentMemberId)||null;
}
