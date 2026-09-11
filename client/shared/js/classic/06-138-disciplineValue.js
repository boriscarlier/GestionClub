function disciplineValue(row,headers,name){
 const i=disciplineHeaderIndex(headers,name);return i>=0?(row[i]??''):'';
}
