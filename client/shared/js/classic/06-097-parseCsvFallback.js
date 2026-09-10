function parseCsvFallback(text){
 const input=String(text||'').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').replace(/\r/g,'\n');
 if(!input.trim())return [];
 let quoted=false,comma=0,semi=0;
 for(let i=0;i<input.length;i++){
  const ch=input[i];if(ch==='"'){if(quoted&&input[i+1]==='"'){i++;continue;}quoted=!quoted;}
  if(!quoted){if(ch==='\n')break;if(ch===',')comma++;if(ch===';')semi++;}
 }
 const delim=semi>=comma?';':',';const rows=[];let row=[],cell='';quoted=false;
 for(let i=0;i<input.length;i++){
  const ch=input[i];
  if(ch==='"'){if(quoted&&input[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
  else if(!quoted&&ch===delim){row.push(cell);cell='';}
  else if(!quoted&&ch==='\n'){row.push(cell);if(row.some(v=>v.trim()!==''))rows.push(row);row=[];cell='';}
  else cell+=ch;
 }
 if(quoted)throw new Error('CSV invalide : champ entre guillemets non terminé.');
 row.push(cell);if(row.some(v=>v.trim()!==''))rows.push(row);return rows;
}
