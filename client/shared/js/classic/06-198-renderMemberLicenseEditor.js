function renderMemberLicenseEditor(m){
 return `<div class="member-block-edit-grid">
  ${memberEditField('editMemberLicenseMain','N° licence',m.licenseNumber)}
  ${memberEditField('editMemberLicenseType','Type de licence',m.licenseType||m.type)}
  ${memberEditField('editMemberCategory','Catégorie',m.category)}
  ${memberEditField('editMemberSubcategory','Sous-catégorie',m.subcategory)}
  ${memberEditField('editMemberLicenseStatus','Statut licence',m.status||m.license)}
  ${memberEditField('editMemberRoles','Rôles',Array.isArray(m.roles)?m.roles.join(', '):(m.roles||''))}
 </div><div class="tiny" style="margin-top:8px">Séparer plusieurs rôles par une virgule.</div><div class="member-block-edit-actions"><button class="primary" onclick="saveMemberBlock('license')">Enregistrer</button><button class="ghost" onclick="cancelMemberBlockEdit('license')">Annuler</button></div>`;
}
