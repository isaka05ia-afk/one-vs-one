const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['fighters.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);
const run=code=>vm.runInContext(code,sandbox);
function setup(id=0,enemy=4){run(`selected=${id};$('mode').value='local';$('opponent').value='${enemy}';start();fighters[0].x=100;fighters[0].y=350;fighters[1].x=300;fighters[1].y=350;`)}
function step(s){for(let t=0;t<s;t+=.01)run('update(.01)')}
setup();run("keys.add('w');keys.add('d')");step(.2);assert(run('fighters[0].x>100&&fighters[0].y<350'));assert(Math.abs(run('distance(fighters[0],{x:100,y:350})')-39)<1);
setup();run('fighters[0].x=400;fighters[0].y=280;move(fighters[0],250,0)');assert(run('fighters[0].x<430'));assert(run('free(fighters[0].x,fighters[0].y)'));
setup();run('fighters[0].x=400;fighters[0].y=280;fighters[1].x=600;fighters[1].y=280;attack(0,0)');step(1);assert.equal(run('fighters[1].hp'),110);assert.equal(run('shots.length'),0);
setup(2);run('fighters[0].aim=-Math.PI/2;attack(0,0)');step(.5);assert.equal(run('fighters[1].hp'),110);
setup(2);run('attack(0,0)');step(.6);assert(run('fighters[1].hp<110'));assert(run('fighters[1].burn>0'));
setup(1);run('attack(0,1)');step(.5);assert(run('fighters[1].stun>0'));step(1);assert.equal(run('fighters[1].stun'),0);
setup();run("keys.add('d');dodge(0);hit(fighters[1],fighters[0],50)");assert.equal(run('fighters[0].hp'),150);step(.15);assert(run('fighters[0].x>180'));assert(run('fighters[0].dodgeCd>0'));
setup(1);run('fighters[0].x=400;fighters[0].y=280;attack(0,2)');step(.5);assert(run('fighters[0].x<430'));
setup(4);run('attack(0,1);hit(fighters[1],fighters[0],20)');assert.equal(run('fighters[0].hp'),103);
setup(3);run('fighters[1].x=220;attack(0,0)');step(.5);assert.equal(run('fighters[1].hp'),110);step(.4);assert.equal(run('fighters[1].hp'),78);
setup(4);run('mouseAim=true;aimPoint={x:300,y:350};attack(0,2)');assert.equal(run('fighters[1].hp'),110);run('fighters[1].y=500');step(1);assert.equal(run('fighters[1].hp'),110);
setup();run("$('mode').value='ai';$('opponent').value='1';start()");assert.equal(run('fighters[1].id'),4);step(8);assert(run('fighters.every(f=>free(f.x,f.y)&&Number.isFinite(f.hp))'));
for(let i=0;i<5;i++)for(let j=0;j<3;j++){setup(i);run(`attack(0,${j})`);step(2);run('render()');assert(run('fighters.every(f=>Number.isFinite(f.hp)&&f.hp>=0&&f.hp<=f.maxHp&&free(f.x,f.y))'))}
setup();run("attack(0,0);paused=true");const cd=run('fighters[0].cd[0]'),x=run('fighters[0].x');step(.4);assert.equal(run('fighters[0].cd[0]'),cd);assert.equal(run('fighters[0].x'),x);
console.log('PASS: 15 abilities, 2D movement, normalized diagonals, cover collision, blocked shots, aiming/misses, burn, lock, dodge immunity, dash collision, shields, pose delay, blast escape, bot identity/navigation, pause and rendering.');
