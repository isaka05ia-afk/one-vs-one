const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','game.js','adventure.js','adventure-harbor.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);









const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
for(const phase of [1,2]){
 run(`startAdventure();paused=false;adventure.phase=${phase};adventure.deaths=0;walls=[];fighters[1].x=400;fighters[1].y=500;shots=[];adventure.warnings=[];var warning=bossWarning('keys',{x:400,y:500,aim:.7},.65)`);
 assert.equal(run('bossKeyTellVisible(warning)'),false);
 run('fighters[1].x=530;fighters[1].y=610;tickAdventure(.54)');assert.equal(run('bossKeyTellVisible(warning)'),false);
 // Marker has moved from its old scheduled origin to the actual launch location.
 run('tickAdventure(.02)');assert.equal(run('bossKeyTellVisible(warning)'),true);close(run('warning.keyOrigin.x'),530);close(run('warning.keyOrigin.y'),610);
 run('var motion=bot(fighters[1],fighters[0],.01)');close(run('motion.x'),0);close(run('motion.y'),0);
 // Inspect canvas calls as well as projectile paths, not just a shared boolean.
 run('var drawn=[];var markerCanvas={save(){},restore(){},beginPath(){},moveTo(x,y){drawn.push({x,y})},lineTo(x,y){drawn[drawn.length-1].ex=x;drawn[drawn.length-1].ey=y},stroke(){}};drawBossKeyTell(markerCanvas,warning)');
 assert.equal(run('drawn.length'),phase===1?3:5);
 run('fighters[1].x=700;fighters[1].y=650;tickAdventure(.1)');assert.equal(run('shots.length'),phase===1?3:5);assert.equal(run('adventure.warnings.length'),0);
 for(let i=0;i<(phase===1?3:5);i++){
  close(run(`shots[${i}].x`),run(`drawn[${i}].x`));close(run(`shots[${i}].y`),run(`drawn[${i}].y`));
  close(run(`shots[${i}].vx/shots[${i}].vy`),run(`(drawn[${i}].ex-drawn[${i}].x)/(drawn[${i}].ey-drawn[${i}].y)`));
  close(run(`Math.hypot(drawn[${i}].ex-drawn[${i}].x,drawn[${i}].ey-drawn[${i}].y)`),950);
 }
 run('drawn=[];drawBossKeyTell(markerCanvas,warning)');assert.equal(run('drawn.length'),0);
}
// The final 0.1 s remains the marker window even when mercy extends total windup.
run("startAdventure();paused=false;adventure.deaths=100;adventure.warnings=[];var extended=bossWarning('keys',fighters[1],.65);extended.left=.1001");assert.equal(run('bossKeyTellVisible(extended)'),false);run('extended.left=.1');assert.equal(run('bossKeyTellVisible(extended)'),true);run('extended.left=0');assert.equal(run('bossKeyTellVisible(extended)'),false);
console.log('Key marker: hidden until final 0.1 s; moving-origin fix; boss holds position; all 3/5 rendered rays exactly match projectile origin/direction/range; no marker after firing PASS');
