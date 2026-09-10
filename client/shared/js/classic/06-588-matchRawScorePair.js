function matchRawScorePair(m){
 if(!m)return null;
 let pair=qaScorePair(m.fcScore,m.oppScore);
 if(pair)return {fc:pair[0],opp:pair[1],source:'manager'};
 const legacy=/^(MATCHS_REFERENCE|LRF_)/.test(m.sourceFormat||'');
 const side=matchHomeAwayLabel(m);
 const orient=(pair,source)=>side==='Domicile'?{fc:pair[0],opp:pair[1],source}:
  side==='Extérieur'?{fc:pair[1],opp:pair[0],source}:{fc:null,opp:null,receiver:pair[0],visitor:pair[1],source:source+'-unoriented'};
 pair=qaScorePair(m.receiverScore,m.visitorScore);
 if(pair)return orient(pair,'lrf');
 pair=qaScorePair(qaSourceValue(m,'Résultat recevant'),qaSourceValue(m,'Résultat visiteur'));
 if(pair)return orient(pair,'sourceData-lrf');
 pair=qaScorePair(m.homeScore,m.awayScore);
 if(pair){
  // Les anciens imports LRF stockaient déjà ces deux champs dans l'ordre club/adversaire.
  if(legacy||m.scoreOrientation==='club')return {fc:pair[0],opp:pair[1],source:'legacy-club'};
  if(side==='Extérieur')return {fc:pair[1],opp:pair[0],source:'home-away'};
  return {fc:pair[0],opp:pair[1],source:'legacy-manager'};
 }
 return null;
}
