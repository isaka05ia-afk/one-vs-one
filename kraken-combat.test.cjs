const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','queen-afflictions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);
run(`function finishShipBossFixture(){if(fighters[1].isKraken){const p=fighters[0];p.hasPaddle=true;p.aim=0;exposeTentacle(p.x+60,p.y,5);const t=adventure.harbor.exposed.find(t=>cone(p,t,155,1.15));if(t)hitKrakenTentacle(p,t,999);}else applyDamage(fighters[1],999);}`);









run("startAdventure();enterHarbor();startSailerFight();update(6);applyDamage(fighters[1],999);update(8);adventure.harbor.timer=99;fighters[0].x=500;fighters[0].y=550;");
assert.equal(run('fighters[1].x'),95);assert.equal(run('terrainAt(fighters[1]).water'),true);assert(run('fighters[1].x<185-fighterRadius(fighters[1])'),'Kraken body stays outside deck');
const hp=run('fighters[1].hp');run('applyDamage(fighters[1],999);hit(fighters[0],fighters[1],99,{area:true})');assert.equal(run('fighters[1].hp'),hp,'Body and incidental attacks cannot deal damage');
const expected=[4,4,10,6,4,4,2,12,6];for(let n=1;n<=9;n++){run(`adventure.harbor.pattern=${n};adventure.harbor.warnings=[];queueKrakenPattern()`);assert.equal(run('adventure.harbor.warnings.length'),expected[n-1]);assert.equal(run('adventure.harbor.warnings.filter(w=>w.followUp).length'),expected[n-1]/2);assert(run('adventure.harbor.warnings.every(w=>w.total>=2)'));}
run("adventure.harbor.exposed=[];exposeTentacle(570,550);fighters[0].hasPaddle=false;fighters[0].aim=fighters[0].lockedAim=0;fighters[0].cd[0]=0;attack(0,0)");assert.equal(run('fighters[1].hp'),hp,'Sword cannot damage tentacles');
run('fighters[0].hasPaddle=true;fighters[0].cd[0]=0;attack(0,0)');assert.equal(run('fighters[1].hp'),hp-32);assert(run('adventure.harbor.exposed[0].hurt>0'));
run('var staleTentacle=adventure.harbor.exposed[0];staleTentacle.life=0;');assert.equal(run('hitKrakenTentacle(fighters[0],staleTentacle)'),false);assert.equal(run('hitKrakenTentacle(fighters[0],{x:570,y:550,life:5})'),false);
run('adventure.harbor.exposed=[];exposeTentacle(800,420)');assert(run('adventure.harbor.exposed.length===1&&free(adventure.harbor.exposed[0].x,adventure.harbor.exposed[0].y,32)'),'Exposed tentacle moves off mast/cover to reachable deck');
run('adventure.harbor.exposed=[];exposeTentacle(570,550);fighters[0].hasPaddle=true;fighters[0].aim=fighters[0].lockedAim=0;fighters[1].hp=32;fighters[0].cd[0]=0;attack(0,0)');assert.equal(run('adventure.harbor.rescued'),true);assert.equal(run('finished'),true);
console.log('PASS: Kraken in water; body/ineligible/expired tentacle hits rejected; paddle alone damages exposed tentacles and completes rescue; all nine patterns contain exactly twice the attacks with >=2s warnings; reachable exposure off obstacles.');
