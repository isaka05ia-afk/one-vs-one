const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','game.js','adventure.js','adventure-harbor.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);








const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
function ship(phase=1){sandbox.phase=phase;run('startAdventure();enterHarbor();startSailerFight();update(6);adventure.phase=phase;adventure.harbor.timer=99;fighters[0].x=500;fighters[0].y=550;fighters[1].x=1000;fighters[1].y=550;fighters[0].guard=0;fighters[0].dodge=0;fighters[0].spawnShield=0');}
// Inspect real canvas operations, rejecting any NaN/Infinity introduced by animations.
run('var calls=[];var visualCanvas=new Proxy({},{get(o,k){return o[k]||(o[k]=(...args)=>{for(const a of args)if(typeof a==="number"&&!Number.isFinite(a))throw Error("Non-finite canvas "+k);calls.push([k,...args])})},set(o,k,v){o[k]=v;return true}})');
for(const [phase,kinds]of [[1,['wave','wind','paddle']],[2,['sweep','suction','tentacle']]])for(const kind of kinds){
 ship(phase);sandbox.kind=kind;run('var w=harborWarn(kind,fighters[0],.2,110);drawShipAttackWarning(visualCanvas,w);tickShip(.19)');assert.equal(run('adventure.harbor.effects.length'),0);close(run('fighters[0].hp'),110);
 run('tickShip(.02);drawShipEffects(visualCanvas)');assert.equal(run('adventure.harbor.effects[0].kind'),kind);const damagedHP=run('fighters[0].hp');assert(damagedHP<110);run('tickShip(.05);drawShipEffects(visualCanvas)');close(run('fighters[0].hp'),damagedHP);
 run('paused=true;var ttl=adventure.harbor.effects[0].left;update(.1)');close(run('adventure.harbor.effects[0].left'),run('ttl'));run('paused=false;tickShip(.6)');assert.equal(run('adventure.harbor.effects.length'),0);close(run('fighters[0].hp'),damagedHP);
}
// Telegraph band exactly matches the existing 130-unit damage strip.
ship();run("calls=[];var wave=harborWarn('wave',fighters[0],1);drawShipAttackWarning(visualCanvas,wave)");assert(run('calls.some(a=>a[0]==="fillRect"&&a[1]===200&&a[2]===485&&a[3]===1200&&a[4]===130)'));
// Brace feedback is distinct and does not add damage pulses.
ship(2);run("fighters[0].hasPaddle=true;fighters[0].aim=-Math.PI/2;fighters[0].guard=1;harborWarn('tentacle',fighters[0],.01);tickShip(.02);drawShipEffects(visualCanvas)");assert(run('adventure.harbor.effects.some(e=>e.kind==="brace")'));close(run('fighters[0].hp'),105.8);assert(run('adventure.harbor.exposed.length')>0);
// Bound allocations and clean effects when transitioning to Kraken/rescue.
run('for(let n=0;n<80;n++)addShipVisualImpact({kind:"wave",x:500,y:550,r:110,origin:{x:500,y:450}})');assert.equal(run('adventure.harbor.effects.length'),24);
run('startKrakenRescue();render()');assert.equal(run('adventure.harbor.effects.length'),0);run('update(8);finishSailerRescue();render()');assert.equal(run('adventure.harbor.effects.length'),0);
// Effects remain local to the Adventure ship and do not persist on a new Arena round.
run('start();render()');assert.equal(run('adventure'),null);
console.log('Ship visuals: all six attack animations, finite canvas paths, matching damage strips, once-only damage, paused/expired effects, Brace feedback, bounded state and scene cleanup PASS');
