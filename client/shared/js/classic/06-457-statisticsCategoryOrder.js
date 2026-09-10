function statisticsCategoryOrder(name){
 const n=norm(name||'');

 // Ordre souhaité pour le pilotage des effectifs.
 if(n.includes('senior'))return 10;
 if(n.includes('feminin')||n.includes('féminin'))return 15;
 if(n.includes('veteran')||n.includes('vétéran'))return 20;
 if(n.includes('dirigeant'))return 30;

 const u=n.match(/\bu\s*([0-9]{1,2})\b/i) || n.match(/\bu([0-9]{1,2})\b/i);
 if(u){
  const age=Number(u[1]);
  if(age>=1&&age<=30)return 100-age; // U18 avant U17, etc.
 }

 return 1000;
}
