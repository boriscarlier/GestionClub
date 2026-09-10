function matchStatusValue(m){
 const raw=String(m?.status||'').trim();
 if(raw)return raw;
 return hasMatchScore(m)?'Terminé':'À venir';
}
