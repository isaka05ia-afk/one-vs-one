const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','creature-art.js','game.js','adventure.js','adventure-harbor.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);








const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
run("window.localStorage={data:{},getItem(k){return this.data[k]||null},setItem(k,v){this.data[k]=v}};adventureSave('one-vs-one-door-key',1);startAdventure();enterHarbor();startSailerFight();update(6)");close(run('fighters[1].maxHp'),480);
run('applyDamage(fighters[1],999);update(8);adventure.harbor.timer=99;fighters[0].x=800;fighters[0].y=550');
run('var seen=new Set();var maximum=0;for(let n=1;n<=9;n++){adventure.harbor.pattern=n;adventure.harbor.warnings=[];queueKrakenPattern();for(const w of adventure.harbor.warnings)seen.add(w.kind);maximum=Math.max(maximum,adventure.harbor.warnings.length)}');assert.equal(run('seen.size'),9);assert(run('KRAKEN_KINDS.every(k=>seen.has(k))'));assert(run('maximum')>=5);
// New visuals and damage geometry have matching bounded strips/capsules/circles.
run('var paint=new Proxy({},{get(o,k){return o[k]||(o[k]=(...a)=>{for(const v of a)if(typeof v==="number"&&!Number.isFinite(v))throw Error("Non-finite "+k)})},set(o,k,v){o[k]=v;return true}});for(let n=1;n<=9;n++){adventure.harbor.pattern=n;adventure.harbor.warnings=[];queueKrakenPattern();for(const w of adventure.harbor.warnings){drawShipAttackWarning(paint,w);addShipVisualImpact(w);drawShipVisualImpact(paint,adventure.harbor.effects.at(-1))}}');
run("var vertical=harborWarn('v_sweep',{x:800,y:550},1);var ink=harborWarn('ink',{x:800,y:550},1,58)");assert.equal(run('shipWarningHits(vertical,{x:864,y:300})'),true);assert.equal(run('shipWarningHits(vertical,{x:866,y:300})'),false);assert.equal(run('shipPhysicalAttack(ink)'),false);
run('adventure.harbor.pattern=7;adventure.harbor.warnings=[];queueKrakenPattern();var tail=adventure.harbor.warnings[0]');assert.equal(run('tail.kind'),'tail');assert.equal(run('shipWarningHits(tail,{x:(tail.a.x+tail.b.x)/2,y:(tail.a.y+tail.b.y)/2})'),true);
run('adventure.harbor.warnings=[];adventure.harbor.timer=0;fighters[1].hp=480;tickShip(.01)');close(run('adventure.harbor.timer'),5);run('adventure.harbor.warnings=[];adventure.harbor.timer=0;fighters[1].hp=100;tickShip(.01)');assert(run('adventure.harbor.timer')>=4.6);
// Every pattern gives at least two seconds of visible warning, including enraged ink.
run('for(let n=1;n<=9;n++){adventure.harbor.pattern=n;adventure.harbor.warnings=[];queueKrakenPattern();if(adventure.harbor.warnings.some(w=>w.total<2))throw Error("Short Kraken warning")}');
// One marked slam cannot hit early. A second pattern waits until every warning ends.
run('adventure.harbor.pattern=0;adventure.harbor.warnings=[];adventure.harbor.timer=0;fighters[1].hp=480;fighters[0].hp=110;fighters[0].spawnShield=0;fighters[0].guard=0;fighters[0].dodge=0;tickShip(.01);var slowPattern=adventure.harbor.pattern;var hpBefore=fighters[0].hp;for(let n=0;n<150;n++)tickShip(.01)');assert.equal(run('fighters[0].hp'),run('hpBefore'));assert.equal(run('adventure.harbor.pattern'),run('slowPattern'));assert(run('adventure.harbor.warnings.length')>0);
// Full fight pressure stays bounded and leaves tentacles that can be struck.
run('fighters[0].hp=110;setAdventureGodMode(true);for(let n=0;n<4500;n++){update(.01);if(n%200===0)render()}');close(run('fighters[0].hp'),110);assert(run('adventure.harbor.exposed.length')>0);assert(run('adventure.harbor.effects.length')<=24);assert(run('adventure.harbor.warnings.length')<16);
// A real rescue opens an on-deck conversation with clue, interruption and safe harbor.
run('setAdventureGodMode(false);adventure.testRun=false;applyDamage(fighters[1],999);enterShipAftermath();render()');assert.equal(run('adventure.chapter'),'ship_rest');assert.equal(run('adventure.dialogue.npc.name'),'Sailer');assert.equal(run('beginOlympiansVoyage()'),false);assert.equal(run('sailerTalkDone()'),false);
assert(run('SAILER_AFTER_RESCUE.join(" ")').includes('no way out'));assert(run('SAILER_AFTER_RESCUE.join(" ")').includes('old heart'));assert(run('SAILER_AFTER_RESCUE.join(" ")').includes('Forget'));assert(run('SAILER_AFTER_RESCUE.join(" ")').includes('rest'));
run('for(let n=0;n<SAILER_AFTER_RESCUE.length-1;n++)$("harborTalkNext").onclick();$("harborBoard").onclick()');assert.equal(run('inHarbor()'),true);assert.equal(run('sailerTalkDone()'),true);assert.equal(run("adventureStored('one-vs-one-sailer-talk')"),1);assert.equal(run('fighters[0].potions'),3);
// Explicit lending choice begins the next voyage and returns the permanent key on arrival.
run('fighters[0].x=1240;fighters[0].y=550;harborInteract();$("harborTalkNext").onclick()');assert(run("$('harborBoard').textContent").includes('LEND THE KEY'));run('$("harborBoard").onclick();render()');assert.equal(run('adventure.keyLoaned'),true);assert.equal(run('fighters[0].hasDoorKey'),false);run('update(3);render();update(4);render()');assert.equal(run('atOlympians()'),true);assert.equal(run('fighters[0].hasDoorKey'),true);assert.equal(run('adventure.keyLoaned'),false);assert.equal(run("adventureStored('one-vs-one-olympians-arrived')"),1);
run('for(const npc of OLYMPIANS_RESIDENTS.slice(0,3)){fighters[0].x=npc.x;fighters[0].y=npc.y;harborInteract();if(!adventure.dialogue)throw Error("No conversation");$("harborTalkNext").onclick();closeHarborDialogue()}');
run('fighters[0].x=190;fighters[0].y=550;harborInteract();$("harborTalkNext").onclick();$("harborBoard").onclick()');assert.equal(run('inHarbor()'),true);close(run('fighters[0].hp'),110);
// Developer-mode rescue/conversations/travel are playable but never create quest saves.
run("window.localStorage.data={};setAdventureGodMode(true);startAdventure();enterHarbor();startSailerFight();update(6);applyDamage(fighters[1],999);update(8);applyDamage(fighters[1],999);enterShipAftermath();for(let n=0;n<5;n++)$('harborTalkNext').onclick();$('harborBoard').onclick();fighters[0].x=1240;fighters[0].y=550;harborInteract();$('harborTalkNext').onclick();$('harborBoard').onclick();update(7)");assert.equal(run('atOlympians()'),true);assert.equal(run("adventureStored('one-vs-one-sailer-talk')"),0);assert.equal(run("adventureStored('one-vs-one-olympians-arrived')"),0);
run('start();render()');assert.equal(run('adventure'),null);
console.log('Kraken/story: 480 HP Sailer, nine visual attack types and overlap pressure, low-HP tempo, bounded simulations, ship dialogue/clue, harbor rest, explicit key loan, Olympians arrival/NPCs/return and test-save isolation PASS');

run('var costumeCalls=[];var oldSailerPaint=drawOldSailer;drawOldSailer=(c,f)=>costumeCalls.push(f);for(const elapsed of [1,2.8,3.3,4.8])drawKrakenInterruptionScene(paint,{elapsed});drawOldSailer=oldSailerPaint');assert.deepEqual(Array.from(run('costumeCalls.map(f=>f.hidePaddle)')),[true,false,true,true]);assert.equal(run('sailerPaddleDropped(3.19)'),false);assert.equal(run('sailerPaddleDropped(3.2)'),true);
console.log('PASS: Kraken 2–3.25-second warnings, slower separated patterns, no early hit; dropped paddle leaves Sailer hand.');
