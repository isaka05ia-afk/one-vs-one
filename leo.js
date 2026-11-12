'use strict';
// Leo's single crystal is a permanent match choice, never a stackable evolution.
const LEO_CARDS=['leo_flames','leo_thunder','leo_earth','leo_ice','leo_corruption'];
const LEO_COLORS={base:'#efc76a',flames:'#ff7849',thunder:'#fff078',earth:'#bd9570',ice:'#a7eaff',corruption:'#bb72ee'};
const LEO_MOVES={
 base:[['Royal Cleave','leo_cleave',40,145,3.8,'A heavy, wide two-handed sword swing.'],['Pride Breaker','leo_break',52,190,7,'A slow crushing overhead strike.'],['Bow Before Me','leo_roar',34,220,10,'A circular sword shockwave.']],
 flames:[['Flame Cleave','leo_cleave',48,175,4.4,'Burn enemies with a blazing sword arc.'],['Infernal Crown','leo_break',65,230,8,'A devastating fiery overhead strike.'],['King of Ashes','leo_roar',55,290,12,'A burning circular shockwave.']],
 thunder:[['Flash Cut','leo_cleave',29,155,2.4,'Fast slash with a brief stun.'],['Thunder Step','leo_break',38,240,5,'Advance toward your aim, then cut.'],['Storm Crown','leo_roar',28,240,8,'Stun nearby opponents with thunder.']],
 earth:[['Mountain Cleave','leo_cleave',38,330,6,'A gigantic, slow stone sword arc.'],['Continental Break','leo_break',58,470,10,'A vast stone strike, with a long warning.'],['Kingdom of Stone','leo_roar',42,390,14,'A huge circular quake. Passive armor reduces incoming damage by 25%.']],
 ice:[['Frost Edge','leo_cleave',22,185,3.8,'Slow and apply two Bleed stacks.'],['Glacier Break','leo_break',31,280,7,'A sharp icy strike that leaves slippery ground.'],['Winter Crown','leo_roar',24,310,11,'A slowing ice field with Bleed.']],
 corruption:[['Hollow Cleave','leo_cleave',53,160,3.6,'Steal 40% of actual enemy HP damage.'],['Devour the Weak','leo_break',72,210,7,'A vicious draining sword strike.'],['Perfect Ruin','leo_roar',58,270,11,'Drain enemies around you. Only 145 max HP.']]
};
for(const [key,name,description] of [
 ['flames','Flames','Highest damage and Burn. Slow, punishable swings.'],
 ['thunder','Thunder','Faster movement and attacks, short stuns. Less damage.'],
 ['earth','Earth','280 HP, 25% armor, enormous attacks. Very slow movement and windups.'],
 ['ice','Ice','Slow, slippery ice and Bleed. Lower direct damage.'],
 ['corruption','Corruption','Sacrifice max HP: 145 HP. Deadly attacks heal 40% of actual enemy HP damage.']
])CARD_DEFS['leo_'+key]={name,icon:'◆',color:LEO_COLORS[key],description:description+' Insert this crystal into the sword. Your ONLY card this match.'};
function leoElement(f){return (f.cards||[]).find(c=>LEO_CARDS.includes(c))?.slice(4)||'base'}
function leoMoves(f){return LEO_MOVES[leoElement(f)]}
function leoMaxHP(cards){return cards.includes('leo_corruption')?145:cards.includes('leo_earth')?280:230}
function leoSpeed(f){return {base:165,flames:160,thunder:260,earth:120,ice:175,corruption:195}[leoElement(f)]}
function leoWindup(f,slot){return ({base:[.55,.85,.75],flames:[.65,1,.95],thunder:[.28,.48,.55],earth:[.95,1.35,1.2],ice:[.5,.8,.85],corruption:[.5,.8,.85]})[leoElement(f)][slot]}
function executeLeo(i,slot){const f=fighters[i],m=leoMoves(f)[slot],e=leoElement(f);f.pending=-1;f.anim=.32;f.leoFlash=.32;f.leoRecovery=slot===1?.45:.25;const color=LEO_COLORS[e];
 if(e==='thunder'&&slot===1){move(f,Math.cos(f.lockedAim)*150,Math.sin(f.lockedAim)*150);}
 beams.push({x:f.x,y:f.y,ex:f.x+Math.cos(f.lockedAim)*m[3],ey:f.y+Math.sin(f.lockedAim)*m[3],life:.3,size:e==='earth'?7:3,color});
 if(slot===2)hitDoorArea(i,{x:f.x,y:f.y,r:m[3]},m[2]);else hitDoorCone(i,m[3],slot===0?1.15:.55,m[2]);
 for(const target of combatEnemies(i)){const inRange=slot===2?distance(f,target)<m[3]+fighterRadius(target)&&sight(f,target):cone(f,target,m[3],slot===0?1.15:.55);if(!inRange)continue;const before=target.hp;if(!hit(f,target,m[2],{area:slot===2,origin:f}))continue;
 if(e==='flames'){target.burn=3;target.burnTick=.5;target.burnOwner=i;}
 if(e==='thunder')target.stun=Math.max(target.stun,slot===2?.45:.18);
 if(e==='ice'){target.magicSlow=Math.max(target.magicSlow,2.5);addBleed(target,2);}
 if(e==='corruption')f.hp=Math.min(f.maxHp,f.hp+Math.max(0,before-target.hp)*.4);
 }
 if(e==='ice')zone(i,f.x,f.y,slot===2?m[3]:100,0,0,'ice',5);
 spark(f.x,f.y,color,20);
}
let leoBenches={};
function leoTeamMode(){return !!battleSlots&&new Set(battleSlots.map(s=>s.team)).size<battleSlots.length}
function leoSoloBonus(winning){return !leoTeamMode()&&fighters.some((f,i)=>f.id===7&&teamOf(i)!==winning)?2:1}
function recordLeoTeamLoss(winning){if(!leoTeamMode()||winning===undefined)return;fighters.forEach((f,i)=>{if(f.id!==7||teamOf(i)===winning)return;if(leoBenches[i])delete leoBenches[i];else leoBenches[i]=true;});}
function applyLeoBench(){if(training||!leoTeamMode())return;fighters.forEach((f,i)=>{if(f.id===7&&leoBenches[i]){f.hp=0;f.leoBenched=true;}});}
function updateLeo(dt){for(const f of fighters){if(f.id!==7||f.hp<=0)continue;f.leoFlash=Math.max(0,(f.leoFlash||0)-dt);f.leoRecovery=Math.max(0,(f.leoRecovery||0)-dt);if(f.leoRecovery>0)f.stun=Math.max(f.stun,.05);}}
function drawLeo(c,f,t=0,preview=false){const e=leoElement(f),col=LEO_COLORS[e],casting=f.cast>0,m=leoMoves(f)[f.move||0];c.save();
 if((casting||f.leoFlash>0)&&!preview){c.translate(f.x,f.y);c.rotate(f.lockedAim||0);c.fillStyle=col+'28';c.strokeStyle=col;c.lineWidth=3;c.beginPath();if(f.move===2)c.arc(0,0,m[3],0,Math.PI*2);else{c.moveTo(0,0);c.arc(0,0,m[3],f.move===0?-1.15:-.55,f.move===0?1.15:.55);c.closePath();}c.fill();c.stroke();c.rotate(-(f.lockedAim||0));c.translate(-f.x,-f.y);}
 c.translate(f.x,f.y);if(preview){c.scale(1.7,1.7);c.translate(0,-28);}c.scale(f.face||1,1);c.globalAlpha=f.dodge>0?.4:f.hurt>0?.6:1;
 c.fillStyle='#10162266';c.beginPath();c.ellipse(0,23,28,10,0,0,7);c.fill();
 // Boots, cape and broad plated torso.
 c.fillStyle=e==='corruption'?'#30213d':'#5d2735';c.beginPath();c.moveTo(-20,-10);c.lineTo(-30,30);c.lineTo(27,27);c.lineTo(17,-14);c.closePath();c.fill();
 c.fillStyle='#333747';c.fillRect(-19,11,14,20);c.fillRect(6,11,14,20);c.fillStyle=e==='earth'?'#756a5b':e==='corruption'?'#3b2d49':'#a3a2a0';c.fillRect(-21,-20,42,36);c.fillStyle=col;c.fillRect(-24,-19,48,8);c.fillRect(-19,7,38,5);
 // Lion mane, ears and muzzle give him a readable non-human silhouette.
 c.fillStyle=e==='corruption'?'#422344':e==='ice'?'#d3f3ff':e==='earth'?'#80654d':'#9c5b2e';for(let n=0;n<10;n++){const a=n*Math.PI/5;c.beginPath();c.arc(Math.cos(a)*19,-37+Math.sin(a)*18,10,0,7);c.fill();}
 c.fillStyle=e==='corruption'?'#b19ab6':'#e2b774';c.beginPath();c.arc(0,-38,18,0,7);c.fill();c.beginPath();c.arc(-14,-52,6,0,7);c.arc(14,-52,6,0,7);c.fill();c.fillStyle='#f3dba9';c.beginPath();c.ellipse(2,-32,11,7,0,0,7);c.fill();c.fillStyle='#302632';c.fillRect(-11,-44,7,3);c.fillRect(6,-44,7,3);c.beginPath();c.moveTo(-3,-35);c.lineTo(5,-35);c.lineTo(1,-30);c.fill();
 // Both hands grip the oversized sword. The crystal sits in its guard.
 c.save();c.translate(21,-4);c.rotate(casting?-.7:f.anim>0?.8:-.15);c.fillStyle='#443335';c.fillRect(0,-2,7,29);c.fillStyle='#e2b774';c.fillRect(-3,9,14,7);c.fillRect(-3,20,14,7);c.fillStyle=col;c.fillRect(-13,-8,34,7);c.beginPath();c.moveTo(-10,-10);c.lineTo(-10,-65);c.lineTo(4,-88);c.lineTo(18,-65);c.lineTo(18,-10);c.closePath();c.fill();c.strokeStyle='#fff3cc';c.lineWidth=2;c.stroke();c.fillStyle=e==='base'?'#eee4ba':col;c.beginPath();c.arc(4,-7,6,0,7);c.fill();c.restore();
 if(e!=='base'){c.strokeStyle=col;c.lineWidth=2;c.beginPath();c.arc(0,-37,30,0,7);c.stroke();}c.restore();}

function leoBotSlot(f,b,visible,d){if(!visible||f.leoRecovery>0)return -1;const moves=leoMoves(f);const order=leoElement(f)==='corruption'&&f.hp<f.maxHp*.55?[2,0,1]:d>moves[0][3]?[1,2,0]:[0,2,1];return order.find(n=>f.cd[n]<=0&&d<moves[n][3]+12)??-1;}
