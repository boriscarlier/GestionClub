function currentAdminCanScoped(module,action='view',teamIdOrName=''){
 const a=currentAdminAccount();
 if(!accountCan(a,module,action))return false;
 if(!teamIdOrName)return true;
 return accountScopeAllowsTeam(a,teamIdOrName);
}
