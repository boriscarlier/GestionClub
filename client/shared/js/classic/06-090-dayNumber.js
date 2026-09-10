function dayNumber(v){
 if(typeof v==='number' && v>=0 && v<=6)return v;
 const x=norm(v);
 const map={lundi:0,lun:0,mardi:1,mar:1,mercredi:2,mer:2,jeudi:3,jeu:3,vendredi:4,ven:4,samedi:5,sam:5,dimanche:6,dim:6};
 return Object.prototype.hasOwnProperty.call(map,x)?map[x]:0;
}
