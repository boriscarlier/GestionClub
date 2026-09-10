function renderVisualFields(){
 const box=document.getElementById('visualDynamicFields');
 if(!box) return;
 if(currentVisualTemplate==='match' || currentVisualTemplate==='result'){
  box.innerHTML=`<div class="field"><label>Match source</label><select id="visualMatchSelect" onchange="generateVisual()">${state.matches.map(m=>`<option value="${m.id}">${m.date} — ${m.team} / ${m.opponent}</option>`).join('')}</select></div>`;
 }else if(currentVisualTemplate==='birthday'){
  box.innerHTML=`<div class="field"><label>Nom / prénom</label><input id="visualName" value="Prénom NOM" oninput="generateVisual()"></div>
  <div class="field"><label>Âge ou message</label><input id="visualAge" value="Joyeux anniversaire !" oninput="generateVisual()"></div>
  <div class="field"><label>Catégorie</label><input id="visualCategory" value="FC LA COUR" oninput="generateVisual()"></div>`;
 }else if(currentVisualTemplate==='partner'){
  box.innerHTML=`<div class="field"><label>Nom du partenaire</label><input id="visualPartner" value="Nom du partenaire" oninput="generateVisual()"></div>
  <div class="field"><label>Message</label><input id="visualPartnerMsg" value="Merci pour votre soutien" oninput="generateVisual()"></div>`;
 }else{
  box.innerHTML=`<div class="field"><label>Titre</label><input id="visualAnnouncement" value="ANNONCE CLUB" oninput="generateVisual()"></div>
  <div class="field"><label>Message</label><textarea id="visualAnnouncementMsg" rows="5" oninput="generateVisual()">Information importante du FC LA COUR</textarea></div>`;
 }
}

