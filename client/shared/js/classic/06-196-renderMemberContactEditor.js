function renderMemberContactEditor(m){
 return `<div class="member-block-edit-grid">
  ${memberEditField('editMemberPhone','Téléphone',m.phone||m.mobile,'tel')}
  ${memberEditField('editMemberHomePhone','Téléphone domicile',m.homePhone,'tel')}
  ${memberEditField('editMemberWorkPhone','Téléphone travail',m.workPhone,'tel')}
  ${memberEditField('editMemberEmail','Email principal',m.email,'email')}
  ${memberEditField('editMemberOtherEmail','Email autre',m.otherEmail,'email')}
  ${memberEditField('editMemberAddress','Adresse',m.address||[m.addressExtra,m.street,m.locality,m.postalCode,m.postOffice,m.country].filter(Boolean).join(', '))}
 </div><div class="member-block-edit-actions"><button class="primary" onclick="saveMemberBlock('contact')">Enregistrer</button><button class="ghost" onclick="cancelMemberBlockEdit('contact')">Annuler</button></div>`;
}
