function matchCompetitionType(m){
 const explicit=String(m.competitionType||'').trim();
 if(['Championnat','Coupe','Match amical'].includes(explicit))return explicit;

 const teamRaw=norm([m.team,m.sourceTeam,m.category,m.subcategory].filter(Boolean).join(' '));
 const competitionRaw=norm([m.competition,m.competitionName,m.sourceCompetition].filter(Boolean).join(' '));
 const dpRaw=norm([m.dp,m.DP,m.divisionPhase,m.typePhase,m.phaseType,m.matchType].filter(Boolean).join(' '));
 const raw=norm([
  m.competition,m.competitionName,m.phase,m.round,m.roundNumber,m.sourceCompetition,
  m.team,m.sourceTeam,m.category,m.subcategory,m.teamsLabel,m.dp,m.DP
 ].filter(Boolean).join(' '));

 // Règle CLUB EXEMPLE : Vétérans / Féminines avec DP "Autre" + CPE ou CDF = Coupe.
 const veteranOrWomen=
  teamRaw.includes('veteran') || teamRaw.includes('vétéran') ||
  teamRaw.includes('feminin') || teamRaw.includes('féminin') ||
  teamRaw.includes('feminine') || teamRaw.includes('féminine');

 const cpeOrCdf=
  competitionRaw==='cpe' || competitionRaw==='cdf' ||
  competitionRaw.includes(' cpe') || competitionRaw.startsWith('cpe ') ||
  competitionRaw.includes(' cdf') || competitionRaw.startsWith('cdf ');

 if(veteranOrWomen && dpRaw.includes('autre') && cpeOrCdf)return 'Coupe';

 // Matchs amicaux
 if(
  raw.includes('amical') ||
  raw.includes('friendly') ||
  raw.includes('preparation') ||
  raw.includes('préparation')
 )return 'Match amical';

 // Coupes
 if(
  raw.includes('coupe') ||
  raw.includes('cup') ||
  raw.includes('trophee') ||
  raw.includes('trophée') ||
  competitionRaw==='cpe' ||
  competitionRaw==='cdf'
 )return 'Coupe';

 // Championnats et compétitions régulières.
 if(
  raw.includes('championnat') ||
  raw.includes('regional') || raw.includes('régional') ||
  raw.includes('r1') || raw.includes('r2') || raw.includes('r3') ||
  raw.includes('d1') || raw.includes('d2') || raw.includes('d3') ||
  raw.includes('elite') || raw.includes('élite') ||
  raw.includes('excellence') ||
  raw.includes('challenge vet') || raw.includes('challenge vét') ||
  raw.includes('challenge u14') ||
  raw.includes('u14')
 )return 'Championnat';

 return 'Autre';
}

