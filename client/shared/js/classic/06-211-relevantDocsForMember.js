function relevantDocsForMember(m){
 const docs=[];
 const type=norm(m.type||m.licenseType),cat=norm(m.category||m.subcategory);
 if(type.includes('arbitre')) docs.push('referee');
 else if(type.includes('educateur')) docs.push('educator','honor');
 else docs.push('player');
 if(m.isMinor) docs.push('healthMinor'); else docs.push('healthAdult');
 if(m.medicalValidity && !/oui|valide|validee|validée/i.test(String(m.medicalValidity))) docs.push('medical');
 if(norm(m.clubChangeNature).includes('mutation') || norm(m.requestNature).includes('changement')) docs.push('117d');
 return [...new Set(docs)];
}
