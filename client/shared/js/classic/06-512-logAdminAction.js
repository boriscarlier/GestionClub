function logAdminAction(module,action,detail=''){
 const coach=qaSpace==='coach'?coachMember():null,a=coach?null:currentAdminAccount();
 state.auditLog=Array.isArray(state.auditLog)?state.auditLog:[];
 state.auditLog.unshift({id:uid('log'),at:new Date().toISOString(),accountId:a?.id||'',coachId:coach?.id||'',user:coach?`${coach.first||''} ${coach.last||''}`.trim():a?accountFullName(a):'Mode local',module:String(module||'Système').slice(0,80),action:String(action||'Action').slice(0,120),detail:sanitizeAuditDetail(detail)});
 state.auditLog=state.auditLog.slice(0,1000);
 try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){toast('Journal','Trace conservée en mémoire uniquement : stockage indisponible.');}
}
