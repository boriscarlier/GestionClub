function renderPublicProgram(){
 const box=document.getElementById('publicProgramList');
 if(!box)return;

 document.querySelectorAll('[data-program-filter]').forEach(b=>{
  b.classList.toggle('active',b.dataset.programFilter===publicProgramFilter);
 });

 renderPublicProgramSections();

 let arr=[...publicVisibleMatches()];
 if(publicProgramFilter==='upcoming')arr=arr.filter(publicMatchIsUpcoming);
 if(publicProgramFilter==='results')arr=arr.filter(publicMatchIsFinished);
 if(publicProgramSection)arr=arr.filter(m=>publicMatchSection(m)===publicProgramSection);

 arr.sort((a,b)=>{
  if(publicProgramFilter==='results')return String(b.date||'').localeCompare(String(a.date||''));
  return String(a.date||'').localeCompare(String(b.date||''));
 });

 const summary=document.getElementById('publicProgramSummary');
 if(summary){
  const sectionText=publicProgramSection?` • ${publicSectionLabel(publicProgramSection)}`:'';
  summary.textContent=`${arr.length} match${arr.length>1?'s':''}${sectionText}`;
 }

 box.innerHTML=arr.length?arr.map(m=>{
  const score=publicMatchScoreText(m);
  const selected=publicProgramFocusId===m.id;
  return `<div class="program-match ${selected?'program-selected':''}" onclick="publicProgramFocusId='${m.id}';renderPublicProgram()">
   <div class="program-date">${formatMatchDateFr(m.date)}<div class="tiny">${m.time||'—'}</div></div>
   <div class="program-team">
    <img class="club-logo-img" data-club-logo alt="Logo FC LA COUR">
    <div><strong>${m.team||'FC LA COUR'}</strong><div class="tiny" style="display:flex;align-items:center;gap:6px">vs ${opponentLogoHtml(m.opponent,'public-opponent-logo')} <span>${m.opponent||'Adversaire'}</span></div></div>
   </div>
   <div class="program-place"><strong>${m.place||'Lieu non renseigné'}</strong><div class="tiny">${m.competition||''}</div></div>
   <div style="text-align:right"><div class="public-match-score">${score||'VS'}</div><span class="badge ${publicMatchIsFinished(m)?'green':'blue'}">${matchStatusValue(m)}</span></div>
  </div>`;
 }).join(''):'<div class="card"><div class="tiny">Aucun match correspondant à ce filtre.</div></div>';

 applyClubLogoAssets?.(document);

 if(publicProgramFocusId){
  setTimeout(()=>{
   const sel=box.querySelector('.program-selected');
   if(sel)sel.scrollIntoView({behavior:'smooth',block:'center'});
  },0);
 }
}


