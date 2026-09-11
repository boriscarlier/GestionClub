function communicationCanPublish(post){
 return post && normalizeCommunicationStatus(post.status)==='À valider';
}
