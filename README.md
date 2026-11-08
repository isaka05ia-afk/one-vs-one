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


## Uppdatering 2 — klasser och rörlighet
- JIMY 3: Tank, 140 HP, 240 fart. Sten har 0,38 s uppladdning och tillfällig rustning, Sax ger tre 9-skadeträffar, Påse kastar en oblockerande motståndare. Sten: 22 skada / 2,2 s cooldown; Sax: 27 totalt / 1,5 s.
- Door Man: Speedster, 90 HP, 370 fart, dubbelhopp. Portalen byter sida utan gratisskada, Lock har synlig uppladdning, Running Man är en rusning med kollisionsbaserad träff.
- Flame Girl: DPS, 100 HP, 300 fart. Fire Ball ger brännskada, Fire Fly lyfter och rusar framåt, Flame Dragon laddas i 0,65 s och lämnar en kort markexplosion vid träff.
- The Overpowerd: Burst-DPS, 115 HP, 225 fart. Behåller sin obligatoriska pose före varje attack. Punch knuffar; I Can Win markerar motståndarens plats och exploderar efter 0,6 s; Dooms Day skickar tre markerade markexplosioner framåt (10 + 10 + 18 skada).
- Shift / mellanslag eller touchknappen Undvik ger 0,24 s osårbar rörelse. Håll vänster/höger för riktning; utan riktning rullar man bakåt. Spelare 2 använder 0. Cooldown: Tank 2,4 s, Speedster 1,2 s, DPS 1,8 s, Burst-DPS 2,6 s.
- Luftburna fighters kan passera över varandra. Undanmanöver och rusning kan passera igenom. Hopp triggas av ett knapptryck, inte automatiskt när knappen hålls.
- Vid timeout jämförs kvarvarande andel HP, eftersom klasserna har olika maxliv.
- Datorn håller avstånd som passar klassen och försöker hoppa eller undvika hot. Balansvärdena är ett första speltestbart pass.

Verifierat med simulerad spelmiljö: 12 attacker, klassliv, fördröjningar, kombo, kast, portal, dubbelhopp, stun, osårbarhet, passage, brännskada och undvikande av markerad explosion. Fysisk mobil och riktig webbläsare återstår.


## Uppdatering 3 — Ms AI
Datorn använder alltid sin egen fighter: Ms AI, en turkos robot med skärmansikte, antenner, metallpansar och en pulserande AI-kärna. 110 HP, 285 fart, undanmanöver med 1,9 s cooldown.
- Datapuls: snabb digital projektil, 13 skada, 1,7 s cooldown.
- Brandvägg: energisköld i 1,8 s, minskar skada med 65 %, 5,5 s cooldown.
- Orbital Scan: markerar spelarens position; efter 0,85 s träffar ett energinedslag marken, 24 skada, 6 s cooldown. Flytta dig, hoppa eller undvik.
I läget Mot datorn är motståndaren låst till Ms AI. I lokalt tvåspelarläge går alla fem fighters att välja för båda spelarna. Ms AI försöker hålla avstånd, använda skydd vid lågt liv och skanna på distans.
