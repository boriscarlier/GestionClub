function lrfRowToMatch(row,headers){
 const val=(...names)=>headerValue(row,headers,names);
 const competition=val('Compétition','Compétition / Phase_2','Compétition / Phase_1','Compétition / Phase');
 const phase=val('Phase');
 const sourceTeam=String(val('Equipe locale_2','Equipe locale_1','Equipe locale')||'').trim();
 const opponentClub=String(val('Club adverse_2','Club adverse_1','Club adverse')||'').trim();
 const opponentTeam=String(val('Equipe adverse_2','Equipe adverse_1','Equipe adverse')||'').trim();
 const rawDate=val('Date du match_2','Date du match_1','Date du match');
 const rawTime=String(val('Heure du match_2','Heure du match_1','Heure du match')||'').trim();
 const place=String(val("Nom de l'installation_2","Nom de l'installation_1","Nom de l'installation")||'').trim();
 const homeAwayRaw=String(val('Recevant-visiteur_2','Recevant-visiteur_1','Recevant-visiteur')||'').trim();
 const side=matchHomeAwayLabel({homeAway:homeAwayRaw});
 const isReceiving=side==='Domicile';
 const isVisiting=side==='Extérieur';

 const receiverScore=safeNumber(val('Résultat recevant'));
 const visitorScore=safeNumber(val('Résultat visiteur'));
 const receiverPens=safeNumber(val('Tirs au but recevant'));
 const visitorPens=safeNumber(val('Tirs au but visiteur'));
 const fcScore=receiverScore===null||visitorScore===null||(!isReceiving&&!isVisiting)?null:(isReceiving?receiverScore:visitorScore);
 const oppScore=receiverScore===null||visitorScore===null||(!isReceiving&&!isVisiting)?null:(isReceiving?visitorScore:receiverScore);
 const fcPens=receiverPens===null||visitorPens===null||(!isReceiving&&!isVisiting)?null:(isReceiving?receiverPens:visitorPens);
 const oppPens=receiverPens===null||visitorPens===null||(!isReceiving&&!isVisiting)?null:(isReceiving?visitorPens:receiverPens);

 const placeholder=!opponentTeam || norm(opponentTeam).includes('non affectee') || opponentClub==='14' || opponentTeam==='14' || place==='14';
 const reportStatus=String(val('Reporté-rejoué')||'').trim();
 const reportDate=normalizeDateCell(val('Date report'));
 const hasResult=fcScore!==null&&oppScore!==null;

 const addressParts=[val('Complément'),val('Voie-rue'),val('Lieu-dit'),val('Code postal'),val('Bureau distributeur')]
  .map(x=>String(x||'').trim()).filter(Boolean);

 return {
  matchNumber:String(val('Numéro match')||'').trim(),
  competition:competition,
  competitionPhase:val('Compétition / Phase_2','Compétition / Phase_1','Compétition / Phase'),
  phaseNumber:val('Numéro phase'),phase:phase,poolCode:val('Poule(code)'),pool:val('Poule'),
  dayNumber:val('Numéro de journée'),roundNumber:val('Numéro de tour'),round:val('Tour'),shortName:val('Nom abrégé'),
  date:normalizeDateCell(rawDate),time:normalizeTimeCell(rawTime),rawTime:rawTime,
  unresolvedTime:/p\d/i.test(rawTime)||/apres-midi|après-midi|soir/i.test(norm(rawTime)),
  leg:val('Aller-Retour'),homeAway:side==='Non renseigné'?'':side,
  team:matchCategoryFromCompetition(competition,phase,sourceTeam),sourceTeam:sourceTeam,
  opponentClub:opponentClub,opponent:opponentClub&&opponentClub!=='14'?opponentClub:opponentTeam,
  opponentTeam:opponentTeam,opponentCity:val('Localité club adverse_2','Localité club adverse_1','Localité club adverse'),
  teamsLabel:val('Equipes'),
  place:place,venueCity:val('Localité installation_2','Localité installation_1','Localité installation'),
  addressExtra:val('Complément'),street:val('Voie-rue'),locality:val('Lieu-dit'),postalCode:val('Code postal'),
  postOffice:val('Bureau distributeur'),venueAddress:addressParts.join(', '),
  receiverScore:receiverScore,visitorScore:visitorScore,fcScore,oppScore,scoreOrientation:'club',homeScore:fcScore,awayScore:oppScore,
  receiverPens:receiverPens,visitorPens:visitorPens,homePens:fcPens,awayPens:oppPens,
  shortestDistance:safeNumber(val('Distance aller la plus courte')),fastestDistance:safeNumber(val('Distance aller la plus rapide')),
  rescheduleStatus:reportStatus,rescheduleDate:reportDate,
  reportHistory:(reportStatus||reportDate)?[{status:reportStatus,date:reportDate}]:[],
  placeholder:placeholder,status:hasResult?'Terminé':(reportStatus?'Reporté':'À venir'),
  sourceFormat:isReferenceMatchExport(headers)?'MATCHS_REFERENCE_V2':'LRF_LEGACY',
  sourceData:allSourceFields(row,headers)
 };
}

