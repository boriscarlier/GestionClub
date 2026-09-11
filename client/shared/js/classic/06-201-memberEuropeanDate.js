function memberEuropeanDate(value){
 if(value===null||value===undefined||String(value).trim()==='')return '—';
 return formatDisciplineDate(value);
}
