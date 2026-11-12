const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);









const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
function door(phase){sandbox.phase=phase;run("setAdventureGodMode(false);startAdventure();paused=false;adventure.phase=phase;adventure.deaths=0;adventure.actionTimer=adventure.teleportTimer=99;walls=[];fighters[0].x=500;fighters[0].y=550;fighters[0].aim=0;fighters[1].x=800;fighters[1].y=550;fighters[1].cd=[99,99,99];mouseAim=false;inputMode='mouse'");}
for(const phase of [1,2]){door(phase);run('for(let i=0;i<120;i++)update(.01)');const d=run('distance(fighters[0],fighters[1])');assert(d<105+run('fighterRadius(fighters[1])'));const before=run('fighters[1].hp');run('attack(0,0)');assert(run('fighters[1].hp')<before);}
// No retreat vector at the old unreachable gap in the second form.
door(2);run('fighters[1].x=640;var direction=bot(fighters[1],fighters[0],.01)');assert(run('direction.x')<0);
// The fast portal run ends close enough to punish during its recovery window.
door(1);run('fighters[0].x=800;fighters[1].x=400;startBossDoorRush();for(let n=0;n<1000&&adventure.doorRush;n++)tickBossDoorRush(.01)');assert.equal(run('adventure.doorRush'),null);assert(run('distance(fighters[0],fighters[1])')<=250&&run('distance(fighters[0],fighters[1])')>=238);run("keys.add('a');for(let n=0;n<60;n++)update(.01);keys.clear();fighters[0].aim=Math.PI");assert(run('adventure.recovery')>0);assert(run('distance(fighters[0],fighters[1])')<127);const vulnerableHP=run('fighters[1].hp');run('attack(0,0)');assert(run('fighters[1].hp')<vulnerableHP);
run('startSailerFight();update(6);adventure.harbor.timer=99;fighters[0].x=500;fighters[0].y=550;fighters[0].aim=0;fighters[1].x=800;fighters[1].y=550;for(let n=0;n<150;n++)update(.01)');assert(run('distance(fighters[0],fighters[1])')<127);const sailerHP=run('fighters[1].hp');run('attack(0,0)');assert(run('fighters[1].hp')<sailerHP);
run('harborWarn("paddle",fighters[0],.01);tickShip(.02);var rooted=bot(fighters[1],fighters[0],.01)');assert(run('adventure.harbor.recovery')>0);close(run('rooted.x'),0);close(run('rooted.y'),0);
// All Door Man attacks inherit the buff, and the agreed surrender remains proportional.
door(1);close(run('heroDamage(fighters[1])'),1.35);run('hit(fighters[1],fighters[0],20)');close(run('fighters[0].hp'),83);door(2);close(run('heroDamage(fighters[1])'),1.55);run('hit(fighters[1],fighters[0],20)');close(run('fighters[0].hp'),79);run('adventure.deaths=71');close(run('heroDamage(fighters[1])'),1.55*.85);
// Cancelled projectile request: holding Slash remains a normal melee release.
door(1);run("$('aimBeforeShoot').checked=true;fighters[1].aiControlled=false;fighters[1].x=580;beginPlayerAttack(0);for(let n=0;n<80;n++)update(.01)");assert.equal(run('shots.length'),0);const heldHP=run('fighters[1].hp');run('endPlayerAttack(0)');assert(run('fighters[1].hp')<heldHP);assert.equal(run('shots.length'),0);assert.equal(run('getMoves(fighters[0]).length'),3);
const lines=run('HARBOR_NPCS.find(n=>n.sailer).lines.join(" ")');assert(lines.includes('key'));assert(lines.includes('trying to leave'));run('startSailerFight();update(2.5)');assert(run('adventure.line').includes('harbor'));run('update(2)');assert(run('adventure.line').includes('more than you'));
console.log('Boss melee access: both Door forms and Sailer approach into Slash range, portal recovery punish, Sailer recovery, increased damage/mercy, key-theft motive and no Slash projectile PASS');
