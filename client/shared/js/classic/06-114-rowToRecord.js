function rowToRecord(row,headers,schema){
 if(schema===importSchemas.matches && isLrfMatchExport(headers)) return lrfRowToMatch(row,headers);
 const map=findHeaderMapping(headers,schema),r={};
 schema.fields.forEach(f=>{if(map[f.key]!==undefined)r[f.key]=row[map[f.key]]});
 if(schema===importSchemas.members){
  if(isReferenceMemberExport(headers)) normalizeReferenceMemberRecord(r,row,headers);
  else{r.type=r.type||'Joueur';r.license=r.license||'En attente';r.public=boolVal(r.public);}
 }
 if(schema===importSchemas.teams){r.public=boolVal(r.public);r.rosterPublic=r.public;r.group=r.group||((String(r.name||'').startsWith('U'))?'jeunes':'seniors');r.ground=r.ground||'Stade des Jacques';}
 if(schema===importSchemas.matches){
  r.date=normalizeDateCell(r.date);r.time=normalizeTimeCell(r.time);
  r.homeScore=safeNumber(r.homeScore);r.awayScore=safeNumber(r.awayScore);
  r.receiverScore=safeNumber(r.receiverScore);r.visitorScore=safeNumber(r.visitorScore);
  const importedScore=(r.homeScore!==null&&r.awayScore!==null)||(r.receiverScore!==null&&r.visitorScore!==null);
  r.status=r.status||(importedScore?'Terminé':'À venir');
 }
 if(schema===importSchemas.planning){r.day=dayNumber(r.day);r.time=normalizeTimeCell(r.time);r.duration=safeNumber(r.duration)||60;r.public=boolVal(r.public);r.type=r.type||'event';}
 if(schema===importSchemas.posts){r.status=r.status||'Brouillon';r.featured=boolVal(r.featured);r.channels=String(r.channels||'Site').split(/[,;|]/).map(x=>x.trim()).filter(Boolean);r.text=r.text||'';r.created=new Date().toISOString();r.publishDate='';}
 return r;
}
