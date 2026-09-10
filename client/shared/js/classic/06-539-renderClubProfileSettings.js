function renderClubProfileSettings(){
 if(!document.getElementById('clubCfgName'))return;
 const p=clubProfileMerged();
 const map={
  clubCfgName:'name',clubCfgAffiliation:'affiliation',clubCfgAffiliationDate:'affiliationDate',
  clubCfgLeague:'league',clubCfgDistrict:'district',clubCfgPrefecture:'prefecture',
  clubCfgSiret:'siret',clubCfgNaf:'naf',clubCfgAddress:'address',clubCfgPhone:'phone',
  clubCfgOfficialEmail:'officialEmail',clubCfgMainEmail:'primaryEmail',
  clubCfgPresident:'president',clubCfgSecretary:'secretary',clubCfgTreasurer:'treasurer',
  clubCfgCorrespondent:'correspondent',clubCfgPef:'pefReferent',clubCfgReferee:'refereeReferent',
  clubCfgVenue:'venueName',clubCfgNni:'nni',clubCfgVenueCity:'venueCity',
  clubCfgVolunteers:'volunteers',clubCfgNotes:'notes'
 };
 Object.entries(map).forEach(([id,key])=>clubProfileSet(id,p[key]));

 const source=document.getElementById('clubProfileSource');
 if(source){
  const s=state.clubProfile?.source;
  source.innerHTML=s
   ? `<strong>${escapeHtml(s.filename||'Fiche Footclubs')}</strong><br>Importée le ${formatDisciplineDateTime(s.importedAt)||'—'}${s.season?` • Saison ${escapeHtml(s.season)}`:''}`
   : 'Aucune fiche officielle enregistrée.';
 }
 const hist=document.getElementById('clubProfileHistory');
 const history=state.clubProfile?.history||[];
 if(hist)hist.innerHTML=history.length?history.map(h=>`<div class="club-profile-history-row"><strong>${escapeHtml(h.filename||'Fiche Footclubs')}</strong><div class="tiny">${formatDisciplineDateTime(h.importedAt)}${h.affiliation?' • Affiliation '+escapeHtml(h.affiliation):''}</div></div>`).join(''):'<div class="tiny">Aucun import enregistré.</div>';
}
