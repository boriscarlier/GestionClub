function immediatelyLowerYouthTeamName(teamName){
 const match=String(teamName||'').trim().match(/^U(\d{1,2})$/i);
 if(!match)return '';
 const lower=`U${Number(match[1])-1}`;
 return (state.teams||[]).some(t=>norm(t.name)===norm(lower))?lower:'';
}
