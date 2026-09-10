function renderPublicHomeMatches(){
 const upcomingBox=document.getElementById('publicUpcomingMatches');
 const resultsBox=document.getElementById('publicRecentResults');
 if(!upcomingBox||!resultsBox)return;

 const upcoming=publicVisibleMatches()
  .filter(publicMatchIsUpcoming)
  .sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')))
  .slice(0,3);

 const results=publicVisibleMatches()
  .filter(publicMatchIsFinished)
  .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))
  .slice(0,3);

 upcomingBox.innerHTML=upcoming.length
  ? upcoming.map(m=>publicMatchCardHtml(m,false)).join('')
  : '<div class="tiny">Aucun match à venir pour le moment.</div>';

 resultsBox.innerHTML=results.length
  ? results.map(m=>publicMatchCardHtml(m,true)).join('')
  : '<div class="tiny">Aucun résultat disponible pour le moment.</div>';

 applyClubLogoAssets?.(document);
}
