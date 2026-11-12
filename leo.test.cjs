const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','game.js','adventure.js','adventure-harbor.js','adventure-olympians.js','adventure-time-rift.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);










run("$('mode').value='local';$('opponent').value='0';$('format').value='series';$('map').value='court';selected=7;start();fighters[0].x=600;fighters[0].y=500;fighters[1].x=700;fighters[1].y=500;fighters[0].lockedAim=0;fighters[1].dodge=0");
assert.equal(run('roster.length'),8);assert.equal(run('cardFamilies(7).length'),5);assert.equal(run("validLoadout(7,['leo_ice','leo_ice'])"),false);assert.equal(run("validLoadout(7,['leo_ice','leo_earth'])"),false);
for(const element of ['base','flames','thunder','earth','ice','corruption']){
 run(`fighters[0].cards=${element==='base'?'[]':JSON.stringify(['leo_'+element])};fighters[0].maxHp=leoMaxHP(fighters[0].cards);fighters[0].hp=100;fighters[1].hp=fighters[1].maxHp;fighters[1].guard=0;fighters[1].dodge=0;fighters[1].x=700;fighters[0].x=600`);
 const hp=run('fighters[1].hp');run('executeLeo(0,0);drawFighter(contextDummy||ctx,fighters[0],0,false)'.replace('contextDummy||',''));
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
