'use strict';
const DRAGON_FORMS=['Ägg','Drakunge','Ung drake','Vuxen drake','Elder Dragon'];
const DRAGON_HP=[85,100,120,150,185],DRAGON_SPEED=[160,200,220,235,245];
const DRAGON_DAMAGE_SCALE=[.8,.9,1,1.15,1.25];
function canRejuvenate(f){return f.id===2&&hasCard(f,'no_wait')&&hasCard(f,'studied')&&f.cards.indexOf('no_wait')<f.cards.indexOf('studied')}
function rejuvenate(f){if(!canRejuvenate(f)||dragonAge(f)<=0)return false;const owner=fighters.indexOf(f);if(owner<0)return false;const before=f.maxHp;f.ageStart=(f.ageStart||roundNumber)+1;f.maxHp=heroMaxHP(f.id,f.cards,f.jacketGiven,f.stage,f.ageStart);f.hp=Math.min(f.maxHp,f.hp+Math.max(0,f.maxHp-before));f.dodgeCd=12;f.guard=f.reflect=0;spark(f.x,f.y,'#9ff5cb',28);tone(720);return true}
function dragonAge(f,round=roundNumber){return hasCard(f,'no_wait')?Math.max(0,round-(f.ageStart||round)):0}
function dragonAgeDamage(f){return Math.max(.25,1-.25*dragonAge(f))}
function dragonStage(f){if(hasCard(f,'no_wait'))return 5;return Math.max(1,Math.min(5,f?.stage||1))}
function baseDragonMoves(f){const s=dragonStage(f);if(s===1)return [['Tackle','eggdash',12,150,2.8,'Roll forward and tackle an enemy.']];const scale=[0,1,1.15,1.4,1.75][s-1];let moves=[['Fire Ball','shot',Math.round(15*scale),440+(s-2)*30,1.5,'A fireball that burns enemies.'],['Flamethrower','breath',Math.round(4*scale),180+(s-2)*25,6,'Breathe fire in front of you for one second.']];if(hasCard(f,'studied'))moves=[['Magic Missile','missile',Math.round(10*scale),500,1.6,'Weakly homing magic with a 0.1 s stun.'],['Gravity Well','gravity',Math.round(8*scale),420,7,'After 0.6 s, pull enemies toward a magical center.']];if(hasCard(f,'toothless'))moves[1]=hasCard(f,'studied')?['Magic Bomb','magicbomb',Math.round(12*scale),520,8,'Fire a magic bomb: area damage and a 0.8 s stun.']:['Plasma Bomb','plasmabomb',Math.round(26*scale),520,7.5,'Fire a plasma ball that explodes in a 110-unit radius.'];if(s>=3&&hasCard(f,'lizard')&&hasCard(f,'studied'))moves.push(['Time Stop','timestop',0,500,24,'After 0.6 s, stun enemies in the area for 3 s. On hit, other cooldowns recover 4x faster for 3 s.']);else if(s>=3&&hasCard(f,'lizard'))moves.push(['Inferno','inferno',65,1000,20,'A powerful fire beam after a 1 s charge. Walls block it.']);else if(s>=3)moves.push(['Fly','dragonfly',0,560+(s-3)*40,10,'Fly over obstacles for 2 s. Deals no damage. You can still be hit.']);return moves}
function magicCooldownScale(f){return f.id===2&&hasCard(f,'studied')?hasCard(f,'no_wait')?.8:Math.max(.25,1-.05*Math.max(0,roundNumber-1)):1}
function dragonMoves(f){return baseDragonMoves(f).map(m=>{let move=[...m];if(hasCard(f,'toothless')&&!hasCard(f,'studied')){if(m[1]==='shot')move=['Plasma Bolt','plasmabolt',m[2],m[3],m[4],'Fire a blue-white plasma bolt. No burn damage.'];else if(m[1]==='inferno')move=['Plasma Beam',m[1],m[2],m[3],m[4],'Charge for 1 s, then fire a powerful plasma beam. Walls block it.'];else if(m[1]==='dragonfly')move=['Plasma Flight',m[1],m[2],m[3],m[4],'Fly over obstacles with a plasma trail for 2 s. Deals no damage.'];else if(m[1]==='eggdash')move=['Plasma Tackle',m[1],m[2],m[3],m[4],'A plasma-powered tackle.']}move[2]=Number((move[2]*DRAGON_DAMAGE_SCALE[dragonStage(f)-1]).toFixed(4));move[4]=Number((move[4]*magicCooldownScale(f)).toFixed(4));return move})}
function hydraHeads(f){return f.id===2&&hasCard(f,'hydra')?Math.max(1,roundNumber-(f.headsLost||0)):1}
function toothlessSpeedScale(f){return hasCard(f,'toothless')?1.5*(1+.05*(hasCard(f,'no_wait')?Math.max(4,roundNumber-1):Math.max(0,roundNumber-1))):1}
function dragonFlightSpeed(f){return (280+(dragonStage(f)-3)*20)*(hasCard(f,'no_wait')?Math.max(120,245-25*dragonAge(f))/245:1)*toothlessSpeedScale(f)*(hasCard(f,'hydra')?.8:1)}
function flying(f){return f?.id===2&&f.fly>0||f?.id===3&&magicFlight(f)}
function landDragon(f){if(f.id!==2)return;if(!free(f.x,f.y)){f.x=f.groundX;f.y=f.groundY}f.fly=0}
function drawWizardHat(c,x,y,clock=false){
 c.save();c.translate(x,y);
 path(c,[[-25,0],[-17,-8],[-8,-48],[4,-60],[11,-43],[19,-7],[27,0]],'#5a3c94');
 path(c,[[-8,-48],[4,-60],[11,-43],[5,-47]],'#9473cb');
 c.fillStyle='#d6ad62';c.fillRect(-18,-10,37,7);
 c.fillStyle='#493273';c.beginPath();c.ellipse(0,0,30,7,0,0,Math.PI*2);c.fill();
 if(clock){disc(0,-23,9,'#efd58b');c.strokeStyle='#5b397a';c.lineWidth=2;c.beginPath();c.moveTo(0,-30);c.lineTo(0,-23);c.lineTo(5,-20);c.stroke()}else{path(c,[[-1,-33],[1,-27],[7,-25],[1,-23],[-1,-17],[-3,-23],[-9,-25],[-3,-27]],'#ffdf91')}
 c.restore();
}
function drawDragon(c,f,time){
 const s=dragonStage(f),lizard=hasCard(f,'lizard'),wizard=hasCard(f,'studied'),combo=lizard&&wizard;
 const tooth=hasCard(f,'toothless');const body=tooth?'#283742':lizard?(s===5?'#688b55':'#829d5b'):(s===5?'#8f509c':'#c67747'),head=tooth?'#3b4c56':lizard?'#a5b96e':(s===5?'#b873bb':'#e39b5d');
 c.save();c.translate(f.x,f.y);c.scale(2,2);disc(0,3,22+s*3,'#0005');c.scale(f.face||1,1);
 if(s===1){
  c.rotate(Math.sin(time*9)*(Math.abs(f.vx||0)>1?.35:.04));c.fillStyle=lizard?'#d5dfb4':'#f0e2b9';c.beginPath();c.ellipse(0,-23,24,33,0,0,Math.PI*2);c.fill();c.strokeStyle='#b78b62';c.lineWidth=3;c.stroke();path(c,[[-12,-45],[-3,-34],[-9,-24],[4,-16]],'#c18066');disc(9,-35,5,'#bca4e8');disc(-9,-12,7,'#bca4e8');if(wizard)drawWizardHat(c,0,-53,combo);
 }else{
  const scale=.65+(s-2)*.16;c.scale(scale*(tooth?.85:1),scale);if(flying(f)){c.translate(0,-20);if(tooth&&!wizard){for(let j=0;j<3;j++)disc(-38-j*17,-15+Math.sin(time*15+j)*5,10-j*2,j===0?'#e6faff':'#7cd5ff')}}
  if(wizard){disc(0,-31,43,null,'#b4a1ff');for(let j=0;j<3;j++){const a=time*1.3+j*Math.PI*2/3;disc(Math.cos(a)*46,-31+Math.sin(a)*31,2.5,'#e2d2ff')}}
  const flap=Math.sin(time*(flying(f)?15:4))*12;
  c.strokeStyle=body;c.lineWidth=lizard?16:12;c.lineCap='round';c.beginPath();c.moveTo(-18,-23);c.quadraticCurveTo(-50,lizard?16:7,lizard?-80:-70,-23);c.stroke();
  if(!lizard){path(c,[[-15,-40],[-65,-86-flap],[-47,-28],[-12,-12]],tooth?'#536d83':'#a568bd');path(c,[[8,-43],[61,-91+flap],[49,-26],[12,-12]],tooth?'#6b8a9b':'#c081d1')}
  else{for(let j=0;j<4;j++)path(c,[[-18-j*14,-30+j*2],[-27-j*14,-44+j*3],[-30-j*14,-25+j*2]],'#e2ba6c')}
  disc(0,-28,29,body);
  if(lizard){c.strokeStyle='#eac377';c.lineWidth=3;for(let j=0;j<3;j++){c.beginPath();c.moveTo(-13+j*11,-45);c.lineTo(-7+j*9,-34);c.lineTo(-12+j*10,-23);c.stroke()}}
  if(wizard){path(c,[[-20,-49],[-7,-40],[7,-40],[21,-49],[25,-5],[-25,-5]],'#5b438e');c.strokeStyle='#e3be76';c.lineWidth=3;c.beginPath();c.moveTo(0,-40);c.lineTo(0,-6);c.stroke();path(c,[[-3,-27],[0,-34],[3,-27],[10,-24],[3,-21],[0,-14],[-3,-21],[-10,-24]],'#d5b6fc')}
  path(c,[[-10,-48],[-11,-82],[21,-86],[39,-67],[25,-51]],head);
  path(c,[[-9,-78],[-19,-101],[2,-85],[16,-89],[22,-107],[29,-82]],'#f1d5a0');
  disc(18,-72,4,tooth?'#a6f875':wizard?'#c9b8ff':'#fff3a5');disc(20,-72,2,'#2e203d');
  c.fillStyle='#eacb85';c.fillRect(-17,-7,11,13);c.fillRect(10,-7,11,13);
  if(hasCard(f,'hydra')){const heads=hydraHeads(f);for(let j=1;j<Math.min(heads,12);j++){const side=j%2?1:-1,row=Math.ceil(j/2),x=side*(25+row*11),y=-57-row*13;c.strokeStyle=body;c.lineWidth=13;c.beginPath();c.moveTo(side*13,-28);c.quadraticCurveTo(x,-28,x,y);c.stroke();disc(x,y,12,head);path(c,[[x-8,y-8],[x-10,y-24],[x+1,y-12],[x+7,y-24],[x+10,y-7]],'#dfd3a1');disc(x+5,y-2,3,tooth?'#a6f875':'#fff3a5');if(wizard){c.save();c.translate(x,y-11);c.scale(.55,.55);drawWizardHat(c,0,0,combo);c.restore()}}if(heads>12){c.fillStyle='#eff8cd';c.font='bold 14px monospace';c.fillText('×'+heads,-20,-135)}}if(wizard)drawWizardHat(c,3,-90,combo);if(hasCard(f,'no_wait')){c.strokeStyle='#e1e0ce';c.lineWidth=3+dragonAge(f);c.beginPath();c.moveTo(27,-61);c.quadraticCurveTo(33,-48,24,-38-dragonAge(f)*2);c.moveTo(14,-60);c.quadraticCurveTo(12,-45,19,-38);c.stroke();c.strokeStyle='#a6a59b';c.lineWidth=2;for(let j=0;j<Math.min(4,dragonAge(f)+1);j++){c.beginPath();c.moveTo(5+j*5,-78);c.lineTo(9+j*5,-75);c.stroke()}}
  if(f.breath>0)path(c,[[36,-66],[68,-82],[58,-63],[83,-56],[57,-48]],'#ffd171');
 }
 c.restore();
}

function throwDragonBomb(i,kind,damage,range){const f=fighters[i],reach=Math.max(80,Math.min(range,distance(f,f.target)));projectile(i,kind,damage,reach,380,10)}
function detonateDragonBomb(s){zone(s.owner,s.x,s.y,110,s.damage,.12,s.kind,.35);spark(s.x,s.y,s.kind==='magicbomb'?'#c6a2ff':'#9bdfff',18)}
function updateDragonBomb(s,dt){const steps=Math.max(1,Math.ceil(Math.hypot(s.vx*dt,s.vy*dt)/6));for(let j=0;j<steps;j++){const x=s.x+s.vx*dt/steps,y=s.y+s.vy*dt/steps;if(!free(x,y,s.r)){detonateDragonBomb(s);return false}s.x=x;s.y=y;const target=combatEnemies(s.owner,s).find(t=>distance(s,t)<R+s.r&&t.dodge<=0&&sight(s,t));if(target){if(target.reflect>0&&defenseFaces(target,s)&&(s.reflections||0)<1){s.reflections=1;const source=fighters[s.owner];s.owner=fighterIndex(target);const n=norm(source.x-target.x,source.y-target.y);s.vx=n.x*380;s.vy=n.y*380;s.x=target.x+n.x*(R+s.r+5);s.y=target.y+n.y*(R+s.r+5);s.life=Math.max(s.life,.8);return true}detonateDragonBomb(s);return false}if(doorTargets(s.owner).some(t=>distance(s,t)<s.r+(t.family?20:13*(t.size||1)))){detonateDragonBomb(s);return false}}s.life-=dt;if(s.life<=0){detonateDragonBomb(s);return false}return true}

function hydraReviveFraction(){return Math.min(1,.25+.01*Math.max(0,roundNumber-1))}
function reviveHydra(f){if(f.id!==2||!hasCard(f,'hydra')||f.hp>0||hydraHeads(f)<=1)return false;f.headsLost=(f.headsLost||0)+1;f.hp=f.maxHp*hydraReviveFraction();const i=fighters.indexOf(f);if(f.grabbedBy>=0){const a=fighters[f.grabbedBy];a.grab=0;a.grabVictim=-1}if(f.grabVictim>=0){fighters[f.grabVictim].grabbedBy=-1;fighters[f.grabVictim].bagged=0}for(const boat of boats)if(boat.passenger===i)releaseBoat(boat);landDragon(f);f.stun=f.burn=f.pose=f.cast=f.rush=f.breath=f.grab=f.bagged=f.guard=f.reflect=0;f.grabbedBy=f.grabVictim=f.pending=-1;f.clapPending=false;f.dodge=.3;f.dx=f.dy=0;spark(f.x,f.y,'#9fe4ae',30);tone(620);return true}
