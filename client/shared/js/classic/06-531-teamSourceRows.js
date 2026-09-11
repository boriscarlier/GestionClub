function teamSourceRows(){
 return serverTeamsEnabled()&&serverTeamsState.loaded?serverTeamsState.items:(state.teams||[]);
}
