function birthdayThisWeek(m){
 if(!m.birthDate)return false;
 const b=new Date(m.birthDate+'T12:00:00');if(isNaN(b))return false;
 const now=new Date(),target=new Date(now.getFullYear(),b.getMonth(),b.getDate(),12);
 let diff=(target-now)/86400000;if(diff<-1)target.setFullYear(now.getFullYear()+1),diff=(target-now)/86400000;
 return diff>=-0.5&&diff<=7.5;
}
