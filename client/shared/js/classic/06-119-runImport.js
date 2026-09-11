function runImport(){
 if(!currentAdminCan('imports','create'))return toast('Accès refusé','Import non autorisé.');
 if(!importRows.length){toast('Import','Charge d’abord un fichier.');return;}
 const target=document.getElementById('importTarget').value,schema=importSchemas[target],strategy=document.getElementById('importStrategy').value;
 const hi=Number(document.getElementById('importHeaderRow').value||0),headers=(importRows[hi]||[]).map(String),map=findHeaderMapping(headers,schema);
 const lrf=target==='matches' && isLrfMatchExport(headers);
 const missing=lrf?[]:schema.required.filter(k=>map[k]===undefined);
 if(missing.length){document.getElementById('importReportMessage').className='import-status err';document.getElementById('importReportMessage').textContent='Import bloqué : colonnes obligatoires manquantes.';return;}
 if(target==='members'&&isReferenceMemberExport(headers))return runReferenceLicenceImport(headers,hi,strategy);
 const collection=collectionForTarget(target);let read=0,added=0,updated=0,skipped=0;
 importRows.slice(hi+1).forEach(row=>{
  if(!row||row.every(v=>String(v??'').trim()===''))return;
  read++;
  const rec=rowToRecord(row,headers,schema);
  if(rec.placeholder){skipped++;return;}
  if(schema.required.some(k=>String(rec[k]??'').trim()==='')){skipped++;return;}
  const key=schema.identity(rec),existing=collection.find(x=>schema.identity(x)===key);
  if(existing){
   let mergedHistory=[...(existing.reportHistory||[])];
   (rec.reportHistory||[]).forEach(h=>{if(!mergedHistory.some(x=>norm(x.status)===norm(h.status)&&norm(x.date)===norm(h.date)))mergedHistory.push(h)});
   if(strategy==='update'){Object.assign(existing,rec);existing.reportHistory=mergedHistory;updated++;}
   else if(strategy==='append'){rec.id=makeImportedId(target);collection.push(rec);added++;}
   else skipped++;
  }else{rec.id=makeImportedId(target);collection.push(rec);added++;}
 });
 logAdminAction('Imports','Import',`${schema.label} — ${importFileName||'Fichier'}`);
 state.importHistory.unshift({id:uid('ih'),file:importFileName||'Fichier',target:schema.label,strategy,date:new Date().toLocaleString('fr-FR'),read,added,updated,skipped});
 document.getElementById('impRead').textContent=read;document.getElementById('impAdded').textContent=added;document.getElementById('impUpdated').textContent=updated;document.getElementById('impSkipped').textContent=skipped;
 document.getElementById('importReportMessage').className='import-status ok';
 const lrfNote=lrf?' • Fichier matchs reconnu : toutes les informations disponibles sont conservées (compétition, phase, poule, journée/tour, numéro match, adresse, résultats, tirs au but, distances et reports). Les lignes techniques sans adversaire réel sont filtrées.':'';
 document.getElementById('importReportMessage').innerHTML=`<strong>Import terminé</strong><div class="tiny">${added} ajout(s), ${updated} mise(s) à jour, ${skipped} ligne(s) ignorée(s).${lrfNote}</div>`;

 // V1.14.28 — relier les imports principaux au registre de fraîcheur / réimportation.
 if(target==='members' || target==='matches'){
  recordImport(target,{
   filename:importFileName||'Fichier importé',
   itemCount:collection.length,
   source:target==='members'?'Import Licenciés':'Import Matchs',
   note:`${read} ligne(s) lue(s), ${added} ajout(s), ${updated} mise(s) à jour`
  });
 }

 save();
 renderImportHistory();
 if(typeof renderImportWatch==='function')renderImportWatch();
 setImportStep(4);
 toast('Importation','Données intégrées dans la base locale.');

 // Retour automatique au suivi après import réussi.
 setTimeout(()=>{
  goTo('importwatch');
  if(typeof renderImportWatch==='function')renderImportWatch();
 },150);
}
