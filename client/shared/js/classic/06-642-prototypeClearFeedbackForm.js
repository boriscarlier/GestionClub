function prototypeClearFeedbackForm(){
 ['prototypeFeedbackTitle','prototypeFeedbackDescription'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=''});
 const p=document.getElementById('prototypeFeedbackPriority');if(p)p.value='Normale';
}
