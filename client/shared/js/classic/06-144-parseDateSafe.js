function parseDateSafe(value){
 if(value===null||value===undefined||value==='')return null;
 if(value instanceof Date)return Number.isNaN(+value)?null:new Date(value.getFullYear(),value.getMonth(),value.getDate(),12);
 const text=String(value).trim();let m=text.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/),y,mo,d;
 if(m){[,y,mo,d]=m;}else{m=text.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);if(!m)return null;[,d,mo,y]=m;}
 const result=new Date(Number(y),Number(mo)-1,Number(d),12);
 return result.getFullYear()===Number(y)&&result.getMonth()===Number(mo)-1&&result.getDate()===Number(d)?result:null;
}
