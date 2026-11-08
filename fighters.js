function path(c,points,fill){c.fillStyle=fill;c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fill()}
function drawFighter(c,f,time=0,preview=false){const d=roster[f.id],k=d.kind,attack=f.anim>0,walk=Math.sin(time*12)*(Math.abs(f.vx||0)>0?9:2);c.save();c.translate(f.x,f.y);c.scale(f.face||1,1);c.globalAlpha=f.dodge>0?.35:f.hurt>0?.6:1;c.shadowColor=d.color;c.shadowBlur=preview?16:6;
 if(k===4){c.shadowColor=d.color;c.shadowBlur=10}if(k===3)c.scale(1.2,1.08);c.lineCap='round';c.strokeStyle=k===1?'#333043':'#27324b';c.lineWidth=14;c.beginPath();c.moveTo(-12,-43);c.lineTo(-20-walk,0);c.moveTo(12,-43);c.lineTo(19+walk,0);c.stroke();
 path(c,[[-24,-94],[24,-94],[28,-40],[-27,-40]],k===0?'#4267b1':k===1?'#272432':'#202736');
 if(k===3){path(c,[[-35,-96],[-20,-110],[0,-97],[22,-111],[36,-94],[23,-42],[-24,-42]],'#56396d');path(c,[[-19,-88],[0,-75],[19,-88],[12,-53],[-12,-53]],'#df7cff');path(c,[[-21,-124],[-29,-153],[-9,-138],[0,-159],[9,-138],[28,-153],[20,-123]],'#efb5ff')}
 if(k===0){path(c,[[-23,-87],[0,-70],[23,-87],[17,-44],[-18,-44]],'#557fd0');c.fillStyle='#d5e5ff';c.font='bold 22px sans-serif';c.fillText('E',-7,-51)}
 if(k===1){path(c,[[-15,-94],[0,-75],[15,-94]],'#f2e5d5');path(c,[[0,-82],[-5,-65],[0,-47],[5,-65]],'#b391fa')}
 if(k===2){path(c,[[-23,-91],[-8,-72],[-20,-44],[12,-44],[22,-80],[9,-93],[3,-64]],'#ff7845');if(f.fly>0){path(c,[[-20,-81],[-95,-132],[-65,-66],[-32,-55]],'#ffac51');path(c,[[20,-81],[95,-132],[65,-66],[32,-55]],'#ffac51')}}
 c.strokeStyle=k===1?'#373341':k===0?'#557fd0':'#f1b18b';c.lineWidth=12;c.beginPath();c.moveTo(-23,-85);c.lineTo(-34,-55+walk);c.moveTo(23,-85);c.lineTo(attack?67:35,attack?-80:-55-walk);c.stroke();
 if(k!==1&&k!==4){c.fillStyle='#efbd99';c.beginPath();c.arc(0,-114,18,0,7);c.fill();c.fillStyle='#171d30';c.fillRect(-10,-118,5,4);c.fillRect(6,-118,5,4)}
 if(k===0){path(c,[[-20,-121],[-21,-135],[13,-138],[22,-126],[37,-123]],'#92b6fa');c.fillStyle='#d6e3ff';c.fillRect(-16,-126,37,5);c.fillStyle='#d75d6b';for(const x of [-34,attack?66:35]){c.beginPath();c.arc(x,attack&&x>0?-80:-54,13,0,7);c.fill()}}
 if(k===1){c.fillStyle='#9e7049';c.fillRect(-23,-151,46,59);c.strokeStyle='#e0b981';c.lineWidth=4;c.strokeRect(-23,-151,46,59);c.lineWidth=1;c.strokeRect(-16,-144,32,21);c.strokeRect(-16,-117,32,19);c.fillStyle='#ffe49c';c.beginPath();c.arc(12,-119,3,0,7);c.fill();c.fillStyle='#ffe49c';c.fillRect(-4,-63,10,4);c.beginPath();c.arc(3,-58,6,0,7);c.stroke()}
 if(k===2){path(c,[[-22,-107],[-24,-132],[-12,-126],[-7,-158],[5,-139],[18,-153],[25,-122],[17,-108],[9,-131],[-2,-122],[-12,-126]],'#ff702f');path(c,[[-10,-133],[0,-151],[6,-131],[15,-140],[12,-119]],'#ffdd72')}
 if(k===5){
 // Sailor silhouette: striped jersey, yellow coat, captain cap and a wooden oar.
 path(c,[[-28,-94],[-9,-91],[-13,-40],[-30,-42]],'#e5b24d');path(c,[[9,-91],[28,-94],[30,-42],[13,-40]],'#e5b24d');
 c.fillStyle='#f2f1df';c.fillRect(-12,-90,24,46);c.fillStyle='#234a6d';for(let y=-86;y<-44;y+=12)c.fillRect(-12,y,24,5);
 c.fillStyle='#f5f2de';c.fillRect(-24,-140,48,18);c.fillStyle='#17364e';c.fillRect(-25,-125,50,8);c.fillRect(-18,-144,36,6);c.fillStyle='#ecc75d';c.fillRect(-3,-137,6,9);
 path(c,[[-16,-107],[0,-96],[16,-107],[10,-89],[-9,-89]],'#d3d8d5');if(hasCard(f,'canons')){c.fillStyle='#3b4656';c.fillRect(20,-88,attack?78:56,19);c.fillStyle='#b9cbd8';c.fillRect(attack?83:61,-92,15,27);if(attack){path(c,[[99,-90],[125,-99],[113,-80],[131,-66],[99,-68]],'#ffbd6c')}}else{c.strokeStyle='#a87340';c.lineWidth=6;c.beginPath();c.moveTo(32,-24);c.lineTo(attack?91:49,attack?-93:-145);c.stroke();path(c,attack?[[82,-83],[92,-112],[108,-106],[96,-78]]:[[39,-133],[43,-163],[59,-163],[58,-131]],'#e2bd7c');}
 c.strokeStyle='#e5d3a5';c.lineWidth=4;c.beginPath();c.arc(-29,-65,12,0,7);c.stroke();
 }if(k===4){
 // Aegis: silver plate armor, gold trim, closed knight helmet and a mirror shield.
 path(c,[[-29,-96],[-18,-109],[0,-99],[18,-109],[29,-96],[25,-43],[-25,-43]],'#a9b9c6');path(c,[[-18,-90],[0,-81],[18,-90],[12,-49],[-12,-49]],'#51677e');c.strokeStyle='#f0d58b';c.lineWidth=3;c.strokeRect(-19,-88,38,38);
 path(c,[[-23,-137],[0,-150],[23,-137],[19,-105],[0,-96],[-19,-105]],'#becbd4');c.fillStyle='#182a3e';c.fillRect(-17,-126,34,7);c.fillStyle='#f0d58b';c.fillRect(-2,-143,4,42);
 const raised=f.guard>0||f.reflect>0,sx=raised?45:33,sy=raised?-84:-58;
 path(c,[[sx-22,sy-28],[sx+21,sy-28],[sx+25,sy+6],[sx,sy+32],[sx-25,sy+6]],f.reflect>0?'#e3faff':'#71899e');c.strokeStyle='#f0d58b';c.lineWidth=4;c.strokeRect(sx-18,sy-23,36,27);c.strokeStyle='#eaf8ff';c.lineWidth=2;c.beginPath();c.moveTo(sx-12,sy+3);c.lineTo(sx+13,sy-19);c.stroke();
 if(raised){c.strokeStyle=f.reflect>0?'#ddfaff':'#f0d58b';c.lineWidth=5;c.beginPath();c.arc(0,-77,65,-1.3,1.3);c.stroke()}
 }if(attack){const type=getMoves(f)[f.move||0]?.[1];c.save();c.translate(73,-80);if(type==='stone'){path(c,[[-16,-18],[12,-24],[28,-7],[20,20],[-12,23],[-23,2]],'#a2a5ac');c.strokeStyle='#606979';c.lineWidth=2;c.strokeRect(-11,-10,16,17)}if(type==='scissors'){c.strokeStyle='#e6eeff';c.lineWidth=5;c.beginPath();c.moveTo(-8,0);c.lineTo(40,-25);c.moveTo(-8,0);c.lineTo(40,16);c.stroke()}if(type==='bag'){path(c,[[-20,-27],[23,-27],[30,25],[-25,25]],'#ca9b64');c.fillStyle='#684a32';c.fillRect(-13,-18,29,4)}c.restore()}
 if(k===3&&f.pose>0){c.strokeStyle='#f5b9ff';c.lineWidth=14;c.beginPath();c.moveTo(-23,-85);c.lineTo(-51,-116);c.lineTo(-43,-139);c.moveTo(23,-85);c.lineTo(51,-116);c.lineTo(43,-139);c.stroke();c.save();c.scale(f.face||1,1);c.fillStyle='#24152f';c.fillRect(-85,-194,170,27);c.fillStyle='#fff';c.font='bold 14px sans-serif';c.textAlign='center';c.fillText('I am overpowerd',0,-176);c.restore()}
 if(f.cast>0||f.armor>0){c.strokeStyle=f.armor>0?'#d8e5ff':d.color;c.lineWidth=4;c.beginPath();c.arc(0,-75,57+Math.sin(time*20)*5,0,Math.PI*2);c.stroke()}if(f.effect>0){c.strokeStyle=d.color;c.lineWidth=4;c.beginPath();c.ellipse(0,-77,48,84,0,0,7);c.stroke()}
 if(f.stun>0){c.fillStyle='#ffe49c';c.fillRect(-17,-98,34,27);c.strokeStyle='#ffe49c';c.lineWidth=4;c.beginPath();c.arc(0,-99,11,Math.PI,0);c.stroke();c.fillStyle='#54406a';c.fillRect(-2,-91,4,12)}
 if(f.bagged>0){path(c,[[-31,-150],[31,-150],[39,-92],[-38,-92]],'#ca9b64');c.fillStyle='#684a32';c.fillRect(-17,-134,10,4);c.fillRect(9,-134,10,4)}
 if(f.block){c.strokeStyle='#b8ecff';c.lineWidth=3;c.beginPath();c.ellipse(32,-75,17,53,0,0,Math.PI*2);c.stroke()}c.restore()}
