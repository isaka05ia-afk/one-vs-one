// Independent seeds/maps, full 90-second rounds, two opponents per configuration.
const fs=require('node:fs');
const boot=fs.readFileSync(__dirname+'/audit.cjs','utf8').split('const maps=run(')[0];
const work=`
const report=JSON.parse(fs.readFileSync(__dirname+'/audit-results.json','utf8')),maps=run('Object.keys(MAPS)'),rows=[];let games=0;
for(const [index,c] of report.results.entries()){
 const comparisons={};
 for(const policy of [...new Set(['adaptive',c.best])]){
  const samples=[];
  for(let n=0;n<2;n++){
   box.c=c;box.enemy=(index+n*3+1)%6;box.map=c.cards.includes('my_home')?((index*7+n*3)%10<6?'harbor':maps.filter(m=>m!=='harbor')[(index+n)%5]):maps[(index*5+n+2)%6];box.policy=policy;box.side=n;const opponents=configs.filter(r=>r.id===box.enemy&&r.cards.length===2&&r.round===3);box.enemyCards=n===1?opponents[(index*3+n)%opponents.length].cards:[];seed=987654+index*31+n;
   run('auditSetup(c,enemy,map,policy,side,enemyCards);clock=90');
   const hp=run('(()=>{for(let frame=0;frame<1800&&active();frame++)update(.05);return fighters.map(f=>f.hp/f.maxHp)})()');
   if(!hp.every(Number.isFinite))throw Error('Invalid validation state');
   const margin=hp[n]-hp[1-n],win=margin>.00001?1:Math.abs(margin)<.00001?.5:0;samples.push({enemy:box.enemy,enemyCards:box.enemyCards,map:box.map,side:n,win,margin});games++;
  }
  comparisons[policy]={wins:samples.reduce((s,x)=>s+x.win,0),margin:samples.reduce((s,x)=>s+x.margin,0)/2,samples};
 }
 const baseline=comparisons.adaptive,proposed=comparisons[c.best];
 const accepted=proposed.wins>baseline.wins||proposed.wins===baseline.wins&&proposed.margin>=baseline.margin;
 rows.push({id:c.id,cards:c.cards,round:c.round,proposed:c.best,selected:accepted?c.best:'adaptive',comparisons});
 if(index%25===0)console.log('Validated',index+1,'/',report.results.length,';',games,'full-round matches');
}
fs.writeFileSync(__dirname+'/validation-results.json',JSON.stringify({method:'Independent seeds and rotated maps, two opponents per configuration (one base, one with two legal cards), full 90-second rounds, alternating sides. Spacing candidates selected on training samples; reverted to adaptive when worse on this validation sample. Small samples are not proof of optimality.',games,rows},null,2)+'\\n');console.log('PASS validation',games,'matches');
`;
eval(boot+work);
