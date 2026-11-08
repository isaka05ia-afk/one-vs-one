const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{})});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},getContext:()=>context,querySelector:()=>node(),value:'local',textContent:'',innerHTML:''});const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/game.js','utf8'),sandbox);
function check(code){return vm.runInContext(code,sandbox)}

function setup(id,enemy=0){check(`selected=${id};$('opponent').value='${enemy}';$('mode').value='local';start();fighters[0].x=400;fighters[1].x=500;`)}
function step(seconds){for(let t=0;t<seconds;t+=.01)check('update(.01)')}
setup(0,1);assert.equal(check('fighters[0].maxHp'),140);assert.equal(check('fighters[1].maxHp'),90);
setup(3);check('attack(0,0)');assert.equal(check('fighters[1].hp'),140);step(.5);assert.equal(check('fighters[1].hp'),140);step(.6);assert(check('fighters[1].hp')<140);const hp=check('fighters[1].hp');check('attack(0,0)');assert.equal(check('fighters[1].hp'),hp);
setup(0);check('attack(0,0)');assert.equal(check('fighters[1].hp'),140);assert(check('fighters[0].armor')>0);step(.4);assert.equal(check('fighters[1].hp'),118);
setup(0);check('attack(0,1)');step(.3);assert.equal(check('fighters[1].hp'),113);
setup(0);check('fighters[1].x=480;attack(0,2)');assert(check('fighters[1].bagged')>0);assert(check('fighters[1].x')>=600);
setup(1);check('attack(0,0)');assert(check('fighters[0].x>fighters[1].x'));assert.equal(check('fighters[1].hp'),140);
setup(1);check('jump(0);jump(0)');assert.equal(check('fighters[0].jumps'),2);check('jump(0)');assert.equal(check('fighters[0].jumps'),2);
setup(0);check('jump(0);jump(0)');assert.equal(check('fighters[0].jumps'),1);
setup(1);check('attack(0,1)');assert.equal(check('fighters[1].stun'),0);step(.4);assert(check('fighters[1].stun')>0);step(1);assert.equal(check('fighters[1].stun'),0);
setup(0);check("keys.add('d');dodge(0);hit(fighters[1],fighters[0],50)");assert.equal(check('fighters[0].hp'),140);step(.2);assert(check('fighters[0].x>fighters[1].x'));assert(check('fighters[0].dodgeCd')>0);
setup(0);check('jump(0)');step(.2);check('fighters[0].x=500;fighters[1].x=500');step(.01);assert(check('Math.abs(fighters[0].x-fighters[1].x)<1'));
setup(2);check('attack(0,0)');step(.4);assert(check('fighters[1].burn')>0);const burned=check('fighters[1].hp');step(.6);assert(check('fighters[1].hp')<burned);
setup(3);check('attack(0,1)');step(1.1);assert.equal(check('fighters[1].hp'),140);assert(check('zones.length')>0);check('fighters[1].x=850');step(.7);assert.equal(check('fighters[1].hp'),140);
for(let i=0;i<4;i++)for(let j=0;j<3;j++){setup(i);check(`attack(0,${j})`);step(2);check('render(1)');assert(check('fighters.every(f=>Number.isFinite(f.hp)&&f.hp>=0&&f.hp<=f.maxHp)'))}
console.log('PASS: all 12 attacks; class HP; windups; combo; grab; portal crossing; double jump; stun; dodge immunity and crossing; airborne crossing; burn; zone escape; cooldown.');
