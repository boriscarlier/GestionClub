function renderFffDirectoryPreview(){
 const box=document.getElementById('oppFffImportResult');
 if(!box)return;
 const clubs=opponentFffDirectoryDraft||[];
 const matched=clubs.filter(c=>c.matchName).length;
 const withFacility=clubs.filter(c=>c.facilities?.installation).length;
 const withPhone=clubs.filter(c=>c.contacts?.phones?.length).length;
 const withContact=clubs.filter(c=>c.contacts?.officialEmail||c.contacts?.mainEmail||c.contacts?.phones?.length).length;

 const diag=(window.__fffDirectoryDiagnostics||[]);
 const diagnosticText=diag.length?diag.map(d=>`P${d.page}: ${d.headers}`).join(' • '):'—';

 box.innerHTML=`
  <div class="annuaire-diagnostic"><strong>Détection structurelle :</strong> ${diagnosticText}<br>Chaque nombre indique le nombre d’en-têtes de clubs détectés sur la page.</div>
  <div class="annuaire-summary">
   ${fffImportField('Clubs détectés',clubs.length)}
   ${fffImportField('Correspondances matchs',matched)}
   ${fffImportField('Avec installation',withFacility)}
   ${fffImportField('Avec téléphone',withPhone)}
  </div>
  <div class="annuaire-actions">
   <button class="primary" onclick="importAllDirectoryClubs()">Importer tous les clubs</button>
   <button class="ghost" onclick="cancelOpponentFffImport()">Annuler</button>
  </div>
  <div class="annuaire-club-list">
   ${clubs.map((c,i)=>`
    <div class="annuaire-club-card">
     <div class="annuaire-club-head">
      <div>
       <strong>${c.name}</strong>
       <div class="tiny">Affiliation ${c.affiliation}</div>
      </div>
      <div class="field annuaire-match-select">
       <label>Correspondance base Matchs</label>
       <select onchange="setDirectoryClubMatch(${i},this.value)">
        <option value="">Aucune</option>
        ${opponentNamesFromMatches().map(n=>`<option value="${n.replace(/"/g,'&quot;')}" ${n===c.matchName?'selected':''}>${n}</option>`).join('')}
       </select>
      </div>
     </div>
     <div class="annuaire-club-themes">
      <div class="annuaire-theme">
       <div class="label">Identité</div>
       <div><strong>${c.name}</strong></div>
       <div class="tiny">Affiliation ${c.affiliation||'—'}</div>
      </div>
      <div class="annuaire-theme">
       <div class="label">Couleurs</div>
       <div>${c.identity.colors||'—'}</div>
      </div>
      <div class="annuaire-theme level">
       <div class="label">Niveau</div>
       <div>${c.identity.level||'Non renseigné'}</div>
      </div>
      <div class="annuaire-theme">
       <div class="label">Coordonnées</div>
       <div>${c.coordinates.address||'—'}</div>
      </div>
      <div class="annuaire-theme">
       <div class="label">Dirigeants</div>
       <div>${c.leaders.president||c.leaders.correspondent||'—'}</div>
      </div>
      <div class="annuaire-theme contact">
       <div class="label">Contact club</div>
       <div>${c.contacts.officialEmail||c.contacts.mainEmail||c.contacts.emails?.[0]||'Email non renseigné'}</div>
       <div class="${c.contacts.phones?.length?'':'contact-phone-missing'}">${c.contacts.phones?.[0]||'Téléphone manquant'}</div>
      </div>
      <div class="annuaire-theme">
       <div class="label">Installation</div>
       <div>${c.facilities.installation||'—'}${c.facilities.surface?' • '+c.facilities.surface:''}</div>
      </div>
     </div>
     <div class="annuaire-actions">
      <button class="secondary" onclick="importOneDirectoryClub(${i})">Importer ce club</button>
     </div>
    </div>`).join('')}
  </div>`;
}

