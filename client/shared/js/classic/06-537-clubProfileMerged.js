function clubProfileMerged(){
 const p=state.clubProfile||{official:{},manual:{}};
 return {...(p.official||{}),...(p.manual||{})};
}
