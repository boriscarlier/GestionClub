function auditSummary(){
 const rows=state.auditLog||[];
 const now=Date.now();
 const last7=rows.filter(x=>now-new Date(x.at).getTime()<=7*86400000).length;
 const users=new Set(rows.map(x=>x.user).filter(Boolean)).size;
 const modules=new Set(rows.map(x=>x.module).filter(Boolean)).size;
 return {total:rows.length,last7,users,modules};
}
