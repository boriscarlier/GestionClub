function administrativeIssuesForMember(m){
 const issues=[];
 const add=(kind,severity,title,detail)=>issues.push({memberId:m.id,kind,severity,title,detail,name:`${m.last||''} ${m.first||''}`.trim(),license:m.licenseNumber||''});
 const status=norm(m.license||m.status);
 if(!m.licenseNumber)add('license','critical','Numéro de licence manquant','Impossible d’identifier réglementairement cette licence.');
 if(!m.email && !m.phone && !m.mobile)add('contact','warning','Coordonnées absentes','Ni email ni téléphone personnel n’est renseigné.');
 if(m.isMinor && !(m.guardian1Name||m.guardianName))add('guardian','critical','Représentant légal manquant','Un licencié mineur ne dispose pas de représentant légal renseigné.');
 if(m.isMinor && !(m.guardian1Email||m.guardianEmail||m.guardian1Mobile||m.guardianPhone))add('guardian','warning','Contact représentant incomplet','Aucun email ou téléphone du représentant légal principal.');
 if(m.photoStatus && /manquant|refus|invalide|non/i.test(norm(m.photoStatus)))add('medical','warning','Photo à contrôler',m.photoStatus);
 if(m.medicalValidity && /non|expire|expir|invalide/i.test(norm(m.medicalValidity)))add('medical','critical','Certificat médical à régulariser',m.medicalValidity);
 if(!m.medicalValidity)add('medical','info','Information médicale non renseignée','Aucune valeur de validité N+1 importée.');
 if(m.paymentState && !/total|regle|réglé|paye|payé/i.test(norm(m.paymentState)))add('payment','warning','Règlement incomplet',`${m.paymentState}${m.paymentAmount!=null?' • '+m.paymentAmount+' €':''}`);
 if(!m.paymentState)add('payment','info','État de règlement absent','Aucun état de règlement importé.');
 if(m.clubChangeNature || /changement|mutation/i.test(norm(m.requestNature)))add('transfer','warning','Changement de club / mutation à contrôler',m.clubChangeNature||m.requestNature);
 if(status && /bloque|refuse|incomplet|attente/i.test(status))add('license','critical','Statut licence à traiter',m.license||m.status);
 return issues;
}
