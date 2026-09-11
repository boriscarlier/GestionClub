function cleanClubLevel(value){
 let raw=cleanFffValue(value||'');
 if(!raw)return '';

 // Remove labels/fields accidentally concatenated by PDF extraction.
 raw=raw.split(/\b(?:Type|Couleurs?|Si[eè]ge social|Email|Mob\.|T[eé]l\.|President|Président|Correspondant|Installation)\b/i)[0].trim();
 raw=raw.replace(/^[:\s-]+|[:\s-]+$/g,'');

 const patterns=[
  /\bR[ée]gionale?\s*[123]\b/i,
  /\bR[123]\s+F[ée]minines?\b/i,
  /\bR[123]\s+F[ée]minin(?:es)?\b/i,
  /\bChallenge\s+V[ée]t(?:[ée]rans?)?\s*42\b/i,
  /\bU\d{2}\s+Elite\s+Regional(?:e)?\b/i,
  /\bU\d{2}\s+Elite\s+R[ée]gional(?:e)?\b/i,
  /\bU\d{2}\s+Excell(?:ence)?\b/i,
  /\bR[ée]serves?\s+R3\b/i
 ];
 for(const p of patterns){
  const m=raw.match(p);
  if(m)return m[0].replace(/\s+/g,' ').trim();
 }
 return raw;
}

