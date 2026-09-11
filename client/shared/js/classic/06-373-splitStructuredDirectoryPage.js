function splitStructuredDirectoryPage(page){
 const detected=detectDirectoryClubHeaders(page);
 const clubs=[];
 detected.headers.forEach((header,i)=>{
  const next=detected.headers[i+1]||null;
  clubs.push(parseDirectoryStructuredClub(page,header,next,detected.rows));
 });
 return {clubs,headers:detected.headers,rows:detected.rows};
}

