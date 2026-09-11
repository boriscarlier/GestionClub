function closeModal(id){document.getElementById(id).classList.remove('show')}


const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');
let currentVisualTemplate='match', currentVisualFormat='square';
const visualSizes={square:[1080,1080],portrait:[1080,1350],story:[1080,1920],landscape:[1200,675]};

