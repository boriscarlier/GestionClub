function memberEditField(id,label,value,type='text',extra=''){
 return `<div class="field"><label>${escapeHtml(label)}</label><input id="${id}" type="${type}" value="${memberEditAttr(value)}" ${extra}></div>`;
}
