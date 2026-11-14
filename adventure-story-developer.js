'use strict';
let storyCheckpointUnlocked=false;
const STORY_TEST_POINTS=[['door','Door Man · Beginning'],['harbor','Door Man defeated · Harbor'],['sailer','Sailer · First phase'],['kraken','Kraken · Rescue'],['olympians','The Olympians'],['engin','Engin · Machine room'],['bob','Bob · Full fight'],['mountain','Mountain · Egg'],['dragon2','Mountain · Grab fireballs'],['dragon3','Mountain · Flying dragon'],['doors','Dragon defeated · Two doors'],['curse','Curse Queen · Receive blade'],['curse1','Curse Blade · One soul'],['curse2','Curse Blade · Two souls'],['curse-end','Curse Blade · Sailer stops you'],['leo','Leo · Conversation'],['leo1','Leo · First phase'],['leo2','Leo · Elemental phase'],['leo3','Leo · Corruption'],['leo-sword','Leo defeated · Pick up sword']];
for(const [value,label]of STORY_TEST_POINTS){const option=document.createElement('option');option.value=value;option.textContent=label;$('developerStoryPoint').append(option);}
const checkpointCode=applyAdventureDeveloperCode;
applyAdventureDeveloperCode=function(){if($('developerCode').value.trim()!=='1209')return checkpointCode();$('developerCode').value='';storyCheckpointUnlocked=true;$('developerStoryPanel').hidden=false;$('developerStatus').textContent='1209 · Choose how far into the Adventure to test. Normal saves are protected.';return true;};
$('developerApply').onclick=applyAdventureDeveloperCode;
function launchStoryCheckpoint(point){if(!storyCheckpointUnlocked||!STORY_TEST_POINTS.some(p=>p[0]===point)||(netSession?.peer&&!netSession.peer.closed))return false;const god=adventureGodMode;setAdventureGodMode(true);startAdventure({resume:true});adventure.developerBossTest=true;adventure.testRun=true;adventure.devCheckpoint=true;adventure.keyUnlocked=true;adventure.hasEnginUranium=true;adventure.hasBobGlove=true;adventure.sailerTalkDone=true;adventure.sailerRescued=true;adventure.olympiansHouseUnlocked=true;adventure.olympianWon=true;adventure.enginBossWon=true;adventure.dragonLesson=true;fighters[0].hasDoorKey=true;
 if(point==='harbor')enterHarbor();
 if(['sailer','kraken'].includes(point)){enterHarbor();startSailerFight();if(point==='kraken')startKrakenRescue();}
 if(point==='olympians'){enterOlympians();startOlympianTrial();}
 if(point==='engin'){enterEnginPast();closeHarborDialogue();startEnginBoss();}
 if(point==='bob'){enterEnginPast();closeHarborDialogue();startBobBoss();}
 if(['mountain','dragon2','dragon3'].includes(point)){enterMountain();startMountainDragon();if(point!=='mountain')nextMountainDragon();if(point==='dragon3')nextMountainDragon();}
 if(point==='doors')enterDragonFork();
 if(point.startsWith('curse')){enterDragonFork();enterDragonMeeting('queen');if(point!=='curse'){takeCurseBlade();adventure.curseSouls=ordinaryHarborResidents().slice(0,point==='curse1'?1:point==='curse2'?2:3).map(n=>n.name);if(point==='curse-end')finishCurseHarbor();}}
 if(point.startsWith('leo')){enterDragonFork();enterDragonMeeting('leo');if(point!=='leo'){startLeoStory();if(['leo2','leo3','leo-sword'].includes(point))nextLeoStoryPhase();if(['leo3','leo-sword'].includes(point))nextLeoStoryPhase();if(point==='leo-sword'){adventure.leoWon=true;enterLeoAftermath();}}}
 adventure.testRun=true;adventure.developerBossTest=true;setAdventureGodMode(god);closeControls();renderAttackButtons(getMoves(fighters[0]));updateHud();return true;}
$('developerStoryLaunch').onclick=()=>launchStoryCheckpoint($('developerStoryPoint').value);
