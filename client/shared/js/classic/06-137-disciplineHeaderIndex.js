function disciplineHeaderIndex(headers,name){
 const n=norm(name);return headers.findIndex(h=>norm(h)===n);
}
