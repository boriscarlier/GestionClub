function normalizeDisciplineRow(row,headers){
 const g=n=>disciplineValue(row,headers,n);
 const rec={
  dossierNumber:String(g('Numéro dossier_2')||g('Numéro dossier_1')||'').trim(),
  dossierDate:normalizeDateCell(g('Date dossier_2')||g('Date dossier_1')),
  dossierType:String(g('Type dossier_2')||g('Type dossier_1')||'').trim(),
  subject:String(g('Sujet dossier_2')||g('Sujet dossier_1')||'').trim(),
  status:String(g('Statut dossier')||'').trim(),
  yellowCards:safeNumber(g('Nbre cartons jaunes'))||0,
  redCard:boolVal(g('Carton rouge')),
  offMatch:boolVal(g('Hors match')),
  commission:String(g('Nom commission_2')||g('Nom commission_1')||'').trim(),
  meetingDate:normalizeDateCell(g('Date réunion_2')||g('Date réunion_1')),
  reason:String(g('Libellé motif_2')||g('Libellé motif_1')||'').trim(),
  decision:String(g('Libellé décision_2')||g('Libellé décision_1')||'').trim(),
  effectDate:normalizeDateCell(g("Date d'effet_2")||g("Date d'effet_1")),
  endDate:normalizeDateCell(g('Date de fin')),
  recurrenceEndDate:normalizeDateCell(g('Date fin récidive')),
  clubNumber:String(g('Numéro de club_2')||g('Numéro de club_1')||'').trim(),
  clubName:String(g('Nom de club_2')||g('Nom de club_1')||'').trim(),
  competition:String(g('Compétition')||'').trim(),
  phase:String(g('Phase')||'').trim(),
  team:String(g('Nom équipe')||'').trim(),
  matchNumber:String(g('Numéro match')||'').trim(),
  matchDate:normalizeDateCell(g('Date match')),
  personNumber:String(g('Numéro personne')||'').trim(),
  personName:String(g('Nom, prénom personne')||'').trim(),
  role:String(g('Rôle')||'').trim(),
  licenseType:String(g('Libellé type licence')||'').trim(),
  subcategory:String(g('Libellé sous catégorie')||'').trim(),
  total:safeNumber(g('Somme totale')),
  sourceFormat:'DISCIPLINE_REFERENCE_V1',
  sourceData:{}
 };
 headers.forEach((h,i)=>rec.sourceData[String(h||('col_'+i))]=row[i]??'');
 linkDisciplineToMember(rec);linkDisciplineToMatch(rec);
 rec.isActive=norm(rec.status)==='actif' || (!!rec.endDate && new Date(rec.endDate+'T23:59:59')>=new Date());
 rec.id='d_'+(rec.dossierNumber||Math.random().toString(36).slice(2));
 return rec;
}
