function qaScore(value){
 if(value===null||value===undefined||typeof value==='boolean')return null;
 const text=String(value).trim();
 if(!/^\d+$/.test(text))return null;
 const n=Number(text);return Number.isSafeInteger(n)&&n>=0?n:null;
}

