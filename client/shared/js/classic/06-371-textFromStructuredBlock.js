function textFromStructuredBlock(rows,startIndex,endIndex){
 return rows.slice(startIndex,endIndex).map(r=>r.text).join('\n');
}

