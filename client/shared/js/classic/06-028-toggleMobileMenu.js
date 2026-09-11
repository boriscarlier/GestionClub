function toggleMobileMenu(force){
  const el=document.getElementById('mobileMenu');
  if(!el)return;
  if(force===false)el.classList.remove('show');
  else el.classList.toggle('show');
}

const KEY='fclc_full_proto_v100';
const defaults={
 members:[],
 teams:[
  {id:'t1',name:'Seniors 1',competition:'R3',group:'seniors',public:true,rosterPublic:true,coach:'Coach Seniors 1',assistant:'Adjoint Seniors 1',manager:'Dirigeant Seniors 1',ground:'Stade Municipal',training:'Mardi & Jeudi • 18h30'},
  {id:'t2',name:'Seniors 2',competition:'R3 Réserve',group:'seniors',public:true,rosterPublic:true,coach:'Coach Seniors 2',assistant:'Adjoint Seniors 2',manager:'Dirigeant Seniors 2',ground:'Stade Municipal',training:'Mercredi • 18h30'},
  {id:'t3',name:'Féminines',competition:'R1F',group:'feminines',public:true,rosterPublic:true,coach:'Coach Féminines',assistant:'Adjoint Féminines',manager:'Dirigeant Féminines',ground:'Stade Municipal',training:'Mardi & Vendredi • 18h30'},
  {id:'t4',name:'U17',competition:'Élite / Excellence',group:'jeunes',public:true,rosterPublic:true,coach:'Coach U17',assistant:'Adjoint U17',manager:'Dirigeant U17',ground:'Stade Municipal',training:'Mercredi & Vendredi • 17h00'},
  {id:'t5',name:'U15',competition:'Élite Régionale',group:'jeunes',public:true,rosterPublic:true,coach:'Coach U15',assistant:'Adjoint U15',manager:'Dirigeant U15',ground:'Stade Municipal',training:'Mardi & Jeudi • 17h00'},
  {id:'t6',name:'U14',competition:'Challenge',group:'jeunes',public:false,rosterPublic:false,coach:'Coach U14',assistant:'Adjoint U14',manager:'Dirigeant U14',ground:'Stade Municipal',training:'Mercredi • 16h30'}
 ],
 matches:[],
 opponents:[],
 discipline:[],
 planning:[
  {id:'e1',day:1,time:'18:30',duration:90,type:'training',title:'Entraînement Seniors 1',team:'Seniors 1',place:'Stade Municipal',public:false},
  {id:'e2',day:2,time:'17:00',duration:90,type:'training',title:'Entraînement U15',team:'U15',place:'Stade Municipal',public:false},
  {id:'e3',day:3,time:'18:30',duration:90,type:'training',title:'Entraînement Féminines',team:'Féminines',place:'Stade Municipal',public:false},
  {id:'e4',day:5,time:'18:00',duration:120,type:'match',title:'Match Seniors 1',team:'Seniors 1',place:'Stade Municipal',public:true},
  {id:'e5',day:5,time:'18:00',duration:120,type:'match',title:'Match Seniors 2',team:'Seniors 2',place:'Stade Municipal',public:true},
  {id:'e6',day:4,time:'19:00',duration:60,type:'meeting',title:'Réunion éducateurs',team:'Club',place:'Club House',public:false}
 ],
 posts:[
  {id:'p1',title:'Une nouvelle saison commence',text:'Retrouvez toute l’actualité du CLUB EXEMPLE.',channels:['Site','Facebook','Instagram'],status:'Publiée'}
 ],
 media:[
  {id:'md1',name:'Seniors 1 — Match',type:'photo',team:'Seniors 1',public:true},
  {id:'md2',name:'École de foot',type:'photo',team:'École de foot',public:true},
  {id:'md3',name:'Interview éducateur',type:'video',team:'Club',public:false}
 ],
 rankings:{
  'Seniors 1':[{name:'Équipe Alpha',pts:24},{name:'CLUB EXEMPLE',pts:22},{name:'Équipe Beta',pts:19},{name:'Équipe Gamma',pts:17}],
  'Seniors 2':[{name:'Équipe Réserve A',pts:21},{name:'Équipe Réserve B',pts:19},{name:'CLUB EXEMPLE',pts:17},{name:'Équipe Réserve C',pts:15}],
  'Féminines':[{name:'Équipe Féminine A',pts:18},{name:'CLUB EXEMPLE',pts:16},{name:'Équipe Féminine B',pts:14},{name:'Équipe Féminine C',pts:11}],
  'U17':[{name:'Équipe U17 A',pts:25},{name:'CLUB EXEMPLE',pts:23},{name:'Équipe U17 B',pts:20},{name:'Équipe U17 C',pts:18}],
  'U15':[{name:'CLUB EXEMPLE',pts:27},{name:'Équipe U15 A',pts:25},{name:'Équipe U15 B',pts:20},{name:'Équipe U15 C',pts:16}]
 }
};
let state=load();

const DATA_RESET_MARKER='fclc_reset_reference_data_v1145';
