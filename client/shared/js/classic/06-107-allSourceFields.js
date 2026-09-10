function allSourceFields(row,headers){
 const obj={};headers.forEach((h,i)=>{obj[String(h||('col_'+i))]=row[i]??''});return obj;
}
