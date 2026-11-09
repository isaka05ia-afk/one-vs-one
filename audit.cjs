// Reproducible headless combat audit. Runs the real engine with a mocked DOM/canvas.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const canvas=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>canvas,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={},math=Object.create(Math);let seed=1;math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const box={console,Math:math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};
vm.createContext(box);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','game.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),box);
const run=s=>vm.runInContext(s,box);
run(`updateHud=()=>{};tone=()=>{};spark=()=>{};updateCamera=()=>{};
function auditSetup(c,enemy,map,policy,side=0,enemyCards=[]){selected=side?enemy:c.id;$('opponent').value=String(side?c.id:enemy);$('mode').value='local';$('map').value=map;$('format').value='quick';$('difficulty').value='expert';start();loadouts[side]=c.cards.slice();loadouts[1-side]=enemyCards.slice();roundNumber=c.round-1;ageStartRounds[side]=c.cards.includes('no_wait')?2:0;ageStartRounds[1-side]=enemyCards.includes('no_wait')?2:0;spawnRound();mapId=map;walls=MAPS[map].walls;for(let i=0;i<2;i++){fighters[i].aiControlled=true;fighters[i].botPolicy=i===side?policy:'adaptive'}clock=25;}
function auditFight(){let frames=0;while(active()&&frames<500){update(.05);frames++;for(const f of fighters)if(![f.hp,f.maxHp,f.x,f.y,...f.cd].every(Number.isFinite)||f.hp<0||f.hp>f.maxHp+.001)throw Error('Invalid combat state '+JSON.stringify({id:f.id,cards:f.cards,hp:f.hp,max:f.maxHp}));}return fighters.map(f=>f.hp/f.maxHp)}
`);
const families=run('roster.map((r,id)=>({id,name:r.name,cards:cardFamilies(id)}))');
for(const hero of families){assert.equal(hero.cards.length,5);assert.equal(new Set(hero.cards).size,5);for(const card of hero.cards){assert(run(`!!CARD_DEFS[${JSON.stringify(card)}]`))}for(const extra of ['vitality','force','haste'])assert.equal(run(`validLoadout(${hero.id},['${extra}'])`),false)}
const configs=[];
for(const hero of families){const cards=hero.cards.flatMap(c=>c==='selfish'?['selfish_runner','selfish_swimmer','selfish_skater']:[c]);const sets=[[],...cards.map(c=>[c])];for(const a of cards)for(const b of cards)if(run(`validLoadout(${hero.id},${JSON.stringify([a,b])})`))sets.push([a,b]);for(const cs of sets)for(const round of hero.id===2?[1,2,3,4,5]:[3])configs.push({id:hero.id,cards:cs,round});}
if(process.argv.includes('--abilities')){
 let attempts=0,accepted=0,gated=[];
 for(const c of configs)for(let athlete=0;athlete<(c.id===4&&!c.cards.some(x=>x.startsWith('selfish_'))?3:1);athlete++)for(let slot=0;slot<3;slot++){
  box.c=c;box.athlete=athlete;box.slot=slot;
  run("auditSetup(c,3,'grove','adaptive');fighters.forEach(f=>f.aiControlled=false);for(let n=0;n<athlete;n++)switchAthlete(fighters[0]);fighters[0].x=100;fighters[1].x=210;fighters[0].y=fighters[1].y=550;fighters[0].aim=0;mouseAim=false");
  if(!run('!!getMoves(fighters[0])[slot]'))continue;
  const kind=run('getMoves(fighters[0])[slot][1]');
  if(kind==='rewind')run('for(let n=0;n<170;n++)update(.05)');
  if(['loadcatapult','momorders','psychicthrow'].includes(kind))run('attack(0,0);for(let n=0;n<6;n++)update(.05)');
  attempts++;run('attack(0,slot)');
  if(run('fighters[0].cd[slot]>0'))accepted++;else gated.push({c,athlete,slot,kind});
  run('for(let n=0;n<60&&active();n++){update(.05);for(const f of fighters)if(![f.hp,f.maxHp,f.x,f.y,...f.cd].every(Number.isFinite)||f.hp<0||f.hp>f.maxHp+.001)throw Error("Invalid ability state")}render()');
 }
 fs.writeFileSync(__dirname+'/ability-audit.json',JSON.stringify({configurations:configs.length,attempts,accepted,gated},null,2)+'\n');console.log('PASS ability audit',attempts,'attempts',accepted,'accepted',gated.length,'gated');process.exit(0);
}
const maps=run('Object.keys(MAPS)'),policies=['adaptive','rush','kite'];
const results=[];let games=0;
for(const [ci,c] of configs.entries()){
 if(process.argv.includes('--only-gods')&&!(c.id===4&&c.cards.includes('kids')&&c.cards.includes('too_old')))continue;
 box.c=c;const scores={};
 for(const policy of policies){const samples=[];for(let enemy=0;enemy<6;enemy++){
  const map=maps[(enemy+ci)%maps.length],side=enemy%2;seed=1000+ci*97+enemy*13;box.enemy=enemy;box.map=map;box.policy=policy;box.side=side;
  try{run('auditSetup(c,enemy,map,policy,side)');const hp=run('auditFight()');samples.push({enemy,map,side,win:hp[side]>hp[1-side]+.00001?1:Math.abs(hp[0]-hp[1])<.00001?.5:0,margin:hp[side]-hp[1-side]});games++}catch(e){throw Error(JSON.stringify({c,enemy,map,policy,side})+'\n'+e.stack)}
 }scores[policy]={wins:samples.reduce((n,s)=>n+s.win,0),margin:samples.reduce((n,s)=>n+s.margin,0)/samples.length,samples};}
 const best=policies.slice().sort((a,b)=>scores[b].wins-scores[a].wins||scores[b].margin-scores[a].margin)[0];results.push({...c,best,scores});
 if(ci%25===0)console.log('Audited',ci+1,'/',configs.length,'configurations;',games,'matches');
}
if(process.argv.includes('--only-gods')){const previous=JSON.parse(fs.readFileSync(__dirname+'/audit-results.json','utf8')),patches=new Map(results.map(r=>[JSON.stringify([r.id,r.cards,r.round]),r]));results.splice(0,results.length,...previous.results.map(r=>patches.get(JSON.stringify([r.id,r.cards,r.round]))||r));games=previous.games;}
const report={generated:new Date().toISOString(),method:'Real engine; mocked DOM/canvas; seeded RNG; 20 Hz; 25-second quick rounds; each configuration vs all six base rosters at the same round; all six maps rotated; alternating sides; three spacing policies; expert difficulty. Opponents have no cards. Wins at timeout use remaining HP fraction, matching game rules. These are comparative samples, not proof of optimal play. Visual/mobile/WebRTC behavior requires separate browser testing.',families,configurations:configs.length,games,results};
fs.writeFileSync(__dirname+'/audit-results.json',JSON.stringify(report,null,2)+'\n');
let md='# Combat audit\n\n'+report.method+'\n\n'+configs.length+' configurations, '+games+' matches. Every roster has exactly five card families. Selfish participant choices belong to one family. Ordered pairs and all five dragon rounds are included.\n\n';
for(const hero of families){const rows=results.filter(r=>r.id===hero.id).sort((a,b)=>b.scores[b.best].wins-a.scores[a.best].wins||b.scores[b.best].margin-a.scores[a.best].margin);md+='## '+hero.name+'\n\nCards: '+hero.cards.join(', ')+'.\n\nBest sampled configurations (out of six opponents each):\n\n';for(const r of rows.slice(0,3))md+='- '+(r.cards.join(' + ')||'Base')+'; round '+r.round+'; '+r.best+'; '+r.scores[r.best].wins+'/6; mean HP margin '+r.scores[r.best].margin.toFixed(3)+'\n';md+='\n';}
fs.writeFileSync(__dirname+'/AUDIT.md',md);console.log('PASS',configs.length,'configurations',games,'matches');
