function createCmsArticle(){
 state.posts.unshift({id:uid('p'),title:'Nouvelle actualité',text:'Contenu à compléter depuis le CMS.',channels:['Site'],status:'Brouillon',category:'Vie du club',created:new Date().toISOString(),publishDate:'',featured:false});
 save();goTo('cms');toast('CMS','Brouillon créé.');
}
