function filteredMembers(){
 const q=norm(document.getElementById('memberSearch')?.value||'');
 const cat=document.getElementById('memberCategoryFilter')?.value||'';
 const type=document.getElementById('memberTypeFilter')?.value||'';
 const lic=document.getElementById('memberLicenseFilter')?.value||'';
 const disc=document.getElementById('memberDisciplineFilter')?.value||'';
 const account=typeof currentAdminAccount==='function'?currentAdminAccount():null;
 const unrestricted=!(state.accounts||[]).length;
 const canDiscipline=unrestricted || (typeof accountCanSeeSensitive==='function'&&accountCanSeeSensitive(account,'discipline'));
 return memberSourceRows().filter(m=>{
  const risks=canDiscipline?memberDisciplineRisk(m):[];
  const susp=canDiscipline?isMemberSuspended(m):false;
  if(q && !memberSearchText(m).includes(q))return false;
  if(cat && String(m.category||'')!==cat)return false;
  if(type && String(m.type||m.licenseType||'')!==type)return false;
  if(lic && String(m.license||m.status||'')!==lic)return false;
  if(disc==='alert' && !risks.length)return false;
  if(disc==='suspended' && !susp)return false;
  if(disc==='none' && risks.length)return false;
  return true;
 });
}
