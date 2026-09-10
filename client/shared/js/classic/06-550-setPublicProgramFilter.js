function setPublicProgramFilter(filter,el){
 publicProgramFilter=filter;
 publicProgramFocusId=null;
 document.querySelectorAll('[data-program-filter]').forEach(b=>b.classList.toggle('active',b===el));
 renderPublicProgram();
}

