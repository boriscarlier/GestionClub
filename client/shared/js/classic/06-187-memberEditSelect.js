function memberEditSelect(id,label,value,options){
 return `<div class="field"><label>${escapeHtml(label)}</label><select id="${id}">${options.map(opt=>{
  const val=typeof opt==='string'?opt:opt.value;
  const text=typeof opt==='string'?opt:opt.label;
  return `<option value="${memberEditAttr(val)}" ${String(value??'')===String(val)?'selected':''}>${escapeHtml(text)}</option>`;
 }).join('')}</select></div>`;
}
