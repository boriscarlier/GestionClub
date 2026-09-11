function matchCategoryFromCompetition(comp,phase,sourceTeam){
 const x=norm([comp,phase,sourceTeam].filter(Boolean).join(' '));
 if(x.includes('reserve')&&x.includes('r3')) return 'Seniors 2';
 if(x.includes('feminin')||x.includes('feminine')||x.includes('r1f')) return 'Féminines';
 if(x.includes('u17')) return 'U17';
 if(x.includes('u15')) return 'U15';
 if(x.includes('u14')) return 'U14';
 if(x.includes('u13')) return 'U13';
 if(x.includes('u11')) return 'U11';
 if(x.includes('veteran')||x.includes('vet 42')) return 'Vétérans';
 if(x.includes('regionale 3')||x.includes('coupe regionale')||x.includes('dominique sauger')) return 'Seniors 1';
 return 'À classer';
}
