function renderStatisticsDataQuality(){
 renderStatisticsSourceSummary();
 const members=state.members||[],matches=state.matches||[],opponents=state.opponents||[];
 const requiredFields={Nom:m=>m.last||m.fullName,Prénom:m=>m.first||m.fullName,'N° licence':m=>m.licenseNumber,Catégorie:m=>m.category,'Téléphone':m=>m.phone||m.mobile||m.homePhone,Email:m=>m.email};
 const missingCounts={};Object.entries(requiredFields).forEach(([k,fn])=>missingCounts[k]=members.filter(m=>!String(fn(m)||'').trim()).length);
 const incomplete=members.filter(m=>!String(m.licenseNumber||'').trim()||!String(m.category||'').trim()||!String(m.fullName||`${m.last||''}${m.first||''}`).trim()).length;
 const memberDup=countDuplicates(members,m=>m.licenseNumber);
 const matchDup=countDuplicates(matches,m=>m.matchNumber||`${m.date}|${m.team}|${m.opponent}`);
 const oppNames=new Set(opponents.flatMap(o=>[norm(o.name||''),norm(o.matchName||'')]).filter(Boolean));
 const missingOpp=[...new Set(matches.map(m=>String(m.opponentClub||m.opponent||'').trim()).filter(Boolean).filter(n=>!oppNames.has(norm(n))))];
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('sqMembersMissing',incomplete);set('sqMemberDup',memberDup);set('sqMatchDup',matchDup);set('sqOpponentMissing',missingOpp.length);
 const fields=document.getElementById('sqMemberFields');if(fields)fields.innerHTML=statsBarsHtml(missingCounts);
 const fresh=document.getElementById('sqFreshness');if(fresh)fresh.innerHTML=['members','matches','discipline','opponents'].map(t=>{const st=importFreshnessState(t),d=IMPORT_SOURCE_DEFS[t];return `<div class="stats-health-row"><span>${d.icon} ${d.label}</span>${importStatusBadge(st)}</div>`}).join('');
 const hist=document.getElementById('sqImportHistory');if(hist)hist.innerHTML=(state.importHistory||[]).slice(0,8).map(h=>`<div class="match-card"><strong>${escapeHtml(h.target||h.type||'Import')}</strong><div class="tiny">${escapeHtml(h.file||'')} • ${escapeHtml(h.date||'')} • lus ${h.read??'—'}, +${h.added??'—'}, maj ${h.updated??'—'}</div></div>`).join('')||'<div class="tiny">Aucun historique.</div>';
 const checks=document.getElementById('sqChecks');if(checks)checks.innerHTML=[
  ['Licences uniques',memberDup===0,memberDup?`${memberDup} doublon(s) potentiel(s)`:'OK'],
  ['Numéros de match uniques',matchDup===0,matchDup?`${matchDup} doublon(s) potentiel(s)`:'OK'],
  ['Adversaires référencés',missingOpp.length===0,missingOpp.length?`${missingOpp.length} sans fiche`:'OK'],
  ['4 bases importées',['members','matches','discipline','opponents'].every(t=>state.importRegistry?.[t]?.importedAt),'Vérifier le suivi des imports']
 ].map(([label,ok,msg])=>`<div class="stats-health-row"><span>${label}</span><span class="badge ${ok?'green':'yellow'}">${ok?'OK':msg}</span></div>`).join('');
}


