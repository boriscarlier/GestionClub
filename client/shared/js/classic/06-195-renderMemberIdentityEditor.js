function renderMemberIdentityEditor(m){
 return `<div class="member-block-edit-grid">
  ${memberEditField('editMemberPersonNumber','N° personne',m.personNumber)}
  ${memberEditField('editMemberLicenseNumber','N° licence',m.licenseNumber)}
  ${memberEditField('editMemberTitle','Civilité',m.title)}
  ${memberEditField('editMemberBirthDate','Date de naissance',normalizeDateCell(m.birthDate),'date')}
  ${memberEditField('editMemberBirthPlace','Lieu de naissance',m.birthPlace)}
  ${memberEditField('editMemberSex','Sexe',m.sex)}
  ${memberEditField('editMemberNationality','Nationalité',m.nationality)}
  ${memberEditField('editMemberPhotoStatus','Statut photo',m.photoStatus)}
  ${memberEditField('editMemberMedicalValidity','Certificat médical N+1',m.medicalValidity)}
 </div><div class="member-block-edit-actions"><button class="primary" onclick="saveMemberBlock('identity')">Enregistrer</button><button class="ghost" onclick="cancelMemberBlockEdit('identity')">Annuler</button></div>`;
}
