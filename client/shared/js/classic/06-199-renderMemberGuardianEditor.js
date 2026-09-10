function renderMemberGuardianEditor(m){
 return `<div class="member-block-edit-grid">
  ${memberEditField('editMemberGuardian1Name','Représentant 1',m.guardian1Name||m.guardianName)}
  ${memberEditField('editMemberGuardian1Mobile','Mobile repr. 1',m.guardian1Mobile||m.guardianPhone,'tel')}
  ${memberEditField('editMemberGuardian1Email','Email repr. 1',m.guardian1Email||m.guardianEmail,'email')}
  ${memberEditField('editMemberGuardian2Name','Représentant 2',m.guardian2Name)}
  ${memberEditField('editMemberGuardian2Mobile','Mobile repr. 2',m.guardian2Mobile,'tel')}
  ${memberEditField('editMemberGuardian2Email','Email repr. 2',m.guardian2Email,'email')}
 </div><div class="member-block-edit-actions"><button class="primary" onclick="saveMemberBlock('guardian')">Enregistrer</button><button class="ghost" onclick="cancelMemberBlockEdit('guardian')">Annuler</button></div>`;
}
