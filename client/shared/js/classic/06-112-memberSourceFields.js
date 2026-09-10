function memberSourceFields(row,headers){const o={};headers.forEach((h,i)=>o[String(h||('col_'+i))]=row[i]??'');return o}
