
/* Gestion Club / FFF V1.22.7.1 — deterministic bridge for Adapter V0.03.1.
   No network, no credentials and no writes to the source federation. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FCFFFCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const VERSION='1.22.7.1',ADAPTER='0.3.1';
 const FIELDS=['matchNumber','team','sourceTeam','opponent','opponentClub','date','time','competition','competitionType','pool','homeAway','place','fcScore','oppScore','receiverScore','visitorScore','status'];
 const LABELS={matchNumber:'N° de match FFF',team:'Équipe du club',sourceTeam:'Équipe interne',opponent:'Adversaire',opponentClub:'Club adverse',date:'Date',time:'Heure',competition:'Compétition',competitionType:'Type de compétition',pool:'Poule',homeAway:'Domicile / extérieur',place:'Installation',fcScore:'Score CLUB EXEMPLE',oppScore:'Score adversaire',receiverScore:'Score recevant',visitorScore:'Score visiteur',status:'Statut'};
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
 const text=v=>v==null?'':typeof v==='string'||typeof v==='number'?String(v).trim():'';
 const norm=v=>text(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
 const clone=v=>JSON.parse(JSON.stringify(v));
 const empty=v=>v===null||v===undefined||v==='';
 function stable(v){if(Array.isArray(v))return '['+v.map(stable).join(',')+']';if(v&&typeof v==='object')return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';return JSON.stringify(v===undefined?null:v);}
 function number(v){if(v===null||v===undefined||typeof v==='boolean'||!/^\d+$/.test(text(v)))return null;const n=Number(v);return Number.isSafeInteger(n)&&n>=0?n:null;}
 function date(v){const s=text(v);let y,m,d,r=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);if(r)[,y,m,d]=r;else{r=s.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);if(!r)return null;[,d,m,y]=r;}const obj=new Date(Date.UTC(+y,+m-1,+d));return obj.getUTCFullYear()===+y&&obj.getUTCMonth()===+m-1&&obj.getUTCDate()===+d?`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`:null;}
 function time(v){const m=text(v).match(/^(\d{1,2})[:h](\d{2})(?::\d{2})?$/i);return m&&+m[1]<24&&+m[2]<60?m[1].padStart(2,'0')+':'+m[2]:null;}
 function sourceURL(v){try{const u=new URL(text(v));if(u.protocol!=='https:'||u.hostname!=='epreuves.fff.fr'||u.username||u.password||u.port||!u.pathname.startsWith('/competition/'))return '';return u.origin+u.pathname;}catch(e){return '';}}
 function matchId(v){
  // Normalize representation only: never match by an approximate team name or slug.
  let s=text(v).replace(/[.,]0+$/,'');
  if(/^\d{1,3}(?:[ \u00a0\u202f]\d{3})+$/.test(s))s=s.replace(/[ \u00a0\u202f]/g,'');
  return /^\d{6,12}$/.test(s)?s:'';
 }
 function idFromURL(v){const u=sourceURL(v),m=u.match(/\/match\/(\d{6,12})(?=-|\/|\.html(?:\/|$)|$)/);return m?m[1]:'';}
 function sourceValue(m,...keys){const s=m?.sourceData||{},key=Object.keys(s).find(k=>keys.map(norm).includes(norm(k)));return key===undefined?'':s[key];}
 function existingIds(m){
  const labels=new Set(['numeromatch','numerodematch','numerodumatch','nomatch','nodematch','nodumatch','nmatch','ndematch','ndumatch']);
  const sd=m?.sourceData&&typeof m.sourceData==='object'&&!Array.isArray(m.sourceData)?m.sourceData:{};
  const sources=Object.entries(sd).filter(([k])=>labels.has(norm(k.replace(/_\d+$/,'')))).map(([,v])=>v);
  return [...new Set([m?.fff?.matchId,m?.fffMatchId,m?.matchNumber,...sources].map(matchId).filter(Boolean))];
 }
 function existingId(m){return existingIds(m)[0]||'';}
 function referenceId(ref){
  if(ref&&typeof ref==='object'&&!Array.isArray(ref))return matchId(ref.match_id||ref.id)||idFromURL(ref.source_url||ref.url);
  return matchId(ref)||idFromURL(ref);
 }
 function failure(code,message,details={}){const error=new Error(message);error.code=code;error.details=details;return error;}
 function resolveCandidate(snapshot,ref){
  if(!snapshot||snapshot.schema!=='gestion-club.fff/1'||!Array.isArray(snapshot.candidates))throw failure('FFF_COLLECTE_INVALIDE','La collecte chargée ne contient pas un inventaire de matchs valide. Rechargez donnees.json ou club.json.');
  const id=referenceId(ref);
  if(!id)throw failure('FFF_REFERENCE_INVALIDE','Numéro FFF invalide. Sélectionnez un match dans les références de la collecte.',{receivedType:typeof ref});
  const found=snapshot.candidates.filter(c=>matchId(c?.id)===id);
  if(!found.length)throw failure('FFF_REFERENCE_ABSENTE','Le match FFF '+id+' est absent de la collecte actuellement chargée. Choisissez une référence affichée ou chargez la collecte contenant ce match.',{requestedId:id,candidateCount:snapshot.candidates.length,capturedAt:snapshot.capturedAt});
  if(found.length>1)throw failure('FFF_REFERENCE_AMBIGUE','Plusieurs références de la collecte portent le numéro FFF '+id+'. Recharger un export brut avant intégration.',{requestedId:id,count:found.length});
  return {...found[0],id};
 }
 function sourceFingerprint(snapshot,candidate){return stable({clubId:snapshot.club?.id,capturedAt:snapshot.capturedAt,candidate});}
 function mapStatus(value,score){const n=norm(value);if(/annul/.test(n))return 'Annulé';if(/report/.test(n))return 'Reporté';if(/arrete|interromp|abandon/.test(n))return 'Arrêté';if(/encours|live/.test(n))return 'En cours';if(/nonjoue/.test(n))return 'Non joué';if(/forfait/.test(n))return 'Forfait — à contrôler';if(/termine|^joue$|^clos$|finished/.test(n))return 'Terminé';if(/avenir|ajouer|programme/.test(n))return 'À venir';return n?text(value):null;}
 function finalStatus(s){return !/arrete|interromp|annul|report|nonjoue|encours|forfait/.test(norm(s));}
 function competitionType(value){const n=norm(value);if(/amical|friendly/.test(n))return 'Match amical';if(/coupe|cup|trophee|^cpe|^cdf/.test(n))return 'Coupe';if(/championnat|regional|elite|excellence|challengeu14|^r[123]/.test(n))return 'Championnat';return null;}
 function rawPair(x){const s=x?.score;if(!s||typeof s!=='object')return null;const a=number(s.home),b=number(s.away);return a===null||b===null?null:{home:a,away:b};}
 function normalize(payload, expectedClub='563512'){
  if(!payload||typeof payload!=='object'||!['fff-epreuves/0.3.1','fff-club/0.3.1'].includes(payload.schema))throw new Error('Export attendu : FFF Adapter V0.03.1 donnees.json ou club.json. Les exports network / changements ne sont pas des bases de matchs.');
  if(payload.adapter_version!==ADAPTER)throw new Error('Version adaptateur non prise en charge : '+text(payload.adapter_version));
  const club=payload.club||{},clubId=text(club.club_id||club.affiliation||payload.club_reference?.club_id);
  if(!/^\d{3,12}$/.test(clubId)||clubId!==text(expectedClub))throw new Error('Club source différent du club gestionnaire ('+clubId+' / '+expectedClub+').');
  const captured=text(payload.captured_at);if(!Number.isFinite(Date.parse(captured))||!/(?:Z|[+-]\d{2}:\d{2})$/.test(captured))throw new Error('Date de collecte absente ou sans fuseau horaire.');
  const teams=(Array.isArray(club.teams)?club.teams:[]).slice(0,300).filter(t=>text(t.club_id)===clubId&&text(t.team_key)&&sourceURL(t.url)).map(t=>({key:text(t.team_key),label:text(t.label),season:text(t.season),url:sourceURL(t.url)}));
  const warnings=[],rejected=[],byId=new Map();
  function reject(origin,id,code,reason){warnings.push(reason);rejected.push({origin,id:id||null,code,reason});}
  function add(raw,origin){
   if(!raw||typeof raw!=='object')return;
   const id=matchId(raw.match_id||raw.id)||idFromURL(raw.source_url||raw.url);if(!id){reject(origin,'','FFF_NUMERO_SOURCE_INVALIDE','Référence ignorée : numéro de match invalide.');return;}
   const url=sourceURL(raw.source_url||raw.url),urlId=idFromURL(url);if(!url||urlId!==id){reject(origin,id,'FFF_URL_SOURCE_INCOHERENTE','Match '+id+' ignoré : URL absente ou numéro contradictoire.');return;}
   const prev=byId.get(id),obj=prev||{id,url,origins:[],rawLabel:'',home:'',away:'',date:null,time:null,competition:'',pool:'',status:null,score:null,place:'',sourceTeamKey:'',issues:[]};
   obj.origins.push(origin);obj.url=url;
   const home=text(raw.home_team),away=text(raw.away_team),score=rawPair(raw);
   if(home)obj.home=home;if(away)obj.away=away;
   const d=date(raw.date||raw.match_date||raw.kickoff_date),t=time(raw.time||raw.kickoff_time);
   if((raw.date||raw.match_date)&&!d)obj.issues.push('Date source non exploitable.');
   if(d)obj.date=d;if(t)obj.time=t;
   if(text(raw.competition))obj.competition=text(raw.competition);
   if(text(raw.pool))obj.pool=text(raw.pool);
   if(text(raw.team_key))obj.sourceTeamKey=text(raw.team_key);
   // venue_text also contains players/officials in V0.03.1: never copy it to an installation field.
   if(text(raw.venue_name||raw.place))obj.place=text(raw.venue_name||raw.place);
   if(score){if(obj.score&&stable(obj.score)!==stable(score))obj.issues.push('Scores contradictoires entre vues.');obj.score=score;}
   if(text(raw.status)){if(obj.status&&norm(obj.status)!==norm(raw.status))obj.issues.push('Statuts contradictoires entre vues.');obj.status=text(raw.status);}
   if(text(raw.raw_label))obj.rawLabel=text(raw.raw_label).slice(0,200);
   byId.set(id,obj);
  }
  for(const x of (club.calendar_matches||[]).slice(0,500))add(x,'club');
  for(const x of (payload.other_matches?.matches||[]).slice(0,500))add(x,'other');
  if(payload.match){
   const detail={...payload.match},ref=payload.reference||{};
   // These are explicit metadata from the same export, not values inferred from a club name.
   if(empty(detail.id)&&empty(detail.match_id)&&matchId(ref.match_id))detail.id=matchId(ref.match_id);
   if(empty(detail.source_url)&&empty(detail.url)&&sourceURL(ref.views?.match))detail.source_url=sourceURL(ref.views.match);
   const explicit=matchId(detail.match_id||detail.id),refId=matchId(ref.match_id);
   if(explicit&&refId&&explicit!==refId)reject('detail',explicit,'FFF_REFERENCE_DETAIL_CONTRADICTOIRE','Fiche détaillée ignorée : son numéro diffère de reference.match_id.');
   else add(detail,'detail');
  }
  const clubNames=new Set([norm(club.name),norm('CLUB EXEMPLE')].filter(Boolean));
  const candidates=[...byId.values()].map(x=>{
   const home=clubNames.has(norm(x.home)),away=clubNames.has(norm(x.away));
   const side=home&&!away?'Domicile':away&&!home?'Extérieur':null;
   const membership=side?'proven':x.home&&x.away?'external':x.origins.includes('club')?'calendar':'unproven';
   return {...x,origins:[...new Set(x.origins)],side,membership,opponent:side==='Domicile'?x.away:side==='Extérieur'?x.home:'',status:mapStatus(x.status,x.score),issues:[...new Set(x.issues)]};
  });
  const rows=(payload.standings?.rows||[]).slice(0,300).map(x=>({rank:text(x.rank),variation:text(x.variation),team:text(x.team),points:text(x.points),played:text(x.played),won:text(x.won),drawn:text(x.drawn),lost:text(x.lost),goals_for:text(x.goals_for),goals_against:text(x.goals_against),difference:text(x.difference)})).filter(x=>x.team);
  return {schema:'gestion-club.fff/1',adapterVersion:ADAPTER,capturedAt:captured,club:{id:clubId,name:text(club.name),url:sourceURL(club.source_url||payload.club_reference?.club_url),teams},candidates,standings:{url:sourceURL(payload.standings?.source_url),competition:text(payload.match?.competition),pool:text(payload.match?.pool),rows},diagnostics:{rejectedCount:rejected.length,rejectedReferences:rejected,networkCount:Number(payload.network?.entries_count)||0,jsonCount:Number(payload.network?.json_entries_count)||0,playerGroupCount:(payload.statistics?.player_groups||[]).length},coverage:{discovered:candidates.length,detailed:candidates.filter(x=>x.origins.includes('detail')).length,calendar:candidates.filter(x=>x.origins.includes('club')).length,complete:false},warnings};
 }
 function findTarget(db,c,manualTarget=''){
  const all=Array.isArray(db.matches)?db.matches:[],found=all.filter(m=>existingIds(m).includes(c.id));
  if(found.length>1)return {blocked:'Plusieurs matchs locaux portent le n° '+c.id+'. Aucun rapprochement automatique.',match:null};
  if(found.length===1&&manualTarget&&String(found[0].id)!==String(manualTarget))return {blocked:'Ce numéro FFF appartient déjà à un autre match local.',match:null};
  if(found.length===1){const m=found[0];if(existingIds(m).length>1)return {blocked:'Numéro local et rattachement FFF incohérents : corriger la fiche avant intégration.',match:null};return {match:m,method:'matchNumber'};}
  if(manualTarget){const m=all.find(m=>String(m.id)===String(manualTarget));if(!m)return {blocked:'Match de rattachement introuvable.',match:null};if(existingIds(m).some(id=>id!==c.id))return {blocked:'Le match choisi porte un autre numéro FFF.',match:null};return {match:m,method:'manual'};}
  return {match:null,method:'new'};
 }
 function createPlan(db,snapshot,candidateId,options={}){
  const c=resolveCandidate(snapshot,candidateId);
  const target=findTarget(db,c,options.targetId),old=target.match,fields={},origins={},issues=[...c.issues];
  if(target.blocked)issues.push(target.blocked);
  if(c.membership==='external')issues.push('Rencontre entre deux autres clubs : conservée en consultation uniquement.');
  if(c.membership==='unproven')issues.push('L’appartenance de ce match au club n’est pas établie.');
  if(old?.fff?.capturedAt&&Date.parse(snapshot.capturedAt)<Date.parse(old.fff.capturedAt))issues.push('Collecte plus ancienne que la source déjà intégrée.');
  const team=old?(text(options.team)||text(old.team||old.sourceTeam)):(text(options.team)||text(db.fffBridge?.teamMappings?.[c.sourceTeamKey]));
  const teams=(db.teams||[]).map(t=>text(t.name));if(!team||!teams.includes(team))issues.push('Choisir une équipe interne existante.');
  let side=c.side||null;
  if(!side&&old){const n=norm(old.homeAway);side=/dom|recevant|^r$|home/.test(n)?'Domicile':/ext|visiteur|^v$|away/.test(n)?'Extérieur':null;}
  function set(k,v,from='fff'){if(!empty(v)){fields[k]=v;origins[k]=from;}}
  set('matchNumber',c.id);if(team){set('team',team,'local-mapping');set('sourceTeam',team,'local-mapping');}
  const opponent=c.opponent||(old&&text(old.opponent||old.opponentClub));
  if(c.opponent){set('opponent',c.opponent);set('opponentClub',c.opponent);}
  if(!opponent)issues.push('Adversaire non identifié : collecte détaillée ou rattachement local requis.');
  set('date',c.date);set('time',c.time);set('competition',c.competition);set('pool',c.pool);set('place',c.place);
  if(c.competition)set('competitionType',competitionType(c.competition),'derived-fff');
  if(c.side)set('homeAway',c.side);
  if(c.status)set('status',c.status);
  if(!old&&!c.date){if(options.localDate&&date(options.localDate))set('date',date(options.localDate),'local-complement');else issues.push('Date absente de l’export : compléter une date locale vérifiée pour créer ce match.');}
  if(!old&&c.membership!=='proven')issues.push('Collecte détaillée nécessaire pour créer ce match ; lien de calendrier seul insuffisant.');
  if(!old&&team&&fields.date){const possible=(db.matches||[]).filter(m=>norm(m.team||m.sourceTeam)===norm(team)&&date(m.date)===fields.date);if(possible.length)issues.push('Doublon possible : un match local de cette équipe existe à cette date. Choisir explicitement le rattachement au match existant.');}
  const scoreFinal=/^(termine|joue|clos)$/.test(norm(c.status))||(!c.status&&/^(termine|joue|clos)$/.test(norm(old?.status)));
  if(c.score&&side&&finalStatus(c.status)&&scoreFinal){
   set('fcScore',side==='Domicile'?c.score.home:c.score.away);set('oppScore',side==='Domicile'?c.score.away:c.score.home);
   set('receiverScore',c.score.home);set('visitorScore',c.score.away);
  }
  const notes=[];
  if(!c.date)notes.push('Date absente de la source ; une date locale existante est conservée.');
  if(!c.score)notes.push('Aucun score extrait : aucun résultat local n’est effacé.');
  else if(!side)notes.push('Score brut recevant / visiteur conservé en source, non orienté dans les statistiques.');
  else if(!finalStatus(c.status)||!scoreFinal)notes.push('Fin de match non établie : score conservé en observation, pas comme résultat définitif.');
  if(c.origins.includes('detail')&&!c.place)notes.push('Le texte du stade n’est pas normalisé en V0.03.1 ; aucune donnée de joueurs n’est copiée dans le lieu.');
  const differences=Object.keys(fields).map(key=>({key,label:LABELS[key],before:old?.[key]??null,after:fields[key],origin:origins[key],changed:stable(old?.[key]??null)!==stable(fields[key]),conflict:!!old&&!empty(old[key])&&stable(old[key])!==stable(fields[key])}));
  const expectedTarget=old?stable(old):null;
  const proposedId=old?.id||'fff_'+c.id;
  if(!old&&(db.matches||[]).some(m=>String(m.id)===proposedId))issues.push('Identifiant interne déjà occupé.');
  return {candidateId:c.id,targetId:proposedId,method:target.method,isNew:!old,source:c,fields,origins,differences,issues:[...new Set(issues)],notes,canApply:issues.length===0,expectedTarget,capturedAt:snapshot.capturedAt,sourceFingerprint:sourceFingerprint(snapshot,c)};
 }
 function applyPlan(db,snapshot,plan,acceptedKeys,actor,now=new Date().toISOString()){
  if(!plan?.canApply)throw failure('FFF_CONTROLE_BLOQUE','La fiche comporte des points bloquants.');
  const selectedSource=resolveCandidate(snapshot,plan.candidateId);
  if(!plan.sourceFingerprint||plan.sourceFingerprint!==sourceFingerprint(snapshot,selectedSource))throw failure('FFF_COLLECTE_MODIFIEE','La collecte a changé depuis la comparaison. Relancez le contrôle avant d’appliquer.',{requestedId:referenceId(plan.candidateId)});
  if(!Array.isArray(acceptedKeys)||acceptedKeys.some(k=>!FIELDS.includes(k)||!own(plan.fields,k)))throw new Error('Champs de synchronisation invalides.');
  const fresh=createPlan(db,snapshot,plan.candidateId,{targetId:plan.isNew?'':plan.targetId,team:plan.fields.team,localDate:plan.fields.date});
  if(!fresh.canApply||fresh.expectedTarget!==plan.expectedTarget||fresh.targetId!==plan.targetId||stable(fresh.fields)!==stable(plan.fields))throw new Error('Le match a changé depuis la comparaison. Refaire le contrôle.');
  const next=clone(db);if(!Array.isArray(next.matches))next.matches=[];
  let dest=next.matches.find(m=>String(m.id)===String(plan.targetId));const before=dest?clone(dest):null;
  if(!dest){dest={id:plan.targetId,public:false,status:'À vérifier',sourceFormat:'FFF_ADAPTER_0_3_1'};next.matches.push(dest);}
  const accepted=new Set(acceptedKeys);const changes=[];
  // Identity and mapping are explicitly selected before validation, not optional conflicting fields.
  for(const k of ['matchNumber','team','sourceTeam'])accepted.add(k);
  if(plan.isNew)for(const k of Object.keys(plan.fields))accepted.add(k);
  for(const k of accepted){if(!own(plan.fields,k))continue;const v=plan.fields[k];if(stable(dest[k])!==stable(v)){changes.push({key:k,before:own(dest,k)?clone(dest[k]):null,beforeExists:own(dest,k),after:clone(v)});dest[k]=v;}}
  if(!dest.date||!dest.team||!dest.opponent)throw new Error('Match incomplet : date, équipe et adversaire requis.');
  if(dest.fff?.capturedAt&&Date.parse(snapshot.capturedAt)<Date.parse(dest.fff.capturedAt))throw new Error('Collecte périmée.');
  const metadata={adapterVersion:ADAPTER,matchId:plan.candidateId,clubId:snapshot.club.id,url:plan.source.url,capturedAt:snapshot.capturedAt,integratedAt:now,integratedBy:text(actor),origins:plan.source.origins,reportedScore:plan.source.score,statusObserved:plan.source.status,acceptedFields:[...accepted],keptLocalFields:plan.differences.filter(d=>d.changed&&!accepted.has(d.key)).map(d=>d.key),manualDate:plan.origins.date==='local-complement'||(dest.fff?.manualDate===true&&!accepted.has('date')),coverage:'partial'};
  if(!changes.length&&dest.fff&&dest.fff.capturedAt===snapshot.capturedAt&&stable(dest.fff.reportedScore)===stable(metadata.reportedScore))return {state:db,changed:false,transaction:null};
  dest.fff=metadata;dest.updatedAt=now;
  const transaction={id:'fff_tx_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),at:now,actor:text(actor),matchId:dest.id,fffId:plan.candidateId,kind:before?'update':'create',before,after:clone(dest),changes,undone:false};
  return {state:next,changed:true,transaction};
 }
 function rollback(db,tx,lineups={}){
  if(!tx||tx.undone)throw new Error('Aucune intégration annulable.');
  const current=(db.matches||[]).find(m=>m.id===tx.matchId);if(!current)throw new Error('Match supprimé depuis l’intégration.');
  const keys=Object.keys(tx.after).filter(k=>stable(tx.before?.[k])!==stable(tx.after[k]));
  if(keys.some(k=>stable(current[k])!==stable(tx.after[k])))throw new Error('Une valeur intégrée a été modifiée depuis : annulation automatique refusée.');
  if(!tx.before){const r=lineups[tx.matchId];if((Array.isArray(r)?r:r?.players||[]).length||(db.coachCallups?.[tx.matchId]||[]).length||own(db.coachFmiPreparation,tx.matchId)||(db.discipline||[]).some(d=>d.matchId===tx.matchId||text(d.matchNumber)===tx.fffId))throw new Error('Ce match possède maintenant des données liées : annulation refusée.');if(stable(current)!==stable(tx.after))throw new Error('Le nouveau match a été modifié : annulation refusée.');}
  const next=clone(db),idx=next.matches.findIndex(m=>m.id===tx.matchId);
  if(!tx.before)next.matches.splice(idx,1);
  else for(const k of keys){if(own(tx.before,k))next.matches[idx][k]=clone(tx.before[k]);else delete next.matches[idx][k];}
  return next;
 }
 return {VERSION,ADAPTER,FIELDS,LABELS,norm,clone,stable,date,time,number,sourceURL,matchId,idFromURL,referenceId,resolveCandidate,existingIds,existingId,normalize,createPlan,applyPlan,rollback,competitionType,finalStatus};
});

