function memberAge(m){
 if(!m?.birthDate)return null;const d=new Date(m.birthDate+'T12:00:00');if(isNaN(d))return null;
 return Math.max(0,Math.floor((Date.now()-d.getTime())/(365.2425*86400000)));
}
