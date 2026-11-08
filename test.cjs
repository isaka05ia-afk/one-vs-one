const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['fighters.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);
const run=code=>vm.runInContext(code,sandbox);
function setup(id=0,enemy=4){run(`selected=${id};$('mode').value='local';$('opponent').value='${enemy}';start();fighters[0].x=100;fighters[0].y=350;fighters[1].x=300;fighters[1].y=350;`)}
function step(s){for(let t=0;t<s;t+=.01)run('update(.01)')}
setup();run("keys.add('w');keys.add('d')");step(.2);assert(run('fighters[0].x>100&&fighters[0].y<350'));assert(Math.abs(run('distance(fighters[0],{x:100,y:350})')-39)<1);
setup();run('fighters[0].x=400;fighters[0].y=280;move(fighters[0],250,0)');assert(run('fighters[0].x<430'));assert(run('free(fighters[0].x,fighters[0].y)'));
setup(2);run('fighters[0].x=400;fighters[0].y=280;fighters[1].x=600;fighters[1].y=280;attack(0,0)');step(1);assert.equal(run('fighters[1].hp'),110);assert.equal(run('shots.length'),0);
setup(2);run('fighters[0].aim=-Math.PI/2;attack(0,0)');step(.5);assert.equal(run('fighters[1].hp'),110);
setup(2);run('attack(0,0)');step(.6);assert(run('fighters[1].hp<110'));assert(run('fighters[1].burn>0'));
setup(1);run('attack(0,1)');step(.5);assert(run('fighters[1].stun>0'));step(1);assert.equal(run('fighters[1].stun'),0);
setup();run("keys.add('d');dodge(0);hit(fighters[1],fighters[0],50)");assert.equal(run('fighters[0].hp'),150);step(.15);assert(run('fighters[0].x>180'));assert(run('fighters[0].dodgeCd>0'));
setup(1);run('fighters[0].x=400;fighters[0].y=280;attack(0,0)');step(.5);assert(run('fighters[0].x<430'));
setup(4);run('attack(0,1);hit(fighters[1],fighters[0],20)');assert.equal(run('fighters[0].hp'),103);
setup(3);run('fighters[1].x=220;attack(0,0)');step(.5);assert.equal(run('fighters[1].hp'),110);step(.4);assert.equal(run('fighters[1].hp'),78);
setup(4);run('mouseAim=true;aimPoint={x:300,y:350};attack(0,2)');assert.equal(run('fighters[1].hp'),110);run('fighters[1].y=500');step(1);assert.equal(run('fighters[1].hp'),110);
setup();run("$('mode').value='ai';$('opponent').value='1';start()");assert.equal(run('fighters[1].id'),4);step(8);assert(run('fighters.every(f=>free(f.x,f.y)&&Number.isFinite(f.hp))'));
for(let i=0;i<6;i++)for(let j=0;j<3;j++){setup(i);run(`attack(0,${j})`);step(2);run('render()');assert(run('fighters.every(f=>Number.isFinite(f.hp)&&f.hp>=0&&f.hp<=f.maxHp&&free(f.x,f.y))'))}
setup();run("attack(0,0);paused=true");const cd=run('fighters[0].cd[0]'),x=run('fighters[0].x');step(.4);assert.equal(run('fighters[0].cd[0]'),cd);assert.equal(run('fighters[0].x'),x);
console.log('PASS: 18 abilities, 2D movement, normalized diagonals, cover collision, blocked shots, aiming/misses, burn, lock, dodge immunity, dash collision, shields, pose delay, blast escape, bot identity/navigation, pause and rendering.');
const originalRandom=Math.random;run('Math.random=()=>.75');
const observations=[];
for(const key of ['easy','normal','hard','expert']){
 setup();run(`$('mode').value='ai';$('difficulty').value='${key}';start()`);
 assert.equal(run('chosenDifficulty'),key);assert.equal(run('fighters[1].maxHp'),110);assert.equal(run('fighters[1].cd[0]'),0);
 run('fighters[1].aiThink=0;fighters[1].aiAction=100;bot(fighters[1],fighters[0],.01)');
 const reaction=run('fighters[1].aiThink');assert.equal(reaction,run('difficulty().reaction'));
 const aim=run('fighters[1].botAim');run('fighters[0].y+=100;bot(fighters[1],fighters[0],.01)');assert.equal(run('fighters[1].botAim'),aim);
 observations.push({reaction,error:run('difficulty().spread'),avoid:run('difficulty().avoid')});
 run("$('difficulty').value='easy'");assert.equal(run('chosenDifficulty'),key);run('spawnRound()');assert.equal(run('chosenDifficulty'),key);
}
for(let i=1;i<4;i++){assert(observations[i].reaction<observations[i-1].reaction);assert(observations[i].error<observations[i-1].error);assert(observations[i].avoid>observations[i-1].avoid)}
run("$('mode').value='local';syncOpponent()");assert.equal(nodes.difficulty.disabled,true);
run("$('mode').value='ai';syncOpponent()");assert.equal(nodes.difficulty.disabled,false);
Math.random=originalRandom;
console.log('PASS: all four difficulty selections, default fallback, round persistence, reaction delay, increasing precision/avoidance, equal HP/cooldowns and local-mode disabling.');
setup(0);run('fighters[1].x=180;attack(0,0)');assert.equal(run('fighters[1].hp'),87);assert.equal(run('shots.length'),0);assert(run('fighters[1].x>180'));
setup(0);run('fighters[1].x=300;attack(0,0)');assert.equal(run('fighters[1].hp'),110);assert.equal(run('shots.length'),0);
setup(0);run('attack(0,1)');assert.equal(run('fighters[1].hp'),110);assert.equal(run('beams.length'),0);step(.41);assert.equal(run('fighters[1].hp'),84);assert.equal(run('beams.length'),1);assert.equal(run('shots.length'),0);step(.4);assert.equal(run('fighters[1].hp'),84);assert.equal(run('beams.length'),0);
setup(0);run('fighters[1].y=410;attack(0,1)');assert.equal(run('fighters[1].hp'),110);
setup(0);run('fighters[0].x=400;fighters[0].y=280;fighters[1].x=600;fighters[1].y=280;attack(0,1)');step(.41);assert.equal(run('fighters[1].hp'),110);assert(run('beams[0].ex<=450'));
setup(0);run('fighters[1].x=170;attack(0,2)');assert.equal(run('fighters[1].grabbedBy'),0);assert.equal(run('fighters[1].hp'),110);run("keys.add('arrowright');dodge(1);attack(1,0)");assert.equal(run('fighters[1].dodge'),0);assert.equal(run('fighters[1].cd[0]'),0);step(.2);assert.equal(run('fighters[1].hp'),110);assert(run('fighters[1].x<170'));step(.4);assert.equal(run('fighters[1].grabbedBy'),-1);assert.equal(run('fighters[1].hp'),88);assert(run('fighters[1].x>200'));
setup(0);run('fighters[1].x=170;fighters[1].dodge=.2;attack(0,2)');assert.equal(run('fighters[1].grabbedBy'),-1);
setup(0);run('fighters[1].x=170;attack(0,2);fighters[0].stun=.4');step(.1);assert.equal(run('fighters[1].grabbedBy'),-1);assert.equal(run('fighters[1].hp'),110);
console.log('PASS: JIMY punch melee/range/knockback; beam damage once, aim miss and wall stop; grab hold/action lock/release damage; dodge escape and stun interruption.');
setup(2);run("rememberPointer({pointerType:'touch'});mouseAim=true;aimPoint={x:100,y:600};fighters[0].aim=-Math.PI/2;attack(0,0)");assert.equal(run('fighters[0].lockedAim'),0);step(.6);assert(run('fighters[1].hp<110'));
setup(2);run("inputMode='touch';touchAim.active=true;touchAim.x=0;touchAim.y=-1;attack(0,0)");assert.equal(run('fighters[0].lockedAim'),-Math.PI/2);step(.6);assert.equal(run('fighters[1].hp'),110);run('touchAim.active=false;updatePlayerAim()');assert.equal(run('fighters[0].aim'),0);
setup(4);run("inputMode='touch';fighters[1].x=260;fighters[1].y=410;attack(0,2)");assert(Math.abs(run('zones[0].x')-260)<.001);assert(Math.abs(run('zones[0].y')-410)<.001);
setup(2);run("rememberPointer({pointerType:'mouse'});mouseAim=true;aimPoint={x:100,y:100};attack(0,0)");assert.equal(run('fighters[0].lockedAim'),-Math.PI/2);step(.5);assert.equal(run('fighters[1].hp'),110);
setup(2);run("inputMode='touch';attack(0,0);fighters[1].y=500");const shotY=run('shots[0].vy');step(.3);assert.equal(shotY,0);assert.equal(run('shots[0].vy'),0);run("inputMode='mouse'");
console.log('PASS: mobile tap auto aim overrides stale mouse, manual stick priority, release restores auto aim, blast target distance, desktop manual aim and non-homing projectiles.');
setup(0);run('attack(0,1)');step(.3);assert.equal(run('fighters[1].hp'),110);assert.equal(run('beams.length'),0);run('fighters[1].y=420');step(.2);assert.equal(run('fighters[1].hp'),110);assert(run('beams.length')>0);
setup(0);run('attack(0,1);fighters[0].stun=.6');step(.5);assert.equal(run('fighters[0].cast'),0);assert.equal(run('beams.length'),0);assert.equal(run('fighters[1].hp'),110);
setup(0);run('fighters[1].hp=0;endRound()');assert.equal(run('wins[0]'),1);assert.equal(run('finished'),false);run('spawnRound();fighters[1].hp=0;endRound()');assert.equal(run('wins[0]'),2);assert.equal(run('finished'),false);run('spawnRound();fighters[1].hp=0;endRound()');assert.equal(run('wins[0]'),3);assert.equal(run('finished'),true);
setup(0);run('endRound()');assert.equal(run('wins[0]+wins[1]'),0);
console.log('PASS: Sax charge delay, sidestep and stun interruption; best of five continues after two wins, ends at three, and draws award no points.');
function placeDoor(x,y,i=0){run(`fighters[${i}].x=${x};fighters[${i}].y=${y};fighters[${i}].cd[2]=0;fighters[${i}].anim=0;attack(${i},2)`)}
setup(1);assert.equal(run('roster[1].moves[0][1]'),'dash');run('attack(0,0)');step(.35);assert.equal(run('fighters[1].hp'),86);assert.equal(run('shots.length'),0);
setup(1);placeDoor(100,350);assert.equal(run('portals.length'),1);assert.equal(run('fighters[1].hp'),110);step(.1);assert.equal(run('fighters[0].x'),100);placeDoor(800,350);assert.equal(run('portals.length'),2);step(.1);assert.equal(run('fighters[0].x'),800);
run('fighters[0].x=740');step(.01);run('fighters[0].x=800');step(.01);assert.equal(run('fighters[0].x'),100);step(1);assert.equal(run('fighters[0].x'),100);run('fighters[0].x=160');step(.01);run('fighters[0].x=100');step(.01);assert.equal(run('fighters[0].x'),800);
placeDoor(800,600);assert.equal(run('portals.length'),2);assert(run('portals.some(p=>p.slot===0&&p.y===600)'));assert(run('!portals.some(p=>p.x===100)'));placeDoor(810,600);assert.equal(run('portals.length'),2);assert.equal(run('fighters[0].cd[2]'),0);
setup(1);placeDoor(100,350);placeDoor(800,350);run('fighters[0].x=740');step(.01);run('fighters[0].x=800;fighters[0].stun=.5');step(.1);assert.equal(run('fighters[0].x'),800);step(.5);assert.equal(run('fighters[0].x'),100);
setup(1);placeDoor(100,350);placeDoor(800,350);run('fighters[0].x=740');step(.01);run('fighters[0].x=800;fighters[1].x=100');step(.1);assert.equal(run('fighters[0].x'),800);run('fighters[1].x=250');step(.01);assert.equal(run('fighters[0].x'),100);run('render();spawnRound()');assert.equal(run('portals.length'),0);
setup(1,1);placeDoor(100,350);placeDoor(800,350);placeDoor(100,600,1);placeDoor(800,600,1);assert.equal(run('portals.filter(p=>p.owner===0).length'),2);assert.equal(run('portals.filter(p=>p.owner===1).length'),2);
console.log('PASS: Running Man first attack and damage; two linked doors, walking teleport both directions, no bounce, oldest replacement, placement spacing, stun/blocked exit protection, round cleanup and separate owner pairs.');
setup(5);assert.equal(run('fighters[0].maxHp'),170);assert(run('roster[5].speed<roster[0].speed'));run('attack(0,0)');step(.15);assert.equal(run('shots.length'),0);step(.6);assert.equal(run('fighters[1].hp'),101);assert(run('fighters[1].x>400'));
setup(5);run('attack(0,1)');step(.2);assert.equal(run('fighters[1].hp'),110);step(.2);assert.equal(run('fighters[1].hp'),106);assert(run('fighters[1].x<200'));assert(run('fighters[1].controlImmune>0'));
setup(5);run('fighters[0].x=400;fighters[0].y=280;fighters[1].x=600;fighters[1].y=280;attack(0,1)');step(.5);assert.equal(run('fighters[1].hp'),110);assert.equal(run('fighters[1].x'),600);
setup(5);run('fighters[1].dodge=.8;attack(0,1)');step(.5);assert.equal(run('fighters[1].hp'),110);assert.equal(run('fighters[1].x'),300);
setup(5);run("inputMode='mouse';mouseAim=true;aimPoint={x:500,y:350};attack(0,2)");step(.3);assert.equal(run('boats.length'),0);step(.7);assert.equal(run('fighters[1].boatOwner'),0);assert.equal(run('fighters[1].hp'),102);run("keys.add('arrowdown');dodge(1);attack(1,0)");assert.equal(run('fighters[1].dodge'),0);assert.equal(run('fighters[1].cd[0]'),0);step(1.2);assert.equal(run('boats.length'),0);assert.equal(run('fighters[1].boatOwner'),-1);assert(run('fighters[1].x>480'));assert(run('fighters[1].controlImmune>0'));
setup(5);run("inputMode='touch';attack(0,2)");step(.5);assert.equal(run('boats[0].tx'),520);run("inputMode='mouse'");
setup(5);run('fighters[0].x=400;fighters[0].y=280;fighters[1].x=600;fighters[1].y=280;attack(0,2)');step(1);assert.equal(run('boats.length'),0);assert.equal(run('fighters[1].boatOwner'),-1);assert.equal(run('fighters[1].hp'),110);
setup(5);run('attack(0,2)');step(.6);run('fighters[1].y=480');step(1.5);assert.equal(run('fighters[1].boatOwner'),-1);assert.equal(run('fighters[1].hp'),110);
setup(5);run('attack(0,2)');step(.6);run('spawnRound()');assert.equal(run('boats.length'),0);assert.equal(run('controlFx.length'),0);assert(run('fighters.every(f=>f.boatOwner===-1)'));
console.log('PASS: Sailer health/speed, wide wave push and delay, wind pull and cover/dodge, boat windup/capture/action lock/transport/release, mobile destination, wall stop, sidestep and round cleanup.');
