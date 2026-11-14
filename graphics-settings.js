'use strict';
// Shared cosmetic-effects preference. Future decorative emitters should use extraEffectsEnabled().
let potatoMode=false;
try{potatoMode=localStorage.getItem('one-vs-one-potato-mode')==='1';}catch{}
function extraEffectsEnabled(){return !potatoMode;}
function setPotatoMode(enabled){potatoMode=!!enabled;$('potatoMode').checked=potatoMode;try{localStorage.setItem('one-vs-one-potato-mode',potatoMode?'1':'0');}catch{}if(potatoMode){particles=[];if(typeof adventure!=='undefined'&&adventure?.leoStory)adventure.leoStory.heroFX=[];}}
document.getElementById('potatoMode').checked=potatoMode;
document.getElementById('potatoMode').addEventListener('change',e=>setPotatoMode(e.target.checked));
