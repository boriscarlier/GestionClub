function renderMemberDetail(){
 qaCaptureMemberDrafts();
 const m=(state.members||[]).find(x=>x.id===currentMemberId);if(!m)return;
 const account=typeof currentAdminAccount==='function'?currentAdminAccount():null;
 const unrestricted=!(state.accounts||[]).length;
 const canContact=unrestricted || (typeof accountCanSeeSensitive==='function'&&accountCanSeeSensitive(account,'contact'));
 const canGuardians=unrestricted || (typeof accountCanSeeSensitive==='function'&&accountCanSeeSensitive(account,'guardians'));
 const canFinance=unrestricted || (typeof accountCanSeeSensitive==='function'&&accountCanSeeSensitive(account,'finance'));
 const canDiscipline=unrestricted || (typeof accountCanSeeSensitive==='function'&&accountCanSeeSensitive(account,'discipline'));

 const panelAccess=[
  ['memberContactPanel',canContact],
  ['memberFinancePanel',canFinance]
 ];
 panelAccess.forEach(([id,allowed])=>{
  const el=document.getElementById(id);
  if(el)el.style.display=allowed?'':'none';
 });
 const initials=((m.first||'').slice(0,1)+(m.last||'').slice(0,1)).toUpperCase()||'LC';
 document.getElementById('memberAvatar').textContent=initials;
 document.getElementById('memberDetailName').textContent=`${m.first||''} ${m.last||''}`.trim()||'Licencié';
 const risks=canDiscipline?memberDisciplineRisk(m):[],susp=canDiscipline?isMemberSuspended(m):false,elig=memberEligibilityStatus(m);
 renderMemberMutationInfo(m);
 const emailBtn=document.querySelector('#memberdetail .member-detail-actions button[onclick="emailCurrentMember()"]');
 if(emailBtn)emailBtn.style.display=canContact?'':'none';
 document.getElementById('memberDetailBadges').innerHTML=[
  m.licenseNumber?`<span class="badge green">Licence ${fmt(m.licenseNumber)}</span>`:'',
  `<span class="badge">${fmt(m.category)}</span>`,
  `<span class="badge">${fmt(m.type||m.licenseType)}</span>`,
  memberMutationInfo(m).explicitlyNotMutated?'<span class="badge green">NON MUTÉ — VÉRIFIÉ</span>':memberMutationInfo(m).hasMutation?`<span class="badge ${memberMutationInfo(m).verified?'green':'yellow'}">MUTATION ${memberMutationInfo(m).verified?'VÉRIFIÉE':'À VÉRIFIER'}</span>`:(memberMutationInfo(m).noStampData?'<span class="badge green">AUCUN CACHET — VÉRIFIÉ</span>':memberMutationInfo(m).hasStamp?'<span class="badge green">CACHET LICENCE</span>':''),
  canDiscipline?(susp?'<span class="badge red">SUSPENSION / CONTRÔLE</span>':risks.length?'<span class="badge yellow">ALERTE DISCIPLINE</span>':'<span class="badge green">DISCIPLINE RAS</span>'):'<span class="badge">DISCIPLINE RESTREINTE</span>', `<span class="badge ${elig.status==='block'?'red':elig.status==='warn'?'yellow':'green'}">${elig.label}</span>`
 ].filter(Boolean).join('');

 document.getElementById('memberIdentityBlock').innerHTML=memberBlockEditState.has('identity')?renderMemberIdentityEditor(m):kvHtml([
  ['N° personne',m.personNumber],['N° licence',m.licenseNumber],['Civilité',m.title],['Date de naissance',memberEuropeanDate(m.birthDate)],['Lieu de naissance',m.birthPlace],
  ['Sexe',m.sex],['Nationalité',m.nationality],['Statut photo',m.photoStatus],['Certificat médical N+1',m.medicalValidity]
 ]);
 document.getElementById('memberContactBlock').innerHTML=memberBlockEditState.has('contact')?renderMemberContactEditor(m):kvHtml([
  ['Téléphone',m.phone||m.mobile],['Téléphone domicile',m.homePhone],['Téléphone travail',m.workPhone],['Email principal',m.email],['Email autre',m.otherEmail],
  ['Adresse',m.address||[m.addressExtra,m.street,m.locality,m.postalCode,m.postOffice,m.country].filter(Boolean).join(', ')]
 ]);
 const licenses=siblingLicenses(m);
 document.getElementById('memberLicensesBlock').innerHTML=memberBlockEditState.has('license')?renderMemberLicenseEditor(m):licenses.map(x=>`<div class="member-license-card"><strong>${x.licenseNumber||'Licence'}</strong><div class="tiny">${fmt(x.licenseType||x.type)} • ${fmt(x.subcategory||x.category)} • ${fmt(x.status||x.license)}</div>${x.roles&&x.roles.length?`<div class="tiny">Rôles : ${x.roles.join(', ')}</div>`:''}</div>`).join('');
 document.getElementById('memberFinanceBlock').innerHTML=memberBlockEditState.has('finance')?renderMemberFinanceEditor(m):kvHtml([
  ['Prix appliqué',m.priceApplied!=null?m.priceApplied+' €':'—'],['Prix club',m.clubPrice!=null?m.clubPrice+' €':'—'],['Montant règlement',m.paymentAmount!=null?m.paymentAmount+' €':'—'],
  ['État règlement',m.paymentState],['Date règlement',memberEuropeanDate(m.paymentDate)],['Mode règlement',m.paymentMode],['Libellé',m.paymentLabel]
 ]);
 document.getElementById('memberGuardianBlock').innerHTML=memberBlockEditState.has('guardian')?renderMemberGuardianEditor(m):kvHtml([
  ['Représentant 1',m.guardian1Name||m.guardianName],['Mobile repr. 1',m.guardian1Mobile||m.guardianPhone],['Email repr. 1',m.guardian1Email||m.guardianEmail],
  ['Représentant 2',m.guardian2Name],['Mobile repr. 2',m.guardian2Mobile],['Email repr. 2',m.guardian2Email]
 ]);
 const ds=disciplineForMember(m);
 document.getElementById('memberDisciplineBlock').innerHTML=memberBlockEditState.has('discipline')?renderMemberDisciplineEditor(m,ds):(ds.length?ds.map(d=>`<div class="member-disc-card"><strong>Dossier ${fmt(d.dossierNumber)} — ${fmt(d.status)}</strong><div class="tiny">${memberEuropeanDate(d.matchDate)} • match ${fmt(d.matchNumber)}</div><div class="tiny"><strong>Motif :</strong> ${fmt(d.reason)}<br><strong>Décision :</strong> ${fmt(d.decision)}<br><strong>Effet :</strong> ${memberEuropeanDate(d.effectDate)} → ${memberEuropeanDate(d.endDate)}</div>${disciplineConsequences(d).map(c=>`<div class="consequence ${c.type}"><strong>${c.title}</strong><div class="tiny">${c.text}</div></div>`).join('')}</div>`).join(''):'<div class="tiny">Aucun dossier disciplinaire lié.</div>');
 document.getElementById('memberHistoryBlock').innerHTML=kvHtml([
  ['Club actuel',m.clubName],['N° club',m.clubNumber],['Nature demande',m.requestNature],['Changement de club',m.clubChangeNature],['Club quitté',m.formerClub],['Saison club quitté',m.formerClubSeason],
  ['Enregistrement',memberEuropeanDate(m.registrationDate)],['Date édition licence',memberEuropeanDate(m.licenseIssueDate)],['Statut suivant',m.nextStatus]
 ]);
 const mutationInfo=memberMutationInfo(m);
 const showMutation=!!(mutationInfo.hasStamp||mutationInfo.hasMutation);
 const showDiscipline=canDiscipline&&ds.length>0;
 const showGuardian=canGuardians&&(memberIsMinorNow(m)||!parseDateSafe(m.birthDate))&&memberHasGuardianInfo(m);
 const showLicenses=memberHasLicenseInfo(m);
 const showHistory=memberHasHistoryInfo(m);

 memberSetPanelVisibility('memberGuardianPanel',showGuardian);
 memberSetPanelVisibility('memberDisciplinePanel',showDiscipline);
 memberSetPanelVisibility('memberMutationPanel',showMutation);
 memberSetPanelVisibility('memberLicensePanel',showLicenses);
 memberSetPanelVisibility('memberHistoryPanel',showHistory);

 // Un bloc masqué ne doit pas rester en mode édition.
 if(!showGuardian)memberBlockEditState.delete('guardian');
 if(!showDiscipline)memberBlockEditState.delete('discipline');
 if(!showLicenses)memberBlockEditState.delete('license');

 const sourceCount=m.sourceData?Object.keys(m.sourceData).length:0;
 document.getElementById('memberSourceSummary').innerHTML=`${sourceCount} champ(s) source conservé(s) pour cette ligne de licence.`;
 if(m.sourceRows?.length)document.getElementById('memberSourceSummary').innerHTML+=`<p>${m.sourceRows.length} ligne(s) source conservée(s).</p>`;
 if(m.officialStamps?.length)document.getElementById('memberSourceSummary').innerHTML+='<h4>Cachets officiels capturés</h4>'+m.officialStamps.map(s=>'<p>'+[s.code,s.label,s.startDate?'Début : '+s.startDate:'',s.endDate?'Fin : '+s.endDate:''].filter(Boolean).map(escapeHtml).join(' · ')+'</p>').join('');
 renderMemberDocuments(m);
 const canEditMember=currentAdminCan('members','edit');
 const editAccess={
  identity:canEditMember,
  contact:canEditMember&&canContact,
  license:canEditMember&&showLicenses,
  finance:canEditMember&&canFinance,
  guardian:canEditMember&&showGuardian,
  discipline:canEditMember&&showDiscipline
 };
 document.querySelectorAll('#memberdetail .member-block-edit-btn').forEach(btn=>{
  btn.style.display=editAccess[btn.dataset.memberEdit]?'':'none';
 });
 renderMemberBlockButtons();
 qaRestoreMemberDrafts();
}
