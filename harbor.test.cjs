const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','queen-afflictions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);







const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
run("window.localStorage={data:{},getItem(k){return this.data[k]||null},setItem(k,v){this.data[k]=v}};startAdventure();paused=false");
// Every lost life, including the last, counts as a real Door Man death.
for(let i=0;i<3;i++)run('fighters[0].spawnShield=0;applyDamage(fighters[0],999)');assert.equal(run("adventureStored('one-vs-one-door-deaths')"),3);run('endRound();reviveAdventurePlayer(fighters[0])');assert.equal(run("adventureStored('one-vs-one-door-deaths')"),3);
run('startAdventure();paused=false;adventure.phase=2;applyDamage(fighters[1],999)');assert.equal(run("adventureStored('one-vs-one-door-key')"),1);assert.equal(run('fighters[0].hasDoorKey'),true);
run('enterHarbor();render();update(.01);updateHud()');assert.equal(run('inHarbor()'),true);assert.equal(run('fighters[0].potions'),3);assert.equal(run('fighters[0].playerLives'),3);
run('fighters[0].x=320;fighters[0].y=350;harborInteract()');assert.equal(run('adventure.dialogue.npc.name'),'Nell · Net Mender');assert.equal(run('active()'),false);const x=run('fighters[0].x');run("keys.add('d');update(1)");close(run('fighters[0].x'),x);run('closeHarborDialogue()');assert.equal(run('active()'),true);
// All residents have complete conversation paths and return to free movement.
run('for(const npc of HARBOR_NPCS){fighters[0].x=npc.x;fighters[0].y=npc.y;harborInteract();for(let i=1;i<npc.lines.length;i++)$("harborTalkNext").onclick();closeHarborDialogue()}');
// Door Step crosses thin cover, respects ship bounds and has no fourth ability.
run('walls=[{x:300,y:460,w:45,h:180}];fighters[0].x=250;fighters[0].y=550;fighters[0].aim=0;fighters[0].dodgeCd=0;dodge(0)');assert(run('fighters[0].x')>345);assert.equal(run('getMoves(fighters[0]).length'),3);
run('startSailerFight();render();update(6)');assert.equal(run('adventure.harborScene'),null);assert.equal(run('fighters[1].id'),5);assert.equal(run('fighters[1].isAdventureBoss'),false);assert.equal(run('fighters[1].isHarborBoss'),true);assert.equal(run('free(100,550)'),false);
run('fighters[0].x=1380;fighters[0].y=550;fighters[0].aim=0;fighters[0].dodgeCd=0;dodge(0)');assert(run('fighters[0].x')<=1415-run('R'));
run('fighters[0].hp=73;fighters[0].potions=1;fighters[0].playerLives=2;applyDamage(fighters[1],999)');assert.equal(run('adventure.phase'),2);assert.equal(run('fighters[1].isKraken'),true);close(run('fighters[0].hp'),73);assert.equal(run('fighters[0].potions'),1);assert.equal(run('fighters[0].playerLives'),2);
run('update(3);render();update(5);render()');assert.equal(run('adventure.harborScene'),null);
run('fighters[0].x=450;fighters[0].y=550;harborInteract()');assert.equal(run('fighters[0].hasPaddle'),true);assert.equal(run('getMoves(fighters[0]).map(m=>m[0]).join(",")'),'Paddle Strike,Healing Potion,Brace');
run('fighters[0].x=500;fighters[0].y=550;fighters[0].aim=0;fighters[0].cd[0]=0;exposeTentacle(570,550);attack(0,0)');close(run('fighters[1].hp'),448);
// Bracing a tentacle exposes it; missing a brace hurts, Dodge avoids it.
run('fighters[0].aim=-Math.PI/2;fighters[0].guard=1;fighters[0].blockHeld=true;harborWarn("tentacle",fighters[0],.01);tickShip(.02)');assert(run('adventure.harbor.exposed.length')>0);assert(run('fighters[0].hp')>60);
run('fighters[0].guard=0;fighters[0].blockHeld=false;harborWarn("suction",fighters[0],.01)');const before=run('fighters[0].hp');run('tickShip(.02)');assert(run('fighters[0].hp')<before);
run('fighters[0].dodge=1;harborWarn("sweep",fighters[0],.01)');const avoided=run('fighters[0].hp');run('tickShip(.02)');close(run('fighters[0].hp'),avoided);
run('applyDamage(fighters[1],999)');assert.equal(run('finished'),true);assert.equal(run('adventure.harbor.rescued'),true);run('render()');assert.equal(run("adventureStored('one-vs-one-harbor-checkpoint')"),2);assert.equal(run("adventureStored('one-vs-one-sailer-rescued')"),1);
run('enterHarbor();render()');assert.equal(run('adventure.harbor.rescued'),true);
// Checkpoint survives reload-style restarting and does not spend Door Man attempts.
const attempts=run("adventureStored('one-vs-one-door-attempts')");run('continueHarbor()');close(run("adventureStored('one-vs-one-door-attempts')"),attempts);assert.equal(run('inHarbor()'),true);
// Sailer never gets recognition dialogue, and a failed voyage retries that boss.
run('startSailerFight();update(6);for(let i=0;i<3;i++){fighters[0].spawnShield=0;applyDamage(fighters[0],999)}');assert.equal(run('adventure.ended'),true);assert.equal(run('adventure.chapter'),'sailer');run('startSailerFight();update(6)');assert.equal(run('fighters[0].playerLives'),3);assert.equal(run('fighters[0].potions'),3);
// Weariness and actual death dialogue thresholds; no weakening before death 71.
run("adventure=null;adventureSave('one-vs-one-door-deaths',70);startAdventure();paused=false");close(run('doorWeariness().damage'),1);run('applyDamage(fighters[0],999)');close(run('doorWeariness().damage'),.85);assert.equal(run("adventureStored('one-vs-one-door-deaths')"),71);assert(run('adventureDialogue(71).join(" ")').includes('can’t keep'));
run('adventure.phase=2;walls=[];fighters[0].x=800;fighters[0].y=550;startBossDoorRush()');assert.equal(run('adventure.doorRush.passes'),2);
run('adventure.deaths=100');close(run('doorWeariness().damage'),.7);assert(run('adventureDialogue(100,true).join(" ")').includes('Was that enough'));
// God mode cannot advance deaths or unlock a persistent harbor/ship victory.
run("adventureSave('one-vs-one-door-key',0);adventureSave('one-vs-one-harbor-checkpoint',0);setAdventureGodMode(true);startAdventure();paused=false;adventure.phase=2;applyDamage(fighters[1],999)");assert.equal(run("adventureStored('one-vs-one-door-key')"),0);run('enterHarbor();startSailerFight();update(6);applyDamage(fighters[1],999);update(8);applyDamage(fighters[1],999)');assert.equal(run("adventureStored('one-vs-one-harbor-checkpoint')"),0);
run('start();render()');assert.equal(run('adventure'),null);assert.equal(run('getMoves(fighters[0]).length'),3);run('drawFighter(ctx,{id:5,x:100,y:200,face:1,cards:[]},0,true)');
// Full fixed-step simulations exercise both ship phases, scene rendering and retries.
run('setAdventureGodMode(true);startAdventure();enterHarbor();startSailerFight();update(6);for(let n=0;n<1600;n++){update(.02);if(n%100===0)render()}');assert.equal(run('adventure.ended'),false);close(run('fighters[0].hp'),110);
run('applyDamage(fighters[1],999);update(8);for(let n=0;n<1600;n++){update(.02);if(n%100===0)render()}');assert.equal(run('adventure.ended'),false);assert(run('adventure.harbor.exposed.length')>0);
run("adventureSave('one-vs-one-door-wins',1);adventureSave('one-vs-one-door-key',0);adventureSave('one-vs-one-harbor-checkpoint',0);migrateHarborProgress()");assert.equal(run("adventureStored('one-vs-one-door-key')"),1);assert.equal(run('harborCheckpoint()'),1);
console.log('Harbor: residents/dialogues, Door deaths/mercy, permanent key/blink, voyage, separate Kraken, resources, paddle/Brace, rescue/checkpoint, retries and cheat isolation PASS');
