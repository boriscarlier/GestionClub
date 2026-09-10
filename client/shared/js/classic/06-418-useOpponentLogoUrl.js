function useOpponentLogoUrl(){
 const url=document.getElementById('oppClubLogoUrl')?.value.trim();
 if(!url)return toast('Logo','Aucune URL renseignée.');
 opponentLogoDraft=url;
 const preview=document.getElementById('oppLogoPreview');
 if(preview)preview.innerHTML=`<img src="${url}" alt="Logo choisi" style="width:60px;height:60px;object-fit:contain;background:#fff;border-radius:10px;padding:4px"><div class="tiny">Logo Internet sélectionné. Cliquez sur Ajouter / Enregistrer.</div>`;
 toast('Logo','Logo sélectionné. Enregistrez maintenant la fiche du club.');
}

