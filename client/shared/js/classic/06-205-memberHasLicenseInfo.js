function memberHasLicenseInfo(m){
 const licenses=siblingLicenses(m)||[];
 if(licenses.length)return licenses.some(x=>[
  x.licenseNumber,x.licenseType,x.type,x.subcategory,x.category,x.status,x.license,
  Array.isArray(x.roles)?x.roles.join(' '):x.roles
 ].some(v=>String(v??'').trim()!==''));
 return !![
  m.licenseNumber,m.licenseType,m.type,m.category,m.subcategory,m.status,m.license,
  Array.isArray(m.roles)?m.roles.join(' '):m.roles
 ].some(v=>String(v??'').trim()!=='');
}
