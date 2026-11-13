const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const {createCanvas}=require('@napi-rs/canvas');const art=createCanvas(1440,1050);const context=art.getContext('2d');
const node=()=>({style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},add(){},addEventListener(){},getContext:()=>context,querySelector:()=>node(),getBoundingClientRect:()=>({left:0,top:0,width:1000,height:700}),value:'local',textContent:'',innerHTML:''});
const nodes={};const sandbox={console,Math,Option:function(){},requestAnimationFrame(){},document:{getElementById:id=>nodes[id]??=node(),createElement:()=>node(),querySelectorAll:()=>[],body:node()},window:{addEventListener(){}},AudioContext:function(){}};vm.createContext(sandbox);for(const f of ['maps.js','fighters.js','cards.js','doors.js','dragon.js','olympic.js','oldteam.js','engin.js','kids.js','pain.js','gods.js','controls.js','enginextras.js','ai-strategies.js','battle.js','combat.js','aiming.js','evolutions.js','sailer-evolutions.js','dragon-evolutions.js','engin-evolutions.js','timeline.js','olympic-age.js','game-upgrades.js','mannequin.js','mannequin-web.js','mannequin-voodoo.js','leo.js','queen.js','queen-evolutions.js','queen-afflictions.js','creature-art.js','game.js','adventure.js','adventure-harbor.js','adventure-olympians.js','adventure-time-rift.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),sandbox);

const run=c=>vm.runInContext(c,sandbox);













sandbox.artContext=context;context.fillStyle='#172536';context.fillRect(0,0,1440,1050);context.textAlign='center';
run("$('mode').value='training';$('opponent').value='0';$('format').value='series';$('map').value='court';start()");
const variants=[[0,'BOB · PUNCH'],[1,'DOOR MAN · RUN'],[2,'LAORES · FIRE']];
for(const [row,[id,label]] of variants.entries())for(let frame=0;frame<6;frame++){
 sandbox.artId=id;run('selected=artId;start();fighters[0].x=0;fighters[0].y=0;fighters[0].face=1;fighters[0].stage=4;fighters[0].vx=100;fighters[0].move=0;');
 const t=frame*.055;run(`fighters[0].anim=${Math.max(0,.22-t)};fighters[0].breath=${id===2?1:0};fighters[0].rush=${id===1?1:0};`);
 context.save();context.translate(120+frame*240,245+row*345);context.scale(.88,.88);run(`drawFighter(artContext,fighters[0],${t},true)`);context.restore();
 context.save();context.translate(120+frame*240,315+row*345);context.scale(.48,.48);run(`drawFighter(artContext,fighters[0],${t},false)`);context.restore();
 context.fillStyle='#ead6a5';context.font='bold 13px sans-serif';context.fillText(label+' '+(frame+1),120+frame*240,25+row*345);
}
fs.writeFileSync('/workspace/neon-duel/animation-v106-review.png',art.toBuffer('image/png'));
