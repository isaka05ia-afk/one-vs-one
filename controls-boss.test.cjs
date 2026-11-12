const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);








const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
function setup(){run("setAdventureGodMode(false);startAdventure();paused=false;adventure.deaths=0;walls=[];fighters[0].x=500;fighters[0].y=550;fighters[1].x=400;fighters[1].y=550;fighters[1].aiControlled=false;fighters[0].aim=0;fighters[0].lockedAim=0;adventure.actionTimer=99;adventure.teleportTimer=99;adventure.recovery=0");}
setup();run('attack(1,0)');assert.equal(run('adventure.runningMan.stage'),'warning');assert.equal(run('fighters[1].rush'),0);const bossX=run('fighters[1].x'),hp=run('fighters[0].hp');run('tickBossRunningMan(.3)');close(run('fighters[1].x'),bossX);close(run('fighters[0].hp'),hp);assert.equal(run('adventure.runningMan.stage'),'warning');
// The aim is locked at the start, so sidestepping during windup always works.
run('fighters[0].y=720;tickBossRunningMan(.25);render();for(let n=0;n<100;n++)tickBossRunningMan(.01)');close(run('fighters[0].hp'),hp);assert.equal(run('adventure.runningMan'),null);assert(run('adventure.recovery')>0);
setup();run('attack(1,0);tickBossRunningMan(1.2);tickBossRunningMan(.2)');assert(run('fighters[0].hp')<110);const hitHp=run('fighters[0].hp');run('tickBossRunningMan(.05)');close(run('fighters[0].hp'),hitHp);
// No locking/projectile combo is left on screen during the windup.
setup();run('bossWarning("lock",fighters[0],.1);projectile(1,"key",10,900,400,7);attack(1,0)');assert.equal(run('adventure.warnings.length'),0);assert.equal(run('shots.filter(s=>s.owner===1).length'),0);
// Door Run is fast only after a full warning; return passes have their own warning.
setup();run('fighters[0].x=800;fighters[1].x=200;startBossDoorRush()');assert.equal(run('adventure.doorRush.left'),.7);assert.equal(run('DOOR_RUSH_SPEED[1]'),1600);assert.equal(run('DOOR_RUSH_SPEED[2]'),1900);run('tickBossDoorRush(.4)');assert.equal(run('adventure.doorRush.stage'),'warning');run('tickBossDoorRush(.35)');assert.equal(run('adventure.doorRush.stage'),'running');const from=run('fighters[1].x');run('tickBossDoorRush(.1)');assert(run('fighters[1].x')-from>150);
run('fighters[0].y=900;tickBossDoorRush(1)');assert.equal(run('adventure.doorRush.stage'),'warning');assert.equal(run('adventure.doorRush.left'),.5);run('render()');
// The second form demands faster reactions; mercy still extends the windows.
setup();run('adventure.phase=2;attack(1,0)');close(run('adventure.runningMan.left'),.4);run('adventure.runningMan=null;fighters[1].cd[0]=0;adventure.deaths=71;attack(1,0)');close(run('adventure.runningMan.left'),.6);run('adventure.runningMan=null;adventure.deaths=0;fighters[0].x=800;startBossDoorRush()');close(run('adventure.doorRush.left'),.55);run('tickBossDoorRush(.6);fighters[0].y=900;tickBossDoorRush(1)');close(run('adventure.doorRush.left'),.4);
// Touch attacks always aim on hold/release, even with desktop direct attacks enabled.
setup();run("inputMode='touch';$('aimBeforeShoot').checked=false;var touchButton=document.createElement('button');bindPainAttackButton(touchButton,0);touchButton.onpointerdown({pointerId:3,pointerType:'touch',clientX:100,clientY:100,preventDefault(){}})");assert.equal(run('aimPreviews.size'),1);close(run('fighters[1].hp'),260);
run("touchButton.onpointermove({pointerId:3,clientX:20,clientY:100});update(.2)");assert.equal(run('aimPreviews.get(0).manual'),true);assert.equal(run('touchAim.active'),true);close(run('fighters[1].hp'),260);
run('touchButton.onpointerup({pointerId:3})');assert(run('fighters[1].hp')<260);assert.equal(run('touchAim.active'),false);assert.equal(run('aimPreviews.size'),0);const afterTouch=run('fighters[1].hp');run('touchButton.onpointerup({pointerId:3})');close(run('fighters[1].hp'),afterTouch);
setup();run("inputMode='touch';$('aimBeforeShoot').checked=false;bindPainAttackButton(touchButton,0);touchButton.onpointerdown({pointerId:4,pointerType:'touch',clientX:100,clientY:100,preventDefault(){}});touchButton.onpointermove({pointerId:4,clientX:20,clientY:100});touchButton.onpointercancel({pointerId:4})");close(run('fighters[1].hp'),260);assert.equal(run('touchAim.active'),false);assert.equal(run('aimPreviews.size'),0);
// Hold attacks (Block/Brace) can turn with the attack-button drag too.
setup();run("inputMode='touch';bindPainAttackButton(touchButton,2);touchButton.onpointerdown({pointerId:5,pointerType:'touch',clientX:100,clientY:100,preventDefault(){}});touchButton.onpointermove({pointerId:5,clientX:100,clientY:20});updatePlayerAim()");close(run('fighters[0].aim'),-Math.PI/2);assert.equal(run('fighters[0].blockHeld'),true);run('touchButton.onpointerup({pointerId:5})');assert.equal(run('fighters[0].blockHeld'),false);assert.equal(run('touchAim.active'),false);
// A keyboard resumes desktop direct attacks after touch use.
setup();run("inputMode='touch';$('aimBeforeShoot').checked=false;handleGameKeyDown({key:'1',code:'Digit1',preventDefault(){}})");assert.equal(run('inputMode'),'mouse');assert.equal(run('aimPreviews.size'),0);
const html=fs.readFileSync(__dirname+'/index.html','utf8');assert(!html.includes('id="aimStick"'));assert(html.indexOf('class="fightbar"')<html.indexOf('id="canvas"'));assert(html.indexOf('class="touch"')<html.indexOf('id="cardDraft"'));assert(!html.includes('Höger spak'));console.log('Controls and boss: touch hold/drag/release/cancel, held-block aim, desktop switching, one dock/no aim stick; warned locked Running Man, safe reaction window, fast Door Run and return warnings PASS');
