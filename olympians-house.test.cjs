const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','queen-afflictions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js','adventure-olympians.js','adventure-time-rift.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);
run(`function finishShipBossFixture(){if(fighters[1].isKraken){const p=fighters[0];p.hasPaddle=true;p.aim=0;exposeTentacle(p.x+60,p.y,5);const t=adventure.harbor.exposed.find(t=>cone(p,t,155,1.15));if(t)hitKrakenTentacle(p,t,999);}else applyDamage(fighters[1],999);}`);










run("window.localStorage={data:{},getItem(k){return this.data[k]||null},setItem(k,v){this.data[k]=v}};startAdventure();enterHarbor();fighters[0].x=500;fighters[0].y=345;harborInteract()");assert.equal(run('adventure.dialogue.npc.house'),true);assert.equal(run('olympiansHouseOpen()'),false);run('$("harborTalkNext").onclick()');assert.equal(run("$('harborBoard').hidden"),true);run('closeHarborDialogue()');assert.equal(run('beginOlympiansVoyage()'),false);
run('startSailerFight();update(6);finishShipBossFixture();update(8);finishShipBossFixture();enterShipAftermath()');assert.equal(run('sailerTalkDone()'),false);run('for(let n=1;n<SAILER_AFTER_RESCUE.length;n++)$("harborTalkNext").onclick()');assert(run("$('harborBoard').textContent").includes('OPEN THE HOUSE'));run('$("harborBoard").onclick()');assert.equal(run('inHarbor()'),true);assert.equal(run('olympiansHouseOpen()'),true);assert.equal(run("adventureStored('one-vs-one-olympians-house')"),1);
run('harborInteract();$("harborTalkNext").onclick();$("harborBoard").onclick();render()');assert.equal(run('atOlympians()'),true);assert.equal(run('adventure.harborScene'),null);assert.equal(run('adventure.keyLoaned'),false);assert.equal(run('fighters[0].hasDoorKey'),true);assert.equal(run('safeAdventureNPCs().filter(n=>n.olymp!==undefined).length'),3);assert(run('safeAdventureNPCs().some(n=>n.sailer)'));assert.equal(run('free(100,550)'),false);
run('fighters[0].x=235;fighters[0].y=550;harborInteract();$("harborTalkNext").onclick();$("harborBoard").onclick()');assert.equal(run('inHarbor()'),true);assert.equal(run('fighters[0].x'),500);assert.equal(run('fighters[0].y'),365);
run('startAdventure({resume:true});enterHarbor()');assert.equal(run('olympiansHouseOpen()'),true,'Saved invitation survives restart');
run("window.localStorage.data={'one-vs-one-door-key':1,'one-vs-one-harbor-checkpoint':3};startAdventure({resume:true});enterHarbor()");assert.equal(run('olympiansHouseOpen()'),true,'Old Olympians checkpoint keeps access');
run("window.localStorage.data={};setAdventureGodMode(true);startAdventure();enterHarbor();startSailerFight();update(6);finishShipBossFixture();update(8);finishShipBossFixture();enterShipAftermath();for(let n=1;n<SAILER_AFTER_RESCUE.length;n++)$('harborTalkNext').onclick();$('harborBoard').onclick()");assert.equal(run('olympiansHouseOpen()'),true);assert.equal(run("adventureStored('one-vs-one-olympians-house')"),0,'Developer run cannot save house invitation');
console.log('PASS: harbor house locked before rescue/invitation; Sailer opens it after Kraken dialogue; all three Olympians and Sailer inside; no voyage/key loan; doorstep return, saved invitation, old checkpoint and developer-save isolation.');
