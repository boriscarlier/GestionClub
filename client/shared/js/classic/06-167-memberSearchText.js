function memberSearchText(m){
 return norm([
  m.first,m.last,m.fullName,m.licenseNumber,m.personNumber,m.type,m.licenseType,m.category,m.subcategory,
  m.status,m.license,m.phone,m.mobile,m.homePhone,m.email,m.otherEmail,m.clubName
 ].filter(Boolean).join(' '));
}
