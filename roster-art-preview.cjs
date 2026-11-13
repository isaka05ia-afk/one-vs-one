const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const {createCanvas}=require('@napi-rs/canvas');const art=createCanvas(1800,1200);const context=art.getContext('2d');
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','queen-afflictions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js','adventure-olympians.js','adventure-time-rift.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);













sandbox.artContext=context;context.fillStyle='#152232';context.fillRect(0,0,1800,1200);context.textAlign='center';
const rows=[
 [0,[],1,'BOB'],[0,['cheter'],1,'CHEATER'],[0,['big_hands'],1,'BIG HANDS'],[0,['jacket'],1,'MOM’S JACKET'],[0,['gloves','gloves'],1,'GLOVES EVO'],[0,['full_name','full_name'],1,'NEVER STOP'],
 [1,[],1,'DOOR MAN'],[1,['hotel'],1,'HOTEL'],[1,['magic'],1,'MAGIC'],[1,['family'],1,'FAMILY'],[1,['late'],1,'LATE'],[1,['hotel','hotel'],1,'INFINITY SPACE'],
 [2,[],1,'EGG'],[2,[],2,'HATCHLING'],[2,[],5,'ELDER DRAGON'],[2,['lizard','lizard'],5,'WALKING VOLCANO'],[2,['studied'],4,'MAGIC'],[2,['hydra'],5,'HYDRA'],
 [2,['toothless'],4,'PLASMA'],[2,['toothless','toothless'],5,'BLUE FLASH'],[2,['no_wait','no_wait'],3,'PRIMAL'],[1,['no_speed'],1,'NO MORE SPEED'],[0,['cheter','cheter'],1,'SNIPER'],[0,['big_hands','big_hands'],1,'BIG HANDS EVO']];
run("$('mode').value='training';$('opponent').value='0';$('format').value='series';$('map').value='court';start()");
for(const [index,[id,cards,stage,label]] of rows.entries()){
 sandbox.reviewCards=cards;run(`selected=${id};start();loadouts[0]=reviewCards;roundNumber=${stage};spawnRound();fighters[0].x=0;fighters[0].y=0;fighters[0].face=1;fighters[0].vx=0;fighters[0].stage=${stage};`);
 const x=150+index%6*300,y=250+Math.floor(index/6)*290;
 context.save();context.translate(x,y);context.scale(.85,.85);run('drawFighter(artContext,fighters[0],.8,true)');context.restore();
 context.fillStyle='#ead6a5';context.font='bold 16px sans-serif';context.fillText(label,x,y+32);
}
fs.writeFileSync('/workspace/neon-duel/roster-v105-review.png',art.toBuffer('image/png'));
