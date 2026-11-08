# One vs One — Arena

En duellarena ovanifrån i HTML, CSS och JavaScript. Fri rörelse i två dimensioner, manuellt sikte, projektiler som kan missa och symmetriska väggar som skydd. Sex egna karaktärer. Boten får en slumpad fighter inför varje ny match och behåller den under alla ronder.

## Spela
Öppna index.html eller kör `python3 -m http.server 8080` och besök localhost:8080. Inga byggsteg behövs.

- Dator: WASD rörelse, musen siktar. Håll vänsterklick eller J för grundattack. K och L aktiverar specialförmågor. Shift eller mellanslag gör en undanmanöver i rörelseriktningen; om du står still används siktriktningen. Escape pausar.
- Mobil: vänster analog spak rör dig; höger spak siktar och skjuter automatiskt så länge den hålls ut. När högerspaken släpps siktar de tre attackknapparna automatiskt mot motståndarens nuvarande position. Håll ut högerspaken för manuellt sikte. En egen knapp gör undanmanöver. Flera fingrar stöds.
- Lokalt tvåspelarläge på dator: spelare 2 rör sig med pilar, använder 1/2/3 och undviker med 0. Spelare 2 har automatiskt riktat sikte mot spelare 1 för att kunna spela på samma tangentbord. Online använder båda spelarna sina egna WASD-/mobilkontroller på varsin enhet.
- Välj bäst av fem ronder (först till tre vinster) eller Quick Match (exakt en rond). 90 sekunder per rond. Vid timeout vinner högst återstående andel av maxliv.

## Fighters
| Fighter | Klass | Liv | Fart | Spelstil |
|---|---|---:|---:|---|
| The Essy Kid | Tank | 150 | 195 | Närslag, riktad stråle, grab och kast |
| Door Man | Speedster | 95 | 285 | Flanka, lås en riktad träff, rusa |
| Flame Girl | DPS | 105 | 235 | Projektiler, eldspår, stor drake |
| The Overpowerd | Burst-DPS | 125 | 185 | Obligatorisk pose och tydligt markerade attacker |
| Aegis | Defender | 140 | 200 | Sköldslag, blockering framifrån och reflektion |
| Sailer | Control | 170 | 175 | Bred våg, vind som drar och en fångande segeljolle |

Alla attacker har separata synliga cooldowns. Sten är ett tungt närslag (23 skada, 60 räckvidd, 1,5 s cooldown). Sax laddar synligt i 0,4 sekunder och skjuter sedan en riktad stråle (26 skada, 400 räckvidd, 4,2 s cooldown), som stoppas av väggar. Påse är en grab på nära håll: håll fast i 0,55 s och kasta sedan för 22 skada (145 räckvidd, 7,2 s cooldown). Båda står still under greppet, den fångade kan inte attackera eller undvika, och stun på The Essy Kid avbryter greppet. Missar och undanmanövrer ger ingen träff. Door Mans första attack är Running Man: rusa och tackla längs siktet (24 skada, 3,2 s cooldown). Andra attacken är Lock. Tredje förmågan är Dörrar: placera en dörr där du står (3 s cooldown). Han kan ha två egna dörrar, A och B, samtidigt; när båda finns kan han gå in i den ena och teleportera till den andra. Fire Fly lämnar brinnande mark; överlappande eldspår får inte stapla skada varje bildruta. The Overpowerd måste posera före varje attack, och poseringen avbryts av stun. Aegis har silverrustning, guldkanter, riddarhjälm och en spegelsköld.

## Placering
Väggar stoppar rörelse, rusningar och projektiler. Explosioner kräver fri sikt till målet. Markeringar visar var en explosion ska träffa och hur lång tid som återstår. Undanmanöver ger 0,2 sekunder osårbarhet men passerar inte genom väggar. Datorn cirklar, håller avstånd, reagerar med fördröjning och försöker hitta vägar runt skydd. Den använder riktiga projektiler och kan missa.

## Verifiering
`node test.cjs` testar 18 förmågor, tvådimensionell rörelse, normaliserad diagonal fart, väggkollision, blockerade skott, manuellt sikte och missar, brännskada, stun, undanmanöver, sköld, posering, undvikande av explosioner, botens identitet och navigering, paus och renderingsanrop i en simulerad miljö. Test i riktig webbläsare och på fysisk mobil återstår.

## Publicering
GitHub Pages: main / root. Alla filer inklusive maps.js, fighters.js, peer.js och multiplayer.js måste ligga i samma mapp. Google Fonts är valfritt och har reservtypsnitt. Ljudknappen aktiverar enkla ljudeffekter och talsyntes för The Overpowerd när webbläsaren stöder det.


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

På dator väljer muspekaren jollens slutplats: sikta förbi motståndaren för att fånga och transportera den. På mobil använder autosiktet riktningen mot fienden och låter jollen fortsätta förbi; högerspaken ger manuellt riktval. Jollen börjar mot vald destination. Under färden styr WASD / vänsterspaken jollen, medan Sailer står still. Efter manuell styrning fortsätter den rakt om spaken släpps. Den har begränsad körsträcka, stannar vid väggar och släpper passageraren när färden tar slut. En fångad fiende kan inte röra sig, attackera, använda dörrar eller undvika under transporten. Man kan undvika eller gå åt sidan före fångsten. Våg och vind kräver fri sikt, och undanmanöver undviker träffen. Förflyttningseffekter ger kort immunitet mot ny kontroll: 0,65 s efter push/pull och 1,1 s efter jollens släpp. Boten kan också få Sailer som slumpad fighter.


## Slumpad bot och Aegis
Den gamla robotkaraktären har ersatts av Aegis. Boten kan slumpa vilken som helst av de sex nuvarande karaktärerna, även samma som spelaren. Slumpningen sker en gång per match. Botens rörelseavstånd och förmågeval anpassas efter karaktären: The Essy Kid söker närstrid, Door Man rusar och placerar dörrar, Flame Girl håller avstånd, The Overpowerd poserar, Aegis försvarar sig och Sailer använder push/pull. De fyra svårighetsgraderna gäller alla botkaraktärer. Botens liv, skada och cooldowns följer samma karaktärsvärden som spelarens.

Aegis har 140 HP, 200 fart och 2,6 s cooldown på undanmanöver.
- Shield Bash: 14 skada på nära håll, knuffar undan fienden, 2,4 s cooldown.
- Iron Guard: blockerar 85 % av skada framifrån i 1,7 s, 5,5 s cooldown. Blockering stoppar också attackens knuff/låsning.
- Mirror Guard: 0,85 s reflektionsfönster, 7,5 s cooldown. Projektiler skickas tillbaka mot skytten; direkta slag och strålar kontras med 60 % av skadan. Projektiler reflekteras högst en gång för att undvika eviga studsar.

Skölden täcker cirka 140° framför Aegis och följer siktet. Under blockering/reflektion går han med 55 % av normal fart. En ny attack eller undanmanöver avslutar skyddet. Stun, grab eller jolle avbryter försvaret. Slag bakifrån, markexplosioner, brännskada, grab och jollens fångst kan gå förbi skölden. Mobilens autosikte riktar skölden mot motståndaren; högerspaken eller musen ger manuellt riktval.

Verifiering inkluderar nu alla sex slumpbara botkaraktärer, bibehållen fighter mellan ronder, frontal blockering, sårbarhet bakifrån, reflekterade projektiler/strålar/slag, markattackernas motspel och avbrutet försvar vid stun.


## Sex större kartor och Quick Match
Arenorna är nu 1600 × 1100 i stället för 1000 × 700, ungefär 2,5 gånger större till ytan. En följkamera och minikarta gör det möjligt att behålla läsbara figurer på mobil. Lokalt tvåspelarläge använder en gemensam kamera som zoomar ut för att visa båda spelarna. Musens sikte räknas om för kamerans position och zoom.

Slumpad karta är förvalt: en av de sex kartorna väljs när en ny match startar. Du kan även välja en bestämd karta före matchen. Kartans beskrivning visas vid valet, och matchens statusrad visar aktuell markeffekt.

| Karta | Miljö | Spelförändring |
|---|---|---|
| Verdant Ruins | Grönskande stenruiner | Källor läker 4 HP/s efter 2 s utan skada |
| Flooded Harbor | Hamn med mycket vatten och träbroar | Vatten sänker farten med 45 %; broar är torra. Sailer behåller farten i vatten |
| Frost Basin | Is och snö | Trög acceleration och glidande inbromsning på isen |
| Ember Crater | Vulkankrater | Lavaventiler varnar i 1,5 s och blir sedan aktiva i 2 s; aktiv lava gör 10 skada/s |
| Wind Dunes | Stormöken | Vindbyar pressar åt sidan, växlar riktning och blockeras av murar som ger lä |
| Neon Foundry | Fabrik | Transportband flyttar spelare norrut, söderut och österut |

Alla kartor har olika murplacering, färger och tydliga markeringar för sin mekanik. Spawnplatserna har fri mark och båda sidor är förbundna med gångbara rutter. Miljöeffekterna gäller både spelare och bot. Sailer är immun mot vattnets fartminskning; han påverkas fortfarande av is, vind, lava och transportband.

Matchlängd väljs separat från motståndare, svårighetsgrad och karta. Quick Match slutar efter en rond, även om den blir oavgjord. Bäst av fem fortsätter tills någon vunnit tre ronder; oavgjorda ronder ger ingen poäng. Karta, svårighetsgrad och botens slumpade fighter behålls mellan ronderna. Nya ronder återställer miljöns cykler och alla placerade dörrar/effekter.

Tester täcker sex kartor, giltiga startplatser och gångbara rutter över varje karta, vatten/Sailers immunitet/broar, isens glidning, läkning, lavavarning och skada, vindriktning, transportband, Quick Match vid vinst/oavgjort, fortsatt seriespel och kamerans siktkoordinater. Fysisk mobil och riktig webbläsare återstår att verifiera.


## Rörligare förmågor
- Door Mans Running Man har nu 3,2 s cooldown (tidigare 5,2 s).
- Sailers jolle kan styras under färden med WASD / mobilens vänsterspak; lokal spelare 2 använder pilarna. Sailer står still under fjärrstyrningen och kan inte attackera eller undvika samtidigt. Kameran följer jollen i enspelarläge. Jollen har mjuka svängar och samma begränsade körsträcka som tidigare; en fångad fiende följer med även genom svängen. Släpper du styrningen efter en sväng fortsätter jollen rakt. Ingen manuell styrning ger den ursprungliga färden till målpunkten.
- The Overpowerd kan röra sig med 50 % fart och ändra attackriktning/markmål under sin obligatoriska pose. Han poserar fortfarande och säger sin replik före varje attack. Mus, högerspak och mobilens autosikte uppdaterar riktningen fram till avfyrningen. Motståndarens riktiga stun/grab stoppar fortfarande honom och avbryter poseringen.


## Online — privat match med SMS-koder
Det finns nu ett WebRTC-läge för två enheter. Ingen registrering, separat signalserver eller egen serverinstallation behövs. Den som skapar matchen blir host och kör hela spelsimuleringen i sin webbläsare. Anslutningsinformationen skickas manuellt via SMS eller chatt.

### Anslut
1. Båda öppnar samma uppdaterade speladress och väljer **Online · privat match** och varsin fighter.
2. Värden väljer karta och Quick Match eller bäst av fem, trycker **Skapa match · bli host**, väntar tills värdkoden är klar och skickar hela koden.
3. Kompisen väljer **Gå med i match**, klistrar in värdkoden och trycker **Skapa svarskod**. Kompisen skickar tillbaka hela svarskoden.
4. Värden klistrar in svarskoden och trycker **Anslut med svarskoden**.
5. När båda är anslutna trycker värden **Starta onlinematch**.

Koderna är långa men kan kopieras eller delas med de inbyggda knapparna. De kan radbrytas i SMS; whitespace tas bort när koden läses. En svarskod gäller bara sin egen värdkod. Om ni börjar om måste båda använda det nya kodparet. Ni behöver inga kameror eller mikrofoner.

### Under matchen
Båda använder WASD + mus / J/K/L/Shift eller mobilspakar och attackknappar. Gästens karaktär är den gröna **DU**-figuren i gästens vy. Kameran, egna livstapeln, attackknapparna och minikartan följer rätt spelare. Sailer kan styra jollen, Door Man kan placera och använda sitt dörrpar, The Overpowerd kan styra sin pose och Aegis kan reflektera även som gäst.

Värden är auktoritativ för positioner, träffar, liv, cooldowns, miljöer och ronder. Gästen skickar normaliserade kontroller och attackönskemål, inte träffar eller livsvärden. Värden skickar tillstånd 20 gånger per sekund; gästen interpolerar figurernas rörelser. Start/inställningar/kontroller använder en tillförlitlig datakanal, tillståndsbilder en separat kanal med begränsad kö. Gamla meddelanden och meddelanden från föregående match ignoreras.

Båda kan pausa. Värden kan starta om efter matchen utan nya koder. Om någon lämnar avslutas onlinematchen. Värdens flik måste hållas öppen och aktiv; flikbyte pausar, och uteblivna kontroller stoppar gästens rörelse. Gästen visar vänteläge om värdens uppdateringar uteblir. Ingen bot tar över vid frånkoppling.

### Nätverk och verifieringsgräns
Anslutningen använder WebRTC och publika STUN-tjänster från Cloudflare och Google för att hitta möjliga direktadresser. Inga egna konton eller nycklar krävs. En TURN-reläserver ingår inte. Vissa brandväggar, företagsnät eller NAT-kombinationer kan därför blockera anslutningen. Prova samma wifi, en mobilhotspot eller ett annat nätverk; annars behövs en framtida relätjänst. Använd aktuell Chrome, Safari eller Firefox via HTTPS (GitHub Pages), eller localhost vid utveckling.

`node test.cjs` verifierar den befintliga spellogiken. `node online.test.cjs` kör två separata spelklienter med komprimerade koder, komplett lobbyhandshake, matchstart och kvittens, input/tillståndssynk, serverauktoritet, paus, ommatch, serieronder, frånkoppling och de olika karaktärernas nätverkskontroller. Transporten i testet är simulerad; det verifierar inte ICE/NAT eller en verklig internetanslutning. Ett försök att starta Chromium blockerades av testmiljöns socket-/nätverksbehörigheter. Verifiering mellan riktiga datorer/mobiler och olika nätverk återstår.


## Slumpade kartor och The Essy Kid
Slumpad karta är nu det första och förvalda kartvalet. En ny match eller ommatch gör en ny slumpning; samma karta behålls under serieronderna. I onlineläge gör värden slumpningen vid start och skickar den faktiska kartan till gästen. Båda får därför alltid samma bana. Ett manuellt kartval finns kvar när ni vill spela en viss miljö.

Sten/sax/påse-karaktären heter nu The Essy Kid och har ett E på hoodien. Påse har utökats från 95 till 145 räckvidd och från ungefär 74 till 115 graders träffkon. Skada, 0,55 s grepp och 7,2 s cooldown behålls. Gripet kräver fortfarande fri sikt och kan undvikas med undanmanöver. Botens avståndsbedömning använder den större grabben.
