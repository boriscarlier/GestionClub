function categoryFromReferenceMember(rec){
 const sub=norm(rec.subcategory),code=norm(rec.categoryCode),type=norm(rec.licenseType);
 if(type==='dirigeant'||sub.includes('dirigeant'))return 'Dirigeant';
 if(type==='arbitre'||sub.includes('arbitre')||code==='ar')return 'Arbitre';
 if(type.includes('educateur')||sub.includes('educateur')||code==='ef')return 'Éducateur';
 if(type==='technique')return 'Technique';
 if(type==='volontaire')return 'Volontaire';
 if(sub.includes('senior f')||code==='sef')return 'Féminines';
 if(sub.includes('veteran'))return 'Vétérans';
 const u=sub.match(/\bu(\d{1,2})\b/); if(u)return 'U'+u[1];
 if(code==='sem')return 'Seniors 1';
 if(code==='fa'||code==='faf')return sub||'École de foot';
 return rec.subcategory||rec.categoryCode||'Non classé';
}
