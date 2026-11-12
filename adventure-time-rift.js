'use strict';
function atEnginPast(){return adventure?.chapter==='engin_past'}
const ENGIN_PAST_NPCS=[
 {name:'Engin · Before the Ruin',engin:true,x:1050,y:540,lines:["A traveler? My machine isn’t ready yet.","You’re not from this world. The readings don’t match anything here.","Home? Maybe. I can trace where you came from—but I’ll need time.","For now, stay clear of the reactor. I’d rather help you than blow us both apart."]},
 {name:'Time Rift',timeExit:true,x:280,y:560,lines:["The Olympians’ door is still open.","You can return to them whenever you’re ready."]}
];
const pastSafeStop=safeAdventureStop;
safeAdventureStop=function(){return atEnginPast()||pastSafeStop()};
const pastNPCs=safeAdventureNPCs;
safeAdventureNPCs=function(){return atEnginPast()?ENGIN_PAST_NPCS:pastNPCs()};
const pastInteract=harborInteract;
harborInteract=function(){if(atEnginPast()&&active()){const n=harborNearest();if(!n){adventureSay('Move closer to Engin or the time rift.',2);return}clearInput();adventure.dialogue={npc:n,index:0,lines:n.lines};showHarborDialogue();return}pastInteract()};
$('harborInteract').onclick=harborInteract;
const pastAction=harborDialogueAction;
harborDialogueAction=function(d){if(atEnginPast())return d?.npc.timeExit?{name:'RETURN THROUGH TIME · THE OLYMPIANS',run:enterOlympians}:null;return pastAction(d)};
const pastShowDialogue=showHarborDialogue;
showHarborDialogue=function(){pastShowDialogue();const d=adventure?.dialogue;if(atOlympians()&&d?.trialOffer&&trialWon()&&d.index>=d.lines.length-1){$('harborReplay').hidden=false;$('harborReplay').textContent='REPLAY THE OLYMPIAN TRIAL'}else $('harborReplay').textContent='REPLAY SAILER / KRAKEN'};
const pastReplay=$('harborReplay').onclick;
$('harborReplay').onclick=()=>{if(atOlympians()&&adventure?.dialogue?.trialOffer){closeHarborDialogue();startOlympianTrial();return}pastReplay()};
function beginEnginRift(){if(!adventure||!atOlympians()||!trialWon())return false;clearChapterEffects();adventure.timeRift={left:6,total:6};adventureSay('Vasta: Hold still. We’re sending you to Engin—before the experiment.',6);return true}
function enterEnginPast(){if(!adventure||!trialWon())return false;clearChapterEffects();adventure.timeRift=null;adventure.chapter='engin_past';adventure.phase=1;adventure.enginPastArrived=true;adventure.harbor={rescued:true,elapsed:0,warnings:[],exposed:[],effects:[],blink:[]};setArena('court');walls=[{x:640,y:250,w:250,h:70},{x:670,y:750,w:300,h:70},{x:1190,y:360,w:65,h:300}];resetVoyagePlayer();Object.assign(fighters[0],{x:410,y:560,hasDoorKey:true});Object.assign(fighters[1],{id:5,isKraken:false,isHarborBoss:false,isAdventureBoss:false,isOlympianBoss:false,hp:1,maxHp:1,aiControlled:false});if(!adventure.testRun)adventureSave('one-vs-one-engin-past-arrived',1);$('combatHint').textContent='ENGIN’S WORKSHOP · A journey into the past. Speak to Engin about finding your way home. The time rift returns to The Olympians.';adventureSay('ENGIN · BEFORE THE RUIN',5);renderAttackButtons(getMoves(fighters[0]));updateHud();return true}
const pastActive=active;
active=function(){return !adventure?.timeRift&&pastActive()};
const pastDamage=applyDamage;
applyDamage=function(f,amount,options={}){if(adventure?.timeRift)return;pastDamage(f,amount,options)};
const pastUpdate=update;
update=function(dt){if(adventure?.timeRift){if(running&&!paused&&!finished){adventure.timeRift.left-=dt;if(adventure.timeRift.left<=0){enterEnginPast();return}updateHud()}return}pastUpdate(dt)};
const pastHud=updateHud;
updateHud=function(){pastHud();if(atEnginPast()){$('name1').textContent='THE PLAYER · Door Man’s Key';$('name2').textContent='ENGIN · BEFORE THE RUIN';$('hp2').style.width='0%';$('timer').textContent='PAST';$('round').textContent='Adventure · Engin’s workshop'+(adventureGodMode?' · GOD MODE':'');$('mapStatus').textContent='THE PAST · Find Engin. He may know a way home.'}else if(adventure?.timeRift){$('timer').textContent='TIME';$('mapStatus').textContent='THE OLYMPIANS · Opening a path to Engin'}};
const pastAttack=attack;
attack=function(i,slot){if(atEnginPast()&&i===0&&slot===1&&active()){adventureSay('Something is still being built here. The air tastes of metal.',4);return}pastAttack(i,slot)};
const pastMap=drawMapBase;
drawMapBase=function(c){if(!atEnginPast())return pastMap(c);c.fillStyle='#253a3c';c.fillRect(0,0,W,H);c.fillStyle='#4d625b';c.fillRect(145,165,1310,770);c.strokeStyle='#7a8a73';c.lineWidth=2;for(let x=170;x<1450;x+=75){c.beginPath();c.moveTo(x,170);c.lineTo(x,930);c.stroke()}for(let y=170;y<930;y+=75){c.beginPath();c.moveTo(150,y);c.lineTo(1450,y);c.stroke()}c.fillStyle='#364d4a';c.fillRect(700,380,230,270);c.strokeStyle='#b6e07b';c.lineWidth=6;c.strokeRect(710,390,210,250);c.beginPath();c.arc(815,515,65,0,Math.PI*2);c.stroke();c.strokeStyle='#c3ef9e';c.lineWidth=3;c.beginPath();c.arc(815,515,42+Math.sin(time*2)*4,0,Math.PI*2);c.stroke();c.fillStyle='#c4df9c';c.font='bold 20px sans-serif';c.textAlign='center';c.fillText('ENGIN’S WORKSHOP',800,125)};
function drawPastTimeDoor(c,n){c.save();c.fillStyle='#1b263c';c.fillRect(n.x-35,n.y-100,70,105);c.strokeStyle='#c3b0ff';c.lineWidth=5;c.strokeRect(n.x-35,n.y-100,70,105);c.strokeStyle='#dce6ff';c.lineWidth=2;for(let j=0;j<3;j++){c.beginPath();c.ellipse(n.x,n.y-48,18+j*7,35+j*6,Math.sin(time)*.15,0,Math.PI*2);c.stroke()}c.restore()}
const pastRender=render;
render=function(){pastRender();if(!adventure?.timeRift||!running)return;const c=ctx,p=1-adventure.timeRift.left/adventure.timeRift.total;c.save();c.fillStyle='#18263fe8';c.fillRect(0,0,VIEW_W,VIEW_H);c.translate(VIEW_W/2,VIEW_H/2);for(let j=0;j<7;j++){c.strokeStyle=j%2?'#b6e8ee':'#d0b5f0';c.lineWidth=3;c.beginPath();c.ellipse(0,0,70+j*32+p*15,100+j*26,(p*2+j*.2),0,Math.PI*2);c.stroke()}c.fillStyle='#fff0cf';c.font='bold 24px sans-serif';c.textAlign='center';c.fillText('ENGIN · BEFORE THE RUIN',0,-VIEW_H*.38);c.font='18px sans-serif';c.fillText('A door into the past. A chance to find home.',0,VIEW_H*.4);c.restore()};
