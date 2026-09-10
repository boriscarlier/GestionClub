function coachMatchKickoffDate(match){
 const date=parseDateSafe(match?.date),time=String(match?.time||'');
 if(!date||!/^\d{1,2}:\d{2}$/.test(time))return null;const [h,m]=time.split(':').map(Number);
 if(h>23||m>59)return null;date.setHours(h,m,0,0);return date;
}
