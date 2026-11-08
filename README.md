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
GitHub Pages: main / root. Alla filer inklusive maps.js, fighters.js, cards.js, doors.js, peer.js och multiplayer.js måste ligga i samma mapp. Google Fonts är valfritt och har reservtypsnitt. Ljudknappen aktiverar enkla ljudeffekter och talsyntes för The Overpowerd när webbläsaren stöder det.


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
Sailer får nu tre slumpade kort från poolen My Home, Capten, Time for Canons, This Is a Real Ship och Drunken Man. Kort du redan äger utesluts. Erbjudandet innehåller tre unika kort. Det finns ingen tvingad More HP-ersättning för Sailer längre. Övriga fighters, förutom Door Man som också har en egen kortpool, behåller sina tre grundkort.

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


## Door Man — fem Ability Cards
Door Man får tre slumpade, ännu inte ägda kort från sin egen pool. Samma regler som Sailer gäller: högst två kort, kortval efter förlorad rond och möjlighet att hoppa över. Stat- och attackförändringar beräknas från båda korten, oberoende av valordning.

| Kort | Effekt |
|---|---|
| Hottel | Upp till fem dörrar. Med minst två placerade dörrar går du ut ur en annan slumpad, ledig dörr |
| I’m Late, Need to Run | Dubbel fart, halvt maxliv (95 → 47,5) och 50 % kortare attackcooldowns |
| Magic | Running Man ersätts av Key Gun: 6 skada, 460 räckvidd, snabb projektil och 0,3 s cooldown |
| I Have a Famely | Dörrarna blir gun rooms med en skjutande person i varje. Ingen teleport. Varje dörr har 10 HP |
| No More Speed | 90 % lägre rörelsefart och 80 % kortare attackcooldowns |

### De tre specialkombinationerna
- **No More Speed + I Have a Famely:** dörrarna är spawners. Varje placerad dörr skapar exakt två rörliga skyttar med 10 HP var. Högst två dörrar och fyra skyttar. De kan skjutas, slås och träffas av områdesattacker. Att ersätta eller förstöra en spawner tar bort dess tillhörande skyttar, vilket förhindrar en obegränsad armé.
- **I’m Late + No More Speed:** Sonic-form. Ingen fart tas bort av No More Speed; i stället får han 1200 fart och behåller kortets halva maxliv. Alla attacker och undanmanöver tas bort. Rörelseriktning, start och stopp har 0,1 s fördröjning. Kontakt medan han springer ger 18 skada, med 0,45 s spärr mellan träffarna. Kollisionskontrollen sker längs rörelsen så hög fart inte hoppar över motståndaren. Väggar och kartornas markeffekter gäller fortfarande.
- **Hottel + Magic:** upp till fem slumpportaler och Key Gun. Andra spelarkaraktärer än Door Man som rör en dörr träffas av Lock-effekten: 7 skada och 0,7 s stun, med återhämtning innan ny fällträff. Andra Door Man-figurer är immuna mot just dörrfällan. Sköld/reflektion/undanmanöver ger vanliga motspel.

### Övriga kombinationer och dörrregler
Hottel + Family ger fem skjutande gun rooms, utan teleport. Magic + Family ger Key Gun och gun rooms. Magic + No More Speed ger 0,06 s cooldown på Key Gun men mycket låg fart. Late + Magic ger snabb skytt med halvt liv. Alla tio kortpar har särskilda förklaringar i kortvalet.

Dörrarna placeras där spelaren står, med samma avståndskrav som tidigare. En ny dörr ersätter den äldsta när gränsen två/fem är nådd. Bara ägaren kan använda portalerna. Ingången väljer en annan fri utgång; blockerade utgångar används inte. Spelaren måste lämna utgångsdörren innan ny teleport, och stun/grab hindrar teleport. Family ersätter teleport helt.

En familjedörrs skytt skjuter för 5 skada ungefär var 1,1 s, kräver fri sikt och har 450 räckvidd. Spawnerskyttar skjuter för 4 skada var 1,2 s och går mot motståndaren. Familjedörrar och skyttar har små synliga livstaplar. Minikartan visar dörrar och skyttar. Standardportaler är fortsatt inte förstörbara; 10 dörr-HP gäller Family-kortet.

Attackcooldowns reduceras genom den sammansatta attacklistan. Kortare animationer tillåter faktiskt den högre eldtakten. No More Speed sänker även hastigheten på Running Man och vanlig undanmanöver; det ändrar inte undanmanöverns cooldown. I Sonic-form finns ingen undanmanöver. Kortens effekter gäller både människa och bot. Boten anpassar räckvidd för Key Gun och söker kontakt i Sonic-form.

Nätverksspelet synkar upp till tio dörrar, familjeskyttar, deras HP och tillhörighet, fällor samt den fördröjda Sonic-rörelsen. Värden väljer slumpad hotellutgång och avgör alla träffar. Båda sidor behöver ladda om till samma version.

Tester täcker alla tjugo ordnade Door Man-kortpar, fem dörrar/slumpad utgång/ersättning, faktiska Key Gun-cooldowns, halvt liv, 10-HP-dörrar, begränsade familjespawners, förstörelse, ingen teleport med Family, fällstun och andra Door Mans immunitet samt Sonic-formens tomma attacklista, styrfördröjning och kontaktskada. Simulerade tvåklientstester verifierar fem dörrar, fällor, skyttars liv/förstörelse och Sonic-formens HUD/kontaktskada. Den tidigare gränsen för riktiga WebRTC-/enhetstester kvarstår.

### The Essy Kid ability cards

The Essy Kid now offers **Cheter**, **Big Hands**, and **Gloves** instead of basic stat cards. Three choices on the first loss, two remaining choices on the second loss, plus Skip. All three pairs compose in either acquisition order.

- **Cheter:** identical aimed Gun in all three slots, each with an independent 1-second cooldown; 10 damage, 460 range. Shots respect walls, dodge, guard and reflection.
- **Big Hands:** 1.5× melee/grab reach and arc, beam reach/width, gun range/projectile size; enlarged fist visuals.
- **Gloves:** all three moves become distinct visible, destructible 5-HP summons. Stone Boxer chases and punches (12 damage / 1 second); Scissors Turret stays put and fires (8 / 1.2 seconds); Bag Catcher chases and stuns (3 damage, 0.7-second stun with target stun immunity). Summon cooldowns are 7 / 9 / 11 seconds. At most three summons per player, oldest replaced; 18-second lifetime and round cleanup.
- **Big Hands + Gloves:** larger summons with 20 HP and 1.5× attack range/projectile size.
- **Cheter + Gloves:** each slot creates the same flying pistol that follows and shoots (6 damage / 0.85 seconds), with 5 HP and summon cooldowns.
- **Cheter + Big Hands:** all three guns gain the size and range bonus.

Summons use host-owned simulation and shared snapshots; guests cannot create or damage units independently. Tests cover every ordered pair, HP/destruction, distinct AI behaviors, cooldowns, bounded populations, expiry, round cleanup, remote card selection with two remaining choices, and synchronized large/flying summons. Online transport tests are simulated rather than a real network connection.

The Essy Kid now has five unique cards, with three random unowned cards offered after a loss:

- **New Jaket from Mom:** +150 max HP (300 total), 15% lower movement speed. Slot three becomes Jacket Block: 85% frontal damage reduction for 1.7 seconds, 7.2-second cooldown. Attacking or dodging cancels the block. With Cheter, two Guns remain; with Gloves, the first Bag instead receives the jacket and 150 HP (see below). Big Hands widens the block angle and retains larger offensive moves. A visible brown jacket and block arc show the change.
- **Det är sten sax påse:** all attack cooldowns ×0.75. Applies after Gun, summon or block replacements; jacket block becomes 5.4 seconds, Guns 0.75 seconds, summons 5.25/6.75/8.25 seconds. Does not shorten stun, summon lifetime, summon firing intervals or dodge cooldown.

All 20 ordered Essy card pairs are tested. Simulated online tests cover jacket HP, movement speed, slot replacement, reduced block cooldown, card choices and active block synchronization.

### Jacket + Gloves: jacket handoff

The first Bag cast each round transfers the jacket to a chasing, stunning Bag with 150 HP. The fighter loses 150 maximum HP and 150 current HP (minimum 1), loses the 15% movement penalty, and no longer wears the jacket. Other summons retain their normal HP. Later Bag casts create ordinary 5-HP Bag Catchers. Only one jacket Bag per round; destroying it does not return the jacket. It has no summon expiry and is protected from oldest-summon replacement, while still counting toward the three-summon limit. Damage, stun immunity, walls and round cleanup still apply. The next round restores the fighter's jacket and permits a fresh handoff. Host snapshots synchronize the transferred HP, speed, jacket appearance and 150-HP summon.

### Essy named combinations

- **Clap Clap — Big Hands + Det är sten sax påse:** each third accepted attack replaces that slot's normal move with a 210-range, wide clap. It charges visibly for 0.55 seconds, deals 20 damage and pulls a hit enemy at most 85 units toward a point 100 units in front of the player. Walls, dodge, defense and control immunity apply. Stun/grab cancels the windup. The selected slot still consumes its normal reduced cooldown. The counter and pending clap reset each round.
- **Big Iron — Cheter + Big Hands:** all three slots become large revolvers (18 damage, 690 range, 1.4-second independent cooldowns, radius 11). Every shot recoils the shooter 45 units; an unblocked hit knocks the enemy 90 units in the bullet direction. Movement respects walls and arena bounds; guard, reflect, dodge and control immunity remain valid counterplay.
- **You Can’t Touch Me — Jacket + Det är sten sax påse:** a successful frontal block charges the next Stone punch with +15 damage (38 total) and stronger 85-unit knockback. One charge maximum; further blocks do not stack it. The next punch consumes it even on a miss/dodge/block. Other attacks leave the charge intact. Rear/area damage does not charge it. The charge resets per round and has a visible indicator.

Unit tests verify trigger timing, interrupt/miss behavior, damage, recoil, pull, charge consumption and round reset. Simulated online tests verify all three combinations on the guest with authoritative host damage, movement and snapshots.

No More Speed now retains Running Man at **50% of normal dash distance** (325 dash speed for the same 0.38-second duration), rather than applying the 90% walk-speed reduction to it. The 80% shorter attack cooldown remains (Running Man 0.64 seconds). Hotel and Family combinations inherit this; Magic still replaces Running Man, and Late + No More Speed retains its special Sonic rules.

### Laores the Dragon replaces Flame Girl

Laores evolves with the actual round number, independent of wins or losses. No Ability Cards or card draft for Laores yet. Quick Match starts and ends as an egg; draws still advance the round and evolution. Round five and later use Elder form.

| Round | Form | HP | Ground speed | Moves |
| --- | --- | --- | --- | --- |
| 1 | Egg | 85 | 160 | Tackling only |
| 2 | Hatchling | 100 | 200 | Fire Ball replaces tackle; Flamethrower unlocked |
| 3 | Young dragon | 120 | 220 | Fire Ball, Flamethrower, Fly |
| 4 | Adult dragon | 150 | 235 | Larger/stronger fire attacks, faster flight |
| 5 | Elder Dragon | 185 | 245 | Strongest fire attacks and flight |

Egg tackle: 12 damage, 0.3-second rush, 2.8-second cooldown. Fire Ball: 15/17/21/26 direct damage in forms 2–5, range 440/470/500/530, 1.5-second cooldown, usual burn. Flamethrower: one-second aimed channel, 4/5/6/7 damage per pulse at 0.2-second intervals, range 180/205/230/255, 6-second cooldown; stun/grab interrupts. Fire attacks respect cover and defense.

Fly: zero damage, two seconds, 280/300/320 flight speed in forms 3–5, ten-second cooldown. Controlled with normal movement; crosses all interior walls and ignores ground terrain while airborne, with arena boundaries retained. Laores remains damageable. If flight expires inside a wall, it returns to its last safe ground position. Egg and each dragon form have distinct growing silhouettes, with wings and flight animation. Attack buttons show only unlocked moves.

Unit and simulated online tests cover all five stages, agreed HP/speed, evolution after either player loses, no card draft for Laores, dynamic attack buttons, flamethrower interruption, obstacle flight without damage, safe landing and Elder snapshots. Real network/browser testing remains unverified in this environment.

### Laores card 1: Lizard Have No Wings

Laores now offers its first unique card after a lost round: **Lizard Have No Wings**, or Skip. Only this available card is shown; no placeholder generic cards. It cannot be selected twice, and further losses after owning it proceed without an empty draft.

Fire damage gains +3 percentage points for each elapsed match round (+3% round 2, +6% round 3, +12% round 5). This stacks with the existing form growth and also applies to burn damage. Wings disappear visually. From round 3, Fly is replaced by **Inferno**: 65 base damage, 1000 range, 1-second aimed windup, 20-second cooldown. It is a single beam hit that stops at cover; dodge, guard, reflection and stun interruption still work. The first two moves and normal HP/speed progression remain. Round 2 still has only Fire Ball/Flamethrower.

Unit and simulated online tests cover the one-card draft/skip, duplicate exclusion, damage growth, round-3 replacement, windup, cooldown, wall block, stun interruption and guest-authoritative damage snapshots.

### Laores card 2: I Studid Magic

Two unique cards are now offered (plus Skip), with no duplicates and a two-card cap. Either acquisition order composes identically.

- **Magic Missile** replaces Fire Ball: weak homing (turn cap 1.8 radians/second), speed 300, range 500, 1.6-second cooldown, 10 base damage growing with form, 0.1-second stun on an unblocked hit. Walls, dodge, guard, reflection and existing stun immunity apply.
- **Gravity Well** replaces Flamethrower: place within 420 range, 120 radius, 0.6-second warning, 7-second cooldown. Deals 8 base damage growing with form and pulls an enemy up to 100 units toward its center. Cover, dodge, control immunity and passenger/grab restrictions apply.
- **Fly** remains when only Magic is selected. Egg still has one move and the second/third slots unlock in rounds 2/3 as usual.
- **Magic + Lizard:** slot three becomes **Time Stop**, replacing Inferno from round 3. Target within 500, 120-radius area, 0.6-second windup and 24-second cooldown. A valid hit stuns for 3 seconds and gives Laores 4× cooldown recovery for those 3 seconds; Time Stop itself always recovers at the normal rate. No damage and no buff on a miss. Cover, dodge, stun immunity and windup interruption counter it. On hit the enemy receives 6 seconds of stun immunity to prevent immediate restuns. Buff/stun reset each round. Control magic does not gain the Lizard fire-damage bonus; wing loss remains.

Unit tests cover both card orders, homing/ministun, gravity pull, Fly preservation, stop duration, cooldown acceleration excluding itself, cover and expiry. Simulated online tests cover actual drafts in both orders and synchronized stop/recovery state.

**I Studid Magic cooldown growth:** all attack base cooldowns now shrink by 5 percentage points for every elapsed round: −5% round 2, −10% round 3, −15% round 4, −20% round 5. Includes Magic Missile, Gravity Well, Fly and Time Stop. Time Stop's active 4× recovery still excludes its own cooldown; the passive per-round discount applies normally. The multiplier bottoms at 0.25 for unusually long drawn series. Unit tests cover all unlocked moves and actual Time Stop casts in rounds 2–5; existing simulated online stop/recovery tests pass with the new values.

**Laores appearance follows its cards:** Lizard removes both wings, changes scales to green, thickens/lengthens the tail and adds a spined silhouette and gold scale markings. Studied Magic adds a purple pointed wizard hat, gold band, star emblem, matching robe, violet eyes and orbiting sparks. The combined form keeps the wingless green lizard body and wizard clothes; its hat displays a clock for Time Stop. Features scale with the evolving dragon, derive directly from synchronized card loadouts and are independent of acquisition order. The egg renderer also supports the card colors/hat. Existing unit render checks and gameplay tests pass after the drawing change.

### Laores card 3: No Time to Wait

Starts on the round immediately after selection, following normal card timing. Laores instantly uses Elder form, all three unlocked moves, 185 HP and 245 movement speed. Age is measured from this activation round, not match start, and persists when acquiring a second card.

Each subsequent round removes 45 max HP, 25 ground speed and 25 percentage points of damage: 185/140/95/50 HP; 100/75/50/25% damage. Floors: 50 HP, 120 movement speed, 25% damage. Flight speed also declines proportionally. Cooldowns are not worsened by aging.

With **I Studid Magic**, immediately uses Elder-strength Magic Missile/Gravity Well/Fly with the round-five −20% base cooldown bonus. With **Lizard**, immediately uses Elder Fire Ball/Flamethrower/Inferno and the round-five +12% fire bonus. Aging damage multiplies those bonuses. Existing two-card cap remains, so all three cards cannot be combined. Both pair orders work; choosing aging second starts the clock then, choosing it first retains elapsed age when adding another card. Rematches reset age. Laores gains a white beard and increasingly visible wrinkles.

Unit tests cover actual draft activation, all moves, stats/aging floors, maxed bonuses, pair order and reset. Simulated online tests cover both pair orders, instant Elder attack buttons, aging HP snapshots and passive bonuses.

### Ordered combo: No Time to Wait → I Studid Magic

This pair now has an acquisition-order requirement. Choosing No Time to Wait first and Magic second replaces dodge (Shift/mobile dodge button/online dodge action) with **Rejuvenate**. The reverse order retains ordinary dodge.

Rejuvenate removes one elapsed round of aging per use, restoring the corresponding movement speed, damage and maximum HP. Current HP increases only by the restored maximum-HP difference (up to 45), preserving existing wounds. Twelve-second fixed cooldown. Cannot go younger than the first Elder round and does nothing at that floor; it does not grant movement or invulnerability. Existing stun/cast/grab/action locks apply. Rejuvenation only changes the current fighter state. Next round rebuilds age from the original card activation round, discarding all rejuvenation uses. Rematches reset it. The HUD labels the replacement and bots can use it. The server validates and applies the action; snapshots synchronize revised age/max HP/current HP and cooldown.

Unit tests verify the order requirement, age floor, wound-preserving recovery, action locks, cooldown, next-round rejuvenation reset, reverse-order dodge and reset. Simulated online tests obtain both cards through real drafts, activate via guest dodge input and verify host-owned age/HP changes and next-round rejuvenation reset.

### Laores card 4: Toothless

**Toothless** turns Laores into a Speedster: 1.5× ground and flight speed, 0.65× maximum HP. Attack damage, cooldowns and stage unlocks stay intact. Round 2: 65 HP / 300 speed; round 3: 78 HP / 330 speed; Elder: 120.25 HP / 367.5 speed. Applies after No Time to Wait aging reductions and composes in either order with Lizard, Magic or No Time to Wait. Lizard still removes Fly; Magic preserves its moves and hat; aging penalties still apply. The two-card limit is unchanged.

The appearance is slimmer with dark scales, blue-gray wings and glowing green eyes. Laores now offers three random unowned cards from its four-card pool (plus Skip); at most two can be owned.

Unit tests cover both pair orders with each card, HP/speed/flight and role, aging composition and unique random offers. Simulated online tests cover actual draft selection, reduced HP snapshots, Speedster HUD, movement and Magic/flight composition.

**Toothless bomb attacks:** Toothless now replaces Flamethrower with **Plasma Bomb**, a fired blue-white plasma ball: 26 base damage growing with form, 520 maximum range, speed 380, 110-radius explosion and 7.5-second cooldown. It detonates once on collision with an enemy/summon or wall, or at the aimed/max distance, with a brief 0.12-second explosion warning. Explosion cover and dodge checks apply; no direct-hit plus explosion double damage. Aegis can reflect the travelling ball.

With **I Studid Magic**, slot two becomes **Magic Bomb** instead of Gravity Well: 12 base damage growing with form, same projectile/radius, 8-second base cooldown and 0.8-second area stun with 3-second target stun immunity. Magic's per-round cooldown discount applies. Both card acquisition orders work; speed, HP and other move effects remain.

Tests verify contact/max-range splash, one damage event, cover, reflection, magic stun and both acquisition orders; simulated online tests verify visible projectile snapshots, authoritative explosion damage and synchronized magic stun.

All fighter attack names and attack-button tooltips are now in English, including card-based replacements. The Essy Kid uses **Rock**, **Scissors** and **Paper**; Door Man uses **Doors**; Laores starts with **Tackle**. Overpowerd's moves are spelled **Overpowered Punch** and **Doomsday**. Charge labels and named references in combat hints use the same names. Gameplay values and controls are unchanged. Syntax and existing unit/gameplay checks pass.

**Toothless without Studied Magic is entirely plasma-themed:** Fire Ball becomes **Plasma Bolt**, a blue-white bolt with the same direct damage/range/cooldown and no fire burn. Plasma Bomb remains slot two. Fly becomes **Plasma Flight**, retaining zero damage with a purely visual plasma trail. Lizard's Inferno becomes **Plasma Beam**, preserving charge, damage and cover rules with blue-white visuals. Egg tackle also has a plasma name if present. With Studied Magic, Magic Missile, Magic Bomb and Fly keep their magical behavior/names. Unit tests check no-burn bolt damage, plasma move names and harmless flight, and preserved magic variants; existing simulated online tests pass.

### Laores card 5: Hydra

**Hydra** is a tank transformation: +60 maximum HP plus 25 HP per extra head, with 20% lower ground and flight speed. Head count equals the actual round number (2 in round 2, 5 in round 5), independent of visual Elder advancement. Each head is visible, with matching colors and wizard hats when applicable; very long drawn games show a count after 12 rendered heads. Attacks keep their existing damage and effects. Typical HP: 185/230/285/345 in rounds 2–5.

All four other cards compose in either acquisition order. Toothless reduces base HP to 65%, then Hydra adds its flat HP; speed modifiers multiply. Magic retains its control moves and hats; Lizard removes wings; No Time to Wait advances to Elder immediately while heads follow match rounds and aging continues. Hydra displays the Tank role. Three random unowned cards are offered from the full five-card pool, with the existing two-card ownership cap.

**Toothless growth:** ground and flight speed now gain an additional additive 5% per elapsed round, multiplying the existing 1.5× modifier: factor `1.5 × (1 + 0.05 × elapsed rounds)`. Ground speed becomes 315 in round 2 and 363 in round 3. No Time to Wait immediately grants at least the round-five 20% growth bonus, with aging still reducing the underlying speed.

Unit tests cover Hydra heads/HP/speed, all eight ordered Hydra pairs, five-card random offers and Toothless growth. Simulated online tests cover Hydra selection, Tank HUD, head/HP progression through actual rounds and Magic composition; existing Toothless movement/flight snapshots use the growing bonus.
