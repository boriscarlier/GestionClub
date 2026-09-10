function qaSourceValue(m,...names){
 const source=m?.sourceData;if(!source||typeof source!=='object')return '';
 const wanted=names.map(norm);
 const key=Object.keys(source).find(k=>wanted.includes(norm(k).replace(/_\d+$/,'')));
 return key===undefined?'':source[key];
}

