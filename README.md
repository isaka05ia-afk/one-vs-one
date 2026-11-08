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
GitHub Pages: main / root. Alla filer inklusive maps.js, fighters.js, cards.js, peer.js och multiplayer.js måste ligga i samma mapp. Google Fonts är valfritt och har reservtypsnitt. Ljudknappen aktiverar enkla ljudeffekter och talsyntes för The Overpowerd när webbläsaren stöder det.


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


## Ability Cards — comeback och nya spelstilar
I bäst-av-fem får den som förlorar en rond välja ett av tre Ability Cards innan nästa rond startar. Kort gäller från nästa rond till matchens slut. Högst två kort per spelare: första och andra förlusten ger val, tredje förlusten avslutar matchen. Vinnaren får inget kort. Oavgjort ger inget kort. Quick Match har en enda rond och inget kortval efteråt.

Matchen väntar på valet; rondtid och miljöer står stilla. Mot bot väljer datorn sitt eget kort när den förlorar. I lokalt tvåspelarläge väljer den förlorande spelaren på samma skärm. Online är kortval och nästa rond auktoritativa hos värden: gästen får välja sina egna erbjudna kort, och värden väntar tills valet är bekräftat. Kort, uppgraderat maxliv, båtens liv, aktiva attacker och My Homes karta synkas till båda klienterna.

### Sailer
Sailers ursprungliga tre kort:

| Kort | Förändring | Avvägning |
|---|---|---|
| My Home | Exakt 60 % chans till Flooded Harbor inför varje kommande rond | Övriga 40 % slumpas bland de fem andra kartorna; ingen direkt stridsbonus |
| Capten | Börjar varje rond i en permanent rörlig båt med 50 egna HP, +40 fart på land och ytterligare +100 i vatten | Tredje attacken tas bort. När båten förstörs går han till fots resten av ronden |
| Time for Canons | Ersätter kontrollattacker med Cannonball, Grapeshot och Deck Cannon | Smala skott med betydligt mindre AoE; förlorar vågens push, vindens pull och jollen |

My Home överstyr även ett manuellt kartval från menyn. Om båda spelarna har My Home är chansen fortfarande 60 %, inte staplad. När ingen har kortet behålls kartan mellan ronderna som tidigare.

Capten ger 215 fart på land och 315 i vatten jämfört med Sailers grundfart 175. Båtens 50 HP absorberar skada först, inklusive miljöskada; överskjutande skada träffar Sailer. Båten återställs vid nästa rond. Läkande källor reparerar den inte. Förlorad båt tar bort fartbonusen men ger inte tillbaka den tredje attacken. Sailer är fortfarande immun mot vattnets normala fartminskning.

Kanonerna:
- Cannonball: 30 skada, 550 räckvidd, 2,2 s cooldown. Smal projektil.
- Grapeshot: tre täta projektiler med 12 skada vardera, 360 räckvidd, 5,8 s cooldown.
- Deck Cannon: 42 skada, 620 räckvidd, 9,5 s cooldown och 0,65 s uppladdning. Ingen stor explosion.

Kortkombinationer beräknas från valen varje rond i stället för att skriva över grundkaraktären. Valordningen spelar ingen roll. **Capten + Time for Canons** ger den permanenta båten med exakt två skadeattacker, Cannonball och Grapeshot. Tredje attacken kommer aldrig tillbaka via kanonkortet. My Home kombineras både med båten och kanonerna.

Ett Sailer-specialkort kan bara väljas en gång. Sailer har nu fem specialkort: tre olika, ännu inte ägda kort slumpas fram vid varje kortval. Hoppa över finns som alternativ utan att ta ett kort.

### Övriga fighters
More HP ger +35 maxliv, More Damage ger +20 % attackskada och More Speed ger +15 % rörelsefart. De tre valen finns efter varje berättigad förlust. Grundkorten kan väljas två gånger, men tar då upp båda kortplatserna. Maxliv ökar additivt, skada/fart multiplicativt. Grundattackerna och cooldowns ändras inte.

Alla kort rensas vid ny match/ommatch. Uppgraderingar är per spelare och följer samma regler för människor och botar.

### Korttester
Tester täcker att bara förloraren får tre val, att nästa rond väntar, högst två kort, inga kort efter slutrond/Quick Match, samtliga Sailer-kortpar i båda ordningarna, båtens 50 HP/överskjutande skada/återställning/vattenfart, exakt 60 av 100 jämnt fördelade My Home-slumputfall, kanonernas ersatta attacklista och grundkortens statseffekter. Simulerade tvåklientstester täcker gästens kortval, avvisade felval, två knappar med Capten + kanoner, båtliv, uppgraderat maxliv och synkroniserad vattenkarta. Verkliga tvåenhetstester har samma tidigare verifieringsgräns.


## Sailer: fem kort, slumpade erbjudanden och Hoppa över
Sailer får nu tre slumpade kort från poolen My Home, Capten, Time for Canons, This Is a Real Ship och Drunken Man. Kort du redan äger utesluts. Erbjudandet innehåller tre unika kort. Det finns ingen tvingad More HP-ersättning för Sailer längre. Övriga fighters behåller sina tre grundkort.

**Hoppa över kortvalet** fortsätter till nästa rond utan att ge ett kort. Att hoppa över tar inte en kortplats. Du får fortfarande högst två kort, med kortval efter de två första förlusterna; ett överhoppat val ger ingen extra chans efter matchens slut. Värden verifierar även gästens skip-begäran och draft-ID.

### This Is a Real Ship
Utan kanon- eller Capten-kombination blir Dinghy Ride dubbelt så stor i både bild och kollisions-/fångstområde. Maxräckvidden ökar från 420 till 840. Den går till den riktade slutplatsen utan styrning under färden, stannar vid väggar och har tillräcklig livstid för det längre avståndet. Den kan inte passera lika smala öppningar som den lilla jollen.

- **Real Ship + Capten:** den permanenta båten behåller sin normala storlek men får 200 båt-HP i stället för 50. Med intakt båt är landfarten 30 % lägre: 215 × 0,7 = 150,5. I vatten är den fortfarande 315. När båten förstörs återgår Sailer till sin normala fart och till fots resten av ronden. Tredje attacken förblir borttagen.
- **Real Ship + Time for Canons:** alla tidigare attacker ersätts av exakt en attack, Dreadnought Cannon. En stor kula går genom väggar, gör 85 skada, har 1000 räckvidd, 1 s uppladdning och 8 s cooldown. Den kan undvikas och reflekteras. Det finns inga andra attackknappar i denna kombination.
- **Real Ship + My Home:** samma stora, ostyrbara jolle och 60 % vattenchans inför nästa rond.

### Drunken Man
Dubbel attackskada, med två separata nackdelar:
- Var femte sekund kontrolleras styrningen. Om den är normal finns tills vidare **50 % chans** till omvänd rörelse i fem sekunder. Är rörelsen redan omvänd återgår den till normal vid nästa femsekundersgräns. Den vänds alltså inte automatiskt varje gång. Siktriktningen är oförändrad.
- När en tillgänglig attack påbörjas finns **10 % risk** att attacken helt misslyckas och ersätts av **3 sekunders självstun**. Ingen projektil eller annan attackeffekt skapas. Attackens cooldown förbrukas, så man kan inte göra omedelbara nya försök.

Risken att vända kontroller och risken att missa en attack är oberoende. De gäller även botar. Omvänd styrning påverkar även styrbar Dinghy Ride, men Real Ships jolle kan aldrig styras. Med Capten är den permanenta båtens rörelse omvänd när effekten är aktiv. Med Time for Canons gör kanonerna dubbel skada men kan misslyckas. My Home fungerar som vanligt.

I onlineläget slumpar värden båda effekterna och synkar utfallet. Gästen skickar råa kontroller så att inversionen bara tillämpas en gång. HUD visar när rörelsen är omvänd. Alla tjugo ordnade par av Sailers fem kort har testats för kompatibel attacklista och båtliv.

Nya tester täcker 3-av-5-erbjudanden, bortfiltrerade ägda kort, samtliga kortpar i båda ordningarna, ostyrbar större jolle, 200-HP-båt och land-/vattenfart, vägggenomträngande singelkanon, slumpad styrningsvändning och återgång, utebliven attack vid självstun, dubbel skada och skip. Simulerade onlinetester täcker de nya kombinationernas HUD, 200 båtliv, vägggenomträngning, skip samt auktoritativ styrningsvändning och självstun.
