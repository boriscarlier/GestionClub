function advancePostStatus(id){
  var post = state.posts.find(function(p){ return p.id===id; });
  if(!post) return;
  var steps = ['Brouillon','À valider','Programmé','Publié'];
  var current = normalizePostStatus(post.status);
  var idx = steps.indexOf(current);
  if(idx < 0) idx = 0;
  post.status = steps[Math.min(idx+1, steps.length-1)];
  if(post.status==='Publié' && post.channels.indexOf('Site')===-1){
    post.channels.push('Site');
  }
  save();
  toast('Communication','Statut : ' + post.status);
}


const COMM_STATUSES=['Brouillon','À valider','Programmé','Publié','Erreur'];
const COMM_CHANNELS=[
 ['site','Site web','🌐'],
 ['facebook','Facebook','📘'],
 ['instagram','Instagram','📸'],
 ['youtube','YouTube','▶️'],
 ['whatsapp','WhatsApp','💬']
];

