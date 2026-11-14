'use strict';
const ADVENTURE_SAVE_SLOT='one-vs-one-adventure-autosave-v1';
const STORY_CHAPTERS=['door','harbor','sailer','ship_rest','olympians','olympian_trial','engin_past','engin_boss','bob_boss','bob_aftermath'];
let restoringAdventureSave=false,storySaveClock=0;
const subtitleArena=$('canvas').parentElement;
subtitleArena.append($('adventureSpeech'));subtitleArena.append($('harborTalk'));
function refreshAdventureSubtitles(){const speech=$('adventureSpeech');if(!adventure||!running){speech.hidden=true;subtitleArena.classList.remove('hasAdventureDialogue');return;}const d=adventure.dialogue;const dialogueLine=d?.lines[d.index]||'';let text=d?(/^[A-Za-z][^:]{0,45}:/.test(dialogueLine)?dialogueLine:d.npc.name+': '+dialogueLine):adventure.lineTime>0?adventure.line:'';if(speech.textContent!==text)speech.textContent=text;speech.hidden=!text;subtitleArena.classList.toggle('hasAdventureDialogue',!!d);}
const subtitleSay=adventureSay;
adventureSay=function(text,seconds=3.5){subtitleSay(text,seconds);refreshAdventureSubtitles();};
const subtitleDialogue=showHarborDialogue;
showHarborDialogue=function(){subtitleDialogue();refreshAdventureSubtitles();saveAdventureSnapshot();};
const subtitleClose=closeHarborDialogue;
closeHarborDialogue=function(){const wasDialogue=!!adventure?.dialogue;subtitleClose();if(wasDialogue&&adventure){adventure.line='';adventure.lineTime=0;}refreshAdventureSubtitles();};
$('harborTalkClose').onclick=closeHarborDialogue;
function storySerializable(value){return JSON.parse(JSON.stringify(value,(_k,v)=>typeof v==='number'&&!Number.isFinite(v)?0:v));}
function saveAdventureSnapshot(){if(restoringAdventureSave||!adventure||adventure.testRun||adventure.developerBossTest||adventure.devInstaRun||adventureGodMode||!STORY_CHAPTERS.includes(adventure.chapter))return false;try{const data=storySerializable({version:1,savedAt:Date.now(),adventure,fighters,mapId,walls,clock,finished,roundOver,paused,time,shots,zones,beams,boats,portals,actors,controlFx,particles});const raw=JSON.stringify(data);if(raw.length>1000000)return false;window.localStorage.setItem(ADVENTURE_SAVE_SLOT,raw);return true;}catch{return false;}}
function readAdventureSnapshot(){try{const raw=window.localStorage.getItem(ADVENTURE_SAVE_SLOT);if(!raw||raw.length>1000000)return null;const data=JSON.parse(raw);if(data.version!==1||!STORY_CHAPTERS.includes(data.adventure?.chapter)||data.adventure.testRun||data.adventure.developerBossTest||data.adventure.devInstaRun||!Array.isArray(data.fighters)||data.fighters.length!==2||!Object.hasOwn(MAPS,data.mapId)||!Array.isArray(data.walls)||data.walls.length>100)return null;for(const f of data.fighters)if(!f||![f.x,f.y,f.hp,f.maxHp].every(Number.isFinite)||f.maxHp<=0||!Array.isArray(f.cd))return null;if(!data.fighters[0].isAdventurePlayer||!Array.isArray(data.adventure.doors)||!Array.isArray(data.adventure.warnings))return null;for(const key of ['shots','zones','beams','boats','portals','actors','controlFx','particles'])if(!Array.isArray(data[key])||data[key].length>2000)return null;for(const [chapter,key] of [['engin_boss','enginBoss'],['bob_boss','bobBoss'],['olympian_trial','olympian'],['leo_boss','leoStory']])if(data.adventure.chapter===chapter&&(!data.adventure[key]||![0,1,2].includes(data.adventure[key].stage)))return null;return data;}catch{return null;}}
function resumeAdventureSnapshot(){const data=readAdventureSnapshot();if(!data||(netSession?.peer&&!netSession.peer.closed))return false;restoringAdventureSave=true;try{setAdventureGodMode(false);startAdventure({resume:true});if(!adventure)return false;adventure=data.adventure;fighters=data.fighters;setArena(data.mapId);walls=data.walls;clock=data.clock;time=data.time||0;finished=!!data.finished;roundOver=!!data.roundOver;paused=false;shots=data.shots||[];zones=data.zones||[];beams=data.beams||[];boats=data.boats||[];portals=data.portals||[];actors=data.actors||[];controlFx=data.controlFx||[];particles=data.particles||[];clearInput();$('banner').textContent='';$('bobDuel').hidden=true;
 if(adventure.ended){if(adventure.chapter==='door'&&adventureStored('one-vs-one-door-key'))enterHarbor();else if(adventure.chapter==='sailer'&&adventure.harbor?.rescued)enterShipAftermath();else if(adventure.chapter==='olympian_trial'&&trialWon())returnFromOlympianTrial();else if(adventure.chapter==='engin_boss'&&enginBossWon())enterEnginPast();else if(adventure.chapter==='bob_boss'&&adventure.bobRescued)enterBobAftermath();else{adventure.ended=false;finishAdventure(false);}}
 if(inBobBoss()&&adventure.bobBoss.duel){$('bobDuel').hidden=false;const d=adventure.bobBoss.duel;$('bobDuelResult').textContent=d.resolved?'Previous result: '+d.result:'Choose! Lose: one life. Win: Bob loses 10% of his maximum HP.';}
 if(adventure.dialogue)showHarborDialogue();else $('harborTalk').hidden=true;renderAttackButtons(getMoves(fighters[0]));updateHud();refreshAdventureSubtitles();render();return true;}finally{restoringAdventureSave=false;storySaveClock=0;}}
const progressSaveValue=adventureSave;
adventureSave=function(key,value){if(restoringAdventureSave)return;return progressSaveValue(key,value);};
const progressContinue=continueHarbor;
continueHarbor=function(){if(!resumeAdventureSnapshot())progressContinue();};
$('adventureContinue').onclick=continueHarbor;
const progressRefresh=refreshHarborContinue;
refreshHarborContinue=function(){progressRefresh();const data=readAdventureSnapshot();if(data){$('adventureContinue').hidden=false;$('adventureContinue').textContent='CONTINUE · '+({door:'DOOR MAN',harbor:'FLOODED HARBOR',sailer:'SAILER / KRAKEN',ship_rest:'SAILER',olympians:'THE OLYMPIANS’ HOUSE',olympian_trial:'THE OLYMPIANS',engin_past:'ENGIN’S WORKSHOP',engin_boss:'ENGIN',bob_boss:'BOB',bob_aftermath:'BOB’S GLOVE'})[data.adventure.chapter];}};
const progressUpdate=update;
update=function(dt){progressUpdate(dt);if(adventure&&!paused){storySaveClock+=dt;if(storySaveClock>=1){storySaveClock=0;saveAdventureSnapshot();}}};
const progressRender=render;
render=function(){progressRender();refreshAdventureSubtitles();};
const progressBack=$('back').onclick;
$('back').onclick=()=>{saveAdventureSnapshot();progressBack();refreshHarborContinue();refreshAdventureSubtitles();};
window.addEventListener('pagehide',saveAdventureSnapshot);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveAdventureSnapshot();});
refreshHarborContinue();
