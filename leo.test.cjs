const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','game.js','adventure.js','adventure-harbor.js','adventure-olympians.js','adventure-time-rift.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);










run("$('mode').value='local';$('opponent').value='0';$('format').value='series';$('map').value='court';selected=7;start();fighters[0].x=600;fighters[0].y=500;fighters[1].x=700;fighters[1].y=500;fighters[0].lockedAim=0;fighters[1].dodge=0");
assert.equal(run('roster.length'),8);assert.equal(run('cardFamilies(7).length'),5);assert.equal(run("validLoadout(7,['leo_ice','leo_ice'])"),false);assert.equal(run("validLoadout(7,['leo_ice','leo_earth'])"),false);
for(const element of ['base','flames','thunder','earth','ice','corruption']){
 run(`fighters[0].cards=${element==='base'?'[]':JSON.stringify(['leo_'+element])};fighters[0].maxHp=leoMaxHP(fighters[0].cards);fighters[0].hp=100;fighters[1].hp=fighters[1].maxHp;fighters[1].guard=0;fighters[1].dodge=0;fighters[1].x=700;fighters[0].x=600`);
 const hp=run('fighters[1].hp');run('executeLeo(0,0);updateLeoShot(shots.at(-1),.15);drawFighter(contextDummy||ctx,fighters[0],0,false)'.replace('contextDummy||',''));
 assert(run('fighters[1].hp')<hp,element+' deals damage');
 if(element==='corruption')assert(run('fighters[0].hp')>100);
 if(element==='flames')assert(run('fighters[1].burn')>0);
 if(element==='thunder')assert(run('fighters[1].stun')>0);
 if(element==='ice')assert(run('fighters[1].magicSlow')>0);
 for(let slot=1;slot<3;slot++){run(`fighters[1].hp=fighters[1].maxHp;fighters[1].stun=0;executeLeo(0,${slot});render()`);}
}
run("fighters[0].cards=['leo_earth'];fighters[0].hp=200;applyDamage(fighters[0],40)");assert.equal(run('fighters[0].hp'),170);
run("loadouts[0]=['leo_ice']");assert.equal(run('offeredCards(7,loadouts[0]).length'),0);
run("start();fighters[0].hp=0;fighters[1].hp=fighters[1].maxHp;endRound()");assert.equal(run('wins[1]'),2);assert.equal(run('cardDraft.player'),0);assert.equal(run('cardDraft.options.length'),3);
run("chooseAbilityCard(0,cardDraft.options[0],cardDraft.id);spawnRound();fighters[1].hp=0;endRound();cardDraft=null;spawnRound();fighters[1].hp=0;endRound()");assert.equal(run('loadouts[0].length'),1);
run("battleSlots=[{fighter:7,team:0,bot:false},{fighter:0,team:0,bot:true},{fighter:1,team:1,bot:true},{fighter:3,team:1,bot:true}];battleMode='team2';loadouts=[[],[],[],[]];wins=[0,0,0,0];leoBenches={};cardDraft=null;spawnRound();recordLeoTeamLoss(1);spawnRound()");assert.equal(run('fighters[0].hp'),0);assert.equal(run('fighters[0].leoBenched'),true);run('recordLeoTeamLoss(0);spawnRound()');assert.equal(run('fighters[0].hp'),0);run('recordLeoTeamLoss(1);spawnRound()');assert(run('fighters[0].hp')>0);
console.log('Leo: six forms / 18 attacks, statuses, lifesteal, armor, single-card validation/draft, double loss points and team bench PASS');

for(const crystal of ['','leo_flames','leo_thunder','leo_earth','leo_ice','leo_corruption']){
 run(`$('mode').value='local';selected=7;$('opponent').value='0';start();loadouts[0]=${crystal?JSON.stringify([crystal]):'[]'};spawnRound();setArena('court');fighters[0].x=600;fighters[0].y=500;fighters[0].aim=fighters[0].lockedAim=0;fighters[1].x=700;fighters[1].y=500;attack(0,0)`);
 const before=run('fighters[1].hp');assert(run('fighters[0].cast')>0);run('update(.1)');assert.equal(run('fighters[1].hp'),before);for(let n=0;n<150;n++)run('update(.01)');assert(run('fighters[1].hp')<before);
 run('fighters.forEach(f=>f.aiControlled=true)');for(let n=0;n<200;n++)run('update(.02);render()');assert(run('fighters.every(f=>Number.isFinite(f.hp)&&Number.isFinite(f.x))'));
}
console.log('Leo: real attack windups, all six forms in bot simulation and rendering PASS');
function leoScenario(element='base'){
 run(`$('mode').value='local';selected=7;$('opponent').value='0';start();loadouts[0]=${JSON.stringify(element==='base'?[]:['leo_'+element])};spawnRound();setArena('court');walls=[];fighters[0].x=600;fighters[0].y=500;fighters[0].aim=fighters[0].lockedAim=0;fighters[0].hp=50;fighters[0].target={x:850,y:500};fighters[1].x=850;fighters[1].y=500;fighters[1].hp=fighters[1].maxHp;fighters[1].dodge=0;shots=[];zones=[]`);
}
leoScenario();run('fighters.push(JSON.parse(JSON.stringify(fighters[1])));fighters[2].x=1100;walls=[{x:700,y:300,w:80,h:400}];executeLeo(0,0);var piercer=shots[0]');assert.equal(run('fighters[1].hp'),150);run('updateLeoShot(piercer,.7)');assert.equal(run('fighters[1].hp'),114);assert.equal(run('fighters[2].hp'),114);run('piercer.vx=-piercer.vx;updateLeoShot(piercer,.7)');assert.equal(run('fighters[1].hp'),114);assert.equal(run('fighters[2].hp'),114);
leoScenario();run('fighters[1].x=700;fighters[1].dodge=1;executeLeo(0,0);updateLeoShot(shots[0],.4)');assert.equal(run('fighters[1].hp'),150);
leoScenario();run('executeLeo(0,1)');assert.equal(run('fighters[1].hp'),150);run('fighters[1].x=700;executeLeo(0,1)');assert.equal(run('fighters[1].hp'),92);
leoScenario('flames');run('executeLeo(0,2);var impact=zones.find(z=>z.kind==="leo_meteor");updateLeoZone(impact,.6)');assert.equal(run('fighters[1].hp'),150);run('updateLeoZone(impact,.3)');assert(run('fighters[1].hp')<150);assert(run('zones.some(z=>z.kind==="trail")'));
leoScenario('thunder');run('executeLeo(0,2);updateLeoZone(zones[0],.01)');assert.equal(run('fighters[0].x'),850);assert(run('fighters[1].stun')>=.55);
leoScenario('earth');run('executeLeo(0,2)');assert.equal(run('zones.filter(z=>z.kind==="leo_fault").length'),3);assert.equal(run('zones[0].x'),775);assert.equal(run('zones[2].x'),1125);
leoScenario('ice');run('executeLeo(0,2);var frost=zones.find(z=>z.kind==="leo_prison");updateLeoZone(frost,.7)');assert(run('fighters[1].magicSlow')>0);assert(run('terrainAt(fighters[1]).ice'));const firstPulse=run('fighters[1].hp');run('updateLeoZone(frost,.71)');assert(run('fighters[1].hp')<firstPulse);
leoScenario('corruption');run('executeLeo(0,2);var chain=zones[0];updateLeoZone(chain,.12)');assert(run('fighters[0].hp')>50);assert(run('fighters[1].x')<850);run('fighters[1].dodge=.1');assert.equal(run('updateLeoZone(chain,.01)'),false);
leoScenario('corruption');run('executeLeo(0,2);var blockedChain=zones[0];walls=[{x:700,y:300,w:60,h:400}]');assert.equal(run('updateLeoZone(blockedChain,.1)'),false);
leoScenario();run('fighters[1].x=700;executeLeo(0,2);updateLeoZone(zones[0],.01)');assert(run('fighters[1].x')>700);
console.log('Leo: travelling wall-piercing/multi-target/once-only wave, dodge, short melee, marked delayed meteor, teleport stun, three faults, persistent frost, breakable lifesteal chain and roar knockback PASS');

// Aim remains adjustable during Leo's windup; released attacks keep their final direction.
leoScenario();run("inputMode='mouse';mouseAim=true;aimPoint={x:850,y:500};attack(0,0);aimPoint={x:600,y:200};update(.1)");assert(Math.abs(run('fighters[0].lockedAim')+Math.PI/2)<.001);run('for(let n=0;n<70;n++)update(.01)');assert(run('shots[0].vy')<0);assert(Math.abs(run('shots[0].vx'))<.001);const shotDirection=run('shots[0].vy');run('aimPoint={x:1000,y:500};update(.1)');assert.equal(run('shots[0].vy'),shotDirection);
leoScenario('flames');run("inputMode='mouse';mouseAim=true;aimPoint={x:850,y:500};attack(0,2);aimPoint={x:600,y:300};update(.1)");assert.equal(run('fighters[0].target.x'),600);assert.equal(run('fighters[0].target.y'),300);run('for(let n=0;n<70;n++)update(.01)');assert.equal(run('zones.find(z=>z.kind==="leo_meteor").y'),300);
leoScenario();run("inputMode='touch';touchAim.active=true;touchAim.x=1;touchAim.y=0;attack(0,1);touchAim.x=0;touchAim.y=-1;update(.1)");assert(Math.abs(run('fighters[0].lockedAim')+Math.PI/2)<.001);
leoScenario();run("inputMode='touch';touchAim.active=false;attack(0,0);fighters[1].x=600;fighters[1].y=250;update(.1)");assert(Math.abs(run('fighters[0].lockedAim')+Math.PI/2)<.001);
console.log('Leo windup: mouse retargeting, ground-target distance, mobile manual/auto aim; launched crescent stays fixed PASS');
