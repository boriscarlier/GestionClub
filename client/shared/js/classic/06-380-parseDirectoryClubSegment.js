function parseDirectoryClubSegment(segText,name,affiliation,pageNo){
 const lines=String(segText||'').split(/\n+/).map(cleanFffValue).filter(Boolean);
 const flat=lines.join('\n');

 const colors=cleanClubColors(firstFffMatch(flat,[/Couleurs?\s*:\s*([^\n]+)/i]));
 const level=cleanClubLevel(firstFffMatch(flat,[/Niveau\s*:\s*([^\n]+)/i]));
 const officialEmail=firstFffMatch(flat,[/Email officiel\s*:\s*([^\n\s]+@[^\n\s]+)/i]);
 const mainEmail=firstFffMatch(flat,[/Email principal\s*:\s*([^\n\s]+@[^\n\s]+)/i]);
 const president=firstFffMatch(flat,[/President\s*:\s*([^\n]+)/i,/Président\s*:\s*([^\n]+)/i]);
 const correspondent=firstFffMatch(flat,[/Correspondant\s*:\s*([^\n]+)/i]);
 const installation=firstFffMatch(flat,[/Installation\s*:\s*([^\n]+)/i]);
 const surface=firstFffMatch(flat,[/Surface de jeu\s*:\s*([^\n]+)/i]);
 const website=firstFffMatch(flat,[/Site internet\s*:\s*([^\n]+)/i]);

 // Try to recover city/locality from postal-code lines.
 const postalLines=lines.filter(x=>/\b974\d{2}\b/.test(x));
 const addressLines=[];
 const siegeIdx=lines.findIndex(x=>/si[eè]ge social/i.test(x));
 if(siegeIdx>=0){
  for(let i=siegeIdx+1;i<Math.min(lines.length,siegeIdx+7);i++){
   const l=lines[i];
   if(/email|mob\.|tél\.|fax|president|correspondant|niveau|type|installation/i.test(norm(l)))break;
   addressLines.push(l);
  }
 }
 const address=addressLines.join(', ');
 const city=postalLines.length?postalLines[0].replace(/^.*\b974\d{2}\b\s*/,'').trim():'';

 return {
  id:'dir_'+pageNo+'_'+affiliation,
  sourcePage:pageNo,
  name,affiliation,
  identity:{name,affiliation,colors,level},
  coordinates:{address,city,website},
  contacts:{officialEmail,mainEmail,emails:collectEmails(flat),phones:collectPhones(flat)},
  leaders:{president,correspondent},
  facilities:{installation,surface},
  rawText:flat,
  matchName:''
 };
}

