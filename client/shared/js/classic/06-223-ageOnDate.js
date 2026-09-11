function ageOnDate(birth,dateStr){
 const b=parseDateSafe(birth),d=parseDateSafe(dateStr)||new Date();if(!b)return null;
 let age=d.getFullYear()-b.getFullYear();
 const md=d.getMonth()-b.getMonth(); if(md<0||(md===0&&d.getDate()<b.getDate()))age--;
 return age;
}

