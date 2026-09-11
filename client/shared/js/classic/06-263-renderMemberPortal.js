function renderMemberPortal(){
 const m=portalMember();if(!m)return;
 const login=document.getElementById('portalLogin'),app=document.getElementById('portalApp');
 if(login)login.style.display='none';if(app)app.style.display='block';
 const initials=((m.first||'').slice(0,1)+(m.last||'').slice(0,1)).toUpperCase()||'FC';
 document.getElementById('portalAvatar').textContent=initials;
 document.getElementById('portalName').textContent=`${m.first||''} ${m.last||''}`.trim();
 document.getElementById('portalLicense').textContent='Licence '+(m.licenseNumber||'—');
 document.getElementById('portalWelcome').textContent='Bienvenue '+(m.first||'');
 document.getElementById('portalKpiLicense').textContent=m.license||m.status||'—';

 const matches=portalMatchesForMember(m),today=new Date().toISOString().slice(0,10),next=matches.find(x=>x.date>=today&&x.status!=='Terminé');
 document.getElementById('portalKpiMatch').textContent=next?`${formatMatchDateFr(next.date)} • ${next.opponent}`:'Aucun';
 document.getElementById('portalKpiPayment').textContent=m.paymentState||'Non renseigné';

 document.getElementById('portalUpcoming').innerHTML=next?`<div class="portal-match"><strong>${m.category||m.team||'Équipe'} vs ${next.opponent||'—'}</strong><div class="tiny">${formatMatchDateFr(next.date)} • ${next.time||'—'} • ${next.place||'—'}</div></div>`:'<div class="tiny">Aucun match à venir.</div>';

 document.getElementById('portalProfileBlock').innerHTML=kvHtml([
  ['Nom',`${m.last||''} ${m.first||''}`],['N° licence',m.licenseNumber],['N° personne',m.personNumber],['Date de naissance',memberEuropeanDate(m.birthDate)],
  ['Catégorie',m.category||m.subcategory],['Type',m.type||m.licenseType],['Téléphone',m.phone||m.mobile],['Email',m.email],['Adresse',m.address]
 ]);

 document.getElementById('portalLicensesBlock').innerHTML=portalSiblingLicenses(m).map(x=>`<div class="member-license-card"><strong>${x.licenseNumber||'Licence'}</strong><div class="tiny">${x.type||x.licenseType||'—'} • ${x.category||x.subcategory||'—'} • ${x.license||x.status||'—'}</div></div>`).join('');

 const pm=portalMatchesForMember(m);
 document.getElementById('portalMatchesList').innerHTML=pm.length?pm.map(mt=>`<div class="portal-match"><strong>${mt.team||m.category||'Équipe'} — ${mt.opponent||'—'}</strong><div class="tiny">${formatMatchDateFr(mt.date)} • ${mt.time||'—'} • ${mt.place||'—'} • ${mt.status||'—'}</div></div>`).join(''):'<div class="tiny">Aucun match associé.</div>';

 const docs=portalRelevantDocs(m);
 document.getElementById('portalDocsList').innerHTML=docs.length?docs.map(d=>`<div class="portal-doc"><strong>${d.title}</strong><div class="tiny">${d.category}</div><div class="portal-actions"><button class="ghost" onclick="openOfficialDoc('${d.id}')">Ouvrir</button></div></div>`).join(''):'<div class="tiny">Aucun document associé.</div>';

 document.getElementById('portalPaymentsBlock').innerHTML=`<div class="portal-payment"><strong>${m.paymentState||'État non renseigné'}</strong><div class="tiny">Prix club : ${m.clubPrice!=null?m.clubPrice+' €':'—'} • Montant réglé : ${m.paymentAmount!=null?m.paymentAmount+' €':'—'} • Mode : ${m.paymentMode||'—'}</div></div>`;

 const msgs=portalMessages(m);
 document.getElementById('portalMessagesList').innerHTML=msgs.length?msgs.slice(0,20).map(p=>`<div class="portal-message"><strong>${p.title||'Message'}</strong><div class="tiny">${p.text||''}</div></div>`).join(''):'<div class="tiny">Aucun message.</div>';
 portalGo('home');
}
