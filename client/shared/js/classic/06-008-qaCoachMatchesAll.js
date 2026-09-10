function qaCoachMatchesAll(){return qaCoachScope()?(state.matches||[]).filter(m=>norm(matchTeamName(m))===norm(coachCurrentTeamName)).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))):[];}

