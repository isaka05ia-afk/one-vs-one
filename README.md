# One v One — Neon Duel demo

Fyra fighters med egna ritade utseenden och tre attacker var. Spel mot datorn på mobil och dator, eller två spelare på samma tangentbord. Ingen installation eller byggprocess behövs: öppna index.html.

## Kontroller
Spelare 1: A/D, W hoppa, S blockera, J/K/L attacker. Spelare 2: pilar, nedåtpil blockera och 1/2/3 attacker. Mobil: touchknappar. Escape pausar. Bäst av tre ronder, 100 HP och 60 sekunder per rond.

## Första balanspasset
| Fighter | Attack | Skada | Cooldown |
|---|---|---:|---:|
| JIMY 3 | Sten | 18 | 1,6 s |
| JIMY 3 | Sax | 12 | 0,95 s |
| JIMY 3 | Påse | 23 | 4,5 s |
| Door Man | Dörrportal | 14 | 3,4 s |
| Door Man | Lock | 4 + 0,85 s stun | 5 s |
| Door Man | Running Man | 20 | 2,8 s |
| Flame Girl | Fire Ball | 15 | 1,8 s |
| Flame Girl | Fire Fly | 17 | 3,2 s |
| Flame Girl | Flame Dragon | 29 | 6,5 s |
| The Overpowerd | Ower Powerd Punch | 27 | 3,5 s |
| The Overpowerd | I Can Win | 21 | 5 s |
| The Overpowerd | Dooms Day | 38 | 9 s |

Blockering minskar skadan med 78 %. Lock kan blockeras och ger 3,5 sekunders immunitet mot ny låsning. The Overpowerd rör sig långsammare och måste posera i 1,05 sekunder före de två första attackerna och 1,45 sekunder före Dooms Day. Han kan träffas under poseringen och Lock avbryter den. Dooms Day kan undvikas genom att hoppa eller lämna räckvidden. I Can Win är en kraftpuls, ingen automatisk vinst.

Pratbubblan visar alltid “I am overpowerd”. Med Ljud på används också webbläsarens talsyntes om den finns. Röststöd varierar mellan webbläsare.

## GitHub Pages
Settings → Pages → Deploy from a branch → main → / (root). Ett privat repository kan kräva en betalplan för Pages. Spelet har inget onlineläge.

## Verifiering
`node test.cjs` testar de 12 attackerna, fördröjningen under posering, cooldown, stun och att hopp undviker Dooms Day med en simulerad spelmiljö. Det ersätter inte test på en fysisk telefon. Google Fonts är valfritt och har reservtypsnitt.
