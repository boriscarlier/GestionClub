function memberMutationInfo(m){
 const stamp=memberOfficialStamp(m),noStampData=![stamp.code,stamp.label,stamp.startDate,stamp.endDate].some(Boolean);
 const history=norm([m.history,m.clubHistory,m.historyClub,m.historique,m.historiqueClub,m.previousStatus,m.formerClubHistory,m.clubChangeNature,m.sourceData?.['Historique'],m.sourceData?.['Historique club']].filter(Boolean).join(' '));
 const explicitlyNotMutated=/\b(?:non|pas)[ -]+mut(?:e|ee|ation)\b/.test(history);
 const nature=norm([stamp.code,stamp.label,m.clubChangeNature,m.requestNature,m.transferNature].filter(Boolean).join(' ')).replace(/\b(?:non|pas)[ -]+mut(?:e|ee|ation)\b/g,'');
 const hasMutation=!explicitlyNotMutated&&(/mutation|\bmute\b|changement de club/.test(nature));
 const fingerprint=qaMutationSignature(m);
 const verifiedByDefault=noStampData||explicitlyNotMutated;
 const verified=verifiedByDefault||((m.mutationVerified===true||m.mutationVerified==='verified')&&m.mutationVerificationMode!=='automatic'&&m.mutationVerificationFingerprint===fingerprint);
 return {hasStamp:!noStampData,hasMutation,...stamp,explicitlyNotMutated,noStampData,verifiedByDefault,verified,verifiedAt:m.mutationVerifiedAt||'',fingerprint};
}
