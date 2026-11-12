const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','creature-art.js','game.js','adventure.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);






const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
run("window.localStorage={data:{},getItem(k){return this.data[k]||null},setItem(k,v){this.data[k]=v}};startAdventure();paused=false");
assert.equal(run('fighters[0].isAdventurePlayer'),true);
assert.equal(run('fighters[1].id'),1);
assert.equal(run('getMoves(fighters[0]).map(m=>m[0]).join(",")'),'Slash,Healing Potion,Block');
assert.equal(run('roster.length'),9);
run('fighters[0].hp=30;attack(0,1)');assert.equal(run('fighters[0].potions'),2);
run('for(let t=0;t<125;t++)update(.01)');close(run('fighters[0].hp'),85);
run('fighters[0].cd[1]=0;attack(0,1);applyDamage(fighters[0],5)');assert.equal(run('fighters[0].drinking'),0);assert.equal(run('fighters[0].potions'),1);
run('fighters[1].hp=123;applyDamage(fighters[0],999)');assert.equal(run('fighters[0].playerLives'),2);close(run('fighters[0].hp'),110);close(run('fighters[1].hp'),123);assert.equal(run('fighters[0].potions'),1);
run('applyDamage(fighters[0],999)');assert.equal(run('fighters[0].playerLives'),2);
run('fighters[0].spawnShield=0;fighters[0].x=300;fighters[0].y=550;fighters[1].x=350;fighters[1].y=550;fighters[0].aim=0;dragonHoldInput(0,2,true);hit(fighters[1],fighters[0],20,{scaled:true})');close(run('fighters[0].hp'),107);
run('dragonHoldInput(0,2,false);hit(fighters[1],fighters[0],20,{scaled:true})');close(run('fighters[0].hp'),87);
run('dragonHoldInput(0,2,true);clearInput()');assert.equal(run('fighters[0].blockHeld'),false);
run('applyDamage(fighters[1],999)');assert.equal(run('adventure.phase'),2);close(run('fighters[1].hp'),420);close(run('fighters[0].hp'),87);assert.equal(run('fighters[0].potions'),1);
run('applyDamage(fighters[1],999)');close(run('fighters[1].hp'),420);
// Growth cutscene freezes the entire fight and cycles retry-aware dialogue.
assert.equal(run('active()'),false);const frozenPlayerX=run('fighters[0].x'),frozenBossX=run('fighters[1].x');
run('attack(0,0);applyDamage(fighters[0],50);applyDamage(fighters[1],50);render();update(2)');close(run('fighters[0].hp'),87);close(run('fighters[1].hp'),420);close(run('fighters[0].x'),frozenPlayerX);close(run('fighters[1].x'),frozenBossX);
assert(run('bossMonsterScale()')>1);const earlyScale=run('bossMonsterScale()');run('paused=true;update(2)');close(run('adventure.cutscene.elapsed'),2);run('paused=false;update(2);render()');assert(run('bossMonsterScale()')>earlyScale);assert(run('adventure.line').includes('sorry'));
run('update(2.5);render()');assert.equal(run('adventure.cutscene.line'),2);run('update(2)');assert.equal(run('adventure.cutscene'),null);close(run('bossMonsterScale()'),2.65);assert.equal(run('active()'),true);
assert.equal(run('fighterRadius(fighters[1])'),48);assert(run('heroDamage(fighters[1])')>1);
run('adventure.transition=0;adventure.warnings=[];fighters[0].dodge=0;bossWarning("grab",fighters[0],.1);tickAdventure(.2)');assert(run('fighters[0].hp')<87);assert(run('fighters[0].stun')>0);
run('render();updateHud();applyDamage(fighters[1],999)');assert.equal(run('adventure.ended'),true);assert.equal(run('finished'),true);
run('startAdventure();paused=false;fighters[0].spawnShield=0;applyDamage(fighters[0],999);fighters[0].spawnShield=0;applyDamage(fighters[0],999);fighters[0].spawnShield=0;applyDamage(fighters[0],999)');assert.equal(run('fighters[0].playerLives'),0);assert.equal(run('adventure.ended'),true);
run('startAdventure();paused=false;for(let n=0;n<1500&&!finished;n++)update(.01);render();updateHud()');
assert(run('adventure.elapsed')>0);
run('start()');assert.equal(run('adventure'),null);assert.equal(run('fighters[0].isAdventurePlayer'),undefined);
assert(run('adventureDialogue(20,true)[0]').includes('How many times'));

run("running=false;adventure=null;adventureSettings=null;selected=5;$('mode').value='ai';$('map').value='harbor';startAdventure();paused=false");
const beforeRetry=run('adventure.attempt');run('startAdventure()');assert.equal(run('adventure.attempt'),beforeRetry+1);
run("$('back').onclick()");assert.equal(run('selected'),5);assert.equal(run("$('map').value"),'harbor');assert.equal(run('adventure'),null);
run("window.localStorage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};startAdventure();paused=false;render()");assert.equal(run('adventure.attempt'),1);
// Native touch-button bindings: hold Block, release/cancel, potion and aim-release Slash.
run("$('aimBeforeShoot').checked=true;var blockButton=document.createElement('button');bindPainAttackButton(blockButton,2);blockButton.onpointerdown({pointerId:9,clientX:0,clientY:0,preventDefault(){},pointerType:'touch'})");assert.equal(run('fighters[0].blockHeld'),true);
run("blockButton.onpointerup({pointerId:9})");assert.equal(run('fighters[0].blockHeld'),false);
run("blockButton.onpointerdown({pointerId:10,clientX:0,clientY:0,preventDefault(){},pointerType:'touch'});blockButton.onpointercancel({pointerId:10})");assert.equal(run('fighters[0].blockHeld'),false);
run('fighters[0].x=300;fighters[0].y=550;fighters[1].x=370;fighters[1].y=550;fighters[0].aim=0;fighters[0].lockedAim=0;beginPlayerAttack(0)');const hpBeforeSlash=run('fighters[1].hp');run('endPlayerAttack(0)');assert(run('fighters[1].hp')<hpBeforeSlash);
// Door Run uses two actual doors and swept damage, including crossing in a long tick.
run('startAdventure();paused=false;walls=[];fighters[0].x=800;fighters[0].y=550;fighters[1].x=200;fighters[1].y=550;startBossDoorRush()');assert(run('adventure.doorRush'));assert.equal(run('adventure.doorRush.passes'),2);
run('render();tickBossDoorRush(1.7)');assert.equal(run('adventure.doorRush.stage'),'running');const rushHP=run('fighters[0].hp');run('tickBossDoorRush(.8)');assert(run('fighters[0].hp')<rushHP);
const afterPass=run('fighters[0].hp');run('tickBossDoorRush(.01)');close(run('fighters[0].hp'),afterPass);
run('fighters[0].x=800;fighters[0].y=850;for(let i=0;i<300;i++)tickBossDoorRush(.01)');assert.equal(run('adventure.doorRush'),null);
// Sidestepping and dodging a pass avoid its damage.
run('fighters[0].x=800;fighters[0].y=550;adventure.recovery=0;startBossDoorRush();tickBossDoorRush(1.7);fighters[0].y=850');const avoidHP=run('fighters[0].hp');run('tickBossDoorRush(.8)');close(run('fighters[0].hp'),avoidHP);
run('adventure.doorRush=null;fighters[0].x=800;fighters[0].y=550;adventure.recovery=0;startBossDoorRush();tickBossDoorRush(1.7);fighters[0].dodge=1');run('tickBossDoorRush(.8)');close(run('fighters[0].hp'),avoidHP);
// Phase-two rush makes three passes; more attacks include a warned key fan and door slam.
run('adventure.doorRush=null;adventure.phase=2;adventure.recovery=0;fighters[0].dodge=0;startBossDoorRush()');assert.equal(run('adventure.doorRush.passes'),3);
run('adventure.doorRush=null;adventure.warnings=[];shots=[];bossWarning("keys",fighters[1],.1);tickAdventure(.2);render()');assert.equal(run('shots.length'),5);
run('adventure.warnings=[];bossWarning("slam",fighters[0],.1)');const slamHP=run('fighters[0].hp');run('tickAdventure(.2)');assert(run('fighters[0].hp')<slamHP);
assert(run('bossGrowthLines(12)[1]').includes('seen this before'));assert(run('bossGrowthLines(5)[1]').includes('not surprised'));
// The transformations and new boss-only modifiers never affect normal Door Man.
run('start()');assert.equal(run('adventure'),null);close(run('heroDamage({id:1,cards:[]})'),1);assert.equal(run('fighterRadius({id:1,cards:[]})'),run('R'));
// Story advances slowly; transformation recognition uses actual completed scenes.
assert.equal(run('adventureDialogue(9).join("|")'),run('adventureDialogue(1).join("|")'));
assert.notEqual(run('adventureDialogue(10).join("|")'),run('adventureDialogue(9).join("|")'));
assert.equal(run('bossGrowthLines(4).join("|")'),run('bossGrowthLines(1).join("|")'));
run("window.localStorage={data:{},getItem(k){return this.data[k]||null},setItem(k,v){this.data[k]=v}};adventureSave('one-vs-one-door-attempts',30);startAdventure();paused=false;adventurePhaseTwo()");assert.equal(run('adventure.cutscene.lines[0]'),'Why are you still here?');close(run("adventureStored('one-vs-one-door-form-views')"),0);
run('updateBossGrowth(8.4);updateBossGrowth(1)');close(run("adventureStored('one-vs-one-door-form-views')"),1);
run("adventureSave('one-vs-one-door-form-views',4);startAdventure();paused=false;adventurePhaseTwo()");assert(run('adventure.cutscene.lines[1]').includes('not surprised'));run('startAdventure()');close(run("adventureStored('one-vs-one-door-form-views')"),4);
// Developer code, harmless invalid input, Adventure-only invulnerability, story isolation.
run("$('developerCode').value='wrong'");assert.equal(run('applyAdventureDeveloperCode()'),false);assert.equal(run('adventureGodMode'),false);
run("$('developerCode').value=' player-god '");assert.equal(run('applyAdventureDeveloperCode()'),true);assert.equal(run('adventureGodMode'),true);
const attemptsBeforeGod=run("adventureStored('one-vs-one-door-attempts')");run('startAdventure();paused=false;applyDamage(fighters[0],9999)');close(run('fighters[0].hp'),110);assert.equal(run('fighters[0].playerLives'),3);close(run("adventureStored('one-vs-one-door-attempts')"),attemptsBeforeGod);
run('adventurePhaseTwo();updateBossGrowth(8.4);applyDamage(fighters[1],9999)');assert.equal(run('adventure.ended'),true);close(run("adventureStored('one-vs-one-door-form-views')"),4);close(run("adventureStored('one-vs-one-door-wins')"),0);
run('start();fighters[0].hp=100;applyDamage(fighters[0],20)');close(run('fighters[0].hp'),80);
run('startAdventure();paused=false;setAdventureGodMode(false);applyDamage(fighters[0],10)');close(run('fighters[0].hp'),100);assert.equal(run('adventure.testRun'),true);
console.log('Adventure: abilities, potion interruption, lives, damage/block, two phases, grabs, defeat, AI/render, arena isolation OK');
