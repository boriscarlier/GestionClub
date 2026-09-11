function disciplineIsClosed(d){
 const code=disciplineLifecycle(d).code;
 return code==='closed_official'||code==='closed_expired';
}
