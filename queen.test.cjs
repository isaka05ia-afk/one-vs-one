const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','queen-afflictions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js','adventure-olympians.js','adventure-time-rift.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);











function setupQueen(cards=[]){sandbox.testCards=cards;run("$('mode').value='local';$('opponent').value='0';$('format').value='series';$('map').value='court';selected=8;start();loadouts[0]=testCards;spawnRound();setArena('court');walls=[];fighters[0].x=500;fighters[0].y=500;fighters[0].aim=fighters[0].lockedAim=0;fighters[0].target={x:800,y:500};fighters[1].x=800;fighters[1].y=500;mouseAim=false;inputMode='mouse';fighters[1].dodge=0;fighters[1].guard=0;fighters[0].hp=60");}
setupQueen();assert.equal(run('roster.length'),9);assert.equal(run('cardFamilies(8).length'),5);assert.equal(run('getMoves(fighters[0]).length'),3);
run('executeQueen(0,0);for(let n=0;n<60;n++){if(!updateQueenShot(shots[0],.01))break;}');assert(run('queenMark(fighters[1],0)'));assert(run('fighters[1].hp')<150);
run('executeQueen(0,1);var decree=zones[0]');const before=run('fighters[1].hp');run('updateQueenZone(decree,.7)');assert.equal(run('fighters[1].hp'),before);run('updateQueenZone(decree,.25)');assert(run('fighters[1].hp')<before);assert.equal(run('queenMark(fighters[1],0)'),undefined);assert(run('fighters[1].curseSlow')>0);
setupQueen();run('fighters[0].cd=[2,6,11];executeQueen(0,2)');assert.equal(run('queenMoves(fighters[0])[0][1]'),'curse_dodge');assert.equal(run('fighters[0].cd[1]'),0);run('executeQueen(0,0)');assert.equal(run('fighters[0].cd[1]'),6);assert.equal(run('fighters[1].curseRules[0].rule'),'dodge');const hp=run('fighters[1].hp');run('dodge(1)');assert.equal(run('fighters[1].hp'),hp-18);run('triggerQueenCurse(1,"dodge")');assert.equal(run('fighters[1].hp'),hp-18);
setupQueen();run('executeQueen(0,2);executeQueen(0,1)');assert.equal(run('fighters[1].curseRules[0].rule'),'attack');run('fighters[1].x=550;attack(1,0)');assert.equal(run('fighters[1].hp'),132);
setupQueen(['my_kingdom']);run('executeQueen(0,1)');assert.equal(run('zones[0].r'),145);assert.equal(run('zones[0].life'),180);run('executeQueen(0,2);updateQueen(5.1)');assert.equal(run('fighters[0].queenChoosing'),0);assert.equal(run('fighters[0].queenSavedCd'),null);
for(const a of run('QUEEN_CARDS'))for(const b of run('QUEEN_CARDS'))if(a!==b){setupQueen([a,b]);assert(run('validLoadout(8,loadouts[0])'));run('fighters.forEach(f=>f.aiControlled=true)');for(let n=0;n<400;n++)run('update(.02);if(Math.random()<.05)render()');assert(run('fighters.every(f=>Number.isFinite(f.hp)&&Number.isFinite(f.x))'));}
setupQueen();run('walls=[{x:620,y:400,w:40,h:200}];executeQueen(0,0)');const oldHp=run('fighters[1].hp');assert.equal(run('updateQueenShot(shots[0],.5)'),false);assert.equal(run('fighters[1].hp'),oldHp);
setupQueen();run('executeQueen(0,1);var escaped=zones[0];fighters[1].y=800;updateQueenZone(escaped,1)');assert.equal(run('fighters[1].hp'),150);
console.log('PASS: Queen needle/mark/cover, delayed decree/escape/slow, rule selection without cooldown lock, once-only dodge/attack punishments, all 20 card combinations, marks/charges/healing/expiry, bot simulations and rendering.');
setupQueen();run("fighters[1].id=6;fighters[1].cards=['dummy_voodoo','dummy_voodoo'];fighters[1].maxHp=fighters[1].hp=110;fighters[1].aim=fighters[1].lockedAim=Math.PI;voodooState(fighters[1]).ready=true;installCopy(fighters[1],0,2,0);executeCopiedAttack(1,0)");assert.equal(run('fighters[1].id'),6);assert.equal(run('fighters[1].maxHp'),110);assert.equal(run('fighters[0].curseRules[0].rule'),'dodge');assert.equal(run('fighters[1].queenChoosing'),undefined);
console.log('PASS: copied Queen Punishment applies No Escape without inheriting Queen HP or leaking her choice state.');
