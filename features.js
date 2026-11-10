'use strict';
const previousSyncOpponent=syncOpponent;
syncOpponent=function(){previousSyncOpponent();refreshBattleSetup();if($('mode').value==='training'){$('opponent').disabled=false;$('format').disabled=true;$('difficulty').disabled=false}else if(!netSession)$('format').disabled=false;};$('mode').onchange=syncOpponent;
$('battleMode').onchange=()=>{if(netSession?.peer&&!netSession.peer.closed)return;refreshBattleSetup()};
$('trainingReset').onclick=resetTraining;
for(const id of ['trainingCard1','trainingCard2'])$(id).onchange=()=>{const cards=[$('trainingCard1').value,$('trainingCard2').value].filter(c=>c&&c!=='none'),valid=validLoadout(selected,cards);$('trainingCardError').textContent=valid?'':'Välj en giltig kombination. Två lika kort ger Evolve för The Essy Kid, Door Man, Sailer, Laores, Engin och Olympic Teams Selfish, So Much Power och No Pain, No Gain.';$('start').disabled=!valid};
$('trainingDummy').onchange=()=>{if(training&&fighters[1])fighters[1].aiControlled=$('trainingDummy').value==='fight'};
$('aimBeforeShoot').onchange=()=>{clearInput();try{window.localStorage?.setItem('one-vs-one-preview',String($('aimBeforeShoot').checked))}catch{}refreshControlSettings();if(running)renderAttackButtons(getMoves(fighters[localIndex()]))};
try{const saved=window.localStorage?.getItem('one-vs-one-preview');if(saved==='true'||saved==='false')$('aimBeforeShoot').checked=saved==='true'}catch{}
refreshBattleSetup();

initEvolutionUI();

initDragonEvolutionUI();
