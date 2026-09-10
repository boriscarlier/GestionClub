function renderStatisticsMembersAdvanced(){
 const members=state.members||[];const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 const female=members.filter(memberIsFemale).length;
 const male=members.filter(m=>{const s=norm(m.sex||m.gender||m.sexe||'');return s==='m'||s.includes('mascul')||s==='homme'}).length;
 const renew=members.filter(m=>norm(m.requestNature||m.clubChangeNature||'').includes('renou')).length;
 const fresh=members.filter(m=>{const n=norm(m.requestNature||m.clubChangeNature||'');return n.includes('nouvel')||n.includes('nouvelle')||n.includes('creation')}).length;
 set('smMale',male);set('smFemale',female);set('smNew',fresh);set('smRenew',renew);
 const roles=statsCountBy(members,memberRoleLabel);
 const ages=statsCountBy(members,m=>{const a=memberAge(m);if(a===null)return 'Âge inconnu';if(a<12)return '< 12 ans';if(a<15)return '12–14 ans';if(a<18)return '15–17 ans';if(a<25)return '18–24 ans';if(a<40)return '25–39 ans';if(a<60)return '40–59 ans';return '60 ans et +'});
 const cities=statsCountBy(members,m=>m.postOffice||m.locality||m.city||'Non renseigné');
 const statuses=statsCountBy(members,m=>m.status||m.license||'Non renseigné');
 const roleEl=document.getElementById('smRoles');if(roleEl)roleEl.innerHTML=statsBarsHtml(roles);
 const ageEl=document.getElementById('smAges');if(ageEl)ageEl.innerHTML=statsBarsHtml(ages);
 const cityEl=document.getElementById('smCities');if(cityEl)cityEl.innerHTML=statsBarsHtml(cities);
 const statusEl=document.getElementById('smStatuses');if(statusEl)statusEl.innerHTML=statsBarsHtml(statuses);
 const cats=sortStatisticsCategories(Object.entries(statsCountBy(members,m=>m.category||m.team||m.categoryLabel||'Non classé')));
 const catEl=document.getElementById('smCategories');
 if(catEl)catEl.innerHTML=cats.map(([c,n])=>`<button class="ghost" onclick='showStatsMemberCategory(${JSON.stringify(c)})'>${escapeHtml(c)} <strong>${n}</strong></button>`).join('');
}


