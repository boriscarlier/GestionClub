function prototypeSaveFeedback(){
 const title=document.getElementById('prototypeFeedbackTitle')?.value?.trim()||'';
 const description=document.getElementById('prototypeFeedbackDescription')?.value?.trim()||'';
 if(!title&&!description)return toast('Retour testeur','Ajoutez un titre ou une description.');
 const items=prototypeFeedbackItems();
 items.unshift({
  id:'fb_'+Date.now(),
  tester:document.getElementById('prototypeFeedbackTester')?.value?.trim()||'Anonyme',
  type:document.getElementById('prototypeFeedbackType')?.value||'Bug',
  area:document.getElementById('prototypeFeedbackArea')?.value||'Autre',
  priority:document.getElementById('prototypeFeedbackPriority')?.value||'Normale',
  title:title||'Retour sans titre',
  description,
  createdAt:new Date().toISOString(),
  build:QA_BUILD,
  viewport:`${window.innerWidth}x${window.innerHeight}`
 });
 localStorage.setItem(PROTOTYPE_FEEDBACK_KEY,JSON.stringify(items));
 prototypeClearFeedbackForm();
 prototypeRenderFeedback();
 toast('Retour testeur','Retour enregistré sur cette tablette.');
}
