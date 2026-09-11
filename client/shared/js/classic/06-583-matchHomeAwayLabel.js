function matchHomeAwayLabel(m){
 const side=norm(m?.homeAway||m?.locationType||m?.venueType||m?.side||qaSourceValue(m,'Recevant-visiteur','Recevant / visiteur'));
 if(/^(r|domicile|home|recevant|recoit)$/.test(side)||side.includes('domicile'))return 'Domicile';
 if(/^(v|exterieur|away|visiteur|visitor)$/.test(side)||side.includes('exterieur'))return 'Extérieur';
 const club=norm('CLUB EXEMPLE').replace(/[^a-z0-9]/g,'');
 const isClub=v=>norm(v).replace(/[^a-z0-9]/g,'').includes(club);
 if(isClub(m?.home||m?.homeTeam||m?.teamHome||''))return 'Domicile';
 if(isClub(m?.away||m?.awayTeam||m?.teamAway||''))return 'Extérieur';
 return 'Non renseigné';
}
