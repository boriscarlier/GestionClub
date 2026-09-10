function memberIsMinorNow(m){
 const birth=parseDateSafe(m?.birthDate);
 if(!birth||birth>new Date())return m?.isMinor===true;
 const now=new Date();let age=now.getFullYear()-birth.getFullYear();
 if(now.getMonth()<birth.getMonth()||(now.getMonth()===birth.getMonth()&&now.getDate()<birth.getDate()))age--;
 return age<18;
}
