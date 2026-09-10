function generateVisual(){
 if(!canvas || !ctx) return;
 visualBase();
 const w=canvas.width, h=canvas.height;

 if(currentVisualTemplate==='match' || currentVisualTemplate==='result'){
  const select=document.getElementById('visualMatchSelect');
  const chosenId=select ? select.value : (state.matches[0] ? state.matches[0].id : null);
  const m=state.matches.find(x=>x.id===chosenId) || state.matches[0];
  if(!m) return;
  const isResult = currentVisualTemplate==='result';
  drawClubLogoOnCanvas(w*0.42,h*0.31,Math.round(Math.min(w,h)*0.16));
  centerText(isResult ? 'RÉSULTAT FINAL' : 'PROCHAIN MATCH', h*0.28, Math.round(w*0.05), '#39d353', 900);
  centerText(m.team, h*0.41, Math.round(w*0.055), '#fff', 900);
  if(isResult){
   centerText(`${m.homeScore ?? 0} - ${m.awayScore ?? 0}`, h*0.55, Math.round(w*0.11), '#f3c842', 950);
   centerText(m.opponent, h*0.68, Math.round(w*0.05), '#fff', 900);
   centerText((m.homeScore ?? 0)>(m.awayScore ?? 0) ? 'VICTOIRE' : 'FIN DU MATCH', h*0.78, Math.round(w*0.028), '#39d353', 850);
  }else{
   centerText('VS', h*0.49, Math.round(w*0.026), '#9aa79f', 700);
   centerText(m.opponent, h*0.58, Math.round(w*0.055), '#fff', 900);
   ctx.fillStyle='#18211b'; ctx.beginPath(); ctx.roundRect(w*0.18,h*0.68,w*0.64,h*0.14,24); ctx.fill();
   centerText(`${m.date} • ${m.time}`, h*0.74, Math.round(w*0.026), '#f3c842', 800);
   centerText(m.place, h*0.795, Math.round(w*0.02), '#d8e0da', 600);
  }
 }else if(currentVisualTemplate==='birthday'){
  centerText('JOYEUX ANNIVERSAIRE', h*0.28, Math.round(w*0.048), '#f3c842', 900);
  centerText('🎂', h*0.44, Math.round(w*0.09), '#fff', 900);
  centerText((document.getElementById('visualName')||{}).value || 'Prénom NOM', h*0.57, Math.round(w*0.058), '#fff', 900);
  centerText((document.getElementById('visualAge')||{}).value || 'Joyeux anniversaire !', h*0.67, Math.round(w*0.03), '#39d353', 800);
  centerText((document.getElementById('visualCategory')||{}).value || 'FC LA COUR', h*0.75, Math.round(w*0.024), '#d8e0da', 700);
 }else if(currentVisualTemplate==='partner'){
  centerText('PARTENAIRE DU CLUB', h*0.28, Math.round(w*0.048), '#39d353', 900);
  ctx.fillStyle='#f7faf8'; ctx.beginPath(); ctx.roundRect(w*0.18,h*0.40,w*0.64,h*0.17,26); ctx.fill();
  centerText((document.getElementById('visualPartner')||{}).value || 'Nom du partenaire', h*0.50, Math.round(w*0.05), '#101713', 900);
  centerText((document.getElementById('visualPartnerMsg')||{}).value || 'Merci pour votre soutien', h*0.68, Math.round(w*0.028), '#f3c842', 800);
 }else{
  centerText((document.getElementById('visualAnnouncement')||{}).value || 'ANNONCE CLUB', h*0.36, Math.round(w*0.058), '#39d353', 950);
  wrapText((document.getElementById('visualAnnouncementMsg')||{}).value || 'Information importante du FC LA COUR', w/2, h*0.52, w*0.72, Math.round(w*0.04), `800 ${Math.round(w*0.03)}px Arial`, '#fff', 'center');
 }

 centerText('ENSEMBLE, PLUS FORTS.', h*0.93, Math.round(w*0.024), '#39d353', 850);
}

