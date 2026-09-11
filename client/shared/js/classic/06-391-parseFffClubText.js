function parseFffClubText(text){
 const normalized=String(text||'').replace(/\r/g,'\n');
 const lines=normalized.split(/\n+/).map(cleanFffValue).filter(Boolean);
 const flat=lines.join('\n');

 const name=firstFffMatch(flat,[
  /(?:^|\n)([A-ZÀ-ÖØ-Ý0-9 .'-]{3,})\s+à\s+[A-ZÀ-ÖØ-Ý0-9 .'-]+/i,
  /(?:^|\n)(F\.?C\.?\s+[A-ZÀ-ÖØ-Ý0-9 .'-]+)/i
 ]);
 const affiliation=firstFffMatch(flat,[
  /N[°º]\s*d['’]?affiliation\s*:\s*([0-9]+)/i,
  /affiliation\s*:\s*([0-9]{5,})/i
 ]);
 const league=firstFffMatch(flat,[/Ligue\s*:\s*([^\n]+)/i]);
 const district=firstFffMatch(flat,[/District\s*:\s*([^\n]+)/i]);
 const clubType=firstFffMatch(flat,[/Type technique\s*:\s*([^\n]+)/i]);
 const affiliationDate=firstFffMatch(flat,[/Date d['’]affiliation\s*:\s*([0-9/.-]+)/i]);
 const prefecture=firstFffMatch(flat,[/N[°º]\s*de déclaration en préfecture\s*:\s*([A-Z0-9]+)/i]);
 const siret=firstFffMatch(flat,[/N[°º]\s*Siret\s*:\s*([0-9]+)/i]);
 const naf=firstFffMatch(flat,[/Code NAF\s*:\s*([A-Z0-9]+)/i]);
 const phone=firstFffMatch(flat,[/(?:Mobile travail|Téléphone)\s*:\s*([0-9 +().-]{8,})/i]);
 const officialEmail=firstFffMatch(flat,[/Email officiel\s*:\s*([^\s\n]+@[^\s\n]+)/i]);
 const primaryEmail=firstFffMatch(flat,[/Email principal\s*:\s*([^\s\n]+@[^\s\n]+)/i]);

 // Address extraction from "COORDONNÉES" zone, tolerant to line ordering.
 let address='';
 const coordIndex=lines.findIndex(x=>norm(x).includes('coordonnees'));
 if(coordIndex>=0){
  const chunk=lines.slice(coordIndex+1,coordIndex+12);
  const stop=chunk.findIndex(x=>norm(x).includes('membres'));
  const addrLines=(stop>=0?chunk.slice(0,stop):chunk)
   .filter(x=>!/mobile|email|telephone/i.test(norm(x)))
   .filter(x=>!/^adresse\s*:?\s*$/i.test(x));
  address=addrLines.slice(0,4).join(', ');
 }

 const president=firstFffMatch(flat,[/PRESIDENT\s*:\s*([^\n]+)/i]);
 const secretary=firstFffMatch(flat,[/SECRETAIRE GENERAL\s*:\s*([^\n]+)/i]);
 const treasurer=firstFffMatch(flat,[/TRESORIER\s*:\s*([^\n]+)/i]);
 const correspondent=firstFffMatch(flat,[/CORRESPONDANT\s*:\s*([^\n]+)/i]);

 const venueName=firstFffMatch(flat,[/(STADE\s+[A-ZÀ-ÖØ-Ý0-9 .'-]+)/i]);
 const nni=firstFffMatch(flat,[/Numéro NNI\s*([0-9]+)/i]);
 const venueCity=firstFffMatch(flat,[/Localité\s*([A-ZÀ-ÖØ-Ý0-9 .'-]+)/i]);

 const data={
  name:name.replace(/\s+à\s+.*$/i,'').trim(),
  affiliation,league,district,clubType,affiliationDate,prefecture,siret,naf,
  phone,officialEmail,primaryEmail,address,
  president,secretary,treasurer,correspondent,
  venueName,nni,venueCity,
  rawText:flat
 };
 return data;
}
