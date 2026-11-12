const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','queen-afflictions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js','adventure-olympians.js','adventure-time-rift.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);









const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
run("window.localStorage={data:{},getItem(k){return this.data[k]||null},setItem(k,v){this.data[k]=v}};adventureSave('one-vs-one-olympian-trial-won',1);startAdventure();enterOlympians();fighters[0].x=1190;fighters[0].y=580;harborInteract()");assert(run('OLYMPIAN_WAGER.join(" ")').includes('back in time'));assert(run('adventure.dialogue.lines.join(" ")').includes('Engin'));assert(!run('adventure.dialogue.lines.join(" ")').includes('bell'));
run('$("harborTalkNext").onclick()');assert(run("$('harborBoard').textContent").includes('TIME RIFT'));assert.equal(run("$('harborReplay').hidden"),false);
run('$("harborBoard").onclick();render()');assert(run('adventure.timeRift'));assert.equal(run('active()'),false);const health=run('fighters[0].hp');run('applyDamage(fighters[0],99);update(3);render()');close(run('fighters[0].hp'),health);run('paused=true;var left=adventure.timeRift.left;update(1)');close(run('adventure.timeRift.left'),run('left'));run('paused=false;update(4);render()');assert.equal(run('atEnginPast()'),true);assert.equal(run("adventureStored('one-vs-one-engin-past-arrived')"),1);assert.equal(run('fighters[0].hasDoorKey'),true);
run('fighters[0].x=1050;fighters[0].y=650;harborInteract()');assert(run('adventure.dialogue.npc.engin'));assert(run('adventure.dialogue.lines.join(" ")').includes('Home? Maybe'));run('closeHarborDialogue();fighters[0].x=280;fighters[0].y=560;harborInteract();$("harborTalkNext").onclick();$("harborBoard").onclick()');assert.equal(run('atOlympians()'),true);
// Replay remains a separate choice after the reward becomes a journey.
run('fighters[0].x=1190;fighters[0].y=580;harborInteract();$("harborTalkNext").onclick();$("harborReplay").onclick()');assert.equal(run('inOlympianTrial()'),true);
// The finisher never harms the player: Kraken interrupts before the strike lands.
run('enterHarbor();startSailerFight();update(6);fighters[0].hp=67;fighters[0].potions=1;fighters[0].playerLives=2;applyDamage(fighters[1],999)');assert.equal(run('krakenInterruptionBeat(0)'),'charge');assert.equal(run('krakenInterruptionBeat(2.6)'),'grab');assert.equal(run('krakenInterruptionBeat(4.2)'),'drag');assert.equal(run('krakenInterruptionBeat(6.2)'),'rescue');assert.equal(run('active()'),false);
run('update(1);render()');assert(run('adventure.line').includes('handed over'));assert(run("$('name2').textContent").includes('FINAL ATTACK'));run('applyDamage(fighters[0],999);update(2);render()');assert(run('adventure.line').includes('before the killing blow'));run('update(1.5);render()');assert(run('adventure.line').includes('overboard'));run('update(2);render()');assert(run('adventure.line').includes('Help!'));run('update(2);render()');assert.equal(run('adventure.harborScene'),null);assert.equal(run('fighters[1].isKraken'),true);close(run('fighters[0].hp'),67);assert.equal(run('fighters[0].potions'),1);assert.equal(run('fighters[0].playerLives'),2);
// Developer preview reaches Engin without writing a new reward/progression save.
run("window.localStorage.data={};setAdventureGodMode(true);adventure.olympianWon=true;enterOlympians();beginEnginRift();update(7);render()");assert.equal(run('atEnginPast()'),true);assert.equal(run("adventureStored('one-vs-one-engin-past-arrived')"),0);
run('start();render()');assert.equal(run('adventure'),null);
console.log('Time reward: saved winners get Engin journey, pause/HP safety, workshop dialogue and return/replay, no old information reward; Sailer charge/grab/drag/rescue sequence preserves all resources; test-mode save isolation PASS');
