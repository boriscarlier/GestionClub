function renderOpponentFffImportPreview(){
 const d=opponentFffImportDraft;
 const box=document.getElementById('oppFffImportResult');
 if(!box||!d)return;

 const matchNames=opponentNamesFromMatches();
 box.innerHTML=`
  <div class="club-fff-import-grid">
   ${fffImportField('Club FFF',d.name)}
   ${fffImportField('N° affiliation',d.affiliation)}
   ${fffImportField('Ligue',d.league)}
   ${fffImportField('District',d.district)}
   ${fffImportField('Date affiliation',d.affiliationDate)}
   ${fffImportField('Adresse',d.address)}
   ${fffImportField('Téléphone',d.phone)}
   ${fffImportField('Email officiel',d.officialEmail||d.primaryEmail)}
   ${fffImportField('Président',d.president)}
   ${fffImportField('Stade',d.venueName)}
   ${fffImportField('NNI',d.nni)}
  </div>
  <div class="field" style="margin-top:12px">
   <label>Correspondance avec l’adversaire de la base Matchs</label>
   <select id="oppFffMatchName">
    <option value="">Aucune correspondance / choisir…</option>
    ${matchNames.map(n=>`<option value="${n.replace(/"/g,'&quot;')}" ${n===d.matchName?'selected':''}>${n}</option>`).join('')}
   </select>
  </div>
  <div class="club-fff-import-actions">
   <button class="primary" onclick="applyOpponentFffImport()">Utiliser ces informations</button>
   <button class="ghost" onclick="cancelOpponentFffImport()">Annuler</button>
  </div>`;
}
