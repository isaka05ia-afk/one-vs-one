'use strict';
// Leo's single crystal is a permanent match choice, never a stackable evolution.
const LEO_CARDS=['leo_flames','leo_thunder','leo_earth','leo_ice','leo_corruption'];
const LEO_COLORS={base:'#efc76a',flames:'#ff7849',thunder:'#fff078',earth:'#bd9570',ice:'#a7eaff',corruption:'#bb72ee'};
const LEO_MOVES={
 base:[['World Splitter','leo_wave',36,5000,6,'A travelling sword crescent pierces walls and every enemy once across the arena.'],['Pride Breaker','leo_melee',58,145,4,'A devastating close-range overhead swing.'],['Kneel Before Me','leo_decree',22,260,11,'Roar and knock nearby enemies away.']],
 flames:[['Blazing Horizon','leo_wave',45,5000,7,'A burning crescent cuts through the arena and cover.'],['Infernal Execution','leo_melee',76,155,5,'A short-range execution swing with Burn.'],['Falling Sun','leo_meteor',64,580,14,'Call a marked meteor onto your aimed position. Leaves burning ground.']],
 thunder:[['Lightning Divide','leo_wave',29,5000,4.8,'A fast piercing crescent with a brief stun.'],['Thunder Fang','leo_melee',42,140,2.8,'A quick, close-range cut that briefly stuns.'],['Storm Arrival','leo_leap',34,350,9,'Teleport to your marked destination and stun enemies near the landing.']],
 earth:[['Continental Divide','leo_wave',42,5000,9,'A gigantic, slow travelling stone crescent pierces all cover.'],['Mountain Crusher','leo_melee',72,190,7,'A massive close-range stone blade. Slow windup.'],['Fault Line','leo_fault',46,540,15,'Three huge marked eruptions advance in a line. Each can hit once.']],
 ice:[['Frozen Horizon','leo_wave',23,5000,6,'A piercing ice crescent applies Slow and Bleed.'],['Shatter Fang','leo_melee',35,150,4,'A jagged close-range slash applies four Bleed stacks.'],['Winter Prison','leo_prison',24,560,12,'Mark a distant ice field. Repeated frost pulses slow enemies; the ground stays slippery.']],
 corruption:[['Hollow Horizon','leo_wave',46,5000,6,'A piercing cursed crescent steals 40% of actual HP damage.'],['Devour the Weak','leo_melee',82,155,4.8,'A brutal close-range lifestealing execution.'],['Soul Chain','leo_siphon',9,560,13,'Attach a visible draining chain for 2 seconds. Pulls and steals life; dodge or break line of sight to escape.']]
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
function leoWindup(f,slot){return ({base:[.65,.7,.6],flames:[.8,.9,.6],thunder:[.35,.35,.45],earth:[1,1.2,.8],ice:[.6,.65,.65],corruption:[.6,.8,.65]})[leoElement(f)][slot]}
function leoHit(i,target,damage,e,options={},bleed=2){const f=fighters[i],before=target.hp;const did=hit(f,target,damage,options);if(target.hp<before&&e==='corruption')healFighter(f,(before-target.hp)*.4);if(!did)return false;
 if(e==='flames'){target.burn=Math.max(target.burn,3);target.burnTick=.5;target.burnOwner=i;}
 if(e==='thunder')target.stun=Math.max(target.stun,.22);
 if(e==='ice'){target.magicSlow=Math.max(target.magicSlow,2.5);addBleed(target,bleed);}
 return true;
}
function leoZone(i,e,kind,x,y,r,damage,delay,life=.5,extra={}){zone(i,x,y,r,damage,delay,'leo_'+kind,life);Object.assign(zones.at(-1),{element:e,total:delay+life,...extra});return zones.at(-1);}
function leoDestination(f,range){const t=f.target||{x:f.x+Math.cos(f.lockedAim)*range,y:f.y+Math.sin(f.lockedAim)*range},d=Math.min(range,distance(f,t));return {x:Math.max(35,Math.min(W-35,f.x+Math.cos(f.lockedAim)*d)),y:Math.max(35,Math.min(H-35,f.y+Math.sin(f.lockedAim)*d))};}
function executeLeo(i,slot){const f=fighters[i],m=leoMoves(f)[slot],e=leoElement(f),color=LEO_COLORS[e];f.pending=-1;f.anim=.42;f.leoFlash=.42;f.leoRecovery=slot===1?.45:.2;
 if(slot===0){const speed={base:850,flames:720,thunder:1200,earth:460,ice:780,corruption:800}[e],r=e==='earth'?90:e==='flames'?48:38;
 const s={x:f.x,y:f.y,vx:Math.cos(f.lockedAim)*speed,vy:Math.sin(f.lockedAim)*speed,life:Math.hypot(W,H)/speed+1,r,owner:i,damage:m[2],kind:'leo_wave',element:e,color,hitFighters:[],hitObjects:[]};shots.push(s);trackTimelineProjectile(s);insightShot(s);spark(f.x,f.y,color,12);return;}
 if(slot===1){hitDoorCone(i,m[3],1.1,m[2]);for(const target of combatEnemies(i))if(cone(f,target,m[3],1.1))leoHit(i,target,m[2],e,{origin:f},e==='ice'?4:2);if(e==='ice')zone(i,f.x+Math.cos(f.lockedAim)*70,f.y+Math.sin(f.lockedAim)*70,100,0,0,'ice',4);spark(f.x+Math.cos(f.lockedAim)*70,f.y+Math.sin(f.lockedAim)*70,color,20);return;}
 const p=leoDestination(f,m[3]);
 if(e==='base'){leoZone(i,e,'decree',f.x,f.y,260,m[2],0,.5);}
 if(e==='flames'){leoZone(i,e,'meteor',p.x,p.y,160,m[2],.85,.7);}
 if(e==='thunder'){if(free(p.x,p.y,R)){spark(f.x,f.y,color,20);f.x=f.groundX=p.x;f.y=f.groundY=p.y;f.velX=f.velY=0;}leoZone(i,e,'arrival',f.x,f.y,140,m[2],0,.5);}
 if(e==='earth'){for(let n=1;n<=3;n++)leoZone(i,e,'fault',f.x+Math.cos(f.lockedAim)*n*175,f.y+Math.sin(f.lockedAim)*n*175,145,m[2],n*.3,.55);}
 if(e==='ice'){leoZone(i,e,'prison',p.x,p.y,185,m[2],.65,2.2);zone(i,p.x,p.y,185,0,0,'ice',6);}
 if(e==='corruption'){const target=combatEnemies(i).find(t=>cone(f,t,m[3],.65));if(target)leoZone(i,e,'siphon',f.x,f.y,m[3],m[2],0,2,{target:fighterIndex(target),tick:.1});else spark(p.x,p.y,color,10);}
}
function updateLeoShot(s,dt){const f=fighters[s.owner];if(!f)return false;const steps=Math.max(1,Math.ceil(len(s.vx,s.vy)*dt/10));for(let n=0;n<steps;n++){
 s.x+=s.vx*dt/steps;s.y+=s.vy*dt/steps;
 for(const target of combatEnemies(s.owner)){const id=fighterIndex(target);if(s.hitFighters.includes(id)||distance(s,target)>s.r+fighterRadius(target))continue;s.hitFighters.push(id);
 if(target.reflect>0&&defenseFaces(target,s)&&!s.reflected){s.reflected=true;s.owner=id;s.vx=-s.vx;s.vy=-s.vy;s.hitFighters=[id];s.hitObjects=[];spark(s.x,s.y,s.color,12);break;}
 leoHit(s.owner,target,s.damage,s.element,{projectile:true,origin:s});}
 for(const t of doorTargets(s.owner)){if(s.hitObjects.includes(t.id)||distance(s,t)>s.r+20)continue;s.hitObjects.push(t.id);hitDoorTarget(s.owner,t,s.damage);}
 }
 s.life-=dt;return s.life>0&&s.x>-s.r&&s.x<W+s.r&&s.y>-s.r&&s.y<H+s.r;
}
function updateLeoZone(z,dt){const f=fighters[z.owner];if(!f)return false;z.delay-=dt;z.life-=dt;
 if(z.kind==='leo_siphon'){const target=fighters[z.target];if(f.hp<=0||f.stun>0||!target||target.hp<=0||target.dodge>0||distance(f,target)>z.r||!sight(f,target))return false;z.x=f.x;z.y=f.y;z.tx=target.x;z.ty=target.y;z.tick-=dt;if(z.tick<=0){z.tick+=.35;leoHit(z.owner,target,z.damage,'corruption',{origin:f,area:true});}if(target.controlImmune<=0){const u=norm(f.x-target.x,f.y-target.y);move(target,u.x*75*dt,u.y*75*dt);}return z.life>0;}
 if(z.delay<=0&&(!z.fired||z.kind==='leo_prison')){z.tick-=dt;if(z.tick<=0){z.tick=.7;z.fired=true;hitDoorArea(z.owner,z,z.damage);for(const target of combatEnemies(z.owner))if(distance(z,target)<z.r+fighterRadius(target)&&sight(z,target)){
 if(leoHit(z.owner,target,z.damage,z.element,{area:true,origin:z})){if(z.kind==='leo_decree'&&target.controlImmune<=0){const u=norm(target.x-z.x,target.y-z.y);move(target,u.x*200,u.y*200);target.controlImmune=.7;}if(z.kind==='leo_arrival')target.stun=Math.max(target.stun,.55);}}
 if(z.kind==='leo_meteor'){zone(z.owner,z.x,z.y,z.r,5,0,'trail',3);zones.at(-1).color=LEO_COLORS.flames;}spark(z.x,z.y,LEO_COLORS[z.element],26);}}
 return z.life>0;
}
let leoBenches={};
function leoTeamMode(){return !!battleSlots&&new Set(battleSlots.map(s=>s.team)).size<battleSlots.length}
function leoSoloBonus(winning){return !leoTeamMode()&&fighters.some((f,i)=>f.id===7&&teamOf(i)!==winning)?2:1}
function recordLeoTeamLoss(winning){if(!leoTeamMode()||winning===undefined)return;fighters.forEach((f,i)=>{if(f.id!==7||teamOf(i)===winning)return;if(leoBenches[i])delete leoBenches[i];else leoBenches[i]=true;});}
function applyLeoBench(){if(training||!leoTeamMode())return;fighters.forEach((f,i)=>{if(f.id===7&&leoBenches[i]){f.hp=0;f.leoBenched=true;}});}
function updateLeo(dt){for(const f of fighters){if(f.id!==7||f.hp<=0)continue;f.leoFlash=Math.max(0,(f.leoFlash||0)-dt);f.leoRecovery=Math.max(0,(f.leoRecovery||0)-dt);if(f.leoRecovery>0)f.stun=Math.max(f.stun,.05);}}
function leoPoly(c,points,fill,stroke){c.beginPath();points.forEach((p,n)=>n?c.lineTo(...p):c.moveTo(...p));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
function leoCircle(c,x,y,r,fill,stroke){c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
function drawLeoShot(c,s){const e=s.element,col=LEO_COLORS[e];c.save();c.translate(s.x,s.y);c.rotate(Math.atan2(s.vy,s.vx));c.shadowColor=col;c.shadowBlur=18;c.lineWidth=3;
 for(let n=3;n>=1;n--){c.globalAlpha=.12*n;c.strokeStyle=col;c.lineWidth=4+n*2;c.beginPath();c.moveTo(-n*18,-s.r*.75);c.quadraticCurveTo(24-n*18,0,-n*18,s.r*.75);c.stroke();}
 c.globalAlpha=1;leoPoly(c,[[0,-s.r],[s.r*.4,-s.r*.4],[s.r*.55,0],[s.r*.4,s.r*.4],[0,s.r],[-12,s.r*.6],[-3,0],[-12,-s.r*.6]],col,'#fff5dd');
 if(e==='thunder'){c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.moveTo(-30,-s.r);c.lineTo(8,-s.r*.4);c.lineTo(-15,0);c.lineTo(12,s.r*.4);c.lineTo(-30,s.r);c.stroke();}
 if(e==='earth'||e==='ice'){for(let n=-2;n<=2;n++)leoPoly(c,[[-18,n*s.r*.35],[-34,n*s.r*.35-9],[-42,n*s.r*.35+5]],e==='ice'?'#e3fbff':'#7d614d',col);}
 c.restore();}
function drawLeoZone(c,z){const col=LEO_COLORS[z.element],warn=z.delay>0;c.save();c.lineWidth=3;c.strokeStyle=col;
 if(z.kind==='leo_siphon'){if(!Number.isFinite(z.tx)){c.restore();return;}const f=fighters[z.owner];c.shadowColor=col;c.shadowBlur=12;c.beginPath();c.moveTo(f.x,f.y-15);c.quadraticCurveTo((f.x+z.tx)/2,(f.y+z.ty)/2-40,z.tx,z.ty);c.stroke();for(let n=0;n<9;n++){const t=(n/9+time*.8)%1;c.fillStyle=n%2?'#f4b8ff':col;leoCircle(c,f.x+(z.tx-f.x)*t,f.y+(z.ty-f.y)*t-10,4,col);}leoCircle(c,z.tx,z.ty,31,null,col);c.restore();return;}
 c.translate(z.x,z.y);c.globalAlpha=warn?.16:.3;c.fillStyle=col;leoCircle(c,0,0,z.r,col);c.globalAlpha=1;c.setLineDash(warn?[10,8]:[]);leoCircle(c,0,0,z.r,null,col);c.setLineDash([]);
 if(warn){const progress=1-Math.max(0,z.delay)/(z.total-(z.kind==='leo_prison'?2.2:z.kind==='leo_meteor'?.7:.55));c.lineWidth=5;c.beginPath();c.arc(0,0,z.r*.8,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,Math.min(1,progress)));c.stroke();c.beginPath();c.moveTo(-12,0);c.lineTo(12,0);c.moveTo(0,-12);c.lineTo(0,12);c.stroke();}
 if(z.kind==='leo_meteor'){if(warn){const h=z.delay*220;c.shadowColor=col;c.shadowBlur=20;leoPoly(c,[[-25,-h-15],[0,-h-72],[30,-h-10],[0,-h+24]],'#ffb34b','#fff1ac');}else{for(let n=0;n<8;n++){const a=n*Math.PI/4;leoPoly(c,[[Math.cos(a)*30,Math.sin(a)*30],[Math.cos(a+.12)*z.r,Math.sin(a+.12)*z.r],[Math.cos(a+.25)*50,Math.sin(a+.25)*50]],'#ff7d39','#ffde7e');}}}
 if(z.kind==='leo_fault'&&!warn){for(let n=0;n<7;n++){const a=n*Math.PI*2/7,x=Math.cos(a)*z.r*.55,y=Math.sin(a)*z.r*.55;leoPoly(c,[[x-22,y+15],[x-13,y-45],[x+13,y-65],[x+28,y+14]],'#8c7560','#ead3a2');}}
 if(z.kind==='leo_prison'){for(let n=0;n<8;n++){const a=n*Math.PI/4,x=Math.cos(a)*z.r*.85,y=Math.sin(a)*z.r*.85;leoPoly(c,[[x-12,y+8],[x,y-32],[x+12,y+8]],warn?'#7fc7df66':'#a3e6f5','#e6ffff');}c.rotate(time*.2);c.lineWidth=2;for(let n=0;n<6;n++){c.rotate(Math.PI/3);c.beginPath();c.moveTo(0,0);c.lineTo(z.r*.6,0);c.moveTo(z.r*.35,-14);c.lineTo(z.r*.45,0);c.lineTo(z.r*.35,14);c.stroke();}}
 if(z.kind==='leo_decree'||z.kind==='leo_arrival'){for(let n=0;n<3;n++)leoCircle(c,0,0,z.r*((time*2+n/3)%1),null,col);}
 c.restore();}
function drawLeo(c,f,t=0,preview=false){const e=leoElement(f),col=LEO_COLORS[e],casting=f.cast>0,slot=f.move||0,m=leoMoves(f)[slot];c.save();
 if(!preview&&!f.storyVisualOnly&&(casting||f.leoFlash>0)){
 c.save();c.translate(f.x,f.y);c.rotate(f.lockedAim||0);c.lineWidth=2;c.strokeStyle=col;c.fillStyle=col+'20';
 if(slot===0&&casting){c.setLineDash([12,10]);c.beginPath();c.moveTo(0,-(e==='earth'?90:38));c.lineTo(Math.hypot(W,H),-(e==='earth'?90:38));c.moveTo(0,e==='earth'?90:38);c.lineTo(Math.hypot(W,H),e==='earth'?90:38);c.stroke();}
 if(slot===1){c.beginPath();c.moveTo(0,0);c.arc(0,0,m[3],-1.1,1.1);c.closePath();c.fill();c.stroke();if(!casting){c.lineWidth=13;c.shadowColor=col;c.shadowBlur=18;c.beginPath();c.arc(0,0,m[3]*.75,-1.1,1.1);c.stroke();c.strokeStyle='#fff4d9';c.lineWidth=4;c.stroke();}}
 c.restore();
 if(slot===2&&casting){const p=leoDestination(f,m[3]);if(e==='earth'){for(let n=1;n<=3;n++)drawLeoZone(c,{kind:'leo_fault',element:e,x:f.x+Math.cos(f.lockedAim)*n*175,y:f.y+Math.sin(f.lockedAim)*n*175,r:145,delay:1,total:1.55});}else if(e==='base'){leoCircle(c,f.x,f.y,260,null,col);}else{const r=e==='ice'?185:e==='flames'?160:e==='thunder'?140:30;leoCircle(c,p.x,p.y,r,col+'18',col);}}
 }
 c.translate(f.x,f.y);if(preview){c.scale(1.4,1.4);c.translate(0,-26);}else{c.translate(0,14);c.scale(1.35,1.35);c.translate(0,-14);}c.scale(f.face||1,1);c.globalAlpha=f.dodge>0?.4:f.hurt>0?.65:1;
 leoCircle(c,0,18,30,'#07111a55');
 // A broad cloak, massive boots and layered shoulder plates establish his weight.
 leoPoly(c,[[-25,-23],[-38,29],[-12,24],[0,33],[29,25],[35,-17]],e==='corruption'?'#26152e':'#702c3a','#d7ae68');
 c.fillStyle='#222a36';c.fillRect(-23,7,18,25);c.fillRect(7,7,18,25);c.fillStyle=e==='earth'?'#8c7961':'#8c98a4';c.fillRect(-24,22,21,10);c.fillRect(6,22,21,10);
 leoPoly(c,[[-25,-26],[25,-26],[21,10],[0,21],[-22,9]],e==='corruption'?'#34283e':e==='earth'?'#776956':'#708090','#e5c16e');
 leoPoly(c,[[-25,-30],[-40,-23],[-37,-8],[-22,-12],[-13,-26]],col,'#fff0bf');leoPoly(c,[[19,-30],[37,-23],[39,-9],[23,-11],[12,-26]],col,'#fff0bf');
 for(const side of [-1,1]){c.strokeStyle='#d8b86f';c.lineWidth=3;c.beginPath();c.moveTo(side*18,-18);c.lineTo(side*13,7);c.lineTo(0,14);c.stroke();}
 leoPoly(c,[[0,-20],[-7,-10],[0,0],[7,-10]],col,'#fff0d1');c.fillStyle='#ceab60';c.fillRect(-22,7,44,5);
 // The mane is an animated elemental crown, with a different silhouette in every form.
 const mane=e==='corruption'?'#452255':e==='ice'?'#76bedb':e==='earth'?'#6e5946':e==='flames'?'#b84327':e==='thunder'?'#b99536':'#8d512a';
 c.shadowColor=col;c.shadowBlur=e==='base'?0:10;
 for(let n=0;n<14;n++){const a=n*Math.PI/7,rx=Math.cos(a),ry=Math.sin(a),pulse=Math.sin(t*5+n*1.7),outer=e==='flames'?39+pulse*7:e==='thunder'?43+(n%2)*7:e==='ice'?43:e==='earth'?40:e==='corruption'?44+pulse*6:35;
 const p1=[rx*23,-42+ry*23],tip=[rx*outer,-42+ry*outer],p2=[Math.cos(a+.4)*25,-42+Math.sin(a+.4)*25];leoPoly(c,[p1,tip,p2],mane,e==='base'?'#c18344':col);
 if(e==='flames')leoPoly(c,[[rx*28,-42+ry*28],[rx*(outer-3),-42+ry*(outer-3)],[Math.cos(a+.18)*31,-42+Math.sin(a+.18)*31]],'#ffcf58');
 if(e==='ice')leoPoly(c,[[rx*28,-42+ry*28],tip,[Math.cos(a+.2)*32,-42+Math.sin(a+.2)*32]],'#e6ffff');
 if(e==='thunder'){c.strokeStyle='#fff9c0';c.lineWidth=2;c.beginPath();c.moveTo(rx*24,-42+ry*24);c.lineTo(rx*34+4,-42+ry*34);c.lineTo(rx*40-3,-42+ry*40);c.lineTo(rx*49,-42+ry*49);c.stroke();}
 }
 c.shadowBlur=0;
 leoCircle(c,-15,-58,7,'#d8aa62','#332c2b');leoCircle(c,15,-58,7,'#d8aa62','#332c2b');
 leoPoly(c,[[-19,-53],[-10,-63],[10,-63],[20,-53],[17,-32],[9,-23],[-10,-24],[-19,-34]],e==='corruption'?'#ad96b6':'#e8b66a','#573a32');
 c.fillStyle='#382c2c';c.fillRect(-13,-47,9,4);c.fillRect(5,-47,9,4);c.fillStyle=e==='base'?'#fff1b8':col;c.fillRect(-11,-46,5,2);c.fillRect(7,-46,5,2);
 leoPoly(c,[[-12,-37],[0,-40],[13,-36],[10,-28],[-9,-28]],'#f6d8a0');leoPoly(c,[[-4,-37],[5,-37],[0,-32]],'#3b2930');c.strokeStyle='#452b2c';c.lineWidth=2;c.beginPath();c.moveTo(-8,-30);c.lineTo(9,-30);c.stroke();leoPoly(c,[[-9,-31],[-6,-25],[-3,-31]],'#fff8e6');leoPoly(c,[[4,-31],[8,-25],[10,-31]],'#fff8e6');
 // An enormous crystal-bound greatsword, gripped with both hands.
 c.strokeStyle='#9d794e';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(22,-15);c.lineTo(37,12);c.moveTo(-18,-12);c.lineTo(8,20);c.lineTo(36,27);c.stroke();
 c.save();c.translate(37,-2);const wind=casting?Math.min(1,f.cast/leoWindup(f,slot)):0;c.rotate(casting?-.8+wind*.2:f.anim>0?.8:-.14);
 c.fillStyle='#3d2a32';c.fillRect(-2,-4,9,38);c.strokeStyle='#d3aa61';c.lineWidth=2;for(let n=0;n<4;n++){c.beginPath();c.moveTo(-2,n*7+3);c.lineTo(7,n*7+8);c.stroke();}
 c.fillStyle='#e8ba76';c.fillRect(-7,9,19,8);c.fillRect(-7,24,19,8);leoPoly(c,[[-20,-13],[-16,-5],[22,-5],[27,-14],[18,-20],[3,-13],[-12,-20]],'#d2ab5d','#fff0bb');
 leoPoly(c,[[-12,-19],[-15,-83],[3,-112],[22,-83],[19,-19]],e==='base'?'#d1d9df':e==='earth'?'#8c806b':e==='corruption'?'#583564':col,'#f9e4a8');
 leoPoly(c,[[3,-105],[-5,-80],[-3,-22],[5,-22],[11,-80]],e==='corruption'?'#d79aff':'#f5f8e9');leoPoly(c,[[3,-24],[-5,-15],[3,-5],[11,-15]],e==='base'?'#ffe6a0':col,'#fff6dc');
 if(e==='corruption'){c.strokeStyle='#ef9eff';c.beginPath();c.moveTo(3,-100);c.lineTo(-5,-75);c.lineTo(9,-58);c.lineTo(-4,-38);c.stroke();}
 c.restore();c.restore();}
function leoBotSlot(f,b,visible,d){if(f.leoRecovery>0)return -1;const moves=leoMoves(f),e=leoElement(f);if(visible&&d<moves[1][3]+10&&f.cd[1]<=0)return 1;if(visible&&f.cd[2]<=0&&d<(e==='base'?250:moves[2][3])&&(e!=='corruption'||f.hp<f.maxHp*.85))return 2;return f.cd[0]<=0?0:-1;}
