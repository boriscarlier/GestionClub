function sanitizeAuditDetail(detail){
 return String(detail||'').replace(/\s+/g,' ').trim().slice(0,500);
}
