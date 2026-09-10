function prototypeCsvCell(v){
 let text=String(v??'');if(/^[\s]*[=+\-@]/.test(text))text="'"+text;
 return '"'+text.replace(/"/g,'""')+'"';
}
