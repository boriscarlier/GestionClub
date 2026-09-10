async function serverMembersApi(path){
 const response=await fetch(path,{credentials:'same-origin',cache:'no-store',headers:{'Accept':'application/json'}});
 const data=await response.json();
 if(!response.ok)throw new Error(data.error||'Lecture serveur refusée.');
 return data;
}
