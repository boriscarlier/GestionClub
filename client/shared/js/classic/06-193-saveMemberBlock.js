function saveMemberBlock(block){
 if(!qaCanEditBlock(block))return toast('Accès refusé','Modification des licenciés non autorisée.');
 const m=(state.members||[]).find(x=>x.id===currentMemberId);if(!m)return;
 if(!qaValidateMemberBlock(block))return;
 const before=JSON.parse(JSON.stringify(m));
 const now=new Date().toISOString();

 if(block==='identity'){
  m.personNumber=memberValue('editMemberPersonNumber');
  m.licenseNumber=memberValue('editMemberLicenseNumber');
  m.title=memberValue('editMemberTitle');
  m.birthDate=memberValue('editMemberBirthDate');
  m.birthPlace=memberValue('editMemberBirthPlace');
  m.sex=memberValue('editMemberSex');
  m.nationality=memberValue('editMemberNationality');
  m.photoStatus=memberValue('editMemberPhotoStatus');
  m.medicalValidity=memberValue('editMemberMedicalValidity');
 }
 if(block==='contact'){
  m.phone=memberValue('editMemberPhone');
  m.mobile=m.phone;
  m.homePhone=memberValue('editMemberHomePhone');
  m.workPhone=memberValue('editMemberWorkPhone');
  m.email=memberValue('editMemberEmail');
  m.otherEmail=memberValue('editMemberOtherEmail');
  m.address=memberValue('editMemberAddress');
 }
 if(block==='finance'){
  m.priceApplied=memberNumberOrNull('editMemberPriceApplied');
  m.clubPrice=memberNumberOrNull('editMemberClubPrice');
  m.paymentAmount=memberNumberOrNull('editMemberPaymentAmount');
  m.paymentState=memberValue('editMemberPaymentState');
  m.paymentDate=memberValue('editMemberPaymentDate');
  m.paymentMode=memberValue('editMemberPaymentMode');
  m.paymentLabel=memberValue('editMemberPaymentLabel');
 }
 if(block==='license'){
  m.licenseNumber=memberValue('editMemberLicenseMain');
  m.licenseType=memberValue('editMemberLicenseType');
  m.type=m.licenseType;
  m.category=memberValue('editMemberCategory');
  m.subcategory=memberValue('editMemberSubcategory');
  m.status=memberValue('editMemberLicenseStatus');
  m.license=m.status;
  m.roles=memberValue('editMemberRoles').split(/[,;|]/).map(x=>x.trim()).filter(Boolean);
 }
 if(block==='guardian'){
  m.guardian1Name=memberValue('editMemberGuardian1Name');
  m.guardianName=m.guardian1Name;
  m.guardian1Mobile=memberValue('editMemberGuardian1Mobile');
  m.guardianPhone=m.guardian1Mobile;
  m.guardian1Email=memberValue('editMemberGuardian1Email');
  m.guardianEmail=m.guardian1Email;
  m.guardian2Name=memberValue('editMemberGuardian2Name');
  m.guardian2Mobile=memberValue('editMemberGuardian2Mobile');
  m.guardian2Email=memberValue('editMemberGuardian2Email');
 }
 m.updatedAt=now;
 try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){Object.keys(m).forEach(k=>delete m[k]);Object.assign(m,before);toast('Non enregistré','Stockage indisponible.');return;}
 if(typeof logAdminAction==='function')logAdminAction('Licenciés','Modification bloc',`${m.last||''} ${m.first||''} • ${block}`);
 memberBlockEditState.delete(block);delete qaMemberDrafts[block];
 renderMemberDetail();
 if(typeof renderMembers==='function')renderMembers();
 toast('Licencié','Bloc enregistré.');
}
