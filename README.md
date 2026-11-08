# One vs One — Arena

En duellarena ovanifrån i HTML, CSS och JavaScript. Fri rörelse i två dimensioner, manuellt sikte, projektiler som kan missa och symmetriska väggar som skydd. Sex egna karaktärer. Datorn spelar alltid som Ms AI.

## Spela
Öppna index.html eller kör `python3 -m http.server 8080` och besök localhost:8080. Inga byggsteg behövs.

- Dator: WASD rörelse, musen siktar. Håll vänsterklick eller J för grundattack. K och L aktiverar specialförmågor. Shift eller mellanslag gör en undanmanöver i rörelseriktningen; om du står still används siktriktningen. Escape pausar.
- Mobil: vänster analog spak rör dig; höger spak siktar och skjuter automatiskt så länge den hålls ut. När högerspaken släpps siktar de tre attackknapparna automatiskt mot motståndarens nuvarande position. Håll ut högerspaken för manuellt sikte. En egen knapp gör undanmanöver. Flera fingrar stöds.
- Lokalt tvåspelarläge på dator: spelare 2 rör sig med pilar, använder 1/2/3 och undviker med 0. Spelare 2 har automatiskt riktat sikte mot spelare 1 för att kunna spela på samma tangentbord. Det finns inget onlineläge.
- Bäst av fem ronder, först till tre vinster. 90 sekunder per rond. Vid timeout vinner högst återstående andel av maxliv.

## Fighters
| Fighter | Klass | Liv | Fart | Spelstil |
|---|---|---:|---:|---|
| JIMY 3 | Tank | 150 | 195 | Närslag, riktad stråle, grab och kast |
| Door Man | Speedster | 95 | 285 | Flanka, lås en riktad träff, rusa |
| Flame Girl | DPS | 105 | 235 | Projektiler, eldspår, stor drake |
| The Overpowerd | Burst-DPS | 125 | 185 | Obligatorisk pose och tydligt markerade attacker |
| Ms AI | AI-robot | 110 | 225 | Datapuls, energisköld och orbitalt nedslag |
| Sailer | Control | 170 | 175 | Bred våg, vind som drar och en fångande segeljolle |

Alla attacker har separata synliga cooldowns. Sten är ett tungt närslag (23 skada, 60 räckvidd, 1,5 s cooldown). Sax laddar synligt i 0,4 sekunder och skjuter sedan en riktad stråle (26 skada, 400 räckvidd, 4,2 s cooldown), som stoppas av väggar. Påse är en grab på nära håll: håll fast i 0,55 s och kasta sedan för 22 skada (95 räckvidd, 7,2 s cooldown). Båda står still under greppet, den fångade kan inte attackera eller undvika, och stun på JIMY avbryter greppet. Missar och undanmanövrer ger ingen träff. Door Mans första attack är Running Man: rusa och tackla längs siktet (24 skada, 5,2 s cooldown). Andra attacken är Lock. Tredje förmågan är Dörrar: placera en dörr där du står (3 s cooldown). Han kan ha två egna dörrar, A och B, samtidigt; när båda finns kan han gå in i den ena och teleportera till den andra. Fire Fly lämnar brinnande mark; överlappande eldspår får inte stapla skada varje bildruta. The Overpowerd måste posera före varje attack, och poseringen avbryts av stun. Ms AI har en egen robotfigur med pansar, antenner och AI-kärna.

## Placering
Väggar stoppar rörelse, rusningar och projektiler. Explosioner kräver fri sikt till målet. Markeringar visar var en explosion ska träffa och hur lång tid som återstår. Undanmanöver ger 0,2 sekunder osårbarhet men passerar inte genom väggar. Datorn cirklar, håller avstånd, reagerar med fördröjning och försöker hitta vägar runt skydd. Den använder riktiga projektiler och kan missa.

## Verifiering
`node test.cjs` testar 18 förmågor, tvådimensionell rörelse, normaliserad diagonal fart, väggkollision, blockerade skott, manuellt sikte och missar, brännskada, stun, undanmanöver, sköld, posering, undvikande av explosioner, botens identitet och navigering, paus och renderingsanrop i en simulerad miljö. Test i riktig webbläsare och på fysisk mobil återstår.

## Publicering
GitHub Pages: main / root. Alla filer inklusive fighters.js måste ligga i samma mapp. Google Fonts är valfritt och har reservtypsnitt. Ljudknappen aktiverar enkla ljudeffekter och talsyntes för The Overpowerd när webbläsaren stöder det.


## Fyra svårighetsgrader
Välj Lätt, Normal, Svår eller Expert före matchen. Normal är förvalt. Valet visas i matchens statusrad och gäller alla ronder. Inställningen är avstängd i lokalt tvåspelarläge.

| Nivå | Reaktionstid | Spridning i siktet | Chans att försöka undvika upptäckt hot |
|---|---:|---:|---:|
| Lätt | 0,80 s | ±24° | 12 % |
| Normal | 0,40 s | ±10° | 40 % |
| Svår | 0,23 s | ±5° | 72 % |
| Expert | 0,13 s | ±2° | 90 % |

Nivåerna ändrar också hur ofta boten fattar attackbeslut, cirklar runt dig, använder sköld och orbitalt nedslag samt hur mycket den försöker förutsäga rörelse. Boten uppdaterar sin observerade position och upptäckta hot vid sin reaktionstid, inte varje bildruta. Liv, rörelsefart, skada och attackernas cooldowns är samma på alla nivåer. Svårighetsbalansen behöver fortsatt mänskligt speltest.


## Längre cooldowns
Alla 15 attacker har cirka 30 % längre cooldown (avrundat till tiondels sekund), för mer tid att placera sig mellan attacker. Exempel: Fire Ball 0,85 → 1,1 s, Lock 4,5 → 5,9 s och Dooms Day 8 → 10,4 s. Samma värden gäller spelare och bot på alla svårighetsgrader. Undanmanöverns cooldown är oförändrad.


## Autosikte på mobil
Touch och penna aktiverar autosikte; datorns mus behåller manuellt sikte. Autosiktet riktar varje ny attack mot motståndarens nuvarande position. Markattacker får också rätt avstånd till målet. Högerspaken har alltid företräde om du vill sikta själv. Attacker med uppladdning behåller sin valda riktning/position, och projektiler följer inte efter målet. Väggar, räckvidd, cooldowns och möjligheten att undvika gäller precis som förut. Autosikte skjuter inte av sig självt; tryck på attackknappen, eller håll ut högerspaken för grundattack.


Sax låser sin riktning när uppladdningen börjar, så motståndaren kan flytta sig åt sidan. Stun eller grab avbryter uppladdningen. Oavgjorda ronder ger ingen poäng; matchen fortsätter tills någon vunnit tre ronder.


## Door Mans länkade dörrar
Tryck L / tredje attackknappen för att lämna dörr A där du står. Flytta minst 100 enheter och lägg dörr B. Gå bort från dörren och sedan tillbaka in för att teleportera. Båda dörrarna står kvar tills ronden slutar. Ny placering ersätter den äldsta av dina två dörrar. Endast ägaren kan använda dem; i lokalt tvåspelarläge har varje Door Man sitt eget dörrpar. Förflyttningen går genom väggar, men dörrar placeras på golvet. Om motståndaren blockerar utgången väntar teleporteringen. Du måste lämna utgångsdörren innan du kan gå tillbaka, och 0,8 s återanvändningsspärr förhindrar studs fram och tillbaka. Du kan inte teleportera medan du är låst eller fångad. Knappen visar antal dörrar och vilken som placeras härnäst. Att placera en dörr gör ingen skada.


## Sailer — Control
Sailer har 170 HP, 175 rörelsefart och 3 s cooldown på undanmanöver. Han är långsam och gör lite skada, men har breda attacker med lång räckvidd. Eget utseende: kaptensmössa, randig tröja, gul sjöjacka, skägg, rep och träåra.

| Attack | Skada | Räckvidd | Cooldown | Effekt |
|---|---:|---:|---:|---|
| Tidal Wave | 9 | 500 | 2,4 s | Bred våg efter 0,2 s uppladdning, knuffar 115 |
| Headwind | 4 | 390 | 5,8 s | Bred vindkon efter 0,35 s, drar upp till 170 närmare |
| Dinghy Ride | 8 | 420 | 9 s | Jolle efter 0,45 s, fångar fienden längs rutten och transporterar till slutplatsen |

På dator väljer muspekaren jollens slutplats: sikta förbi motståndaren för att fånga och transportera den. På mobil använder autosiktet riktningen mot fienden och låter jollen fortsätta förbi; högerspaken ger manuellt riktval. Jollen går rakt, stannar vid väggar och släpper passageraren vid destinationen. En fångad fiende kan inte röra sig, attackera, använda dörrar eller undvika under transporten. Man kan undvika eller gå åt sidan före fångsten. Våg och vind kräver fri sikt, och undanmanöver undviker träffen. Förflyttningseffekter ger kort immunitet mot ny kontroll: 0,65 s efter push/pull och 1,1 s efter jollens släpp. Boten är fortfarande Ms AI.
