function renderCoachLineup(){
 const sel=document.getElementById('coachLineupMatch');if(!sel)return;
 const match=qaCoachMatchesAll().find(m=>m.id===sel.value),matchId=match?.id||'';
 const meta=document.getElementById('coachLineupMeta'),availEl=document.getElementById('coachLineupAvailable'),selectedEl=document.getElementById('coachLineupSelected');
 if(!match){meta.textContent='Aucun match sélectionné.';availEl.innerHTML='';selectedEl.innerHTML='';renderCoachFmiPreparation('',null);}
 else{
  const rec=coachLineupRecord(matchId),selected=rec.players,players=coachTeamMembers(),final=coachLineupExistsForMatch(matchId);
  renderCoachFmiPreparation(matchId,match);
  meta.innerHTML=`<span class="badge ${final?'green':'yellow'}">${final?'COMPOSITION ENREGISTRÉE':'BROUILLON SAUVEGARDÉ'}</span><span>${selected.length} joueur(s)</span>${!final?`<button class="primary" onclick="qaFinalizeLineup('${matchId}')">Valider la composition</button>`:''}<div class="tiny">L’ajout d’un joueur ne clôture pas le match. Validez la liste complète ; les matchs terminés seront alors archivés.</div>`;
  availEl.innerHTML=players.filter(p=>!selected.includes(p.id)).map(p=>{const st=coachPlayerStatus(p);return `<div class="coach-player"><div><strong>${escapeHtml(`${p.last||''} ${p.first||''}`)}</strong><div class="tiny">${escapeHtml(st.label)}${st.status==='warning'?' • ajout autorisé, contrôle conseillé':''}</div></div><button class="ghost" ${coachPlayerCanBeSelected(p)?'':'disabled'} onclick="toggleCoachLineup('${matchId}','${p.id}',true)">Ajouter</button></div>`;}).join('')||'<div class="tiny">Aucun autre joueur.</div>';
  selectedEl.innerHTML=selected.map(id=>{const p=(state.members||[]).find(x=>x.id===id)||rec.playerSnapshots?.[id];return `<div class="coach-player"><div><strong>${escapeHtml(p?`${p.last||''} ${p.first||''}`:`Joueur archivé (${id})`)}</strong><div class="tiny">${coachMemberGamesPlayed(id)} match(s) comptabilisé(s)</div></div><button class="ghost" onclick="toggleCoachLineup('${matchId}','${id}',false)">Retirer</button></div>`;}).join('')||'<div class="tiny">Aucun joueur sélectionné.</div>';
 }
 const rows=coachLineupHistoryForCurrentTeam().filter(x=>x.match&&x.rec?.players?.length);
 document.getElementById('coachLineupHistory').innerHTML=rows.map(x=>`<div class="item"><strong>${formatMatchDateFr(x.match.date)} — ${escapeHtml(matchOpponentName(x.match)||'Match')}</strong> <span class="badge">${x.rec.status==='draft'?'Brouillon':coachMatchPlayed(x.match)?'Archivé':'Préparé'}</span><div class="tiny">${x.rec.players.length} joueurs</div><button class="ghost" onclick="qaOpenLineup('${x.matchId}')">Revoir</button></div>`).join('')||'<div class="tiny">Aucune composition enregistrée.</div>';
}

