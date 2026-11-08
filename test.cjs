const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);
const run=code=>vm.runInContext(code,sandbox);
function setup(id=0,enemy=4){run(`selected=${id};$('mode').value='local';$('opponent').value='${enemy}';start();fighters[0].x=100;fighters[0].y=350;fighters[1].x=300;fighters[1].y=350;`)}
function step(s){for(let t=0;t<s;t+=.01)run('update(.01)')}
setup();run("keys.add('w');keys.add('d')");step(.2);assert(run('fighters[0].x>100&&fighters[0].y<350'));assert(Math.abs(run('distance(fighters[0],{x:100,y:350})')-39)<1);
setup();run('fighters[0].x=400;fighters[0].y=280;move(fighters[0],250,0)');assert(run('fighters[0].x<430'));assert(run('free(fighters[0].x,fighters[0].y)'));
setup(2);run('fighters[0].x=400;fighters[0].y=280;fighters[1].x=600;fighters[1].y=280;attack(0,0)');step(1);assert.equal(run('fighters[1].hp'),140);assert.equal(run('shots.length'),0);
setup(2);run('fighters[0].aim=-Math.PI/2;attack(0,0)');step(.5);assert.equal(run('fighters[1].hp'),140);
setup(2);run('attack(0,0)');step(.6);assert(run('fighters[1].hp<140'));assert(run('fighters[1].burn>0'));
setup(1);run('attack(0,1)');step(.5);assert(run('fighters[1].stun>0'));step(1);assert.equal(run('fighters[1].stun'),0);
setup();run("keys.add('d');dodge(0);hit(fighters[1],fighters[0],50)");assert.equal(run('fighters[0].hp'),150);step(.15);assert(run('fighters[0].x>180'));assert(run('fighters[0].dodgeCd>0'));
setup(1);run('fighters[0].x=400;fighters[0].y=280;attack(0,0)');step(.5);assert(run('fighters[0].x<430'));
setup(4);run('attack(0,1);hit(fighters[1],fighters[0],20)');assert.equal(run('fighters[0].hp'),137);
setup(3);run('fighters[1].x=220;attack(0,0)');step(.5);assert.equal(run('fighters[1].hp'),140);step(.4);assert.equal(run('fighters[1].hp'),108);
setup(4);run('mouseAim=true;aimPoint={x:300,y:350};attack(0,2)');assert.equal(run('fighters[1].hp'),140);run('fighters[1].y=500');step(1);assert.equal(run('fighters[1].hp'),140);
setup();run("$('mode').value='ai';$('opponent').value='1';start()");assert(run('fighters[1].id>=0&&fighters[1].id<roster.length'));step(8);assert(run('fighters.every(f=>free(f.x,f.y)&&Number.isFinite(f.hp))'));
for(let i=0;i<6;i++)for(let j=0;j<3;j++){setup(i);run(`attack(0,${j})`);step(2);run('render()');assert(run('fighters.every(f=>Number.isFinite(f.hp)&&f.hp>=0&&f.hp<=f.maxHp&&free(f.x,f.y))'))}
setup();run("attack(0,0);paused=true");const cd=run('fighters[0].cd[0]'),x=run('fighters[0].x');step(.4);assert.equal(run('fighters[0].cd[0]'),cd);assert.equal(run('fighters[0].x'),x);
console.log('PASS: 18 abilities, 2D movement, normalized diagonals, cover collision, blocked shots, aiming/misses, burn, lock, dodge immunity, dash collision, shields, pose delay, blast escape, bot identity/navigation, pause and rendering.');
const originalRandom=Math.random;run('Math.random=()=>.75');
const observations=[];
for(const key of ['easy','normal','hard','expert']){
 setup();run(`$('mode').value='ai';$('difficulty').value='${key}';start()`);
 assert.equal(run('chosenDifficulty'),key);assert.equal(run('fighters[1].maxHp'),140);assert.equal(run('fighters[1].cd[0]'),0);
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
setup(0);run('fighters[1].x=180;attack(0,0)');assert.equal(run('fighters[1].hp'),117);assert.equal(run('shots.length'),0);assert(run('fighters[1].x>180'));
setup(0);run('fighters[1].x=300;attack(0,0)');assert.equal(run('fighters[1].hp'),140);assert.equal(run('shots.length'),0);
setup(0);run('attack(0,1)');assert.equal(run('fighters[1].hp'),140);assert.equal(run('beams.length'),0);step(.41);assert.equal(run('fighters[1].hp'),114);assert.equal(run('beams.length'),1);assert.equal(run('shots.length'),0);step(.4);assert.equal(run('fighters[1].hp'),114);assert.equal(run('beams.length'),0);
setup(0);run('fighters[1].y=410;attack(0,1)');assert.equal(run('fighters[1].hp'),140);
setup(0);run('fighters[0].x=400;fighters[0].y=280;fighters[1].x=600;fighters[1].y=280;attack(0,1)');step(.41);assert.equal(run('fighters[1].hp'),140);assert(run('beams[0].ex<=450'));
setup(0);run('fighters[1].x=170;attack(0,2)');assert.equal(run('fighters[1].grabbedBy'),0);assert.equal(run('fighters[1].hp'),140);run("keys.add('arrowright');dodge(1);attack(1,0)");assert.equal(run('fighters[1].dodge'),0);assert.equal(run('fighters[1].cd[0]'),0);step(.2);assert.equal(run('fighters[1].hp'),140);assert(run('fighters[1].x<170'));step(.4);assert.equal(run('fighters[1].grabbedBy'),-1);assert.equal(run('fighters[1].hp'),118);assert(run('fighters[1].x>200'));
setup(0);run('fighters[1].x=170;fighters[1].dodge=.2;attack(0,2)');assert.equal(run('fighters[1].grabbedBy'),-1);
setup(0);run('fighters[1].x=170;attack(0,2);fighters[0].stun=.4');step(.1);assert.equal(run('fighters[1].grabbedBy'),-1);assert.equal(run('fighters[1].hp'),140);
console.log('PASS: The Essy Kid punch melee/range/knockback; beam damage once, aim miss and wall stop; grab hold/action lock/release damage; dodge escape and stun interruption.');
setup(2);run("rememberPointer({pointerType:'touch'});mouseAim=true;aimPoint={x:100,y:600};fighters[0].aim=-Math.PI/2;attack(0,0)");assert.equal(run('fighters[0].lockedAim'),0);step(.6);assert(run('fighters[1].hp<140'));
setup(2);run("inputMode='touch';touchAim.active=true;touchAim.x=0;touchAim.y=-1;attack(0,0)");assert.equal(run('fighters[0].lockedAim'),-Math.PI/2);step(.6);assert.equal(run('fighters[1].hp'),140);run('touchAim.active=false;updatePlayerAim()');assert.equal(run('fighters[0].aim'),0);
setup(3);run("inputMode='touch';fighters[1].x=260;fighters[1].y=410;attack(0,1)");step(.81);assert(Math.abs(run('zones[0].x')-260)<.001);assert(Math.abs(run('zones[0].y')-410)<.001);
setup(2);run("rememberPointer({pointerType:'mouse'});mouseAim=true;aimPoint={x:100,y:100};attack(0,0)");assert.equal(run('fighters[0].lockedAim'),-Math.PI/2);step(.5);assert.equal(run('fighters[1].hp'),140);
setup(2);run("inputMode='touch';attack(0,0);fighters[1].y=500");const shotY=run('shots[0].vy');step(.3);assert.equal(shotY,0);assert.equal(run('shots[0].vy'),0);run("inputMode='mouse'");
console.log('PASS: mobile tap auto aim overrides stale mouse, manual stick priority, release restores auto aim, blast target distance, desktop manual aim and non-homing projectiles.');
setup(0);run('attack(0,1)');step(.3);assert.equal(run('fighters[1].hp'),140);assert.equal(run('beams.length'),0);run('fighters[1].y=420');step(.2);assert.equal(run('fighters[1].hp'),140);assert(run('beams.length')>0);
setup(0);run('attack(0,1);fighters[0].stun=.6');step(.5);assert.equal(run('fighters[0].cast'),0);assert.equal(run('beams.length'),0);assert.equal(run('fighters[1].hp'),140);
setup(0);run('fighters[1].hp=0;endRound()');assert.equal(run('wins[0]'),1);assert.equal(run('finished'),false);run('spawnRound();fighters[1].hp=0;endRound()');assert.equal(run('wins[0]'),2);assert.equal(run('finished'),false);run('spawnRound();fighters[1].hp=0;endRound()');assert.equal(run('wins[0]'),3);assert.equal(run('finished'),true);
setup(0);run('endRound()');assert.equal(run('wins[0]+wins[1]'),0);
console.log('PASS: Sax charge delay, sidestep and stun interruption; best of five continues after two wins, ends at three, and draws award no points.');
function placeDoor(x,y,i=0){run(`fighters[${i}].x=${x};fighters[${i}].y=${y};fighters[${i}].cd[2]=0;fighters[${i}].anim=0;attack(${i},2)`)}
setup(1);assert.equal(run('roster[1].moves[0][1]'),'dash');run('attack(0,0)');step(.35);assert.equal(run('fighters[1].hp'),116);assert.equal(run('shots.length'),0);
setup(1);placeDoor(100,350);assert.equal(run('portals.length'),1);assert.equal(run('fighters[1].hp'),140);step(.1);assert.equal(run('fighters[0].x'),100);placeDoor(800,350);assert.equal(run('portals.length'),2);step(.1);assert.equal(run('fighters[0].x'),800);
run('fighters[0].x=740');step(.01);run('fighters[0].x=800');step(.01);assert.equal(run('fighters[0].x'),100);step(1);assert.equal(run('fighters[0].x'),100);run('fighters[0].x=160');step(.01);run('fighters[0].x=100');step(.01);assert.equal(run('fighters[0].x'),800);
placeDoor(800,600);assert.equal(run('portals.length'),2);assert(run('portals.some(p=>p.slot===0&&p.y===600)'));assert(run('!portals.some(p=>p.x===100)'));placeDoor(810,600);assert.equal(run('portals.length'),2);assert.equal(run('fighters[0].cd[2]'),0);
setup(1);placeDoor(100,350);placeDoor(800,350);run('fighters[0].x=740');step(.01);run('fighters[0].x=800;fighters[0].stun=.5');step(.1);assert.equal(run('fighters[0].x'),800);step(.5);assert.equal(run('fighters[0].x'),100);
setup(1);placeDoor(100,350);placeDoor(800,350);run('fighters[0].x=740');step(.01);run('fighters[0].x=800;fighters[1].x=100');step(.1);assert.equal(run('fighters[0].x'),800);run('fighters[1].x=250');step(.01);assert.equal(run('fighters[0].x'),100);run('render();spawnRound()');assert.equal(run('portals.length'),0);
setup(1,1);placeDoor(100,350);placeDoor(800,350);placeDoor(100,600,1);placeDoor(800,600,1);assert.equal(run('portals.filter(p=>p.owner===0).length'),2);assert.equal(run('portals.filter(p=>p.owner===1).length'),2);
console.log('PASS: Running Man first attack and damage; two linked doors, walking teleport both directions, no bounce, oldest replacement, placement spacing, stun/blocked exit protection, round cleanup and separate owner pairs.');
setup(5);assert.equal(run('fighters[0].maxHp'),170);assert(run('roster[5].speed<roster[0].speed'));run('attack(0,0)');step(.15);assert.equal(run('shots.length'),0);step(.6);assert.equal(run('fighters[1].hp'),131);assert(run('fighters[1].x>400'));
setup(5);run('attack(0,1)');step(.2);assert.equal(run('fighters[1].hp'),140);step(.2);assert.equal(run('fighters[1].hp'),136);assert(run('fighters[1].x<200'));assert(run('fighters[1].controlImmune>0'));
setup(5);run('fighters[0].x=400;fighters[0].y=280;fighters[1].x=600;fighters[1].y=280;attack(0,1)');step(.5);assert.equal(run('fighters[1].hp'),140);assert.equal(run('fighters[1].x'),600);
setup(5);run('fighters[1].dodge=.8;attack(0,1)');step(.5);assert.equal(run('fighters[1].hp'),140);assert.equal(run('fighters[1].x'),300);
setup(5);run("inputMode='mouse';mouseAim=true;aimPoint={x:500,y:350};attack(0,2)");step(.3);assert.equal(run('boats.length'),0);step(.7);assert.equal(run('fighters[1].boatOwner'),0);assert.equal(run('fighters[1].hp'),132);run("keys.add('arrowdown');dodge(1);attack(1,0)");assert.equal(run('fighters[1].dodge'),0);assert.equal(run('fighters[1].cd[0]'),0);step(1.2);assert.equal(run('boats.length'),0);assert.equal(run('fighters[1].boatOwner'),-1);assert(run('fighters[1].x>480'));assert(run('fighters[1].controlImmune>0'));
setup(5);run("inputMode='touch';attack(0,2)");step(.5);assert.equal(run('boats[0].tx'),520);run("inputMode='mouse'");
setup(5);run('fighters[0].x=400;fighters[0].y=280;fighters[1].x=600;fighters[1].y=280;attack(0,2)');step(1);assert.equal(run('boats.length'),0);assert.equal(run('fighters[1].boatOwner'),-1);assert.equal(run('fighters[1].hp'),140);
setup(5);run('attack(0,2)');step(.6);run('fighters[1].y=480');step(1.5);assert.equal(run('fighters[1].boatOwner'),-1);assert.equal(run('fighters[1].hp'),140);
setup(5);run('attack(0,2)');step(.6);run('spawnRound()');assert.equal(run('boats.length'),0);assert.equal(run('controlFx.length'),0);assert(run('fighters.every(f=>f.boatOwner===-1)'));
console.log('PASS: Sailer health/speed, wide wave push and delay, wind pull and cover/dodge, boat windup/capture/action lock/transport/release, mobile destination, wall stop, sidestep and round cleanup.');
assert(run("roster.every(f=>f.name!=='MS AI')"));assert.equal(run('roster[4].name'),'AEGIS');
setup(4);run('attack(0,1);hit(fighters[1],fighters[0],20)');assert.equal(run('fighters[0].hp'),137);run('fighters[1].x=50;hit(fighters[1],fighters[0],20)');assert.equal(run('fighters[0].hp'),117);step(1.8);assert.equal(run('fighters[0].guard'),0);
setup(2,4);run('attack(1,2);attack(0,0)');step(.8);assert.equal(run('fighters[1].hp'),140);assert(run('fighters[0].hp<=90'));assert(run('shots.every(s=>(s.reflections||0)<=1)'));
setup(0,4);run('attack(1,2);attack(0,1)');step(.42);assert.equal(run('fighters[1].hp'),140);assert(Math.abs(run('fighters[0].hp')-134.4)<.001);
setup(0,4);run('fighters[1].x=160;attack(1,2);attack(0,0)');assert.equal(run('fighters[1].hp'),140);assert(Math.abs(run('fighters[0].hp')-136.2)<.001);
setup(4);run('attack(0,2);hit(fighters[1],fighters[0],20,{area:true})');assert.equal(run('fighters[0].hp'),120);
setup(4);run('attack(0,2);fighters[0].stun=.5');step(.1);assert.equal(run('fighters[0].reflect'),0);
setup(4);run('fighters[1].x=175;attack(0,0)');assert.equal(run('fighters[1].hp'),126);assert(run('fighters[1].x>175'));
const savedRandom=Math.random;
for(let id=0;id<6;id++){
 run(`Math.random=()=>${(id+.1)/6};$('mode').value='ai';start()`);assert.equal(run('fighters[1].id'),id);assert.equal(run('fighters[1].maxHp'),run(`roster[${id}].hp`));run('spawnRound()');assert.equal(run('fighters[1].id'),id);
 step(4);assert(run('fighters.every(f=>free(f.x,f.y)&&Number.isFinite(f.hp))'));
}
Math.random=savedRandom;
console.log('PASS: Ms AI removed; Aegis frontal blocking, rear vulnerability, guard expiry, projectile/beam/melee reflection, area counterplay, stun interruption and shield bash; all six bot fighters and match-level random persistence.');
function setupMap(map,id=0,format='series'){run(`$('map').value='${map}';$('format').value='${format}';selected=${id};$('mode').value='local';$('opponent').value='4';start()`)}
assert.equal(run('Object.keys(MAPS).length'),6);assert(run('W>1000&&H>700'));
for(const id of ['grove','harbor','frost','ember','dunes','factory']){setupMap(id);assert.equal(run('mapId'),id);assert(run('fighters.every(f=>free(f.x,f.y))'));run('render()');const reachable=run(`(()=>{const step=30,queue=[{x:135,y:550}],seen=new Set(['135,550']);for(let n=0;n<queue.length;n++){const f=queue[n];if(distance(f,{x:1465,y:550})<50)return true;for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){const q={x:f.x+dx,y:f.y+dy},k=q.x+','+q.y;if(!seen.has(k)&&free(q.x,q.y)){seen.add(k);queue.push(q)}}}return false})()`);assert(reachable,id+' has no walkable route')}
setupMap('harbor');run('fighters[0].x=600;fighters[0].y=350');assert.equal(run('terrainSpeed(fighters[0])'),.55);run('fighters[0].id=5');assert.equal(run('terrainSpeed(fighters[0])'),1);run('fighters[0].id=0;fighters[0].x=800;fighters[0].y=550');assert.equal(run('terrainSpeed(fighters[0])'),1);
setupMap('frost');run("fighters[0].x=600;fighters[0].y=600;keys.add('d')");step(.5);run('keys.clear()');const beforeSlide=run('fighters[0].x');step(.2);assert(run('fighters[0].x')>beforeSlide+5);
setupMap('grove');run('fighters[0].x=800;fighters[0].y=550;fighters[0].hp=100');step(1);assert.equal(run('fighters[0].hp'),100);step(1.5);assert(run('fighters[0].hp>100'));run('fighters[0].hp=fighters[0].maxHp');step(.5);assert.equal(run('fighters[0].hp'),150);
setupMap('ember');run('fighters[0].x=500;fighters[0].y=550;mapClock=3.2');assert.equal(run('lavaPhase()'),'warning');step(.3);assert.equal(run('fighters[0].hp'),150);run('mapClock=4.6');step(.5);assert(run('fighters[0].hp<146'));assert.equal(run('fighters[0].guard'),0);
setupMap('dunes');run('fighters[0].x=800;fighters[0].y=550;mapClock=0');assert.equal(run('sheltered(fighters[0])'),false);const windX=run('fighters[0].x');step(.2);assert(run('fighters[0].x')>windX);run('mapClock=8.1');assert(run('windVector().x<0'));
setupMap('factory');run('fighters[0].x=500;fighters[0].y=550');const beltY=run('fighters[0].y');step(.2);assert(run('fighters[0].y')>beltY+15);
setupMap('harbor',0,'quick');run('fighters[1].hp=0;endRound()');assert.equal(run('finished'),true);assert.equal(run('wins[0]'),1);step(3);assert.equal(run('finished'),true);
setupMap('grove',0,'quick');run('endRound()');assert.equal(run('finished'),true);assert.equal(run('wins[0]+wins[1]'),0);
setupMap('grove',0,'series');run('fighters[1].hp=0;endRound()');assert.equal(run('finished'),false);run('spawnRound()');assert.equal(run('mapId'),'grove');assert.equal(run('mapClock'),0);
setupMap('harbor');run("$('mode').value='ai';fighters[0].x=1400;fighters[0].y=900;updateCamera()");assert(run('camera.x>0&&camera.y>0'));const point=run('pointerPosition({clientX:500,clientY:350})');assert.equal(point.x,run('camera.x+500/camera.scale'));assert.equal(point.y,run('camera.y+350/camera.scale'));
console.log('PASS: six distinct maps, enlarged world, valid spawns and cross-map paths; water slow/Sailer immunity/bridges; ice momentum; healing; lava warning/damage; reversing wind; conveyors; quick win/draw end in one round; series/map persistence; camera aim coordinates.');
run("$('map').value='grove';$('format').value='series';inputMode='mouse'");
setup(1);run('attack(0,0)');assert.equal(run('fighters[0].cd[0]'),3.2);step(3.21);assert.equal(run('fighters[0].cd[0]'),0);
setup(5);run("mouseAim=true;aimPoint={x:500,y:350};attack(0,2)");step(1);assert.equal(run('fighters[1].boatOwner'),0);const bodyBefore=run('fighters[0].y'),boatBefore=run('boats[0].y');run("keys.add('s');attack(0,0);dodge(0)");assert.equal(run('fighters[0].cd[0]'),0);assert.equal(run('fighters[0].dodge'),0);step(.15);assert.equal(run('fighters[0].y'),bodyBefore);assert(run('boats[0].y')>boatBefore+5);assert.equal(run('fighters[1].y'),run('boats[0].y'));const turned=run('boats[0].aim');run('keys.clear()');step(.1);assert.equal(run('boats[0].aim'),turned);step(1);assert.equal(run('fighters[1].boatOwner'),-1);assert.equal(run('boats.length'),0);
setup(5);run("touchMove.y=1;attack(0,2)");step(.6);assert(run('boats[0].aim>0'));assert.equal(run('fighters[0].y'),350);run('touchMove.y=0');
setup(5);run('attack(0,2)');step(.5);run("$('mode').value='ai';boats[0].x=1200;boats[0].y=700;updateCamera()");assert(run('camera.x>0'));
setup(3);run("keys.add('d');attack(0,0)");step(.3);assert(run('fighters[0].pose>0'));assert(run('fighters[0].x>120&&fighters[0].x<135'));
setup(3);run("mouseAim=true;aimPoint={x:300,y:350};attack(0,1);aimPoint={x:140,y:500}");step(.81);assert(Math.abs(run('zones[0].x')-140)<.01);assert(Math.abs(run('zones[0].y')-500)<.01);
setup(3);run("inputMode='touch';fighters[1].x=220;attack(0,0);fighters[1].x=100;fighters[1].y=480");step(.81);assert.equal(run('fighters[1].hp'),108);
setup(3);run("keys.add('d');attack(0,0);fighters[0].stun=.5");step(.2);assert.equal(run('fighters[0].x'),100);assert.equal(run('fighters[0].pose'),0);run("inputMode='mouse'");
console.log('PASS: Running Man cooldown 3.2 s; keyboard/touch boat steering, passenger follows turns, owner action lock, heading retained and camera follows; Overpowerd pose movement, retargeted blast, mobile turning and real stun cancellation.');
assert.equal(run('roster[0].name'),'THE ESSY KID');
const randomBeforeMapTest=Math.random;
for(let i=0;i<6;i++){run(`Math.random=()=>${(i+.1)/6};$('map').value='random';$('mode').value='local';$('opponent').value='4';start()`);assert.equal(run('mapId'),run(`Object.keys(MAPS)[${i}]`));const kept=run('mapId');run('spawnRound()');assert.equal(run('mapId'),kept)}
Math.random=randomBeforeMapTest;run("$('map').value='grove';inputMode='mouse'");
setup(0);run('fighters[1].x=240;attack(0,2)');assert.equal(run('fighters[1].grabbedBy'),0);assert.equal(run('roster[0].moves[2][4]'),7.2);
setup(0);run('fighters[1].x=180;fighters[1].y=470;attack(0,2)');assert.equal(run('fighters[1].grabbedBy'),0);
setup(0);run('fighters[0].x=200;fighters[0].y=100;fighters[0].aim=Math.PI/2;fighters[1].x=200;fighters[1].y=230;attack(0,2)');assert.equal(run('fighters[1].grabbedBy'),-1);
console.log('PASS: The Essy Kid rename, larger and wider bag grab with unchanged cooldown, wall protection, all six random map outcomes and map persistence within rounds.');
