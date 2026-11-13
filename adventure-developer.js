'use strict';
let adventureBossToolsUnlocked=false;
const BOSS_TEST_TARGETS=[['door','Door Man · Full fight'],['door-growth','Door Man · Transformation'],['sailer','Sailer · Boarding and fight'],['kraken','Kraken · Interruption cutscene and fight'],['rescue','Sailer · After the rescue'],['olympians','Olympians · Full trial'],['skater','Olympians · Ice transition'],['runner','Olympians · Runner transition'],['rift','Olympians · Time journey'],['engin','Engin · Machine trap and full fight'],['beast','Engin · Beast transformation'],['uranium','Engin · Uranium V2 transformation'],['bob','Bob · Uranium pickup and ending']];
for(const [value,label] of BOSS_TEST_TARGETS){const option=document.createElement('option');option.value=value;option.textContent=label;$('developerBossTarget').append(option);}
const bossToolsCode=applyAdventureDeveloperCode;
applyAdventureDeveloperCode=function(){if($('developerCode').value.trim().toUpperCase()!=='PLAYER-BOSSES')return bossToolsCode();$('developerCode').value='';adventureBossToolsUnlocked=true;$('developerBossPanel').hidden=false;$('developerGodToggle').unlocked=true;setAdventureGodMode(true);$('developerStatus').textContent='All boss tests unlocked · choose a fight or cutscene · normal progress is protected.';return true;};
$('developerApply').onclick=applyAdventureDeveloperCode;
const bossTestSave=adventureSave;
adventureSave=function(key,value){if(adventure?.developerBossTest)return;return bossTestSave(key,value);};
function launchAdventureBossTest(target){if(!adventureBossToolsUnlocked||!BOSS_TEST_TARGETS.some(t=>t[0]===target))return false;const immortal=adventureGodMode;setAdventureGodMode(true);startAdventure({resume:true});adventure.developerBossTest=true;adventure.testRun=true;adventure.olympianWon=true;adventure.sailerTalkDone=true;adventure.olympiansHouseUnlocked=true;adventure.keyUnlocked=true;fighters[0].hasDoorKey=true;
 if(target==='door-growth')adventurePhaseTwo();
 else if(['sailer','kraken','rescue'].includes(target)){enterHarbor();startSailerFight();if(target==='kraken')startKrakenRescue();if(target==='rescue')enterShipAftermath();}
 else if(['olympians','skater','runner','rift'].includes(target)){enterOlympians();if(target==='rift')beginEnginRift();else{startOlympianTrial();if(target==='skater')olympianNextPhase();if(target==='runner'){olympianNextPhase();olympianNextPhase();}}}
 else if(['engin','beast','uranium','bob'].includes(target)){enterEnginPast();closeHarborDialogue();if(target==='bob'){adventure.enginBossWon=true;adventure.hasEnginUranium=false;fighters[0].x=1050;fighters[0].y=620;takeEnginUranium();}else{startEnginBoss();if(target==='beast')nextEnginBossForm();if(target==='uranium'){nextEnginBossForm();nextEnginBossForm();}}}
 adventure.testRun=true;setAdventureGodMode(immortal);closeControls();updateHud();return true;}
$('developerBossLaunch').onclick=()=>launchAdventureBossTest($('developerBossTarget').value);
