function runReferenceLicenceImport(headers,hi,strategy){
 try{
  if(!currentAdminCan('imports','create')||!currentAdminCan('members','create')||(strategy==='update'&&!currentAdminCan('members','edit')))throw Error('Droits de création/import et, pour une mise à jour, de modification des licenciés requis.');
  if(!['skip','update'].includes(strategy))throw Error('Choisir « Ignorer les doublons » ou « Mettre à jour l’existant ». Une licence ne doit pas être ajoutée plusieurs fois.');
  const records=prepareReferenceLicences(importRows.slice(hi+1),headers),before=JSON.stringify(state),disk=localStorage.getItem(KEY);
  if(!records.length)throw Error('Aucune licence exploitable.');
  if(disk&&FCUContactsCore.stable(JSON.parse(disk))!==FCUContactsCore.stable(state))throw Error('La base enregistrée a changé. Rechargez la page avant l’import.');
  const clubs=[...new Set(records.flatMap(r=>r.sourceRows.map(x=>String(x['Numéro']||'').trim())))];
  if(clubs.length!==1||!/^\d{6}$/.test(clubs[0]))throw Error('Affiliation de club absente, multiple ou non reconnue dans le fichier.');
  const next=JSON.parse(before),profile={...(next.clubProfile?.official||{}),...(next.clubProfile?.manual||{})};
  if(profile.affiliation&&String(profile.affiliation)!==clubs[0])throw Error('Le fichier et le club paramétré portent des affiliations différentes.');
  let added=0,updated=0,skipped=0;
  for(const rec of records){
   const matches=next.members.filter(x=>String(x.licenseNumber||'').trim()===rec.licenseNumber);
   if(matches.length>1)throw Error('Plusieurs fiches locales portent le même numéro de licence. Contrôle nécessaire avant import.');
   if(matches.length){if(String(matches[0].personNumber||'').trim()&&String(matches[0].personNumber).trim()!==rec.personNumber)throw Error('Une licence locale est rattachée à un autre numéro personne.');if(strategy==='update'){Object.assign(matches[0],rec);updated++;}else skipped++;}
   else{rec.id=uid('m');next.members.push(rec);added++;}
  }
  const now=new Date().toISOString(),read=records.reduce((n,r)=>n+r.sourceRows.length,0);
  next.clubProfile=next.clubProfile||{official:{},manual:{},source:null,history:[]};next.clubProfile.manual=next.clubProfile.manual||{};
  if(!profile.affiliation)next.clubProfile.manual.affiliation=clubs[0];
  next.importHistory=next.importHistory||[];next.importHistory.unshift({id:uid('ih'),file:importFileName,target:'Licenciés',strategy,date:new Date().toLocaleString('fr-FR'),read,added,updated,skipped});
  next.importRegistry=next.importRegistry||{};next.importRegistry.members={type:'members',reimportRequired:false,updatedAt:now,filename:importFileName,importedAt:now,itemCount:records.length,source:'Import Licenciés',note:read+' lignes, '+records.length+' licences ; cachets multiples conservés'};
  next.auditLog=next.auditLog||[];next.auditLog.unshift({id:uid('log'),at:now,accountId:currentAdminAccount()?.id||'',user:'Administration',module:'Imports',action:'Import licences de référence',detail:read+' lignes ; '+added+' ajouts ; '+updated+' mises à jour'});
  if(JSON.stringify(state)!==before||localStorage.getItem(KEY)!==disk)throw Error('La base a changé pendant le contrôle. Recommencer.');
  localStorage.setItem('fclc_before_reference_licences',JSON.stringify(qaBackupPayload()));
  if(localStorage.getItem(KEY)!==disk)throw Error('La base a changé avant l’enregistrement.');
  localStorage.setItem(KEY,JSON.stringify(next));state=next;
  try{renderAll();}catch(e){/* Data commit succeeded; reload can refresh presentation. */}
  document.getElementById('impRead').textContent=read;document.getElementById('impAdded').textContent=added;document.getElementById('impUpdated').textContent=updated;document.getElementById('impSkipped').textContent=skipped;
  const status=document.getElementById('importReportMessage');status.className='import-status ok';status.textContent=read+' lignes regroupées en '+records.length+' licences : '+added+' ajouts, '+updated+' mises à jour, '+skipped+' licences déjà présentes ignorées. Cachets et lignes source conservés. Les autres fiches locales sont conservées.';
  setImportStep(4);renderImportHistory();
 }catch(e){const status=document.getElementById('importReportMessage');status.className='import-status err';status.textContent='Import arrêté : '+e.message;}
}

