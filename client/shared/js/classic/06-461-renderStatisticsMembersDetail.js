function renderStatisticsMembersDetail(){
 const root=document.getElementById('statistics-members');if(!root)return;
 const members=Array.isArray(state.members)?state.members:[];
 const categories={};
 members.forEach(m=>{
  const cat=String(m.category||m.team||m.categoryLabel||'Non classé').trim()||'Non classé';
  categories[cat]=(categories[cat]||0)+1;
 });
 const entries=sortStatisticsCategories(Object.entries(categories));
 const women=members.filter(memberIsFemale).length;

 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
 set('statsMembersDetailTotal',members.length);
 set('statsMembersDetailCategories',entries.length);
 set('statsMembersDetailWomen',women);

 const bars=document.getElementById('statsMembersDetailBars');
 if(bars){
  const max=Math.max(1,...entries.map(x=>x[1]));
  bars.innerHTML=entries.length?entries.map(([name,count])=>`
   <div class="stats-bar-row">
    <div class="tiny" title="${escapeHtml(name)}">${escapeHtml(name)}</div>
    <div class="stats-bar-track"><div class="stats-bar-fill" style="width:${Math.max(4,Math.round(count/max*100))}%"></div></div>
    <strong>${count}</strong>
   </div>`).join(''):'<div class="stats-empty">Aucune donnée licencié importée.</div>';
 }

 const tbody=document.getElementById('statsMembersDetailTable');
 if(tbody){
  tbody.innerHTML=entries.length?entries.map(([name,count])=>`
   <tr><td>${escapeHtml(name)}</td><td><strong>${count}</strong></td></tr>
  `).join(''):'<tr><td colspan="2" class="tiny">Aucune donnée disponible.</td></tr>';
 }
}


