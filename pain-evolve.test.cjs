const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);

const close=(a,b)=>assert(Math.abs(a-b)<.000001,`${a} != ${b}`);
const runStep=(s)=>run(`for(let n=0;n<${Math.ceil(s/.01)};n++)update(.01)`);
function setup(n=0){sandbox.athlete=n;run("$('mode').value='training';$('format').value='series';$('map').value='court';$('opponent').value='0';$('trainingCard1').value='no_pain';$('trainingCard2').value='no_pain';selected=4;start();teamState(fighters[0]).active=athlete;syncTeam(fighters[0]);fighters[0].x=200;fighters[1].x=1000;fighters[0].y=fighters[1].y=550;fighters[0].aim=0;walls=[];inputMode='mouse';mouseAim=false;$('trainingImmortal').checked=false;$('trainingImmortalDummy').checked=true;$('aimBeforeShoot').checked=false");}
function charge(slot,s=2){run(`beginPlayerAttack(${slot})`);runStep(s);run(`endPlayerAttack(${slot})`)}
setup();assert.equal(run("validLoadout(4,['no_pain','no_pain'])"),true);assert.equal(run("evolutionOwner('no_pain')"),4);close(run('allEvolutions().length'),37);close(run('fighters[0].hp'),120);
run('beginPlayerAttack(0)');runStep(1);assert(Math.abs(run('teamState(fighters[0]).members[0].hp')-27.5)<.001);close(run('painState(fighters[0]).debt'),12.5);run('endPlayerAttack(0)');close(run('getMoves(fighters[0])[0][2]'),45);runStep(1);close(run('fighters[0].hp'),107.5);
setup();charge(0);close(run('painState(fighters[0]).spent'),25);close(run('getMoves(fighters[0])[0][2]'),72);close(run('fighters[0].hp'),95);close(run('fighters[0].rush'),.75);assert.equal(run('validPain(fighters[0])'),true);run('render()');
setup();run('beginPlayerAttack(0)');runStep(.5);run('endPlayerAttack(0,true)');close(run('fighters[0].hp'),113.75);close(run('fighters[0].cd[0]'),0);assert.equal(run('painState(fighters[0]).empowered'),false);
setup();run('beginPlayerAttack(0)');runStep(1);run('fighters[0].stun=1');runStep(.01);assert.equal(run('painState(fighters[0]).charging'),false);close(run('fighters[0].hp'),107.5);
setup();run('teamState(fighters[0]).members[0].hp=8;syncTeam(fighters[0])');charge(0);close(run('teamState(fighters[0]).members[0].hp'),1);close(run('teamState(fighters[0]).active'),0);close(run('painState(fighters[0]).spent'),7);assert(Math.abs(run('getMoves(fighters[0])[0][2]')-33.12)<.001);
setup();charge(1);close(run('teamState(fighters[0]).members[0].hp'),10);close(run('teamState(fighters[0]).drink'),10);setup();run('teamState(fighters[0]).members[0].hp=10;syncTeam(fighters[0])');charge(1);close(run('teamState(fighters[0]).members[0].hp'),1);close(run('teamState(fighters[0]).active'),0);
setup(1);run('fighters[1].x=500');charge(0);close(run('shots[0].damage'),48);close(run('shots[0].r'),100);close(run('shots[0].push'),300);runStep(1);assert(run('trainingStats.damage>=48'));run('render()');
setup(1);run('fighters[1].x=400');charge(1);close(run('teamState(fighters[0]).diving'),1.8);runStep(.5);close(run('trainingStats.damage'),32);runStep(.2);close(run('trainingStats.damage'),32);
setup(2);run('fighters[1].x=400');charge(0);runStep(.5);close(run('fighters[1].athletics.bleed'),5);assert(run('trainingStats.damage>=12'));
setup(2);charge(1);runStep(.01);assert(run("zones.some(z=>z.kind==='ice'&&z.r>119.9&&z.life>15)"));assert(run('teamState(fighters[0]).trail>6.9'));
setup();charge(2);close(run('teamState(fighters[0]).active'),1);close(run('painState(fighters[0]).switchBoost'),8);close(run('teamState(fighters[0]).members[0].hp'),15);assert.equal(run('painState(fighters[0]).empowered'),false);
setup();run('beginPain(0,0,true)');runStep(2.1);assert.equal(run('painState(fighters[0]).charging'),false);close(run('fighters[0].hp'),95);assert(run('fighters[0].rush>0'));
// Fixed Evolve mode uses the same two cards, while disabling Evolves removes repeat offers.
run("$('mode').value='ai';$('format').value='evolve';$('evolveChoice').value='no_pain';start()");close(run('fighters[0].id'),4);assert.equal(run('painEvolve(fighters[0])'),true);run('render()');
setup();run('beginPlayerAttack(0)');runStep(1);run('resetTraining()');close(run('painState(fighters[0]).debt'),0);close(run('painState(fighters[0]).spent'),0);
console.log('PASS: Beyond the Limit registration, partial/full/tap charging, immediate 25-HP budget, 1-HP floor, no refund on cancel/stun/miss, Energy reserve, 4x damage, long damaging Dive, giant push wave, extra Bleed/ice, boosted Switch, AI charge, fixed Evolve and round reset.');

setup();const savedRandom=Math.random;Math.random=()=>0;run("evolutionsEnabled=true;matchFormat='series'");assert(run("offeredCards(4,['no_pain']).includes('no_pain')"));run('evolutionsEnabled=false');assert.equal(run("offeredCards(4,['no_pain']).includes('no_pain')"),false);Math.random=savedRandom;
