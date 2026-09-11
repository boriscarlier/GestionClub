function parseDirectoryStructuredClub(page,header,nextHeader,rows){
 const start=header.rowIndex;
 const end=nextHeader?nextHeader.rowIndex:rows.length;
 const blockRows=rows.slice(start,end);
 const blockText=blockRows.map(r=>r.text).join('\n');

 const colors=cleanClubColors(firstFffMatch(blockText,[/Couleurs?\s*:\s*([^\n]+)/i]));
 const level=cleanClubLevel(firstFffMatch(blockText,[/Niveau\s*:\s*([^\n]+)/i]));
 const officialEmail=firstFffMatch(blockText,[/Email officiel\s*:\s*([^\n\s]+@[^\n\s]+)/i]);
 const mainEmail=firstFffMatch(blockText,[/Email principal\s*:\s*([^\n\s]+@[^\n\s]+)/i]);
 const president=firstFffMatch(blockText,[/President\s*:\s*([^\n]+)/i,/Président\s*:\s*([^\n]+)/i]);
 const correspondent=firstFffMatch(blockText,[/Correspondant\s*:\s*([^\n]+)/i]);
 const installation=firstFffMatch(blockText,[/Installation\s*:\s*([^\n]+)/i]);
 const surface=firstFffMatch(blockText,[/Surface de jeu\s*:\s*([^\n]+)/i]);
 const website=firstFffMatch(blockText,[/Site internet\s*:\s*([^\n]+)/i]);

 // Recover address from rows after "Siège social", stopping at obvious contact fields.
 let addressParts=[];
 let inAddress=false;
 for(const r of blockRows){
  const txt=r.text;
  if(/si[eè]ge social\s*:/i.test(txt)){
   const after=txt.replace(/^.*?si[eè]ge social\s*:\s*/i,'').trim();
   if(after)addressParts.push(after);
   inAddress=true;
   continue;
  }
  if(inAddress){
   if(/email|mob\.|t[eé]l\.|fax|president|correspondant|niveau|type|installation/i.test(norm(txt)))break;
   if(txt)addressParts.push(txt);
   if(addressParts.length>=4)break;
  }
 }
 let address=addressParts.join(', ').replace(/\s+,/g,',').trim();

 // Postal/city fallback.
 const postalLine=blockRows.map(r=>r.text).find(t=>/\b974\d{2}\b/.test(t))||'';
 const postal=firstFffMatch(postalLine,[/\b(974\d{2})\b/]);
 const cityFromPostal=postalLine.replace(/^.*?\b974\d{2}\b\s*/,'').trim();

 return {
  id:'dir_'+page.page+'_'+header.affiliation,
  sourcePage:page.page,
  name:header.name,
  affiliation:header.affiliation,
  identity:{
   name:header.name,
   affiliation:header.affiliation,
   colors,
   level,
   region:header.region
  },
  coordinates:{
   address,
   city:cityFromPostal||header.city,
   locality:header.city,
   postalCode:postal,
   website
  },
  contacts:{
   officialEmail,
   mainEmail,
   emails:collectEmails(blockText),
   phones:collectPhones(blockText)
  },
  leaders:{president,correspondent},
  facilities:{installation,surface},
  rawText:blockText,
  matchName:''
 };
}

