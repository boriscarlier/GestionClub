function renderMemberDisciplineEditor(m,ds){
 if(!ds.length)return `<div class="tiny">Aucun dossier disciplinaire lié à ce licencié. La création d’un nouveau dossier reste gérée dans le module Discipline.</div><div class="member-block-edit-actions"><button class="ghost" onclick="cancelMemberBlockEdit('discipline')">Fermer</button></div>`;
 return ds.map((d,index)=>`<div class="member-discipline-edit-card">
  <strong>Dossier ${escapeHtml(d.dossierNumber||String(index+1))}</strong>
  <div class="member-block-edit-grid" style="margin-top:10px">
   ${memberEditField(`editDiscNumber_${index}`,'N° dossier',d.dossierNumber)}
   ${memberEditField(`editDiscStatus_${index}`,'Statut',d.status)}
   ${memberEditField(`editDiscMatchNumber_${index}`,'N° match',d.matchNumber)}
   ${memberEditField(`editDiscMatchDate_${index}`,'Date match',normalizeDateCell(d.matchDate),'date')}
   ${memberEditField(`editDiscReason_${index}`,'Motif',d.reason)}
   ${memberEditField(`editDiscDecision_${index}`,'Décision',d.decision)}
   ${memberEditField(`editDiscEffectDate_${index}`,'Date effet',normalizeDateCell(d.effectDate),'date')}
   ${memberEditField(`editDiscEndDate_${index}`,'Date fin',normalizeDateCell(d.endDate),'date')}
  </div>
 </div>`).join('')+`<div class="member-block-edit-actions"><button class="primary" onclick="saveMemberDisciplineBlock()">Enregistrer</button><button class="ghost" onclick="cancelMemberBlockEdit('discipline')">Annuler</button></div>`;
}


