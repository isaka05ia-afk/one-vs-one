const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','creature-art.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext('{'+c+'}',sandbox);





const close=(a,b)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
function step(s){run(`for(let n=0;n<${Math.ceil(s/.01)};n++)update(.01)`)}
function duel(id=0,enemy=0){sandbox.own=id;sandbox.other=enemy;run("selected=own;$('mode').value='local';$('battleMode').value='duel';$('opponent').value=String(other);$('map').value='court';$('format').value='series';start();walls=[];fighters[0].x=200;fighters[1].x=600;fighters[0].y=fighters[1].y=550;fighters[0].aim=fighters[0].lockedAim=0;fighters[1].aim=Math.PI;inputMode='mouse';mouseAim=false");}
function practice(id=0){sandbox.own=id;run("selected=own;$('mode').value='training';$('map').value='court';$('opponent').value='0';$('trainingCard1').value='none';$('trainingCard2').value='none';$('trainingDummy').value='still';$('trainingStage').value='3';start();walls=[];fighters[0].x=200;fighters[1].x=600;fighters[0].y=fighters[1].y=550;fighters[0].aim=fighters[0].lockedAim=0;inputMode='mouse';mouseAim=false;$('trainingImmortal').checked=false;$('trainingImmortalDummy').checked=true");}

function magic(cards,enemy=0,other=[]){duel(6,enemy);sandbox.cards=cards;sandbox.other=other;run('loadouts=[cards,other];roundNumber=2;spawnRound();walls=[];fighters[0].x=200;fighters[1].x=500;fighters[0].y=fighters[1].y=550;fighters[0].aim=fighters[0].lockedAim=0;fighters[1].aim=Math.PI;mouseAim=false;if(webEvo(fighters[0]))Object.assign(webNode(fighters[0],webState(fighters[0]).root),{x:200,y:550});');if(run('voodooSetupPending()'))run('applyVoodooChoices(0,[{target:1,sourceSlot:0,slot:voodooEvo(fighters[0])?0:2}],true)');}
function chain(){run('const a=addWebNode(0,{x:250,y:350},true),b=addWebNode(0,{x:450,y:550},true),c=addWebNode(0,{x:650,y:350},true);connectWeb(fighters[0],a,b);connectWeb(fighters[0],b,c);webState(fighters[0]).edges.forEach(e=>e.build=0)');}

vm.runInContext(fs.readFileSync(__dirname+'/multiplayer.js','utf8'),sandbox);
let checked=0;const failures=[];
for(let id=0;id<7;id++){sandbox.id=id;const families=Array.from(run('cardFamilies(id)')).map(c=>c==='selfish'?'selfish_runner':c);const builds=[[],...families.map(c=>[c]),...families.flatMap(a=>families.filter(b=>a!==b).map(b=>[a,b])),...Array.from(run('evolveCards(id)')).map(c=>[c,c])];for(const cards of builds)for(const athlete of id===4?[0,1,2]:[0]){
 magic(['dummy_voodoo','dummy_voodoo'],id,cards);sandbox.athlete=athlete;run('if(isOlympic(fighters[1])&&selfishAthlete(fighters[1])<0){teamState(fighters[1]).active=athlete;syncTeam(fighters[1])}if(fighters[1].voodoo)voodooState(fighters[1]).ready=true;if(mannequinEvo(fighters[1],"dummy_spirit"))mannequinState(fighters[1]).ready=true');
 const moves=JSON.parse(JSON.stringify(run('getMoves(fighters[1])')));for(let slot=0;slot<moves.length;slot++){
  magic(['dummy_voodoo','dummy_voodoo'],id,cards);sandbox.athlete=athlete;sandbox.src=slot;try{run('if(isOlympic(fighters[1])&&selfishAthlete(fighters[1])<0){teamState(fighters[1]).active=athlete;syncTeam(fighters[1])}if(fighters[1].voodoo)voodooState(fighters[1]).ready=true;if(mannequinEvo(fighters[1],"dummy_spirit"))mannequinState(fighters[1]).ready=true;voodooState(fighters[0]).copies=[null,null,null];installCopy(fighters[0],1,src,2);fighters[0].cd=[0,0,0];fighters[0].aim=0;fighters[1].x=300;');if(!run('copyRecord(fighters[0],2)'))continue;
   run('if(copiedHoldInfo(fighters[0],2))beginPlayerAttack(2);else attack(0,2)');step(.9);run('endPlayerAttack(2)');step(1.7);run('render()');assert.equal(run('fighters[0].id'),6);assert.equal(run('fighters[0].maxHp'),110);assert(run('fighters.every(f=>Number.isFinite(f.hp)&&Number.isFinite(f.x)&&Number.isFinite(f.y))'));assert(run('fighters[0].athletics.team===null'));assert(run('validVoodoo(packDollFighter(fighters[0]))'));run("netSession={role:'host',started:true,matchId:1,snapshotSeq:0,roundId:1}");assert(run('validSnapshot(exportOnlineSnapshot())'));assert(run('JSON.stringify(exportOnlineSnapshot()).length<131072'));checked++;
  }catch(e){failures.push({id,cards,athlete,slot,move:moves[slot][0],error:e.stack});}
 }
}}
console.log('Native copied attacks checked:',checked);if(failures.length){console.log(JSON.stringify(failures,null,2));throw Error(failures.length+' native copy failures')}console.log('PASS: all roster builds, source card orders/Evolves, all athlete forms, held/tap attacks, native execution/background updates, unchanged mannequin identity/HP and no inherited team lives.');
