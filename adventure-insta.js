'use strict';
let adventureInstaKill=false;
function refreshInstaWeapon(){$('developerInstaToggle').hidden=!$('developerInstaToggle').unlocked;$('developerInstaToggle').textContent=adventureInstaKill?'Insta-kill sword · ON (turn off)':'Insta-kill sword · OFF (turn on)';}
function setInstaWeapon(enabled){if(enabled&&adventure&&!adventure.devInstaRun&&typeof saveAdventureSnapshot==='function')saveAdventureSnapshot();adventureInstaKill=!!enabled;if(enabled&&adventure){adventure.testRun=true;adventure.devInstaRun=true;}refreshInstaWeapon();if(adventure&&running){renderAttackButtons(getMoves(fighters[0]));updateHud();}}
const instaDeveloperCode=applyAdventureDeveloperCode;
applyAdventureDeveloperCode=function(){if($('developerCode').value.trim()!=='1483')return instaDeveloperCode();$('developerCode').value='';$('developerInstaToggle').unlocked=true;setInstaWeapon(true);$('developerStatus').textContent='1483 · Insta-kill sword unlocked for Adventure. Test only; normal saves are protected.';return true;};
$('developerApply').onclick=applyAdventureDeveloperCode;
$('developerInstaToggle').onclick=()=>setInstaWeapon(!adventureInstaKill);
const instaStartAdventure=startAdventure;
startAdventure=function(options={}){const immortal=adventureGodMode;if(adventureInstaKill)adventureGodMode=true;try{instaStartAdventure(options);if(adventure&&adventureInstaKill){adventure.devInstaRun=true;adventure.testRun=true;}}finally{adventureGodMode=immortal;}if(adventure&&running)updateHud();};
const instaSave=adventureSave;
adventureSave=function(key,value){if(adventure?.devInstaRun||adventureInstaKill)return;return instaSave(key,value);};
function developerSwordStrike(){const p=fighters[0],b=fighters[1];if(!adventureInstaKill||!adventure||!p?.isAdventurePlayer||!active()||safeAdventureStop()||p.hp<=0||p.cd[0]>0||p.stun>0||p.drinking>0)return false;adventure.testRun=true;adventure.devInstaRun=true;updatePlayerAim();p.lockedAim=p.aim;p.anim=.25;p.move=0;p.cd[0]=.35;p.guard=0;p.blockHeld=false;const damage=Math.max(100000,b.maxHp*100);
 if(typeof inMountainFight==='function'&&inMountainFight()){const s=adventure.dragonStory;if(s.stage===2)beginDragonDefeat();else{s.grabStrike=true;try{applyDamage(b,damage);}finally{s.grabStrike=false;}}}
 else if(onBossShip()&&b.isKraken){p.hasPaddle=true;const target=adventure.harbor.exposed.find(t=>t.life>0);if(target){p.aim=p.lockedAim=angle(p,target);const origin={x:p.x,y:p.y};Object.assign(p,{x:target.x-45,y:target.y});try{hitKrakenTentacle(p,target,damage);}finally{Object.assign(p,origin);}}else{exposeTentacle(p.x+65,p.y,4);const t=adventure.harbor.exposed.find(t=>t.life>0);if(t){p.aim=p.lockedAim=angle(p,t);hitKrakenTentacle(p,t,damage);}}}
 else{if(inOlympianTrial())adventure.olympian.recovery=Math.max(1,adventure.olympian.recovery);if(inEnginBoss())adventure.enginBoss.motion=null;applyDamage(b,damage);}
 spark(b.x,b.y,'#f9baff',25);tone(800);return true;}
const instaAttack=attack;
attack=function(i,slot){if(i===0&&slot===0&&adventureInstaKill&&adventure&&!safeAdventureStop()){developerSwordStrike();return;}return instaAttack(i,slot);};
const instaMoves=getMoves;
getMoves=function(f){const moves=instaMoves(f);if(!adventureInstaKill||!adventure||!f?.isAdventurePlayer||safeAdventureStop())return moves;return moves.map((m,i)=>i===0?['DEV Insta-kill Sword',m[1],100000,2000,.35,'Developer weapon: one hit finishes the current boss phase, preserving story transitions.']:m);};
const instaHud=updateHud;
updateHud=function(){instaHud();if(adventure&&adventureInstaKill)$('name1').textContent+=' · DEV INSTA-KILL';};
refreshInstaWeapon();
const instaResume=resumeAdventureSnapshot;
resumeAdventureSnapshot=function(){const resumed=instaResume();if(resumed&&adventureInstaKill&&adventure){adventure.testRun=true;adventure.devInstaRun=true;renderAttackButtons(getMoves(fighters[0]));updateHud();}return resumed;};
const instaDraw=drawFighter;
drawFighter=function(c,f,t=0,preview=false){instaDraw(c,f,t,preview);if(!adventure||!adventureInstaKill||!f.isAdventurePlayer)return;c.save();c.translate(f.x,f.y);c.scale(f.face||1,1);c.shadowColor='#f7a4ff';c.shadowBlur=15;c.strokeStyle='#f9d1ff';c.lineWidth=6;c.beginPath();c.moveTo(21,-35);c.lineTo(f.anim>0?68:42,f.anim>0?-55:-78);c.stroke();c.shadowBlur=0;c.restore();};
