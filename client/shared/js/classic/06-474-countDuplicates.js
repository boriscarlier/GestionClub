function countDuplicates(list,keyFn){
 const m=new Map();list.forEach(x=>{const k=norm(keyFn(x)||'');if(k)m.set(k,(m.get(k)||0)+1)});return [...m.values()].filter(n=>n>1).reduce((s,n)=>s+(n-1),0);
}
