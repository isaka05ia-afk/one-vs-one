const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','queen-afflictions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js','adventure-olympians.js','adventure-time-rift.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);












run("$('mode').value='training';$('opponent').value='0';$('format').value='series';$('map').value='court';selected=4;$('trainingStage').value='3';start()");
const families=Array.from(run('cardFamilies(4)')),loadoutsToDraw=[[]];
for(const card of families){for(const c of card==='selfish'?Array.from(run('SELFISH_IDS')):[card]){loadoutsToDraw.push([c]);loadoutsToDraw.push([c,c]);}}
const actual=['selfish_runner','selfish_swimmer','selfish_skater','so_power','too_old','kids','no_pain'];for(const a of actual)for(const b of actual)if(a!==b&&run(`validLoadout(4,${JSON.stringify([a,b])})`))loadoutsToDraw.push([a,b]);
run('var depths=0,paintOps=0;var strictPaint=new Proxy({save(){depths++},restore(){depths--;if(depths<0)throw Error("Unbalanced restore")}}, {get(o,k){if(k in o)return o[k];return (...a)=>{paintOps++;for(const v of a)if(typeof v==="number"&&!Number.isFinite(v))throw Error("Nonfinite "+k)}},set(o,k,v){if(typeof v==="number"&&!Number.isFinite(v))throw Error("Nonfinite style "+k);o[k]=v;return true}})');
for(const cards of loadoutsToDraw){sandbox.drawCards=cards;run('loadouts[0]=drawCards;cardDraft=null;spawnRound()');for(let n=0;n<3;n++){run(`teamState(fighters[0]).active=${n};fighters[0].anim=.2;drawOlympic(strictPaint,fighters[0],1,false);drawCreatureCardEffects(strictPaint,fighters[0],1)`);assert.equal(run('depths'),0);}}
run("selected=5;start()");for(const card of run('SAILER_CARDS')){for(const cards of [[card],[card,card]]){sandbox.drawCards=cards;run('loadouts[0]=drawCards;spawnRound();fighters[0].anim=.2;drawFighter(strictPaint,fighters[0],1);drawCreatureCardEffects(strictPaint,fighters[0],1)');assert.equal(run('depths'),0);}}
assert(run('paintOps')>1000);assert.equal(run('ATHLETES[0].properName'),'Vasta');assert.equal(run('ATHLETES[1].properName'),'Latissa');assert.equal(run('ATHLETES[2].properName'),'Solea');
console.log('PASS: medieval rabbit/dolphin/hedgehog render through every normal card, ordered combo, all seven athlete selections/evolutions; five Sailer cards and evos; finite geometry and balanced canvas stacks.');

// Render every legal Bob / Door Man / Laores build, facing and dragon stage.
for(const id of [0,1,2]){
 const families=Array.from(run(`cardFamilies(${id})`)),builds=[[]];
 for(const a of families){builds.push([a],[a,a]);for(const b of families)if(a!==b)builds.push([a,b]);}
 sandbox.reviewId=id;run('selected=reviewId;start()');
 for(const cards of builds){sandbox.drawCards=cards;run('loadouts[0]=drawCards;spawnRound()');
 for(const stage of id===2?[1,2,3,4,5]:[1])for(const face of [-1,1])for(const t of [0,.125,1]){
 run(`fighters[0].stage=${stage};fighters[0].face=${face};fighters[0].anim=.2;drawFighter(strictPaint,fighters[0],${t},false);drawFighter(strictPaint,fighters[0],${t},true)`);assert.equal(run('depths'),0);
 }}
}
assert.equal(run('roster[0].name'),'BOB');
console.log('PASS: Bob, Door Man and Laores: every ordered card pair/evolution, all five dragon stages, both facings and animated frames; finite geometry, balanced canvas stack and Bob menu name.');
