function buildImportPreview(){
 const head=document.getElementById('importPreviewHead'),body=document.getElementById('importPreviewBody'),info=document.getElementById('importPreviewInfo');
 if(!head||!body||!info)return;
 if(!importRows.length){head.innerHTML='';body.innerHTML='';info.textContent='Aucune donnée à afficher.';return;}
 const headerIndex=Number(document.getElementById('importHeaderRow').value||0);
 const headers=(importRows[headerIndex]||[]).map(v=>String(v));
 head.innerHTML='<tr>'+headers.map(h=>`<th>${escapeHtml(h||'—')}</th>`).join('')+'</tr>';
 body.innerHTML=importRows.slice(headerIndex+1,headerIndex+11).map(r=>'<tr>'+headers.map((_,i)=>`<td>${escapeHtml(r[i]??'')}</td>`).join('')+'</tr>').join('');
 const schema=importSchemas[document.getElementById('importTarget').value],map=findHeaderMapping(headers,schema);
 const lrfMembers=(document.getElementById('importTarget').value==='members' && isReferenceMemberExport(headers));
 const lrf=document.getElementById('importTarget').value==='matches' && isLrfMatchExport(headers);
 const missing=lrf?[]:schema.required.filter(k=>map[k]===undefined);
 if(lrf){
  const converted=importRows.slice(headerIndex+1).map(r=>lrfRowToMatch(r,headers));
  const placeholders=converted.filter(r=>r.placeholder).length;
  const unresolved=converted.filter(r=>r.unresolvedTime&&!r.placeholder).length;
  const results=converted.filter(r=>r.status==='Terminé'&&!r.placeholder).length;
  const reports=converted.filter(r=>r.rescheduleStatus&&!r.placeholder).length;
  const pens=converted.filter(r=>r.homePens!==null&&r.awayPens!==null&&!r.placeholder).length;
  const ref=isReferenceMatchExport(headers);
  info.innerHTML=`<span style="color:var(--green)"><strong>${ref?'Fichier MATCHS DE RÉFÉRENCE détecté':'Format LRF détecté'}</strong></span> • ${converted.length} ligne(s) • ${placeholders} technique(s) ignorée(s) • ${results} résultat(s) • ${reports} report(s) • ${pens} séance(s) de tirs au but • ${unresolved} horaire(s) indicatif(s)`;
 }else{
  info.innerHTML=`${Math.max(importRows.length-headerIndex-1,0)} ligne(s) de données • ${headers.length} colonne(s)`+(lrfMembers?' • <span style="color:var(--green)">Fichier LICENCES DE RÉFÉRENCE détecté</span>':'')+(missing.length?` • <span style="color:var(--red)">Colonnes obligatoires non reconnues : ${missing.map(k=>schema.fields.find(f=>f.key===k).label).join(', ')}</span>`:` • <span style="color:var(--green)">Colonnes obligatoires reconnues</span>`);
 }
}
