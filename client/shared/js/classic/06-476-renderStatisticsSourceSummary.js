function renderStatisticsSourceSummary(){
 const root=document.getElementById('statsSourceSummary');
 if(!root)return;
 const defs=[
  ['members','Licenciés','👥'],
  ['matches','Matchs','🗓️'],
  ['discipline','Discipline','🟥'],
  ['opponents','Clubs adverses','🛡️'],
  ['clubprofile','Fiche Footclubs','🏟️']
 ];
 root.innerHTML=defs.map(([type,label,icon])=>{
  const st=typeof importFreshnessState==='function'?importFreshnessState(type):{status:'stale',label:'Inconnu',days:null};
  const badge=typeof importStatusBadge==='function'?importStatusBadge(st):st.label;
  const reg=state.importRegistry?.[type] || (type==='clubprofile'&&state.clubProfile?.source?{
   importedAt:state.clubProfile.source.importedAt,
   filename:state.clubProfile.source.filename
  }:null);
  return `<div class="stats-source-card">
   <span class="tiny">${icon} ${label}</span>
   <strong>${badge}</strong>
   <div class="tiny">${reg?.filename?escapeHtml(reg.filename):'Aucun fichier enregistré'}</div>
   <div class="tiny">${reg?.importedAt?formatImportDate(reg.importedAt):'Jamais importé'}</div>
  </div>`;
 }).join('');
}

