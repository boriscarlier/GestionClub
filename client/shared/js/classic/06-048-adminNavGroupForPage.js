function adminNavGroupForPage(page){
 const aliases={
  import:'importwatch',
  memberdetail:'members',
  teamdetailadmin:'teams',
  matchdetail:'matches',
  opponentdetail:'opponents',
  accountdetail:'accounts'
 };
 const effectivePage=aliases[page]||page;
 const button=document.querySelector(`#intranetApp .nav button[data-page="${effectivePage}"]`);
 return button?.closest('.nav-group')||null;
}
