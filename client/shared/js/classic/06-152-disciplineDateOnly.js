function disciplineDateOnly(value){
 if(!value)return null;
 const d=parseDateSafe(value);
 if(!d || Number.isNaN(d.getTime()))return null;
 return new Date(d.getFullYear(),d.getMonth(),d.getDate());
}

