const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','queen-afflictions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js','adventure-olympians.js','adventure-time-rift.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);








const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
run("window.localStorage={data:{},getItem(k){return this.data[k]||null},setItem(k,v){this.data[k]=v}};startAdventure();enterOlympians();fighters[0].x=1190;fighters[0].y=580;harborInteract()");assert.equal(run('adventure.dialogue.trialOffer'),true);assert(run('OLYMPIAN_WAGER.join(" ")').includes('Sailer: No.'));assert(run('OLYMPIAN_WAGER.join(" ")').includes('sailor instead'));assert.equal(run('OLYMPIAN_TRIAL.map(i=>i.name).join(",")'),'Latissa,Solea,Vasta');
run('for(let n=0;n<OLYMPIAN_WAGER.length-1;n++)$("harborTalkNext").onclick()');assert(run("$('harborBoard').textContent").includes('ACCEPT'));run('$("harborBoard").onclick();render();update(3)');assert.equal(run('inOlympianTrial()'),true);assert.equal(run('adventure.olympian.stage'),0);assert.equal(run('fighters[0].playerLives'),3);assert.equal(run('fighters[0].potions'),3);
assert.equal(run('terrainAt({x:900,y:550}).water'),true);assert.equal(run('terrainAt({x:350,y:550}).water'),false);
// Swimmer actively keeps distance, pulls into water, then surfaces within melee reach.
run('adventure.olympian.timer=99;fighters[1].x=900;fighters[1].y=550;fighters[0].x=820;fighters[0].y=550;var swim=bot(fighters[1],fighters[0],.01)');assert(run('swim.x')>0);
run('fighters[0].x=560;fighters[0].y=550;var vortex=trialWarn("vortex",fighters[0],.01,150);resolveTrialWarning(vortex)');assert(run('fighters[0].x')>650);
run('adventure.olympian.warnings=[];beginTrialMotion("dive",{x:fighters[0].x+90,y:fighters[0].y},650);for(let n=0;n<200&&adventure.olympian.motion;n++)tickTrialMotion(.01)');assert(run('adventure.olympian.recovery')>0);assert(run('distance(fighters[0],fighters[1])')<127);
run('fighters[0].hp=73;fighters[0].potions=1;fighters[0].playerLives=2;applyDamage(fighters[1],999)');assert.equal(run('adventure.olympian.stage'),1);assert.equal(run('active()'),false);run('update(3.1);render()');assert.equal(run('terrainAt({x:900,y:550}).ice'),true);assert.equal(run('terrainAt({x:900,y:550}).water'),false);close(run('fighters[0].hp'),73);assert.equal(run('fighters[0].potions'),1);assert.equal(run('fighters[0].playerLives'),2);
// Skater ignores attacks while gliding; visible stops are the damage windows.
const skaterHP=run('fighters[1].hp');run('adventure.olympian.recovery=0;adventure.olympian.warnings=[];var glide=bot(fighters[1],fighters[0],.01);applyDamage(fighters[1],22)');assert(run('Math.hypot(glide.x,glide.y)')>0);close(run('fighters[1].hp'),skaterHP);run('beginTrialMotion("skate",{x:1100,y:550},820);for(let n=0;n<100&&adventure.olympian.motion;n++)tickTrialMotion(.01)');assert(run('adventure.olympian.recovery')>0);run('applyDamage(fighters[1],22)');close(run('fighters[1].hp'),skaterHP-22);assert(run('adventure.olympian.trails.length')>0);
run('applyDamage(fighters[1],999);update(3.1);render()');assert.equal(run('adventure.olympian.stage'),2);close(run('fighters[0].hp'),73);
// Runner can dodge once, then has a punishable cooldown instead of evading every Slash.
run("adventure.olympian.timer=99;adventure.olympian.recovery=0;adventure.olympian.evadeCd=0;fighters[0].x=500;fighters[0].y=550;fighters[0].aim=0;fighters[0].cd[0]=0;fighters[1].x=570;fighters[1].y=550;fighters[1].aim=Math.PI;mouseAim=false;inputMode='mouse';attack(0,0)");assert.equal(run('adventure.olympian.motion.kind'),'evade');assert(run('adventure.olympian.evadeCd')>3);const runnerHP=run('fighters[1].hp');run('for(let n=0;n<100&&adventure.olympian.motion;n++)tickTrialMotion(.01);applyDamage(fighters[1],22)');close(run('fighters[1].hp'),runnerHP-22);
run('adventure.olympian.motion=null;beginTrialMotion("sprint",{x:800,y:550},1000);for(let n=0;n<200&&adventure.olympian.motion;n++)tickTrialMotion(.01)');assert(run('adventure.olympian.warnings.some(w=>w.kind==="echo")'));
run('var hpBeforeTime=fighters[1].hp;var rewind=trialWarn("rewind",{x:900,y:600},.01,70);rewind.b={x:900,y:600};resolveTrialWarning(rewind)');close(run('fighters[1].x'),900);close(run('fighters[1].hp'),run('hpBeforeTime'));
run('applyDamage(fighters[1],999)');assert.equal(run('finished'),true);assert.equal(run("adventureStored('one-vs-one-olympian-trial-won')"),1);run('returnFromOlympianTrial();render()');assert.equal(run('atOlympians()'),true);assert.equal(run('fighters[0].hasDoorKey'),true);assert(run('adventure.dialogue.lines.join(" ")').includes('Engin'));
// Failure returns to a safe courtyard, allows a full retry, and never erases the key.
run('closeHarborDialogue();startOlympianTrial();update(3);for(let n=0;n<3;n++){fighters[0].spawnShield=0;applyDamage(fighters[0],999)}');assert.equal(run('finished'),true);assert.equal(run("adventureStored('one-vs-one-olympian-key-debt')"),1);run('returnFromOlympianTrial();closeHarborDialogue();startOlympianTrial();update(3)');assert.equal(run('fighters[0].hasDoorKey'),true);assert.equal(run('fighters[0].playerLives'),3);
// Fixed-step stress and rendering of every phase, with invulnerability used for testing.
run('setAdventureGodMode(true)');for(const stage of [0,1,2]){sandbox.stage=stage;run('adventure.olympian.stage=stage;adventure.phase=stage+1;adventure.olympian.transition=null;setOlympianBoss(stage);adventure.olympian.warnings=[];adventure.olympian.motion=null;adventure.olympian.recovery=0;adventure.olympian.timer=.1;for(let n=0;n<1800;n++){update(.01);if(n%150===0)render()}');assert(run('fighters.every(f=>[f.x,f.y,f.hp].every(Number.isFinite))'));}
run('returnFromOlympianTrial();closeHarborDialogue();enterHarbor();startSailerFight();update(6);render()');assert.equal(run('fighters[1].isOlympianBoss'),false);assert.equal(run('fighters[1].isHarborBoss'),true);
run('start();render()');assert.equal(run('adventure'),null);run('drawOlympic(ctx,{id:4,x:130,y:205,face:1,cards:[]},0,true)');
console.log('Olympians: Latin muscle names, friendly wager/No joke, three resource-sharing phases, water pull/surface, ice stop windows, speed/dodge/time echoes, information/retry/key safety, render stress and chapter/Arena isolation PASS');
