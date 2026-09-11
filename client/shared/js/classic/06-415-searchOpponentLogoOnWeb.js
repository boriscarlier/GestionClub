function searchOpponentLogoOnWeb(){
 const q=opponentSearchQuery();
 if(!q || q==='football club logo')return toast('Logo','Renseignez d’abord le nom du club.');
 const url='https://www.google.com/search?tbm=isch&q='+encodeURIComponent(q);
 window.open(url,'_blank','noopener,noreferrer');
 toast('Recherche logo','La recherche d’images a été ouverte dans un nouvel onglet.');
}
