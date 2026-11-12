const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','game.js','adventure.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);






const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
run("window.localStorage={data:{},getItem(k){return this.data[k]||null},setItem(k,v){this.data[k]=v}};startAdventure();paused=false");
assert.equal(run('fighters[0].isAdventurePlayer'),true);
assert.equal(run('fighters[1].id'),1);
assert.equal(run('getMoves(fighters[0]).map(m=>m[0]).join(",")'),'Slash,Healing Potion,Block');
assert.equal(run('roster.length'),7);
run('fighters[0].hp=30;attack(0,1)');assert.equal(run('fighters[0].potions'),2);
run('for(let t=0;t<125;t++)update(.01)');close(run('fighters[0].hp'),85);
run('fighters[0].cd[1]=0;attack(0,1);applyDamage(fighters[0],5)');assert.equal(run('fighters[0].drinking'),0);assert.equal(run('fighters[0].potions'),1);
run('fighters[1].hp=123;applyDamage(fighters[0],999)');assert.equal(run('fighters[0].playerLives'),2);close(run('fighters[0].hp'),110);close(run('fighters[1].hp'),123);assert.equal(run('fighters[0].potions'),1);
run('applyDamage(fighters[0],999)');assert.equal(run('fighters[0].playerLives'),2);
run('fighters[0].spawnShield=0;fighters[0].x=300;fighters[0].y=550;fighters[1].x=350;fighters[1].y=550;fighters[0].aim=0;dragonHoldInput(0,2,true);hit(fighters[1],fighters[0],20)');close(run('fighters[0].hp'),107);
run('dragonHoldInput(0,2,false);hit(fighters[1],fighters[0],20)');close(run('fighters[0].hp'),87);
run('dragonHoldInput(0,2,true);clearInput()');assert.equal(run('fighters[0].blockHeld'),false);
run('applyDamage(fighters[1],999)');assert.equal(run('adventure.phase'),2);close(run('fighters[1].hp'),340);close(run('fighters[0].hp'),87);assert.equal(run('fighters[0].potions'),1);
run('applyDamage(fighters[1],999)');close(run('fighters[1].hp'),340);
run('adventure.transition=0;adventure.warnings=[];fighters[0].dodge=0;bossWarning("grab",fighters[0],.1);tickAdventure(.2)');assert(run('fighters[0].hp')<87);assert(run('fighters[0].stun')>0);
run('render();updateHud();applyDamage(fighters[1],999)');assert.equal(run('adventure.ended'),true);assert.equal(run('finished'),true);
run('startAdventure();paused=false;fighters[0].spawnShield=0;applyDamage(fighters[0],999);fighters[0].spawnShield=0;applyDamage(fighters[0],999);fighters[0].spawnShield=0;applyDamage(fighters[0],999)');assert.equal(run('fighters[0].playerLives'),0);assert.equal(run('adventure.ended'),true);
run('startAdventure();paused=false;for(let n=0;n<1500&&!finished;n++)update(.01);render();updateHud()');
assert(run('adventure.elapsed')>0);
run('start()');assert.equal(run('adventure'),null);assert.equal(run('fighters[0].isAdventurePlayer'),undefined);
assert.equal(run('adventureDialogue(8,true)[1]'),'Do I always apologise?');

run("running=false;adventure=null;adventureSettings=null;selected=5;$('mode').value='ai';$('map').value='harbor';startAdventure();paused=false");
const beforeRetry=run('adventure.attempt');run('startAdventure()');assert.equal(run('adventure.attempt'),beforeRetry+1);
run("$('back').onclick()");assert.equal(run('selected'),5);assert.equal(run("$('map').value"),'harbor');assert.equal(run('adventure'),null);
run("window.localStorage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};startAdventure();paused=false;render()");assert.equal(run('adventure.attempt'),1);
// Native touch-button bindings: hold Block, release/cancel, potion and aim-release Slash.
run("$('aimBeforeShoot').checked=true;var blockButton=document.createElement('button');bindPainAttackButton(blockButton,2);blockButton.onpointerdown({pointerId:9,clientX:0,clientY:0,preventDefault(){},pointerType:'touch'})");assert.equal(run('fighters[0].blockHeld'),true);
run("blockButton.onpointerup({pointerId:9})");assert.equal(run('fighters[0].blockHeld'),false);
run("blockButton.onpointerdown({pointerId:10,clientX:0,clientY:0,preventDefault(){},pointerType:'touch'});blockButton.onpointercancel({pointerId:10})");assert.equal(run('fighters[0].blockHeld'),false);
run('fighters[0].x=300;fighters[0].y=550;fighters[1].x=370;fighters[1].y=550;fighters[0].aim=0;fighters[0].lockedAim=0;beginPlayerAttack(0)');const hpBeforeSlash=run('fighters[1].hp');run('endPlayerAttack(0)');assert(run('fighters[1].hp')<hpBeforeSlash);
console.log('Adventure: abilities, potion interruption, lives, damage/block, two phases, grabs, defeat, AI/render, arena isolation OK');
