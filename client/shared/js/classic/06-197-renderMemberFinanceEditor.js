function renderMemberFinanceEditor(m){
 return `<div class="member-block-edit-grid">
  ${memberEditField('editMemberPriceApplied','Prix appliqué',m.priceApplied,'number','step="0.01" min="0"')}
  ${memberEditField('editMemberClubPrice','Prix club',m.clubPrice,'number','step="0.01" min="0"')}
  ${memberEditField('editMemberPaymentAmount','Montant règlement',m.paymentAmount,'number','step="0.01" min="0"')}
  ${memberEditField('editMemberPaymentState','État règlement',m.paymentState)}
  ${memberEditField('editMemberPaymentDate','Date règlement',normalizeDateCell(m.paymentDate),'date')}
  ${memberEditField('editMemberPaymentMode','Mode règlement',m.paymentMode)}
  ${memberEditField('editMemberPaymentLabel','Libellé',m.paymentLabel)}
 </div><div class="member-block-edit-actions"><button class="primary" onclick="saveMemberBlock('finance')">Enregistrer</button><button class="ghost" onclick="cancelMemberBlockEdit('finance')">Annuler</button></div>`;
}
