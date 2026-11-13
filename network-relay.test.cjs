'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const timers=new Map();let next=0;
class Events{constructor(){this.events={};this.open=true;this.sent=[];this.dataChannel={bufferedAmount:0}}on(k,f){(this.events[k]??=[]).push(f)}emit(k,v){for(const f of this.events[k]||[])f(v)}send(p){this.sent.push(p)}close(){this.open=false;this.emit('close')}}
class RTC{constructor(config){this.config=config;this.connectionState='new';this.channels=[]}createDataChannel(label){const c={label,readyState:'open',close(){this.readyState='closed';this.onclose?.()}};this.channels.push(c);return c}close(){this.connectionState='closed';this.onconnectionstatechange?.()}}
const ctx={console,RTCPeerConnection:RTC,setTimeout(fn,ms){const id=++next;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)}};vm.createContext(ctx);
for(const n of ['peer.js','quickpeer.js'])vm.runInContext(fs.readFileSync(n,'utf8'),ctx);
vm.runInContext(fs.readFileSync('multiplayer-group.js','utf8').split('function validPartyConfig')[0],ctx);
const run=s=>vm.runInContext(s,ctx);
run('var manual=new ManualPeer({});manual.init(true);var quick=new QuickPeer({});var party=new PartyHost({});');
for(const expression of ['manual.pc.config','quick.options().config','party.options().config']){
 const config=run(expression),relays=config.iceServers.filter(s=>JSON.stringify(s.urls).includes('turn:'));
 assert(relays.length);assert(relays[0].urls.includes('turn:eu-0.turn.peerjs.com:3478'));assert(relays[0].urls.includes('turn:us-0.turn.peerjs.com:3478'));assert.equal(config.iceTransportPolicy,'all');
}
run("var closedReasons=[],statuses=[];manual.callbacks={onClose:r=>closedReasons.push(r),onStatus:s=>statuses.push(s)};manual.pc.connectionState='disconnected';manual.pc.onconnectionstatechange();");
assert.equal(timers.size,1);assert.equal([...timers.values()][0].ms,15000);
run("manual.pc.connectionState='connected';manual.pc.onconnectionstatechange()");assert.equal(timers.size,0);assert.equal(run('closedReasons.length'),0);
ctx.connection=new Events();run('quick.callbacks={onClose:r=>closedReasons.push(r),onStatus:s=>statuses.push(s)};quick.attach(connection);connection.emit("open");');
ctx.connection.emit('iceStateChanged','disconnected');assert.equal(run('quick.closed'),false);assert(run('statuses.at(-1)').includes('tillfälligt'));
ctx.connection.emit('iceStateChanged','connected');assert.equal(run('quick.closed'),false);
run('quick.sendSnapshot({seq:1,matchId:1,kept:1,absent:undefined,nested:{absent:undefined}})');const wire=JSON.parse(ctx.connection.sent.at(-1));assert.equal(Object.hasOwn(wire.data,'absent'),false);assert.equal(Object.hasOwn(wire.data.nested,'absent'),false);
ctx.partyLink=new Events();run('party.attachParty(partyLink);party.sendTo(1,"snapshot",{kept:1,absent:undefined})');assert(!Object.hasOwn(JSON.parse(ctx.partyLink.sent.at(-1)).data,'absent'));
ctx.connection.close();assert.equal(run('quick.closed'),true);assert.equal(run('closedReasons.length'),1);run('manual.close();party.close()');assert.equal(timers.size,0);
console.log('PASS: manual/duel/party preserve direct + TURN candidates; temporary disconnect recovery; JSON-compatible chunked-transport packets; actual close and timer cleanup. No live relay availability assertion.');
