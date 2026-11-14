'use strict';
function curseChargeAllowed(){return !!adventure?.hasCurseBlade&&fighters[0]?.isAdventurePlayer&&(!safeAdventureStop()||inHarbor()||atOlympians());}
function cancelCurseCharge(){if(adventure)adventure.curseCharge=null;cancelAimPreview(0);}
const curseChargeBegin=beginPlayerAttack;
beginPlayerAttack=function(slot){if(slot!==0||!curseChargeAllowed())return curseChargeBegin(slot);const p=fighters[0];if(!active()||adventure.dialogue||p.cd[0]>0||p.hp<=0||p.stun>0||p.drinking>0)return;beginAimAttack(0,0);if(aimPreviews.has(0))adventure.curseCharge={held:0};};
const curseChargeEnd=endPlayerAttack;
endPlayerAttack=function(slot,cancel=false){if(slot!==0||!adventure?.curseCharge)return curseChargeEnd(slot,cancel);const charge=adventure.curseCharge,p=fighters[0],preview=aimPreviews.get(0);if(cancel||!active()||p.stun>0||p.hp<=0){cancelCurseCharge();return;}if(preview?.manual)p.aim=preview.aim;else updatePlayerAim();const aim=p.aim;adventure.curseCharge=null;cancelAimPreview(0);if(charge.held>=2)fireCurseSlash(aim);else attack(0,0);};
function fireCurseSlash(aim){const p=fighters[0];if(!curseChargeAllowed()||!active()||p.cd[0]>0)return false;adventure.curseShots??=[];if(adventure.curseShots.length>=5)return false;p.cd[0]=1.1;p.anim=.3;p.blockHeld=false;p.guard=0;adventure.curseShots.push({x:p.x,y:p.y,vx:Math.cos(aim)*700,vy:Math.sin(aim)*700,r:22,life:2.1,damage:38});tone(520);return true;}
function curseShotCopyDamage(o){const copy=adventure.curseOlympians?.copy;if(!inCurseOlympians()||!copy||copy.dead||distance(copy,o)>fighterRadius(copy)+o.r)return false;return damageCurseCopy(o.damage);}
function tickCurseShots(dt){if(!adventure.curseShots?.length)return;const next=[];for(const o of adventure.curseShots){let alive=true;o.life-=dt;const steps=Math.ceil(700*dt/8)||1;for(let n=0;n<steps;n++){o.x+=o.vx*dt/steps;o.y+=o.vy*dt/steps;if(!free(o.x,o.y,o.r)){alive=false;break;}if(inHarbor()){const target=safeAdventureNPCs().find(n=>ordinaryHarborResidents().some(p=>p.name===n.name)&&distance(n,o)<24+o.r);if(target){collectCurseHarborSoul(target);alive=false;break;}}
 else if(atOlympians()){const target=safeAdventureNPCs().find(n=>n.olymp!==undefined&&distance(n,o)<28+o.r);if(target){startOlympianTrial();alive=false;break;}}
 else if(curseShotCopyDamage(o)){alive=false;break;}else if(!safeAdventureStop()&&fighters[1]?.hp>0&&distance(o,fighters[1])<fighterRadius(fighters[1])+o.r){applyDamage(fighters[1],o.damage);spark(o.x,o.y,'#e5a2fa',12);alive=false;break;}}
 if(alive&&o.life>0)next.push(o);if(adventure.ended)break;}adventure.curseShots=adventure.ended?[]:next;}
const curseChargeClear=clearChapterEffects;
clearChapterEffects=function(){curseChargeClear();if(adventure){adventure.curseCharge=null;adventure.curseShots=[];}};
const curseChargeRevive=reviveAdventurePlayer;
reviveAdventurePlayer=function(f){if(adventure&&f.isAdventurePlayer&&f.hp<=0){adventure.curseCharge=null;adventure.curseShots=[];}return curseChargeRevive(f);};
const curseChargeUpdate=update;
update=function(dt){if(adventure&&active()){if(adventure.curseCharge){const p=fighters[0];if(p.stun>0||p.drinking>0||p.dodge>0)cancelCurseCharge();else adventure.curseCharge.held=Math.min(2.5,adventure.curseCharge.held+dt);}tickCurseShots(dt);}return curseChargeUpdate(dt);};
const curseChargeResume=resumeAdventureSnapshot;
resumeAdventureSnapshot=function(){const result=curseChargeResume();if(result)adventure.curseCharge=null;return result;};
const curseChargeRender=render;
render=function(){curseChargeRender();if(!adventure||!running)return;const c=ctx;c.save();c.scale(camera.scale,camera.scale);c.translate(-camera.x,-camera.y);for(const o of adventure.curseShots||[]){c.save();c.translate(o.x,o.y);c.rotate(Math.atan2(o.vy,o.vx));c.shadowColor='#b34bec';c.shadowBlur=14;c.strokeStyle='#f0c7ff';c.lineWidth=7;c.beginPath();c.arc(-8,0,34,-1.2,1.2);c.stroke();c.lineWidth=3;c.strokeStyle='#b75bea';c.beginPath();c.arc(-18,0,40,-1.1,1.1);c.stroke();c.restore();}if(adventure.curseCharge){const p=fighters[0],progress=Math.min(1,adventure.curseCharge.held/2);c.strokeStyle=progress>=1?'#f1d0ff':'#b36bce';c.lineWidth=5;c.beginPath();c.arc(p.x,p.y-55,43,-Math.PI/2,-Math.PI/2+progress*Math.PI*2);c.stroke();c.fillStyle='#f4d9ff';c.font='bold 13px sans-serif';c.textAlign='center';c.fillText(progress>=1?'CURSE SLASH READY':'CHARGE · '+adventure.curseCharge.held.toFixed(1)+' / 2 s',p.x,p.y-115);}c.restore();};
const curseChargeMoves=getMoves;
getMoves=function(f){const moves=curseChargeMoves(f);if(!adventure?.hasCurseBlade||!f?.isAdventurePlayer||adventureInstaKill||safeAdventureStop()&&!inHarbor()&&!atOlympians())return moves;return moves.map((m,i)=>i===0?['Cursed Blade',m[1],m[2],adventure.curseCharge?.held>=2?1400:m[3],m[4],'Tap to slash. Hold for 2 seconds, then release to fire a flying Curse Slash.']:m);};
