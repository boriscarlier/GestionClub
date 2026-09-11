function normalizeReferenceMemberRecord(rec,row,headers){
 ['birthDate','photoUploadDate','registrationDate','licenseIssueDate','paymentDate','refereeRemovalDate','refereeFirstLicenseDate','stampStartDate','stampEndDate'].forEach(k=>rec[k]=normalizeDateCell(rec[k]));
 rec.personNumber=String(rec.personNumber??'').trim(); rec.licenseNumber=String(rec.licenseNumber??'').trim();
 rec.fullName=rec.fullName||`${rec.last||''} ${rec.first||''}`.trim();
 rec.category=categoryFromReferenceMember(rec); rec.type=rec.licenseType||'Libre'; rec.license=rec.status||'Active'; rec.public=false;
 rec.priceApplied=safeNumber(rec.priceApplied); rec.clubPrice=safeNumber(rec.clubPrice); rec.paymentAmount=safeNumber(rec.paymentAmount);
 rec.phone=String(rec.mobile||rec.homePhone||'').trim(); rec.email=String(rec.email||'').trim();
 rec.guardianName=String(rec.guardian1Name||'').trim(); rec.guardianPhone=String(rec.guardian1Mobile||'').trim(); rec.guardianEmail=String(rec.guardian1Email||'').trim();
 rec.address=[rec.addressExtra,rec.street,rec.locality,rec.postalCode,rec.postOffice,rec.country].map(x=>String(x||'').trim()).filter(Boolean).join(', ');
 rec.isMinor=false; if(rec.birthDate){const d=new Date(rec.birthDate+'T00:00:00');if(!isNaN(d))rec.isMinor=((Date.now()-d.getTime())/(365.25*86400000))<18;}
 rec.roles=[...new Set([rec.licenseType,rec.refereeCategory?`Arbitre ${rec.refereeCategory}`:'',rec.refereeDesignation?'Désignation arbitre':''].filter(Boolean))];
 rec.sourceFormat='LICENCES_REFERENCE_V2'; rec.sourceData=memberSourceFields(row,headers); return rec;
}

