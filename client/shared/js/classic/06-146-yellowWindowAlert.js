function yellowWindowAlert(dossier){
 const all=(state.discipline||[]).filter(d=>
   norm(d.personNumber)===norm(dossier.personNumber) &&
   (d.yellowCards||0)>0 &&
   d.matchDate
 ).sort((a,b)=>String(a.matchDate).localeCompare(String(b.matchDate)));

 if(all.length<3)return null;

 for(let i=0;i<all.length;i++){
  const selected=[];
  for(let j=i;j<all.length;j++){
   if(!samePractice(all[i],all[j]))continue;
   const d1=parseDateSafe(all[i].matchDate),d2=parseDateSafe(all[j].matchDate);
   if(!d1||!d2)continue;
   const days=(d2-d1)/86400000;
   if(days<=92){
    // Each warning must have occurred on a different match.
    const matchKey=String(all[j].matchNumber||all[j].matchDate);
    if(!selected.some(x=>String(x.matchNumber||x.matchDate)===matchKey)){
      selected.push(all[j]);
    }
    const warnings=selected.reduce((s,x)=>s+Math.max(1,Number(x.yellowCards||0)),0);
    if(selected.length>=3 && warnings>=3){
      return {
       type:'pending',
       title:'Suspension 1 match à confirmer',
       text:'Seuil de 3 avertissements sur 3 matchs différents dans une période ≤ 3 mois détecté. La suspension devient officielle après décision de l’organe disciplinaire.',
       ref:'FFF Annexe 2, art. 1.3 / LRF art. 51',
       matches:selected.slice(0,3).map(x=>x.matchNumber||x.matchDate)
      };
    }
   }
  }
 }
 return null;
}
