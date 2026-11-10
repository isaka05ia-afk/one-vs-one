const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);



const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
function step(s){run(`for(let n=0;n<${Math.ceil(s/.01)};n++)update(.01)`)}
function setup(n=0){sandbox.athlete=n;run("$('mode').value='training';$('format').value='series';$('map').value='court';$('opponent').value='0';$('trainingCard1').value='so_power';$('trainingCard2').value='so_power';selected=4;start();teamState(fighters[0]).active=athlete;syncTeam(fighters[0]);fighters[0].x=500;fighters[1].x=1100;fighters[0].y=fighters[1].y=550;fighters[0].aim=0;walls=[];inputMode='mouse';mouseAim=false;$('trainingImmortal').checked=false;$('trainingImmortalDummy').checked=true;$('aimBeforeShoot').checked=true");}
for(let n=0;n<3;n++){setup(n);assert(run('powerEvolved(fighters[0])'));assert(run('validAthletics(fighters[0])'));close(run('getMoves(fighters[0]).length'),3);run('render()')}
close(run('allEvolutions().length'),32);assert(run("validLoadout(4,['so_power','so_power'])"));
setup();run('fighters[1].x=600;walls=[{x:850,y:400,w:50,h:300}];attack(0,0)');step(.64);close(run('trainingStats.damage'),0);step(.04);close(run('trainingStats.damage'),85);assert(run('fighters[1].x<830'));close(run('fighters[0].hp'),120);
setup();run('fighters[0].x=100;attack(0,0)');step(.7);close(run('fighters[0].hp'),90);close(run('teamState(fighters[0]).active'),0);
setup();run('fighters[0].x=100;attack(0,1)');step(.3);run('attack(0,0)');step(.7);close(run('teamState(fighters[0]).active'),1);close(run('fighters[0].hp'),80);
setup();run('fighters[0].x=700;attack(0,0)');step(.7);close(run('fighters[0].hp'),120);assert(run('fighters[0].x<400'));
setup(1);run('fighters[1].x=650;beginPlayerAttack(1)');step(1);assert(run('powerEvoState(fighters[0]).holding'));assert(run('heroSpeed(fighters[0])<160'));run('render()');assert(run("zones.find(z=>z.kind==='powerwhirlpool').caught.includes(1)"));const pulled=run('fighters[1].x');run('endPlayerAttack(1)');assert(!run('powerEvoState(fighters[0]).holding'));assert(run('fighters[1].x')>pulled+300);assert(run('trainingStats.damage>17.9'));close(run("zones.filter(z=>z.kind==='powerwhirlpool').length"),0);
setup(1);run("fighters[1].team=fighters[0].team;fighters[1].x=650;$('trainingImmortalDummy').checked=false;beginPlayerAttack(1)");step(1);const ally=run('fighters[1].x');run('endPlayerAttack(1)');assert(run('fighters[1].x')>ally+300);close(run('fighters[1].hp'),150);
setup(1);run('beginPlayerAttack(1)');step(.5);run('attack(0,2)');close(run('teamState(fighters[0]).active'),2);assert(!run('powerEvoState(fighters[0]).holding'));close(run("zones.filter(z=>z.kind==='powerwhirlpool').length"),0);
setup(1);run('beginPlayerAttack(1)');step(4.1);assert(!run('powerEvoState(fighters[0]).holding'));
setup(2);run('fighters[0].x=350;fighters[1].x=650;attack(0,0)');step(.5);assert(run("shots.some(s=>s.kind==='shatterwave')"));step(.6);assert(run("shots.some(s=>s.kind==='powericeshard')"));assert(run('fighters[1].athletics.bleed>=3'));step(1);assert(run('fighters[0].hp<120'));assert(run('fighters[0].athletics.bleed>=2'));run('render()');
setup(2);run('zone(0,500,550,100,0,0,"ice",10);attack(0,0)');step(.5);close(run('shots[0].shards'),7);close(run('shots[0].r'),100);
// A returning shard can bounce and still remains hazardous to its creator.
run("shots=[{kind:'powericeshard',owner:0,creator:0,x:W-30.1,y:550,vx:260,vy:0,r:8,damage:7,bleedStacks:2,bounces:0,life:4,color:'#cff'}]");step(.01);assert(run('shots[0].vx<0'));close(run('shots[0].bounces'),1);
// Pool area never exceeds half any supported arena, including the large maze/sea.
for(const map of ['grove','court','harbor','frost','portals','maze','sea']){sandbox.poolMap=map;run('setArena(poolMap)');assert(run('Math.PI*selfishPoolRadius()**2<=W*H*.500000001'))}
setup();run("$('mode').value='ai';$('format').value='evolve';$('evolveChoice').value='so_power';start()");assert(run('powerEvolved(fighters[0])'));run('render()');
console.log('PASS: No Control registration/training/Evolve, warned kick/wall damage/miss recoil/Drink risk, growing moving vortex/release/ally pull without damage/Switch/timeout, shattering wave/queued returning shards/self-damage/Bleed/bounces, and half-area pool limit on every map.');
