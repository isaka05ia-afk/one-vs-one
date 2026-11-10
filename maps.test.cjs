const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);
function arena(mode='ffa4',ids=[0,3,0,3],cards=[]){sandbox.ids=ids;sandbox.cardSets=cards;run(`$('mode').value='ai';$('battleMode').value='${mode}';$('map').value='grove';$('format').value='series';$('aimBeforeShoot').checked=false;selected=ids[0];start();battleSlots.forEach((s,i)=>{s.fighter=ids[i%ids.length];s.bot=false});loadouts=battleSlots.map((s,i)=>cardSets[i]||[]);roundNumber=2;spawnRound();mapId='grove';walls=[];fighters.forEach((f,i)=>{f.x=200+i*160;f.y=550;f.aiControlled=false});`)}
function step(s){run(`for(let n=0;n<${Math.ceil(s/.01)};n++)update(.01)`)}

for(const id of run('Object.keys(MAPS)')){
 sandbox.mapChoice=id;
 run("$('mode').value='training';$('map').value=mapChoice;$('opponent').value='3';start()");
 assert.equal(run('mapId'),id);assert(run('fighters.every(f=>free(f.x,f.y))'),id+' spawn');
 run('render()');
 const connected=run(`(()=>{const step=25,cols=Math.ceil(W/step),key=(x,y)=>x+y*cols,queue=[{x:5,y:Math.round(H/2/step)}],seen=new Set();for(let n=0;n<queue.length;n++){const p=queue[n];if(p.x*step>W-170&&Math.abs(p.y*step-H/2)<60)return true;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,y=p.y+dy,k=key(x,y);if(!seen.has(k)&&free(x*step,y*step)){seen.add(k);queue.push({x,y})}}}return false})()`);
 assert(connected,id+' walkable cross-map route');
 for(const mode of ['ffa4','team3']){run(`$('mode').value='ai';$('battleMode').value='${mode}';$('map').value=mapChoice;start()`);assert(run('fighters.every(f=>free(f.x,f.y))'),id+' '+mode+' spawns')}
}
run("setArena('maze');fighters[0].x=135;fighters[0].y=800;fighters[1].x=2465;fighters[1].y=800");
for(let n=0;n<8000;n++){run('(()=>{const f=fighters[0],v=mazeDirection(f,fighters[1]);if(v)move(f,v.x*10,v.y*10)})()');if(run('distance(fighters[0],fighters[1])<100'))break}
assert(run('distance(fighters[0],fighters[1])<100'),'Bot crosses labyrinth');
run("setArena('portals');fighters[0].hp=100;fighters[0].arenaPortalArmed=true;fighters[0].arenaPortalCd=0;fighters[0].x=300;fighters[0].y=300;updateArenaPortals(.01)");assert.equal(run('fighters[0].x'),1300);assert.equal(run('fighters[0].y'),800);run('updateArenaPortals(2)');assert.equal(run('fighters[0].x'),1300);run('fighters[0].x=1200;updateArenaPortals(.01);fighters[0].x=1300;updateArenaPortals(.01)');assert.equal(run('fighters[0].x'),300);
run("setArena('harbor');fighters[0].id=0;fighters[0].x=600;fighters[0].y=250");assert.equal(run('terrainSpeed(fighters[0])'),.55);run('fighters[0].id=5');assert.equal(run('terrainSpeed(fighters[0])'),1);run('fighters[0].x=800;fighters[0].y=550');assert.equal(run('terrainSpeed(fighters[0])'),1);
run("setArena('court')");assert.equal(run('walls.length'),0);assert.equal(run('W'),1600);
console.log('PASS: all six replacement maps render; 2/4/6-player spawns, walkable routes, bot labyrinth routing, portal pairs/re-entry, harbor water/Sailer/dry docks, dimensions reset.');
