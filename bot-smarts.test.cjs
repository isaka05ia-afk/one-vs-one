const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','queen-afflictions.js','creature-art.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);
// Other-fighter regression tests use a stationary 140-HP training target.
let dummyTarget=false;
const run=code=>{const result=vm.runInContext(code,sandbox);if(dummyTarget)vm.runInContext("if(fighters.length===2&&$('mode').value==='local'&&fighters[1].id===3&&fighters[1].maxHp===125){if(fighters[1].hp>0)fighters[1].hp+=15;fighters[1].maxHp=140}",sandbox);return result};
run("function useTestMap(){mapId=chooseMap($('map').value);walls=mapId==='grove'?mirrorWalls([[185,145,145,45],[185,510,145,45],[670,145,145,45],[450,245,100,80],[450,375,100,80]]):MAPS[mapId].walls}");
run("function nextTestRound(){if(cardDraft)chooseAbilityCard(cardDraft.player,cardDraft.options[0],cardDraft.id);spawnRound()}");
function setup(id=0,enemy=4){dummyTarget=enemy===4;if(dummyTarget)enemy=3;run(`selected=${id};$('mode').value='local';$('opponent').value='${enemy}';start();fighters[0].x=100;fighters[0].y=350;fighters[1].x=300;fighters[1].y=350;walls=[];`)}
function step(s){for(let t=0;t<s;t+=.01)run('update(.01)')}

run("var botSeed=781;Math.random=()=>{botSeed=(Math.imul(botSeed,1664525)+1013904223)>>>0;return botSeed/4294967296};");
const routes=[];
for(const map of ['grove','court','harbor','frost','portals','maze']){
 setup(0,1);run(`mapId='${map}';setArena(mapId);walls=MAPS[mapId].walls;fighters[0].x=135;fighters[0].y=H/2;fighters[1].x=W-135;fighters[1].y=H/2;`);
 let reached=false,seconds=0;for(let n=0;n<3500;n++){run('time+=.025;var route=botRoute(fighters[0],fighters[1]);if(route)move(fighters[0],route.x*5,route.y*5)');assert(run('free(fighters[0].x,fighters[0].y,fighterRadius(fighters[0]))'),map+' crossed wall');if(run('distance(fighters[0],fighters[1])<65')){reached=true;seconds=n*.025;break;}}
 assert(reached,map+' path did not reach target');routes.push({map,seconds});
}
setup(0,1);run('walls=[{x:400,y:300,w:350,h:45},{x:400,y:300,w:45,h:400},{x:400,y:655,w:350,h:45}];fighters[0].x=550;fighters[0].y=500;fighters[1].x=250;fighters[1].y=500;');
let escaped=false;for(let n=0;n<700;n++){run('time+=.025;var route=botRoute(fighters[0],fighters[1]);if(route)move(fighters[0],route.x*5,route.y*5)');if(run('distance(fighters[0],fighters[1])<65')){escaped=true;break;}}assert(escaped,'Must leave U-shaped trap even when first moving away from target');
setup(0,1);run("chosenDifficulty='expert';fighters[0].x=500;fighters[0].y=550;fighters[1].x=900;fighters[1].y=550;shots=[{owner:1,x:300,y:550,vx:500,vy:0,r:10,life:2}];var threats=botThreats(fighters[0],fighters[1],difficulty());botBrain(fighters[0]).threats=threats;var escape=botSteer(fighters[0],fighters[1],{x:1,y:0},90,.025);");assert.equal(run('threats.length'),1);assert(run('botThreatScore({x:fighters[0].x+escape.x*60,y:fighters[0].y+escape.y*60},threats)<botThreatScore(fighters[0],threats)'));assert(run('botEvadeDirection(fighters[0])!==null'));
run('fighters[0].dodgeCd=1');assert.equal(run('botEvadeDirection(fighters[0])'),null,'Cannot waste an action on dodge cooldown');run('fighters[0].dodgeCd=0');
run('shots[0].vx=-500');assert.equal(run('botThreats(fighters[0],fighters[1],difficulty()).length'),0,'Receding projectile must not waste dodge');
run('shots[0].vx=500;walls=[{x:390,y:400,w:40,h:300}]');assert.equal(run('botThreats(fighters[0],fighters[1],difficulty()).length'),0,'Cover must block threat forecast');
setup(0,1);run("chosenDifficulty='expert';fighters[0].aiControlled=true;fighters[0].aiThink=0;fighters[0].aiAction=100;bot(fighters[0],fighters[1],.01);var rememberedAim=fighters[0].botAim;fighters[1].y+=150;bot(fighters[0],fighters[1],.01)");assert.equal(run('fighters[0].botAim'),run('rememberedAim'),'Aim must wait for next reaction sample');
assert(run('difficulties.easy.reaction>difficulties.normal.reaction&&difficulties.normal.reaction>difficulties.hard.reaction&&difficulties.hard.reaction>difficulties.expert.reaction&&difficulties.expert.reaction>=.1'));
let builds=0;
for(let id=0;id<9;id++){
 setup(id,0);const families=Array.from(run(`cardFamilies(${id})`)).flatMap(c=>c==='selfish'?['selfish_runner','selfish_swimmer','selfish_skater']:[c]),cards=[[],...families.flatMap(c=>[[c],[c,c]])];for(const a of families)for(const b of families)if(a!==b)cards.push([a,b]);

 for(const build of cards){if(!run(`validLoadout(${id},${JSON.stringify(build)})`))continue;sandbox.botBuild=build;run("loadouts[0]=botBuild;spawnRound();fighters[0].aiControlled=true;chosenDifficulty='expert';fighters[0].x=200;fighters[0].y=550;fighters[1].x=600;fighters[1].y=550;walls=[];");for(let n=0;n<15;n++)run('update(.025)');assert(run('fighters.every(f=>Number.isFinite(f.x)&&Number.isFinite(f.y)&&Number.isFinite(f.hp))'));builds++;}
}
console.log('PASS: six arena routes including labyrinth, U-trap escape, incoming/receding/covered projectile decisions, safe dodge, reaction limits and '+builds+' legal base/card/evolution bot builds.');console.log(JSON.stringify(routes));
