function statsCountBy(list,keyFn){
 const out={};list.forEach(x=>{const k=String(keyFn(x)||'Non renseigné').trim()||'Non renseigné';out[k]=(out[k]||0)+1});return out;
}
