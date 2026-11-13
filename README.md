> **Nytt i v61:** Jolle/grab/virvel och portaler fungerar med lagkamrater. Blå laglivmätare, 25 % lagkamratsskada från reaktorstrålar, delad terräng och Yoga-läkning. Laores skada: −20/−10/0/+15/+25 % i form 1–5. Inferno/Plasma Beam kan riktas om under uppladdning. Cache v61 / nätverksversion arena-online-44. Se [MULTIPLAYER.md](MULTIPLAYER.md).

> **Nytt i v60:** Träningsbana, håll/släpp-sikte och 1v1v1, 1v1v1v1, 2v2 samt 3v3 offline och online. Fyll lediga onlineplatser med valbara/slumpade botar. Se [MULTIPLAYER.md](MULTIPLAYER.md) för hur du spelar, regler och testgränser. Cache v60 / nätverksversion arena-online-43.

# One vs One — Arena

En duellarena ovanifrån i HTML, CSS och JavaScript. Fri rörelse i två dimensioner, manuellt sikte, projektiler som kan missa och symmetriska väggar som skydd. Nio egna karaktärer. Boten får en slumpad fighter inför varje ny match och behåller den under alla ronder.

## Spela
Öppna index.html eller kör `python3 -m http.server 8080` och besök localhost:8080. Inga byggsteg behövs.

- Dator: WASD rörelse, musen siktar. Håll vänsterklick eller J för grundattack. K och L aktiverar specialförmågor. Shift eller mellanslag gör en undanmanöver i rörelseriktningen; om du står still används siktriktningen. Escape pausar.
- Mobil: vänster analog spak rör dig; höger spak siktar och skjuter automatiskt så länge den hålls ut. När högerspaken släpps siktar de tre attackknapparna automatiskt mot motståndarens nuvarande position. Håll ut högerspaken för manuellt sikte. En egen knapp gör undanmanöver. Flera fingrar stöds.
- Lokalt tvåspelarläge på dator: spelare 2 rör sig med pilar, använder 1/2/3 och undviker med 0. Spelare 2 har automatiskt riktat sikte mot spelare 1 för att kunna spela på samma tangentbord. Online använder båda spelarna sina egna WASD-/mobilkontroller på varsin enhet.
- Välj bäst av fem ronder (först till tre vinster) eller Quick Match (exakt en rond). 90 sekunder per rond. Vid timeout vinner högst återstående andel av maxliv.

## Fighters
| Fighter | Klass | Liv | Fart | Spelstil |
|---|---|---:|---:|---|
| Bob | Tank | 150 | 195 | Närslag, riktad stråle, grab och kast |
| Door Man | Speedster | 95 | 285 | Flanka, lås en riktad träff, rusa |
| Laores the Dragon | Evolution | 85–185 | 160–245 | Ägg till Elder Dragon; kort ändrar formen |
| Engin | DPS | 125 | 185 | Stationär reaktorstråle, explosion med HP-kostnad och studsande energikula |
| Olympic Team | Relay | 3 × 40 | 180–360 | Löpare, simmare och skridskoåkare med egna liv |
| Sailer | Control | 170 | 175 | Bred våg, vind som drar och en fångande segeljolle |

Alla attacker har separata synliga cooldowns. Sten är ett tungt närslag (23 skada, 60 räckvidd, 1,5 s cooldown). Sax laddar synligt i 0,4 sekunder och skjuter sedan en riktad stråle (26 skada, 400 räckvidd, 4,2 s cooldown), som stoppas av väggar. Påse är en grab på nära håll: håll fast i 0,55 s och kasta sedan för 22 skada (145 räckvidd, 7,2 s cooldown). Båda står still under greppet, den fångade kan inte attackera eller undvika, och stun på Bob avbryter greppet. Missar och undanmanövrer ger ingen träff. Door Mans första attack är Running Man: rusa och tackla längs siktet (24 skada, 3,2 s cooldown). Andra attacken är Lock. Tredje förmågan är Dörrar: placera en dörr där du står (3 s cooldown). Han kan ha två egna dörrar, A och B, samtidigt; när båda finns kan han gå in i den ena och teleportera till den andra. Fire Fly lämnar brinnande mark; överlappande eldspår får inte stapla skada varje bildruta. Engin står still under Reactor Beam och avbryts av stun. Aegis har silverrustning, guldkanter, riddarhjälm och en spegelsköld.

## Placering
Väggar stoppar rörelse, rusningar och projektiler. Explosioner kräver fri sikt till målet. Markeringar visar var en explosion ska träffa och hur lång tid som återstår. Undanmanöver ger 0,2 sekunder osårbarhet men passerar inte genom väggar. Datorn cirklar, håller avstånd, reagerar med fördröjning och försöker hitta vägar runt skydd. Den använder riktiga projektiler och kan missa.

## Verifiering
`node test.cjs` testar 18 förmågor, tvådimensionell rörelse, normaliserad diagonal fart, väggkollision, blockerade skott, manuellt sikte och missar, brännskada, stun, undanmanöver, sköld, posering, undvikande av explosioner, botens identitet och navigering, paus och renderingsanrop i en simulerad miljö. Test i riktig webbläsare och på fysisk mobil återstår.

## Publicering
GitHub Pages: main / root. Alla filer inklusive maps.js, fighters.js, cards.js, doors.js, dragon.js, olympic.js, oldteam.js, engin.js, kids.js, pain.js, gods.js, controls.js, enginextras.js, peer.js och multiplayer.js måste ligga i samma mapp. Google Fonts är valfritt och har reservtypsnitt. Ljudknappen aktiverar enkla ljudeffekter och talsyntes för Engin när webbläsaren stöder det.


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


## Slumpad bot och Olympic Team
Boten väljer en av de sex karaktärerna per match. Olympic Team ersätter Aegis och kan användas av både spelare och bot. Boten anpassar deltagarval och attacker efter vatten, is, skador och hot. Se Olympic Team-avsnittet nedan för reglerna.

## Sex större kartor och Quick Match
Arenorna är nu 1600 × 1100 i stället för 1000 × 700, ungefär 2,5 gånger större till ytan. En följkamera och minikarta gör det möjligt att behålla läsbara figurer på mobil. Lokalt tvåspelarläge använder en gemensam kamera som zoomar ut för att visa båda spelarna. Musens sikte räknas om för kamerans position och zoom.

Slumpad karta är förvalt: en av de sex kartorna väljs när en ny match startar. Du kan även välja en bestämd karta för första ronden. Varje följande rond får en ny slumpad karta. Kartans beskrivning visas vid valet, och matchens statusrad visar aktuell markeffekt.

| Karta | Miljö | Spelförändring |
|---|---|---|
| Verdant Ruins | Grönskande stenruiner | Källor läker 4 HP/s efter 2 s utan skada |
| Flooded Harbor | Hamn med mycket vatten och träbroar | Vatten sänker farten med 45 %; broar är torra. Sailer behåller farten i vatten |
| Frost Basin | Is och snö | Trög acceleration och glidande inbromsning på isen |
| Ember Crater | Vulkankrater | Lavaventiler varnar i 1,5 s och blir sedan aktiva i 2 s; aktiv lava gör 10 skada/s |
| Wind Dunes | Stormöken | Vindbyar pressar åt sidan, växlar riktning och blockeras av murar som ger lä |
| Neon Foundry | Fabrik | Transportband flyttar spelare norrut, söderut och österut |

Alla kartor har olika murplacering, färger och tydliga markeringar för sin mekanik. Spawnplatserna har fri mark och båda sidor är förbundna med gångbara rutter. Miljöeffekterna gäller både spelare och bot. Sailer är immun mot vattnets fartminskning; han påverkas fortfarande av is, vind, lava och transportband.

Matchlängd väljs separat från motståndare, svårighetsgrad och karta. Quick Match slutar efter en rond, även om den blir oavgjord. Bäst av fem fortsätter tills någon vunnit tre ronder; oavgjorda ronder ger ingen poäng. Svårighetsgrad och botens slumpade fighter behålls mellan ronderna. Kartan lottas på nytt inför varje rond. Nya ronder återställer miljöns cykler och alla placerade dörrar/effekter.

Tester täcker sex kartor, giltiga startplatser och gångbara rutter över varje karta, vatten/Sailers immunitet/broar, isens glidning, läkning, lavavarning och skada, vindriktning, transportband, Quick Match vid vinst/oavgjort, fortsatt seriespel och kamerans siktkoordinater. Fysisk mobil och riktig webbläsare återstår att verifiera.


## Rörligare förmågor
- Door Mans Running Man har nu 3,2 s cooldown (tidigare 5,2 s).
- Sailers jolle kan styras under färden med WASD / mobilens vänsterspak; lokal spelare 2 använder pilarna. Sailer står still under fjärrstyrningen och kan inte attackera eller undvika samtidigt. Kameran följer jollen i enspelarläge. Jollen har mjuka svängar och samma begränsade körsträcka som tidigare; en fångad fiende följer med även genom svängen. Släpper du styrningen efter en sväng fortsätter jollen rakt. Ingen manuell styrning ger den ursprungliga färden till målpunkten.
- Engin ersätter The Overpowerd. Reactor Beam låser rörelsen under laddning och kanalisering; stun/grab avbryter.


## Online — privat match med SMS-koder
Det finns nu ett WebRTC-läge för två enheter. Ingen registrering, separat signalserver eller egen serverinstallation behövs. Den som skapar matchen blir host och kör hela spelsimuleringen i sin webbläsare. Anslutningsinformationen skickas manuellt via SMS eller chatt.

### Anslut
1. Båda öppnar samma uppdaterade speladress och väljer **Online · privat match** och varsin fighter.
2. Värden väljer första kartan och Quick Match eller bäst av fem, trycker **Skapa match · bli host**, väntar tills värdkoden är klar och skickar hela koden.
3. Kompisen väljer **Gå med i match**, klistrar in värdkoden och trycker **Skapa svarskod**. Kompisen skickar tillbaka hela svarskoden.
4. Värden klistrar in svarskoden och trycker **Anslut med svarskoden**.
5. När båda är anslutna trycker värden **Starta onlinematch**.

Koderna är långa men kan kopieras eller delas med de inbyggda knapparna. De kan radbrytas i SMS; whitespace tas bort när koden läses. En svarskod gäller bara sin egen värdkod. Om ni börjar om måste båda använda det nya kodparet. Ni behöver inga kameror eller mikrofoner.

### Under matchen
Båda använder WASD + mus / J/K/L/Shift eller mobilspakar och attackknappar. Gästens karaktär är den gröna **DU**-figuren i gästens vy. Kameran, egna livstapeln, attackknapparna och minikartan följer rätt spelare. Sailer kan styra jollen, Door Man kan placera och använda sitt dörrpar, Engin kan styra sin reaktorstråle långsamt och Aegis kan reflektera även som gäst.

Värden är auktoritativ för positioner, träffar, liv, cooldowns, miljöer och ronder. Gästen skickar normaliserade kontroller och attackönskemål, inte träffar eller livsvärden. Värden skickar tillstånd 20 gånger per sekund; gästen interpolerar figurernas rörelser. Start/inställningar/kontroller använder en tillförlitlig datakanal, tillståndsbilder en separat kanal med begränsad kö. Gamla meddelanden och meddelanden från föregående match ignoreras.

Båda kan pausa. Värden kan starta om efter matchen utan nya koder. Om någon lämnar avslutas onlinematchen. Värdens flik måste hållas öppen och aktiv; flikbyte pausar, och uteblivna kontroller stoppar gästens rörelse. Gästen visar vänteläge om värdens uppdateringar uteblir. Ingen bot tar över vid frånkoppling.

### Nätverk och verifieringsgräns
Anslutningen använder WebRTC, publika STUN-tjänster från Cloudflare/Google och samma publika TURN-reserv som PeerJS 1.5.4 (EU/USA). Webbläsaren väljer direktanslutning eller relä automatiskt. Inga egna konton eller nycklar krävs för denna publika reserv, men tillgänglighet och stöd för alla brandväggar garanteras inte. Använd aktuell Chrome, Safari eller Firefox via HTTPS (GitHub Pages), eller localhost vid utveckling.

`node test.cjs` verifierar den befintliga spellogiken. `node online.test.cjs` kör två separata spelklienter med komprimerade koder, komplett lobbyhandshake, matchstart och kvittens, input/tillståndssynk, serverauktoritet, paus, ommatch, serieronder, frånkoppling och de olika karaktärernas nätverkskontroller. Transporten i testet är simulerad; det verifierar inte ICE/NAT eller en verklig internetanslutning. Ett försök att starta Chromium blockerades av testmiljöns socket-/nätverksbehörigheter. Verifiering mellan riktiga datorer/mobiler och olika nätverk återstår.


## Slumpade kartor och Bob
Slumpad karta är nu det första och förvalda kartvalet. En ny match eller ommatch gör en ny slumpning; samma karta behålls under serieronderna. I onlineläge gör värden slumpningen vid start och skickar den faktiska kartan till gästen. Båda får därför alltid samma bana. Ett manuellt kartval finns kvar när ni vill spela en viss miljö.

Sten/sax/påse-karaktären heter nu Bob och har ett E på hoodien. Påse har utökats från 95 till 145 räckvidd och från ungefär 74 till 115 graders träffkon. Skada, 0,55 s grepp och 7,2 s cooldown behålls. Gripet kräver fortfarande fri sikt och kan undvikas med undanmanöver. Botens avståndsbedömning använder den större grabben.


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
Från v59 är generiska HP-, skade- och fartkort borttagna. Varje karaktär använder endast sina fem egna kortfamiljer; inga upprepade kortfamiljer tillåts. Se STRATEGIES.md för den granskade kortuppsättningen och bottesterna.

Alla kort rensas vid ny match/ommatch. Uppgraderingar är per spelare och följer samma regler för människor och botar.

### Korttester
Tester täcker att bara förloraren får tre val, att nästa rond väntar, högst två kort, inga kort efter slutrond/Quick Match, samtliga Sailer-kortpar i båda ordningarna, båtens 50 HP/överskjutande skada/återställning/vattenfart, exakt 60 av 100 jämnt fördelade My Home-slumputfall, kanonernas ersatta attacklista och grundkortens statseffekter. Simulerade tvåklientstester täcker gästens kortval, avvisade felval, två knappar med Capten + kanoner, båtliv, uppgraderat maxliv och synkroniserad vattenkarta. Verkliga tvåenhetstester har samma tidigare verifieringsgräns.


## Sailer: fem kort, slumpade erbjudanden och Hoppa över
Sailer får nu tre slumpade kort från poolen My Home, Capten, Time for Canons, This Is a Real Ship och Drunken Man. Kort du redan äger utesluts. Erbjudandet innehåller tre unika kort. Det finns ingen tvingad More HP-ersättning för Sailer längre. Från v59 har alla fighters egna pooler med fem kortfamiljer.

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

### Bob ability cards

Bob now offers **Cheter**, **Big Hands**, and **Gloves** instead of basic stat cards. Three choices on the first loss, two remaining choices on the second loss, plus Skip. All three pairs compose in either acquisition order.

- **Cheter:** identical aimed Gun in all three slots, each with an independent 1-second cooldown; 10 damage, 460 range. Shots respect walls, dodge, guard and reflection.
- **Big Hands:** 1.5× melee/grab reach and arc, beam reach/width, gun range/projectile size; enlarged fist visuals.
- **Gloves:** all three moves become distinct visible, destructible 5-HP summons. Stone Boxer chases and punches (12 damage / 1 second); Scissors Turret stays put and fires (8 / 1.2 seconds); Bag Catcher chases and stuns (3 damage, 0.7-second stun with target stun immunity). Summon cooldowns are 7 / 9 / 11 seconds. At most three summons per player, oldest replaced; 18-second lifetime and round cleanup.
- **Big Hands + Gloves:** larger summons with 20 HP and 1.5× attack range/projectile size.
- **Cheter + Gloves:** each slot creates the same flying pistol that follows and shoots (6 damage / 0.85 seconds), with 5 HP and summon cooldowns.
- **Cheter + Big Hands:** all three guns gain the size and range bonus.

Summons use host-owned simulation and shared snapshots; guests cannot create or damage units independently. Tests cover every ordered pair, HP/destruction, distinct AI behaviors, cooldowns, bounded populations, expiry, round cleanup, remote card selection with two remaining choices, and synchronized large/flying summons. Online transport tests are simulated rather than a real network connection.

Bob now has five unique cards, with three random unowned cards offered after a loss:

- **New Jaket from Mom:** +100 max HP (250 total), 15% lower movement speed. Slot three becomes Jacket Block: 85% frontal damage reduction for 1.7 seconds, 7.2-second cooldown. Attacking or dodging cancels the block. With Cheter, two Guns remain; with Gloves, the first Bag instead receives the jacket and 100 HP (see below). Big Hands widens the block angle and retains larger offensive moves. A visible brown jacket and block arc show the change.
- **Det är sten sax påse:** all attack cooldowns ×0.75. Applies after Gun, summon or block replacements; jacket block becomes 5.4 seconds, Guns 0.75 seconds, summons 5.25/6.75/8.25 seconds. Does not shorten stun, summon lifetime, summon firing intervals or dodge cooldown.

All 20 ordered Essy card pairs are tested. Simulated online tests cover jacket HP, movement speed, slot replacement, reduced block cooldown, card choices and active block synchronization.

### Jacket + Gloves: jacket handoff

The first Bag cast each round transfers the jacket to a chasing, stunning Bag with 100 HP. The fighter loses 100 maximum HP and 100 current HP (minimum 1), loses the 15% movement penalty, and no longer wears the jacket. Other summons retain their normal HP. Later Bag casts create ordinary 5-HP Bag Catchers. Only one jacket Bag per round; destroying it does not return the jacket. It has no summon expiry and is protected from oldest-summon replacement, while still counting toward the three-summon limit. Damage, stun immunity, walls and round cleanup still apply. The next round restores the fighter's jacket and permits a fresh handoff. Host snapshots synchronize the transferred HP, speed, jacket appearance and 100-HP summon.

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

All fighter attack names and attack-button tooltips are now in English, including card-based replacements. Bob uses **Rock**, **Scissors** and **Paper**; Door Man uses **Doors**; Laores starts with **Tackle**. Engin uses **Reactor Beam**, **Over Powerd** and **Radioactive Orb**. Charge labels and named references in combat hints use the same names. Gameplay values and controls are unchanged. Syntax and existing unit/gameplay checks pass.

**Toothless without Studied Magic is entirely plasma-themed:** Fire Ball becomes **Plasma Bolt**, a blue-white bolt with the same direct damage/range/cooldown and no fire burn. Plasma Bomb remains slot two. Fly becomes **Plasma Flight**, retaining zero damage with a purely visual plasma trail. Lizard's Inferno becomes **Plasma Beam**, preserving charge, damage and cover rules with blue-white visuals. Egg tackle also has a plasma name if present. With Studied Magic, Magic Missile, Magic Bomb and Fly keep their magical behavior/names. Unit tests check no-burn bolt damage, plasma move names and harmless flight, and preserved magic variants; existing simulated online tests pass.

### Laores card 5: Hydra

**Hydra** is a tank with extra lives, not extra max HP. Head count starts at the actual round number (2 in round 2, 5 in round 5). A lethal hit consumes one extra head and revives Laores with 25% of its normal max HP plus 1 percentage point per elapsed round: 26% in round 2, 27% in round 3, 29% in round 5 (capped at 100% in very long drawn matches). With one head left, the next death ends the round. Heads visibly disappear when consumed and reset/grow at the next round. Ground and flight speed remain 20% lower. Attacks retain their damage/effects. Each head follows card colors and wizard hats.

All four other cards compose in either acquisition order. Toothless reduces max HP to 65%, and revives use that reduced max HP; speed modifiers multiply. Magic retains its control moves and hats; Lizard removes wings; No Time to Wait advances to Elder immediately while heads follow match rounds and aging continues. Hydra displays the Tank role. Three random unowned cards are offered from the full five-card pool, with the existing two-card ownership cap.

**Toothless growth:** ground and flight speed now gain an additional additive 5% per elapsed round, multiplying the existing 1.5× modifier: factor `1.5 × (1 + 0.05 × elapsed rounds)`. Ground speed becomes 315 in round 2 and 363 in round 3. No Time to Wait immediately grants at least the round-five 20% growth bonus, with aging still reducing the underlying speed.

Unit tests cover Hydra heads/HP/speed, all eight ordered Hydra pairs, five-card random offers and Toothless growth. Simulated online tests cover Hydra selection, Tank HUD, head/HP progression through actual rounds and Magic composition; existing Toothless movement/flight snapshots use the growing bonus.


Hydra revive tests verify all lives in rounds 2–5, per-round recovery percentages, no max-HP bonus, final death, head reset and Toothless composition. Revive clears disabling states, safely releases grabs/boats, lands if necessary, and grants a 0.3-second stationary recovery window to prevent instant repeated life loss. Cooldowns do not reset. Simulated online tests verify a lethal-hit revival, remaining head count/HP snapshots, final-life defeat and next-round reset.


### New map lottery each round

Every non-final round transition now rerolls from all six maps, even if a specific starting map was chosen. Maps may repeat because each lottery is independent. The first-map selector still controls the initial round; Quick Match has no additional lottery. The new map is chosen when the next round spawns, after any card choices, and clears/restarts terrain cycles and entities as usual.

With **My Home** on either or both players, each new-round lottery has exactly 60% chance of Flooded Harbor. The remaining 40% is split among the five non-water maps. Two holders do not stack the probability. The host performs the lottery and sends the resulting map to the guest.

Unit tests exercise five actual series rounds with five controlled outcomes, no extra map change after the final round, and exactly 60/100 water rolls for either/both My Home holders. Simulated online tests verify five actual round maps match between host and guest. Existing combat tests explicitly select their fixture maps so environmental differences do not change their intended checks.


### Olympic Team replaces Aegis

Three female athletes with distinct skin tones and outfits: Runner (deep brown skin, red track kit, high ponytail), Swimmer (warm tan skin, blue swimsuit/cap/goggles), Skater (light skin, white/turquoise kit, braid and skates). The roster preview shows all three; gameplay shows the active athlete. Each starts with 40 HP: 120 total team HP. Generic vitality bonuses divide evenly among all three.

Each athlete has two moves; slot three is **Switch** (3-second cooldown), cycling to the next living athlete. Individual HP and attack cooldowns persist during switches, and all cooldowns continue ticking while benched. A killed athlete is removed for the round and automatically replaced by the next living teammate, with a brief stationary 0.25-second recovery. Overkill does not damage other teammates. The team loses only after all three are dead. Round reset revives all three; timeout compares total team health ratios. Healing applies only to the active living athlete.

| Athlete | Moves | Special behavior |
| --- | --- | --- |
| Runner | Sprint; Energy Drink | 250 speed. Sprint: 18 damage, 4 s cooldown. Drink: costs 5 personal HP, +35% movement speed and Sprint damage rises to 27 for 5 s; 9 s cooldown. Cannot drink at 5 HP or below. |
| Swimmer | Splash; Dive | 180 land speed, 320 in water with no water slow. Splash fires a pushing wave (12 damage, 3.5 s cooldown). Dive avoids attacks while moving forward for 0.8 s at 450 speed (7 s cooldown). |
| Skater | Ice Dash; Ice Trail | 200 speed normally, 360 on ice with slippery momentum. Ice Dash: 3 damage, one Bleed stack; starting on ice boosts dash speed from 520 to 900 and applies three stacks. 3.2 s cooldown. Ice Trail lasts 3 s and lays patches lasting 8 s, making ground slippery for both players. 8 s cooldown. |

Each Bleed stack deals 0.2 HP/second: five stacks = 1 HP/second. No stack cap or expiry during the round, and it continues across Olympic switches. It clears next round. Damage, energy cost, healing, cooldowns, automatic/manual switches, athlete appearance and temporary ice all use the host-owned simulation/snapshots online.

Tests cover individual HP/cooldowns, energy cost/boost, manual and death switches, final defeat/reset, water immunity, ice empowerment/trails, permanent Bleed, healing/cards and three distinct skin tones. Simulated online tests cover actual guest input, changing ability buttons, individual HP/cooldown snapshots, all three athlete deaths, round reset, temporary ice and Bleed. Other-fighter regression tests use stationary damage targets rather than the removed knight. Browser/physical-device/real-network checks remain unverified in this environment.

**Steerable Dive:** Swimmer's Dive now starts in the movement-input direction when present, otherwise the aimed direction. WASD/arrow controls/left joystick can change its heading throughout the 0.8-second dive. Releasing movement retains the last heading. Dive lasts 0.8 seconds at 450 speed; wall collision, attack avoidance and seven-second cooldown remain. Ordinary dodge remains separate. Tests cover keyboard/touch starts, turns, release/expiry and guest-authoritative online steering snapshots.

### Olympic card 1: Selfish

Selfish opens a second, host-validated choice of Runner, Swimmer or Skater. Only the chosen athlete remains for the match, with the full team maximum HP (120 normally; vitality still applies). Switch disappears. Basic attacks gain 20% damage, 10% shorter cooldowns and 10% range; Swimmer's Dive lasts 0.96 s, Skater's Ice Trail emits for 4 s. Generic stat cards were removed in v59. Only one Selfish variant may be owned. The draft stays paused through both stages; Skip can cancel before choosing, and bots complete both choices automatically.

- **Runner — Never Happened:** 20-second cooldown, requires six seconds of history in the current round. Restores her own safe position, HP, burn/stun/immunity, Bleed and Energy Drink state from six seconds ago. No cooldowns, opponents, emitted attacks or terrain rewind. History is host-local and resets each round, while readiness and restored state synchronize normally.
- **Swimmer — Pool:** one use per round, creates a 340-radius water pool near her position for the remainder of the round. Ordinary water/bridge rules apply to both players; Swimmer and Sailer retain their water advantages. Pool usage cannot be reset by waiting or forcing the cooldown. New rounds clear the pool and restore its use.
- **Skater — Spin Cycle:** 9-second cooldown. A 110-radius circular slash on ordinary ground gives one Bleed stack. Starting on map ice or Ice Trail produces three pulses 0.3 s apart, each giving one stack if it hits (2 direct damage per pulse). Movement slows during the routine; stun/grab or dodge interrupts it. Cover and attack avoidance remain valid counterplay.

Tests cover two-stage selection, locked solo HP, illegal double-Selfish rejection, Pool/reuse/reset/water, six-second rewind history/HP/effects without cooldown/enemy rewinding, and one/three Spin Bleed pulses. Simulated online tests cover all three actual guest draft choices, solo state, Pool, own-HP rewind and triple ice Spin snapshots.

### Four-digit multiplayer rooms

The default online flow is now **Skapa match · få 4 siffror** → share the four digits → friend enters them and presses **Anslut med kod** → host starts. No answer code is needed. The host still runs the match and both players keep their tabs open. Room codes exist only while hosting; occupied codes are retried automatically and a room accepts one opponent.

`quickpeer.js` loads pinned PeerJS 1.5.4 on demand from jsDelivr and uses the public PeerJS Cloud signalling service to discover peers. Game messages/snapshots travel over WebRTC, directly when possible or through the public TURN fallback, with host authority unchanged. No account or server setup is required from the players. The manual offer/answer flow remains under **Reserv: manuella anslutningskoder** and does not require this signalling service. Library/service failures show a retry/fallback message without breaking offline play.

Mocked PeerJS integration tests verify four-digit host/join/copy, ordinary lobby/start/gameplay protocol, invalid/missing codes, occupied-ID retries preserving the existing room, rejecting a third participant, disconnect cleanup, and CDN failure with manual fallback. Existing manual transport and all gameplay tests still pass. The public CDN/signalling service and real browser/network pairing could not be verified from this workspace because its network proxy is unavailable; test with two actual devices after deployment.

### Olympic card 2: So Much Power

Replaces all three athlete dash abilities with stationary power/control moves. Normal dodge remains. Basic stat cards compose; the card cannot be chosen twice. With any Selfish selection, the chosen solo athlete keeps full team HP, her improved basic attacks, and her existing third ability. Both acquisition orders work.

- **Runner — Power Kick** replaces Sprint. 0.35-second windup, 6 direct damage, 110 range and 6.5-second cooldown. Knocks a hit enemy up to 380 units; collision with a wall or arena boundary adds 32 damage once. Cover, dodge, frontal guard and control immunity counter the push. Energy Drink doubles knockback to 760 for its normal five-second duration, without boosting direct kick damage. It still costs 5 personal HP and increases movement speed. Selfish damage improvements apply to the kick and wall impact.
- **Swimmer — Wave** replaces Splash: 95 projectile radius versus Splash's 42, 520 range, 14 damage, speed 280, 4.8-second cooldown. Pushes 150 units on a valid hit. A short 0.25-second windup and slower projectile offer counterplay.
- **Swimmer — Whirlpool** replaces Dive: centered on the Swimmer and follows her movement, 160 radius, 0.45-second warning then three seconds of continuous suction (140 units/s), 9-second cooldown. No damage or invulnerability. Cover, dodging, existing control immunity, grabs and boat transport prevent the pull. The rotating vortex is visible throughout.
- **Skater — Blade Wave** replaces Ice Dash: a cutting projectile, 4 damage, 460 range, 5.2-second cooldown, 0.25-second windup. One permanent Bleed stack normally; firing from ice increases projectile radius from 16 to 44 and applies three stacks. Ice Trail and Selfish Spin Cycle remain available as appropriate.

Unit tests cover kick charge/interruption, unchanged low direct damage while drinking, doubled push, one-time wall slam, wide Wave, damage-free Whirlpool suction, ice-enhanced Blade Wave and all six ordered Selfish combinations. Simulated online tests obtain the card through a real draft and verify wall damage/position, wide projectile snapshots, vortex movement, Bleed and both Selfish acquisition orders preserving Pool.


## Engin replaces The Overpowerd

Engin is a 125-HP, 185-speed radioactive inventor (DPS). His orange overalls, dark skin, cracked green goggles, black hair, heavy boots, reactor backpack and three-clawed arm cannon have a dedicated sprite. Beam charging deploys boot anchors; overheating flashes the reactor red, vents steam and displays “It's getting hot!” (spoken when sound and speech synthesis are available).

- **Reactor Beam:** 0.8-second visible charge, then a stationary 1.5-second channel, ten 10-damage pulses (100 base total), 720 range, 12-second cooldown. Turns at most 0.7 radians/second. Walls block the beam. Dodge/other attacks are locked during channel; enemy stun/grab/boat transport interrupts it.
- **Over Powerd:** 0.9-second warning around the caster, then 62 area damage within 155 radius. Costs exactly 12 own HP on detonation, can defeat Engin, 10-second cooldown. Escaping, cover and dodge avoid enemy damage. Interrupting the charge prevents both explosion and HP cost.
- **Radioactive Orb:** 48 damage, 170 speed, 18 radius, 8-second maximum life and 8-second cooldown. Reflects off two interior walls or arena boundaries; disappears on the third wall impact, an enemy hit or expiry. Swept movement prevents tunnelling.

Generic HP/damage/speed cards were removed in v59. Host-authoritative beam timers, charged attacks, explosion damage and orb bounces synchronize to guests. Unit and simulated transport tests cover movement lock, limited turn rate, channel damage/interruptions/cover, explosion cost/escape, and two bounces followed by destruction. Build arena-online-33 / cache v50.


### Engin orb self-damage

Radioactive Orb now deals **100 fixed self-damage** on contact with its original caster, including after reflection. It disappears on that contact, can defeat Engin, and dodge avoids contact damage. Normal enemy damage remains 48. The original caster is protected only until the orb clears its initial muzzle overlap; a wall bounce arms self-contact immediately. This prevents instant launch damage while making close walls and chasing your own orb dangerous. Unit tests cover safe launch, catching the orb, wall return, lethal self-hit and dodge; simulated online checks synchronize the returned orb's self-damage and disappearance. Build arena-online-34 / cache v51.


## Engin ability cards (arena-online-35 / cache v52)

Engin now offers three unique cards after a lost round: Heavy Armor, Uranium V2 and Into the Veins. Owned cards are excluded, Skip still works and the existing two-card match limit applies. All three pairs compose in either acquisition order. `engin.js` must be shipped alongside the other scripts.

- **Heavy Armor:** +100 maximum HP (225 alone), 15% slower movement, 25% lower damage for every attack except Radioactive Orb. A heavy steel breastplate and shoulder plates show the change.
- **Uranium V2:** loses 1 HP/s while alive and untransformed, including during attacks. Reactor Beam doubles its width and multiplies damage by 1.6 (160 base total), with 22 units/s backward recoil during channel. Explosion damage ×1.5 and radius ×1.3. Orb damage ×1.5 (72), radius ×1.5 (27), original-caster self-hit 125. Cracked reactor glass and leaking radioactive droplets are visible.
- **Into the Veins:** maximum HP ×0.75 (93.75 alone), movement ×1.3. Blue-tinted skin, fur and glowing veins/slangs replace the ordinary appearance. Reactor Rush replaces the beam (26 base damage, 0.35 s rush, 5 s cooldown). Explosion charges in 0.55 s and costs 8 HP. Radioactive Breath replaces the orb (wide 230-range cone, 8 base damage per 0.2 s pulse for 1 s, 7 s cooldown). Channel locks other attacks and dodge; stun/grab interrupts breath.

**Heavy Armor + V2:** 225 HP and 15% lower walk speed. Beam modifiers multiply to 1.2 (120 total); explosion ×1.125, orb stays ×1.5. HP leakage, recoil and hazardous terrain remain. **Heavy Armor + Veins:** 168.75 HP, walk speed 185 ×0.85 ×1.3 =204.425; armor reduces rush, breath and explosion damage.

**V2 radioactive terrain:** holding the beam on the same impact area for 0.7 s creates a patch. Moving the impact over 36 units resets its dwell timer. Explosion always leaves its radius irradiated. Veins/V2 rush and breath also leave patches. Terrain lasts 4 s, damages either player for 4 HP/s, and shows a radiation symbol/countdown. Overlap never stacks damage; nearby patches refresh. Cover, dodge and being airborne protect from ground radiation. Pausing stops its timers/damage. Patches clear on the next round and the active patch count is bounded.

**Into the Veins + Uranium V2: Overload.** Before transformation the player has Reactor Rush, Overload and Radioactive Breath. Overload is immediate, requires strictly more than 50 HP and pays exactly 50 HP, with no instant heal. It can activate once per round and replaces all three moves for the rest of that round. The large blue furry monster has 3 HP/s regeneration instead of the V2 leak, starting after 2 s and capped at its unchanged max HP. Other damage can defeat it before regen. The mutant has slow-turning Wild Rush (32 base damage, 0.5 s rush, 6 s cooldown), Mutant Slam (38 base damage, 175 base radius, 0.5 s warning, 7 s cooldown) and Mutant Leap (45 base damage, 430 max range, 0.75 s flight, 110 landing radius, 10 s cooldown). V2 damage/radius bonuses still apply. Slam and leap knock back and irradiate the ground. Leap marks its destination, crosses walls and lands on valid ground. A successful Wild Rush causes a visible 0.35 s forward rage commitment; stun cancels this commitment. Transforming starts the new move cooldowns at 1 s. No monster form, used flag, regen delay or radiation survives the round reset.

Unit checks and simulated two-client transport tests cover actual loss drafts, owned exclusion, every ordered pair, HP/speed/damage values, V2 recoil/beam width/terrain, non-stacking hazards, Overload's HP gate/payment/delayed regen/death, synchronized mutant attacks/HUD, leap over cover, and round reset. Public signalling and real-network browser gameplay were not exercised in this environment.


## Too Old — Olympic Team (arena-online-36 / cache v53)

The Olympic Team gets **Too Old**, a unique card in its random three-choice loss draft. It works in either acquisition order with each Selfish participant, So Much Power with the two-card limit; generic stat cards were removed in v59. The two-card limit, Skip, relay health/cooldowns and automatic death switch still apply. Ship `oldteam.js` with the other scripts.

- **Mom (Summoner):** replaces Runner, 170 base speed. My Baby summons exactly one 30-HP baby (8 s cooldown); recasting with a living baby orders an immediate attack instead of creating another. The baby follows/attacks, has a visible umbilical cord and cannot be farther than 145 units from Mom. Walls, knockback, fast travel and teleporting cannot break the tether. It punches for 5 base damage (10 while ordered), with small knockback. Mom’s Orders aims its movement and gives it 3 s of faster movement/attacks (4.5 s cooldown). The baby is independently damageable by attacks/projectiles and disappears when Mom switches, dies or the next round begins. Damage/speed cards also improve its damage/movement.
- **Yoga Instructor (Healer):** replaces Swimmer, 175 base speed. Deep Breath heals 6 active-member HP and deals 8 cone damage, 180 range, 4 s cooldown. Healing Circle creates a visible mat with 100 radius for 3 s, healing the owner’s currently active participant for 4 HP/s and hurting enemies for 3 HP/s, 9 s cooldown. Healing caps at the active participant's own maximum; walls/dodge/airborne states protect from mat damage.
- **Tattooed Baddie (Bruiser):** replaces Skater, 210 base speed, black jacket, tattoos, boots and dyed hair. Heavy Punch: 18 damage, 80 range, 1.4 s cooldown. Come Here: 5 damage, 160 range, up to 100 pull into punching range, 6 s cooldown. Existing control immunity/cover/dodge/guard protections apply.

**Too Old + Selfish:** the chosen woman has all 120 team HP, +20% move damage, +10% move range and −10% basic cooldowns, with no Switch. Selection buttons use Mom/Yoga Instructor/Tattooed Baddie names when Too Old is already owned.

- **Mom:** baby becomes a 45-HP catapult on wheels, still attached by its cord. It auto-launches toys over cover to an aimed landing point (8 base area damage, 50 radius, 1.5 s cadence). Loaded Catapult (third ability, 10 s cooldown) makes the next shot a 26-base-damage, 100-radius blast. Selfish damage bonuses apply. Landing explosions obey cover.
- **Yoga — Praise the Sun:** third ability (20 s cooldown) changes the two other buttons to Sun Beam and Cruel Sun. Choose one next attack, then both buttons return to healing moves. Sun Beam charges 0.8 s, stops at walls and deals 48 base damage at 650 base range; Cruel Sun charges 1 s and releases a slow 180-speed sun that explodes for 52 base damage in 120 radius on impact/expiry. Selfish damage/range bonuses apply. Charging locks movement; stun/grab interrupts it without consuming the empowerment, but the attempted attack cooldown is spent.
- **Baddie — Tattoo Rage:** third ability, 14 s cooldown, 6 s duration. Tattoos visibly glow. Hits heal for 30% of actual enemy HP removed, capped at own maximum; misses, dodges and reflected hits provide no healing.

**Too Old + So Much Power:**

- **Mom:** one psychic baby with floating toys; 7-base-damage projectiles at up to 310 range. Psychic Throw replaces Mom’s Orders: 14 damage and short lift/100-unit throw, 6 s cooldown. Umbilical cord, single-baby limit, HP and enemy counterplay remain.
- **Yoga:** large muscles give **only +30 personal maximum HP**. Total team HP becomes 150, split Mom 40 / Yoga 70 / Baddie 40. Her speed, damage, healing and moves are otherwise identical to ordinary Too Old Yoga.
- **Baddie — The Power of Karen:** Complaint, a 14-damage cone shout at 210 range (0.25 s warning, 2.2 s cooldown). Get the Manager deals 4 damage at 260 range after a 0.35 s warning and stuns for 0.6 s, with 7 s cooldown. A successful stun empowers the next Complaint by 60%; it is consumed even if that shout misses. Stun immunity/guard/dodge/cover apply.

Unit and simulated two-client transport tests cover loss drafts/owned exclusion, all ordered Selfish/Power combinations, one baby/tether/HP/destruction/switch cleanup, catapult shots over cover, healing and damage, Sun charge/choice/consumption/interruption, tattoo healing, yoga-only HP and Karen control. Round reset clears babies, mats, sun empowerment and rage. Browser/network signalling was not exercised in this environment.


### Aim during solar charge (arena-online-37 / cache v54)

Sun Beam and Cruel Sun now follow live aim throughout their charge: mouse, manual right stick or mobile auto aim. Movement remains locked and enemy stun/grab still interrupts. The final direction locks when the attack fires; Cruel Sun does not home afterward. Guest aim is resolved by the host and the aiming warning follows the same direction. Unit and simulated online tests cover desktop/manual stick/auto aim retargeting and final shot direction.


## Keyboard settings (arena-online-38 / cache v55)

Open **Inställningar** in the menu or fight bar. Player 1, including either online player on their own device, can choose **1/2/3**, **Z/X/C** or **Auto**. Auto recognizes whichever of these groups is pressed and updates the on-screen attack labels; it does not fire abilities by itself. Player 2 on a shared keyboard has a separate **8/9/0** or **I/O/L** choice. Player 2 now dodges with **Enter**, so zero remains available for the third attack. Player 1 still uses WASD/mouse/Shift, and player 2 uses arrow keys/automatic aim. Mouse-held basic attacks and mobile controls remain available.

Both choices save locally and are independent across online peers. Storage failures fall back to working in-memory preferences. Settings can be changed during play: opening them clears held inputs and pauses the match; close and select Fortsätt to resume. Inputs in text/select fields or with browser Ctrl/Alt/Meta modifiers do not attack. Number-row and numpad keys both work. Auto switching preserves held movement keys. Ship `controls.js` before `game.js`.

Unit checks cover all layouts, two-player isolation, numpad/zero/Enter, labels, focus guards, pause/input clearing and saved preferences. Simulated two-client tests verify guest keyboard attacks, held-fire packets, Auto recognition and settings-driven pause without changing the host's preferences. Live browser/network signalling was not exercised.


## Kids and No Pain, No Gain (arena-online-39 / cache v56)

Olympians now have five unique cards: Selfish, So Much Power, Too Old, Kids and No Pain, No Gain. Generic cards were removed in v59. Loss drafts offer three randomized choices, exclude owned unique cards, permit Skip and retain the two-card limit. `kids.js` and `pain.js` load before controls/game scripts. All character appearances and new attack names are implemented.

**Kids** turns Runner into Sugar Rush, Swimmer into Water Fight and Skater into Lego Kid. Tag! is a strong 22-damage rush followed by a 2 s slow/weak energy dip. Candy boosts speed and Tag! for 4 s, then causes a 3 s dip; Candy cannot bypass its own dip. Water Gun deals 7 damage and pushes 80 units; Water Balloon deals 12 area damage and pushes 100. Lego Throw deals no direct damage, gives 2 permanent Bleed and 0.2 s stun, respecting dodge/guard/stun immunity. Lego Wall is a passable 160×34 strip lasting 6 s, giving the enemy 6 Bleed once per placement. Bleed still deals 0.2 HP/s per stack, persists until the round ends and can defeat its victim.

**Kids + Selfish:** selected child receives full team HP and ordinary Selfish damage/range/cooldown bonuses. Sugar Rush gets Halloween: other characters/summons/boats freeze for 1.5 s; the owner's two ordinary cooldowns recover 4× faster, excluding Halloween's 20 s cooldown. An energy dip follows. Water Fight gets Kids Pool, once per round, lasting the round. Adults are ejected and cannot enter; Bob and any Kids Olympians can enter. Shots cross its boundary. Pool exclusion handles walking, flight, portals, knockback and passengers, with a safe fallback exit. Lego Kid gets +1 Bleed per Lego ability plus Spiky Lego: +2 more Bleed for 5 s at a cost of 3 permanent self-Bleed (Throw 5 / Wall 9 while buffed).

**Kids + Too Old** is Family Team: child kits remain active, with visible adult helpers. Mom/baby add 4 base Tag! damage, Yoga heals 4 HP when Water Balloon is thrown, and Baddie adds 1 Lego Throw Bleed. **Kids + So Much Power:** Power Kick replaces Tag!, Candy doubles its knockback and still causes a dip; water attacks have more range/push; Lego Wall is wider. Unique abilities, health and fields reset each round.

**No Pain, No Gain:** a short keyboard/mouse/mobile-button press fires normally on release. Hold at least 0.8 s then release for a stronger version costing exactly 4 HP from the active participant. Charging slows movement, follows live aim and displays progress/HP cost. The active member must have strictly more than 4 HP, or more than 9 for Energy Drink (4 extra + ordinary 5). Otherwise release fires the ordinary version without the extra cost. Cooldowns do not change. Enemy stun/grab, dodge, pointer cancellation, pause, disconnect and round cleanup cancel charging safely. Bots can charge. Online press/release/cancel actions are timed, charged and validated by the host; clients cannot submit their own charged damage or HP cost.

Enhancements follow the ability rather than one universal multiplier: longer/harder Sprint; longer Energy Drink; wider/pushing Splash/Wave; longer steerable Dive; extra Ice Dash/Blade Wave Bleed (2 normally, 5 from ice); wider/longer-lived Ice Trail; stronger wall impact and knockback for Power Kick; larger Whirlpool; Switch gives the next participant 3 s of speed. Mom grants the existing single baby a 15-point shield or a stronger next ordered hit. Yoga gets a larger puff with 10 HP healing or a larger, stronger healing mat. Baddie gets a 60% harder punch or longer grab. Kids get stronger Tag!/water attacks, longer sugar effects but longer dips, 3 Lego Throw Bleed and 8 Lego Wall Bleed. Selfish gets an 8 s rewind, a 440-radius once-per-round Pool or larger Spin with an extra Bleed per hit. Rewind snapshots track permanent round-local No Pain HP debt so neither normal nor enhanced rewind refunds the card's HP costs. Three-card-only combinations such as No Pain + Kids + Selfish remain unavailable under the existing limit.

Unit tests cover every ordinary/Too Old/Power/Kids attack slot, real touch hold/release/cancel and stable button capture, HP thresholds/payment/debt, tap/interruption, enhanced utility and control, eight-second rewind, children/dips/zero-direct-damage Lego, pool admission, Halloween, Spiky Lego and all ordered pairs. Simulated two-client tests use real loss drafts and keyboard actions to verify host-controlled hold timing, HP payment, tap/interruption, every No Pain kit, Kids Selfish card orders, pool barriers, freeze, Bleed and cleanup. Live browser/signalling/network play was not exercised in this environment.


## Arrow/WASD movement and Timeless Gods (arena-online-40 / cache v57)

Settings now let each desktop/online player choose **WASD** or **arrow keys** for movement. The choice saves on that device, clears held inputs when changed and leaves attack bindings independent. Two players sharing a keyboard automatically use opposite movement groups: player 1 arrows means player 2 WASD, and vice versa. The host receives the guest's normalized movement vector, so different online preferences coexist. Touch sticks keep their existing controls. Settings and instructions show the selected groups.

**Too Old + Kids now becomes Timeless Gods**, replacing Family Team in either card acquisition order. They have no child/elder lifecycle and no sugar dips or Lego attacks. Switch, individual cooldowns, relay death and round resets remain. Total health is **132**, explicitly divided among these forms:

- **God of Speed:** **12 HP**, 480 walk speed. Original **Sprint** and **Energy Drink** return. Sprint deals 18 damage with a 0.3 s, 900-speed rush; Energy Drink still costs 5 personal HP, gives 5 s of +35% walk speed, 27-damage Sprint and 1100 rush speed. Its original cooldowns stay 4/9 s. Drink requires more than 5 HP. The appearance has a golden halo, silver hair, winged shoes and speed trails. Bot switching uses health ratios so low maximum HP does not make it immediately abandon this form.
- **God of Water:** normal **40 HP**, 180 speed. **Water Lance** (5.5 s cooldown, 550 aim range) marks up to six valid positions around the aimed/enemy location. Dashed lines warn for 0.75 s; then 8-damage, 380-speed lances converge on that original point. They do not home after release and walls stop them. Moving out of the convergence avoids the attack. **Dive** remains steerable and invulnerable for 0.8 s at 450 speed, but now deals **12 damage once per enemy/summon touched**, with a 7 s cooldown. A blue halo, white hair and trident identify this form.
- **Timeless Robot:** **80 HP**, 160 speed, adding **40 HP** over the normal Skater. **Robot Laser** charges for 0.45 s while aim remains controllable, then deals 28 beam damage at 650 range, blocked by walls (4.5 s cooldown). **Teleport** moves up to 360 units toward movement input, otherwise aim (7.5 s cooldown). It crosses intervening walls but searches backward for a free landing point, stays inside the arena and avoids landing on the enemy. The robot has heavy plated limbs, a cyan visor, arm laser and a purple energy ring. Teleport deals no damage or invulnerability.

All forms have dedicated appearances. The combo's health distribution, attacks, lance warnings/projectiles, dive contact tracking and teleport results synchronize through host-authoritative snapshots. `gods.js` loads before `controls.js`/`game.js`. Unit and simulated two-client checks cover saved/complementary movement, independent online preferences, real loss drafts in both combo orders, exact HP, original speed attacks, six-lance warning/convergence/sidestep, damage-once Dive/steering/invulnerability, laser charge/retarget/cover, safe wall-crossing teleport and round reset. Live browser/network signalling was not exercised in this environment.


## Infected and Magic Technology (arena-online-41 / cache v58)

Engin now has five unique cards: Heavy Armor, Uranium V2, Into the Veins, Infected and Magic Technology. Drafts still show three randomized unowned choices, allow Skip and cap loadouts at two. Every ordered pair is supported. Ship `enginextras.js` before `game.js`.

**Infected:** maximum HP ×0.7 (87.5 alone). Each lethal damage event has a 60% revival chance. Success restores 10% max HP and gives 0.5 s of damage protection, clears interrupted casts/grabs/burn and shows a green pulse. Failure ends the life; subsequent hits on a defeated body cannot reroll it. Protection prevents one beam/ground hazard from repeatedly killing the character immediately, but does not waive ability HP costs. Heavy Armor composes to 157.5 HP. **Infected + Uranium V2:** 25 max HP, 95% revival chance and 2.5 revival HP; the V2 leak resumes after protection. **Infected + Into the Veins:** 65.625 max HP, original 60% chance, and each successful revival gives 4 s Hunger: +25% speed and 35% healing from actual Rush/Breath HP damage. Gray-green/blue skin, glowing veins and shield/Hunger effects show the infection.

**Magic Technology:** class becomes Control DPS. Tractor Beam is the same stationary 0.8 s charge/1.5 s channel, but ten 6-damage pulses slowly pull on successful hits. Repulsion Pulse charges 0.9 s, deals 38 area damage and pushes 220 units; its 12-HP self-cost remains. Gravity Orb deals 32 enemy damage and 40% movement slow for 1.2 s. Its weak homing turns at most 0.55 radians/s toward the nearest player or clone, including the original caster after safe launch separation. It bounces off four walls and breaks on the fifth impact or after its 8 s lifetime. Original-caster contact deals 100 fixed self-damage (125 with V2); dodge, cover and damage protection still matter. Crystals, runes, floating metal and purple projectiles distinguish the card. Armor still weakens non-orb attacks; V2 still increases damage/size, leaks HP and leaves radiation from its beam/pulse.

**Magic Technology + Into the Veins:** magic enters the blood; keep the three magic attacks instead of mutant/rush/breath moves. 93.75 HP, 240.5 base speed and permanent, damageable flight over walls. No shooting/beam channel from inside solid walls. After 0.35 s stationary inside a wall, or 1.2 s total continuous wall transit, the character automatically returns to nearby valid ground. This permits crossing obstacles while preventing hiding in blocks. It has a rune/levitation appearance rather than the blue furry mutant.

**Magic Technology + Infected:** a hidden timer rolls the next copy spawn 12–20 playing seconds ahead. A magical discharge announces a copy, with a short startup window. Max one live copy per Engin, lifetime 10 s; it cannot spawn copies. It has the same 87.5 max HP, base speed, Magic attacks/cooldowns/self-cost and Infected revival chance. It independently targets nearby characters/structures and can damage either player, including its creator; either player can also damage it. Its neutral Gravity Orb can return to itself. Copy damage, health, AI casts, beams/orbs, death/expiry and cleanup are host-authoritative and synchronized. Copies do not replace the two actual players or change round scoring. Pause stops their timers; next round clears them and all revival/Hunger/flight-wall state.

Unit tests cover 60/95% probability boundaries, 10% health, protection/final defeat, V2 leak and Feral healing, pull/push, bounded self-homing/four bounces/self-damage/slow, flight crossing/ejection/attack blocking, hostile copy HP/costs/both-player damage/destruction/lifetime/no offspring and all twenty ordered pairs. Simulated two-client tests use real card drafts in both orders and verify authoritative revivals, Feral effects, flight safety, hostile copies and orb self-damage. Live browser/network signalling was not exercised in this environment.


## Kortgranskning och botstrategier (v59)

Alla sex karaktärer har exakt fem egna kortfamiljer. Generiska More HP/More Damage/More Speed är borttagna och avvisas även i multiplayer. Selfishs tre deltagarval är underalternativ till ett kort. Max två valda kort, tre slumpade alternativ och Skip behålls.

Boten väljer avstånd efter karaktärens faktiska attacker och kortkombination. Summons, Selfish-varianter, kontrollmagi, egen farlig orb, blockering och No Pain har särskilda beslutsregler. Ett rörelsefel vid väggar är rättat. Rekommendationer och kortvärden finns i `ai-strategies.js` och bygger på reproducerbara motortester. Se [STRATEGIES.md](STRATEGIES.md) och [AUDIT.md](AUDIT.md) för resultat och begränsningar.

Kör `node test.cjs` och `node online.test.cjs` för regressioner. Kör `node audit.cjs --abilities` för förmågesvepet, `node audit.cjs` för jämförelsen, `node validate-tactics.cjs` för andra slumptal och fulla rundor, och `node build-tactics.cjs` för att skapa bottabellen och strategirapporten. Tester använder simulerad DOM/canvas; onlinetesterna använder simulerad transport. Visuell mobilupplevelse och riktiga internetanslutningar kräver webbläsartest.

## Replacement arenas (simple canvas style)

The current rotation contains exactly six arenas: **Breakwall Arena**, **Rival Court**,
**Flooded Harbor**, **Frostfall**, **Portal Chamber**, and **The Labyrinth**.
The earlier forest, volcano, desert and factory layouts have been replaced. Internal
IDs `grove`, `harbor`, and `frost` remain stable for existing card/config references.
No pixel-art prototype sheets are loaded by the game.

- Breakwall: neutral stone cover and wide flanking lanes.
- Rival Court: blue/red open halves, central marking, no cover.
- Flooded Harbor: shallow water, dry dock crossings/platforms and cargo decoration.
  Water slows ordinary fighters by 45%; Sailer remains immune. My Home retains its
  60% chance of choosing this arena at each round reroll.
- Frostfall: blue ice and white snow with ice blocks and a snowy central tree island.
- Portal Chamber: three numbered/color-matched portal pairs available to everyone.
  A fighter must leave the destination plate before teleporting again; carried or
  grabbing fighters and boat pilots cannot trigger arena pads.
- The Labyrinth: 2600 × 1600, versus 1600 × 1100 for the other arenas. Bots use
  a navigation field around its long walls; the minimap fits the larger world.

Arena size is derived from the map on round setup and guest snapshot import.
Online protocol build 45 prevents mixing old and new arena definitions. Run
`node maps.test.cjs` for arena topology, all mode spawn checks, portal re-entry,
water immunity and bot navigation checks. Existing combat fixtures explicitly
specify their walls instead of depending on the changed arena layouts.

## Bob — Evolve

A second copy of Cheter, Big Hands or Gloves may be offered after owning the first.
Two copies occupy both card slots and replace the ordinary build with an Evolve:

- **Cheter ×2 / Sniper:** 75 HP, one 65-damage narrow projectile, 1200 range,
  1500 projectile speed, 0.6-second charge and 3.5-second cooldown. Walls block it.
- **Big Hands ×2 / Giant Hands:** three-times-sized Rock/Scissors/Paper with
  50% increased damage. First button attacks; second button switches in order.
  Each attack keeps its own 8/12/14-second cooldown while another is selected.
- **Gloves ×2 / Hand Factory:** one button randomly creates Rock, Scissors or
  Paper every 0.65 seconds. Each has 3 HP and a 12-second lifetime; maximum eight,
  replacing the oldest when full. There are no direct attack buttons.

All five Essy Kid Evolves are enabled; the other fighters still use
unique cards until their Evolves are designed. Ordinary mixed pairs remain intact.
Bots use long-range sniper spacing, switch giant attacks, and maintain the factory
population. Round resets restore selection and cooldown state. Online build 47
synchronizes duplicate loadouts and giant selection/cooldowns.

Validation: `node evolve.test.cjs`, `node test.cjs`, `node online.test.cjs`.
Online transport tests are simulated; real two-device network testing is separate.

### Overprotected, Never Stop and rare Evolve offers

- **Jacket ×2 / Overprotected:** 400 max HP, 55% less movement speed, weak Rock
  (6 damage) and Scissors (5 damage). Jacket Block lasts 2 seconds, blocks 95%
  from every direction including area attacks, and prevents voluntary movement.
  Blocking arms one +50-damage Rock counter, consumed even on a miss. Block has
  a 5-second cooldown. It does not heal and can be interrupted by control effects.
- **Full Name ×2 / Never Stop:** ordinary three attacks with 90% shorter
  cooldowns and a 0.08-second Scissors charge. Every accepted attack costs 5 HP,
  including missed/interrupted attacks. The cost can kill the user.
- **Rarity:** with one Essy card owned, a draft has exactly a 10% chance to offer
  that card again as one of three distinct choices. Otherwise all three choices
  are new cards. The first draft is unchanged; two cards remains the maximum.
- **Cooldown nerfs:** ordinary Cheter Gun 1 → 1.6 seconds; Big Iron
  (Cheter + Big Hands) 1.4 → 2.2 seconds. Full Name applies its usual 25% reduction.
  Sniper, flying gun summons and Hand Factory are unchanged.

Targeted Evolve tests cover both new kits, lethal self-cost, blocking/counters,
immobile guard and the exact 10% offer threshold. Simulated online tests cover
guest Overprotected HP/block/counter and Never Stop HP costs.

## Door Man Evolves and Evolve match format

All five Door Man cards now support a duplicate-card Evolve, using both card slots.
The normal draft retains the 10% repeat-offer chance, shared with Bob.

- **Hotel ×2 — Infinity Space:** keep normal Running Man and Lock damage. The
  third button opens a full-map position picker (desktop and touch). Choose a free
  position to teleport, leaving two public doors that enemies and allies may use.
  Four-second cooldown, no teleporting into walls or restricted Kids Pools.
- **Late ×2 — Last Second:** 45 HP, one 38-damage dash with 12-second cooldown.
  Invulnerable during its 0.55-second rush. A successful enemy hit resets the
  cooldown; a miss stuns the user for 0.8 seconds. Walls still block movement.
- **Magic ×2 — One Key Fits All:** a slow giant key (48 damage, 1.5-second Lock,
  nine-second cooldown) passes through walls. Infinity Lock is the second attack:
  0.35-second guaranteed stun on everyone else, including allies, every seven
  seconds. Running Man and portals are removed.
- **Family ×2 — Family Business:** no direct attacks. Two 15-HP doors can each
  spawn four 5-HP relatives. Losing or replacing a door removes its relatives.
- **No More Speed ×2 — I Live Here Now:** immobile body, no dodge. Place a remote
  door near the aimed enemy, then move the door with movement controls and aim/fire
  from it. Camera follows the door, but the vulnerable body retains all health.

The menu offers **Med Evolve / Utan Evolve** for ordinary games. With Evolve off,
normal three-card choices still work, but duplicate cards are never offered.

**Evolve — Bäst av 3** is a match-length option compatible with 1v1, FFA and teams.
Choose from the twenty implemented Evolves; the selected Evolve determines the
character. Bots also choose an Evolve, and every loadout is fixed for the match.
No between-round card drafts. First to two wins, with a three-round cap; score
ties after three rounds are draws. Maps continue rerolling.

Online hosts choose the format/rules. Guests may choose their Evolve before joining
or change it in the connected lobby before the host starts. Party hosts may choose
a bot's Evolve in its lobby seat. Protocol build 48 synchronizes the new format,
rule toggle, selections, public/controlled doors and evolving fighter state.

Checks: `node door-evolve.test.cjs`, `node evolve.test.cjs`, `node test.cjs`,
`node online.test.cjs`, `node party.test.cjs`, and team utility suites. Transport is
simulated; real device-to-device network validation remains separate.

## Sailer — five Evolves

All five Sailer cards now support a repeat-card Evolve. The normal draft uses the
existing 10% repeat-offer chance; Evolve mode exposes all fifteen implemented
Evolves for Bob, Door Man and Sailer. Bot lobby choices use the same list.

- **My Home ×2 — The Sea:** forces the exclusive **2400 × 1500** ocean arena
  for everyone, every round, including the first round of Evolve mode. It is
  hidden from ordinary map selection/random rotation. Small docks/islands give
  dry footing with little cover. Sailer keeps ordinary 170 HP and damage, retains
  water immunity and loses Dodge. A single My Home still gives 60% Harbor odds.
- **Capten ×2 — I Am the Boat:** the boat is the character, with 280 HP and no
  separate shell or surviving walking form. Water speed 300, land speed 110.
  A 46-unit collision/hit radius and slow 1.5-radian/s turns are the risks. Wave,
  Headwind and Ram remain; Ram deals 32 damage and pushes, with six-second cooldown.
- **Canons ×2 — Naval Strike:** Precision Strike (42 damage, 75 radius, 1.1 s
  warning, 5 s cooldown); Bombing Run (five 24-damage impacts in a line, 10 s
  cooldown); Naval Barrage (seven staggered 25-damage impacts, 18 s cooldown).
  Range 1400–1500; ignores cover, targets enemies, with visible warnings.
- **Real Ship ×2 — Titanic:** Wave/Headwind plus a Titanic call (32 s cooldown).
  Random left/right arrival, 2.5 s warning/horn and a marked central danger band.
  The ship ignores terrain, can carry caster/allies/enemies sideways and deals
  260 damage once per carried fighter on reaching the opposite edge. Reach
  the top/bottom safe lanes before contact. Contact guarantees a grab, even in flight or dodge.
  At most two ships can be active; round reset clears all ships and passengers.
- **Drunken Man ×2 — Toxic Captain:** four times ordinary damage and green waves.
  Host-authoritative movement rotation changes every 2.5 seconds. A compass
  shows where Up moves. Aim remains reliable. No original-card self-stun; random
  steering also affects dodge and boat piloting for players and bots.

Protocol build 49 synchronizes exclusive Sea dimensions, boat stats, artillery,
Titanic warning/carry/resolution and toxic rotation. `sailer-evolve.test.cjs` covers
all five kits, bots, risk mechanics, large collision/projectile hitbox, exclusive
map rules, delayed artillery through cover and Titanic damage to every team.
Online and party suites cover all five guest kits, chosen artillery bots, shared
Sea maps and Titanic warnings. Tests use simulated transport, not real internet
routes; browser/device playtesting remains separate.

## Laores — five owned-round Evolves

The five Dragon families now support duplicate-card Evolves, making **25** choices
across five fighters in Evolve mode. Dragon Evolve growth counts rounds **owned**,
not the match round: an Evolve first used in match round four starts at its own
round one. The start is stored by the host and synchronized per fighter.

The selection menu has **Fördelar**, **Nackdelar** and **Rondutveckling** tabs for
Dragon Evolves, and the in-match status shows the owned-round number.

- **Lizard ×2 — Walking Volcano:** all three attacks change. Lava Ball explodes
  (26/34/42 damage); Molten Breath deals 5/7/9 per pulse; Volcanic Inferno deals
  70/95/120 after 1.1 s charge. Owned round two adds splitting embers and burning
  ground; round three widens and strengthens attacks. HP 150/180/210; speed
  170/150/130. No Fly or Dodge. Stationary during the charged beam. Aim turns at most 0.5 rad/s during
  charge, then locks for the final 0.4 s so opponents can sidestep.
- **Studied ×2 — Arcane Hunter:** Arcane Missile, Hunter Orb and Arcane Swarm.
  Homing turn rates grow per owned round; swarm fires 3/5/7 weak shots. Walls
  stop them, and they cannot home onto invisible Blue Flash. HP 110/120/130.
- **No Time to Wait ×2 — Primal Dragon, Lord of All:** enormous first form with
  650 HP, 180 speed, Primal Fire 132 damage and Sovereign Inferno 209. Not immune
  to damage. Owned round two: 170 HP, 125 speed, 45/71 damage. Round three: 55 HP,
  90 speed, 15/24 damage. Later owned rounds weaken it further. Colors and size
  change with age. No ordinary No Time to Wait aging is double-applied.
- **Toothless ×2 — The Blue Flash:** 65 HP; movement 360/400/440. Hold Blue Flight
  for invisible flight, release to land. Energy 1.4/2/2.6 seconds, regenerating
  on the ground. No attacks during flight. After 0.7 s inside a block, eject to
  safe ground, take 20 HP and 1.2 s stun; warn before this and before exhaustion.
  R1 has Bolt + Flight (2 buttons). R2 adds Bomb (3 buttons). R3 keeps exactly
  three: Bolt / Plasma Charge / Flight. Tap Plasma Charge for Bomb; hold 0.8 s
  for Beam, slowing movement while charging. **No fourth attack.** Enemy bodies,
  ground markers and minimap icons are hidden during flight; manual area hits
  still work. Ordinary player dodging cancels a pending plasma charge.
- **Hydra ×2 — Many Become One:** 2/3/4 heads at owned rounds 1/2/3, then up to
  6. Each head is a life; revive with about 25% HP. Extra heads autonomously fire
  weak shots toward the aimed visible enemy, so losing heads reduces firepower.
  Large hitbox, 140/150/160 HP and 145/135/125 speed. Main attacks: Hydra Fire,
  Hydra Breath and Hydra Roar. Lost heads reset with the next round.

### Titanic and bot fixes

Titanic contact now guarantees a grab for everyone, including flying/dodging
fighters. It cancels their actions and holds them until delivery; escape must
happen **before contact**. The 260-damage delivery and safe lanes remain.
Bots have a **90% priority roll** to select an offered valid Evolve. Their chance
of being offered the repeat card remains the same 10% as human players.

Protocol build 50 includes owned-round starts, Blue Flight hold/release/cancel and
charge state, first-round Hydra extra-life validation and guaranteed Titanic grabs.
Checks include `dragon-evolve.test.cjs`, all prior Evolve suites, ordinary gameplay,
simulated duel/party transport, all fifteen Dragon bot/owned-round combinations
and the prior team utility suites. Real browser/network testing is separate.


## Engin — five Evolves

All five Engin families now have Evolves, available through rare duplicate offers,
training and the fixed-loadout best-of-three Evolve mode (25 choices total).

- **Heavy Armor ×2 — Power Plant:** a destructible 220-HP central reactor supplies
  warned arena-wide strikes. Engin has a harmless rush; a destroyed reactor takes
  a stationary 2.2 s rebuild. Bots can attack the reactor.
- **Uranium V2 ×2 — Living Atom Bomb:** slots are Atomic Beam, Doomsday, Nuclear
  Orb. Beam channels ten 18-damage pulses over 1.5 s after a 0.8 s charge,
  with stationary feet, slow aim steering, recoil and wall blocking, like the
  original Reactor Beam. Doomsday/Orb deal 135/120 damage; cooldowns 14/20/18 s
  and HP costs 28/42/14. The large purple orb explodes on its fourth wall
  bounce (a corner counts once), with a visible bounce counter. Its explosion
  can hurt its creator. Bots flee it.
- **Into the Veins ×2 — Uranium Addict:** a blue monster with rush, leap and
  injection. Fuel lasts 10 s, enabling 6 HP/s regeneration. Injection self-stuns
  for 1.2 s; empty fuel reduces speed/damage and drains 2 HP/s. Rage affects steering.
- **Infected ×2 — Never Dead:** 1 HP and 98% revive chance per death, with 0.55 s
  protection. Each death adds 8% damage and 2 speed, capped after 25 deaths for
  this match. Zombie Swipe, Shamble Rush and Over Power; failed revive ends its life.
- **Magic Technology ×2 — Broken Timeline:** records every Engin round from match
  start, even before acquiring magic. Later rounds replay earlier movements,
  sampled projectile paths and beam/area attacks through the new map's walls.
  Echoes can damage Engin and enemies. Positions scale to the current arena;
  echoes last only their original recorded duration and do not create more echoes.
  Fixed Evolve mode therefore has zero, one, then two prior-round echoes.

`node engin-evolve.test.cjs` verifies costs, attacks, reactor rebuilding, injection,
revival, historical recording and Volcano aim limits. `node online.test.cjs` also
checks host-authoritative Engin Evolve state and remote attacks using simulated
transport. These checks do not exercise real internet connectivity.

Never Dead now has a separate rotten zombie silhouette: crooked bare limbs, exposed bones, ragged clothes, damaged face and drooping jaw, with no reactor equipment.

The returning Nuclear Orb also deals 120 damage on contact with its creator after arming by separation or a wall bounce. A 1 s contact cooldown prevents per-frame hits. Contact leaves the orb active; its fourth bounce still triggers its explosion. Dodge avoids contact.


## Olympic Team Evolve — Beyond the Limit

**No Pain, No Gain ×2** is now available through the rare repeat-card offer,
training and the fixed-loadout Evolve mode. This adds the 26th Evolve choice.
It keeps the three athletes and Switch; All five Olympic card families now have Evolves.

Hold any attack for up to **2 s**. Charging immediately spends **12.5 HP/s**, up
to **25 HP**, from the active athlete. Release early for proportional power:
`damage multiplier = 1 + 3 × (actual HP spent / 25)`, reaching **4×**. A tap
uses the ordinary attack. Charging slows movement as with regular No Pain.
Cancelling, missing, being stunned or failing to execute never refunds the cost.
The charge stops draining at **1 active-athlete HP**. Energy Drink reserves its
ordinary additional 5 HP cost so it cannot cause an automatic switch after charging.
HP loss remains part of the normal team HP and is synchronized by the host.

At full power:

- Runner: Sprint deals 72 damage (108 with Energy Drink), lasts 0.75 s and has
  a wider contact area. Energy Drink lasts 10 s and still costs its normal 5 HP.
- Swimmer: Splash deals 48 damage, has double range, radius 100 and pushes 300.
  Dive lasts 1.8 s, is steerable at 550 speed and deals 32 damage once per enemy.
- Skater: Ice Dash deals 12 damage and adds five Bleed (seven when started on
  ice). Ice Trail emits radius-120 patches lasting 16 s for seven seconds.
- Charged Switch still changes athlete and gives an eight-second speed boost.

Strength for damage and control scales with actual HP paid, not time alone.
An athlete with only 8 HP can pay 7 HP; she cannot buy full power by charging
at the HP floor. Every new round resets charge state and HP debt. Ordinary
single-card No Pain and its existing combinations keep their 0.8 s / 4 HP rules.

`node pain-evolve.test.cjs` verifies budgets, partial/full charge, interruption,
no refunds, low-HP safety, each athlete, AI, rare offers and fixed Evolve mode.
`node online.test.cjs` checks guest charging, host-paid HP, cancellation, the HP
floor, snapshot validation and fixed-Evolve selection through simulated transport.


## Selfish ×2 — All About Me

Training accepts two matching Selfish athlete cards. Fixed best-of-three Evolve
mode offers three explicit choices: **Can’t Stop (Runner)**, **Deep End (Swimmer)**
and **Thin Ice (Skater)**. There are now 32 total Evolve selections. Each choice retains
one athlete, her three buttons and 120 HP for the entire match. Between-round
respawns never change her. Selecting a rare second Selfish card in a series
uses the already-selected athlete directly, without opening another choice.
Different Selfish athletes cannot be combined.

- Runner: hold Sprint on keyboard/touch to keep rushing. Movement input or aim
  steers it. Over three seconds speed rises from 500 to 1100 and damage from
  22 to 66; turning falls from 2.2 to 0.35 rad/s. Energy Drink boosts these to
  1320 speed / 99 damage and costs its usual 5 HP. Releasing, stun, grab or
  cancelled input stops the run and starts the 3.6 s cooldown. Energy Drink or
  Never Happened can interrupt Sprint. Bot/direct-tap runs stop after 3 s.
- Swimmer: once-per-round Pool now covers **at most half the arena area**. Its
  centered radius is the smaller of `sqrt(W*H/(2*pi))` and half the shorter
  arena side minus 22. Normal water rules apply to
  everyone. She has 400 speed in water and only 85 on dry ground. Splash deals
  32 in water / 14 on land, radius 80, 650 range and 170 push. Steerable Dive
  lasts 1.8 s at 600 water / 320 land speed.
- Skater: Ice Trail emits radius-100 ice for six seconds; patches last 12 s.
  Ice Dash lasts 0.5 s and gives two Bleed, or five on ice. Spin Cycle makes
  two hits normally or six on ice, each giving two Bleed. Slippery terrain uses
  much heavier momentum for her, making braking and turning difficult.

`node selfish-evolve.test.cjs` checks training, matching-card validation,
first-athlete locking, three-round persistence, held Sprint/release/interrupt,
rewind escape, water dependence, pool reuse prevention and enhanced ice/spin.
Online and party tests cover all three Evolve choices, synchronized fixed
athletes and Runner hold/release through simulated transport.


## So Much Power ×2 — No Control

Available as a rare second So Much Power card, in training and fixed best-of-three
Evolve mode. All three athletes retain their own 40 HP and Switch.

- **Runner — Wrecking Kick:** 0.65 s visible windup, 10 direct damage, 700 push
  and 75 extra damage if the enemy hits a wall. A miss recoils 350; hitting a
  wall during recoil costs 30 own HP. Energy Drink still costs 5 HP and doubles
  both push/recoil (and the recoil wall penalty), making a bad boosted miss
  capable of knocking out Runner. Cooldown 7.5 s.
- **Swimmer — Walking Whirlpool:** hold to grow a moving field from radius 90
  to 350 over four seconds. Movement slows to 30%. It pulls enemies **and allies**
  at 175/s; fighters can move/dodge away. Release throws nearby caught fighters
  in the aimed direction for 350–670 push; enemies take 14–30 damage, allies take
  no direct damage. Switch, interruption or cancellation discards the field.
  Direct taps/bots release after two seconds; human holds cap at four. Cooldown
  11 s from release. Tidal Wave remains the first attack.
- **Skater — Shattered Ice:** a 0.45 s warned wave deals 8 damage and three Bleed,
  then splits into five returning shards. Starting on ice widens the wave from
  radius 64 to 100, adds two Bleed and produces seven shards. Each shard deals
  7 damage and two Bleed, bounces twice and can hit its creator. Shards are queued
  until the projectile update completes so they survive the wave's removal.
  Ice Trail remains available and creates stronger sliding terrain.

The Selfish Evolve Pool nerf is separate: normal Selfish and No Pain Pool sizes
are unchanged. The area bound holds on every map, including Labyrinth and Sea.

`node power-evolve.test.cjs` checks recoil/Drink/wall damage, growing/released/
interrupted whirlpools, allied pull without damage, Switch, queued shards,
self-hits/Bleed/bounces and the pool-area bound on all maps. Simulated online
and party tests cover the new Evolve choice, guest hold/release, projectile
snapshots and round cleanup. Real internet transport was not exercised.


## Olympic age Evolves — the last two families

**Too Old ×2 — Still Not Retired** and **Kids ×2 — Too Young for This** are
available through rare duplicate offers, training and fixed best-of-three Evolve.
All five Olympic card families now evolve (seven menu choices because Selfish has
three locked athlete variants); the game has 32 Evolve selections in total.

Age counts rounds **owned**, including the first one. Acquisition in match round
four starts at owned round one. Fixed Evolve mode starts at one and advances each
round. Training's Round / Age Step field previews steps one through five. Visuals,
HP, speed and abilities follow the same stored stage in multiplayer snapshots.

Too Old, owned rounds 1 / 2 / 3:

- Mother becomes Grandma; her child becomes child / teen / adult. Parent and child
  remain connected by a visible 145-distance cord. The one child's HP is
  40 / 65 / 95 and melee damage 8 / 13 / 19. Protect Grandma commands the child
  and gives a short frontal guard. Switching dismisses the child.
- Yoga has Ancient Sun Beam (25 / 38 / 56 damage), with increasingly long
  0.7 / 1.0 / 1.3 s aimable charge. Sacred Circle damages enemies and heals allies
  for 5 / 7 / 9 HP/s. Switching removes her circle.
- Living History summons 1 / 2 / 3 living tattoos. Activation costs 3 / 5 / 7 HP,
  and upkeep costs 1 / 2 / 3 HP/s. Each tattoo deals 7 / 10 / 13 nearby damage
  every 0.8 s and can be destroyed. Recall Ink or Switch stops the cost and
  dismisses them. The summon lasts at most seven seconds.
- Team HP falls 104 / 85 / 66 and movement slows with age. Additional owned rounds
  four/five continue the trend, with stronger powers and increasingly fragile bodies.

Kids, owned rounds 1 / 2 / 3:

- Runner and Swimmer shrink from children toward babies. Each has 40 / 32 / 24 HP.
  Runner's normal speed falls 240 / 190 / 130, but Sugar Burst gives
  460 / 620 / 780 speed and +40% Baby Rush damage, followed by a harsh energy dip.
- Swimmer has a **100-water tank**, starting with 50 each round. Water Gun costs
  12; Water Balloon costs 35 and leaves a refill puddle for the round. Hold the
  Water Gun button **while in water** to refill at 45/s; release to shoot, or
  cancel to keep the water without firing. The button remains usable for reload
  even when empty or cooling down, so no fourth attack is needed. On a dry map
  with no water source, gunfire reserves enough for one emergency balloon.
  Bots create/refill at puddles rather than remaining dry and unable to attack.
- Lego Fortress has 140 / 150 / 160 HP, a larger hitbox, powerful ranged Lego
  and barricades. She cannot walk, dodge or be ordinarily pushed. Switch leaves
  the fortress form; existing boats/grabs/Titanic can still transport her.
  Younger stages four/five further strengthen the fort while weakening the others.
- Switch cancels water refill, ends Sugar Burst (keeping its dip risk), and
  changes athlete. Water ammunition stays with the team during that round.

`node olympic-age.test.cjs` checks all six athletes across three owned stages,
late acquisition, cord/child growth, age HP/speed, sun healing/charge, tattoo
costs/recall, sugar bursts/dips, water-only refill/ammo/puddles/empty-button safety,
fort roots/HP/attacks/Switch and bot refill navigation. Online and party tests
verify actual guest input, round-to-round age/HP changes, growing children,
living-ink actors, refill puddles and rooted movement over simulated transport.
Real network/signalling routes were not exercised.


## Match insights, live practice tools and The Sea support

Completed matches now show a responsive result panel for every player: actual
capped damage dealt/taken (including captain hull), projectile hits/launches,
evaded hits, effective healing, guarded/reflected damage, ability HP costs and
the part of damage supplied by The Sea. Projectile precision counts each
projectile once even if it produces multiple hits. Dodge near-misses require a
projectile path intersection or an avoided hit; repeating frames do not count
again. Zombie/Hydra revivals do not erase the damage that exhausted the old life,
and overkill is capped at the actual HP available. Self-hits and HP costs are not
credited as damage to enemies. Bleed attribution follows its contributing owners.

The build breakdown shows observed damage/healing/blocking/costs while each card
combination was in use. It does not invent a counterfactual damage bonus for each
individual card. Match data accumulates across rounds, resets on rematch, is
host-authoritative and is validated/imported with online snapshots. Training has
its own damage counter and is excluded from competitive match totals.

During training, the new tools below the play controls let you select both cards
and owned-round/age step, apply the build without returning to the menu, reset
cooldowns (including Giant Hands and Olympic personal cooldowns), restore the
dummy, clear the damage counter or start a new trial. Applying a build cleans up
old effects/state and retains legal player positions. Dummy modes are Still,
Moving, Avoiding (no attacks) and Fighting, with live difficulty selection.
Existing immortality/no-cooldown training options remain available in setup.
Controls stay above the tools on mobile.

Only **The Sea** has new arena events. Every nine seconds after an initial eight
seconds, a living My Home Evolve Sailer receives one of three warned attacks:

- Sea’s Wrath: three staggered water eruptions, 16 damage each.
- Ghost Broadside: a 90-wide horizontal cannon lane, 24 damage.
- Captain’s Storm: a marked 140-radius strike, 28 damage.

Warnings last 1.25–1.8 seconds. Events attack only the source Sailer's enemies;
the Sailer and that Sailer's allies are protected. Multiple opposing Sea owners
take turns receiving support for their own side. Dead owners lose pending
support. Bots react to the marked danger and seek a safe direction. No other
map receives these events. Training disables them by default, with an optional
The Sea event checkbox to practice them deliberately.

`node game-upgrades.test.cjs` covers capped damage/guards/healing/costs,
projectile accuracy, evasion de-duplication, Bleed, resurrection accounting,
build/round totals/results/rematches, practice controls and Sea behavior.
Online tests cover authoritative guest result panels and rematch resets; party
tests cover synchronized Sea warnings/damage and allied protection. Core gameplay, Evolve, map and team
regression checks also pass with simulated transport. Headless Chromium could
not start in the sandbox (Crashpad setsockopt EPERM), so no live browser/network
claim is made by these tests.

### The Mannequin
Faceless wooden Control fighter (110 HP): Needle Stitch attaches a breakable tether, Pull the Thread reels the target in, and Tripwire places two destructible anchors. All five card families are now available:
- **Training Dummy:** wooden katana, timed frontal Perfect Block, Wooden Slash and Triple Slash. Missing a parry leaves a recovery window; area damage bypasses it.
- **Spirit:** three bodies with shared HP; Dodge cycles through all three bodies with a vulnerable, delayed possession transfer. Inactive bodies are lifeless, invulnerable and do not stop projectiles.
- **Haunted Dojo:** combine both cards. A successful parry resets possession cooldown; Triple Slash can continue after one body swap.
- **The Perfect Counter (Training Dummy ×2):** steel katana, Cut, and Slashes of the Gods, which requires the target to remain stunned by this fighter's own Perfect Block.
- **Five Empty Bodies (Spirit ×2):** place five bodies on the map before each round, select the initial body and press Ready. All players wait for placement. Each body has independent attack cooldowns; HP remains shared. The possessed body can walk normally; inactive bodies stay at their last position. Dodge opens body selection. Supported in practice, fixed Evolve matches and authoritative online/party play.

Regression checks: `node mannequin.test.cjs`, `node mannequin-online.test.cjs` and `node party.test.cjs`. Network checks use simulated transport; real internet/mobile play still needs manual verification.

- **Pins and Needles:** 95 HP; fast Pin Shot, Sew Together and Unravel. Missed shots plant 5-HP needles (six maximum, 18 s lifetime). Web crossings deal 5 damage and slow; returning needles pierce enemies once each. Needles and threads remain visible and destructible.
- **Sewing Blade (Pins + Training Dummy):** faster, weaker katana attacks; misses leave needles, the final Triple Slash recalls them, and Perfect Block gives a shorter 0.7 s stun plus three needle shots.
- **Haunted Web (Pins + Spirit):** both empty bodies anchor the web. A possession transfer disarms threads for 0.65 s and redirects recalled needles toward the newly possessed body. Shared HP and three attacks remain.
- **The Sewing Machine (Pins ×2):** 80 HP, 12 ground needles. Hold Needle Storm for a stationary, aimable burst of at most 2.4 s; release or stun interrupts. Cross Stitch shows a 0.9 s warning before two damaging diagonal lines. Unravel Everything recalls all needles. Dodge becomes Cut Loose: consume all needles/projectiles/webs for a short escape dash, with an 8 s cooldown. No needles means no dash. The skin adds multiple thread spools and needle fingers.

Run `node pins.test.cjs` for pin limits/destruction, web crossings, piercing recall, both card orders, hold/root/aim/release, warning timing and Cut Loose costs. Mannequin online and party tests also cover the new card/evolution with simulated transport.


### Perfect Block timing and online fairness
Perfect Block activates on **button/key press**, including with aim-before-shoot enabled; release does not fire another parry. Normal and Sewing Blade windows are 0.35 s; The Perfect Counter Evolve has a 0.25 s window. The visible gold arc follows the actual facing direction. Miss recovery remains 0.45 s normally / 0.6 s Evolve. Front-facing lasers (including recorded echo beams) are parryable; area explosions are not. A successful parry stuns the attacker and stops an active Reactor/Tractor/Atomic channel.

Online uses **delay-based parry input fairness**, not rollback or extra guest invulnerability. The host measures each connection with nonce-checked ping/pong; clients cannot submit an RTT. A common budget is the room's maximum measured RTT plus snapshot interpolation (50 ms duel / 80 ms party), capped at 200 ms. The host queues its parry for that budget. Each guest receives only the remaining wait after its own RTT/interpolation. This compensates for the guest seeing the attack later and sending its response back. All players keep the same active window and cooldown rules. A dotted amber ring marks queued activation; the gold arc marks the active window. The HUD shows the room budget. Queued parries consume cooldown, cannot be spammed, cancel on pause/round reset/death, and cannot activate while stunned or otherwise unable to attack. Offline activation remains immediate.

This reduces host reaction advantage within the supported delay budget; packet jitter and RTT beyond the 200-ms cap can still affect timing. Tests use actual delayed simulated control/snapshot packets at 0/60/120/150-ms RTT and verify equal reaction timing within 25 ms, as well as party-specific waits, laser channels, input press/release and state validation. Run `node parry.test.cjs` and `node parry-online.test.cjs`. Real internet/device testing is still manual.


### String Theory and Voodoo — complete Mannequin deck
**String Theory** builds a ten-anchor maze. Select an existing anchor, then connect/place the next; each anchor supports two links. Long threads take longer to finish, stop at walls and remain visible. Wrong Way reinforces the thread nearest the aim with one press; a repeat reverses its arrow; arrows warn opponents. Three threads may be armed. Hold Tighten the Web to root the caster and send pulls through the connected graph; release cancels it. Flying enemies ignore ground threads; a 0.9 s control immunity prevents infinite knock chains. Destroying a key anchor disables disconnected branches.

**The Weaver (String Theory ×2)** has forty anchors, three links per anchor and eight armed threads. It moves only on its connected threads. Thread Slide replaces Dodge; breaking its supporting thread causes a 0.8 s stun and leaves a new recovery anchor at its position. Pull the Pattern propagates edge by edge for up to eight held seconds, requiring setup and prediction. It has low direct damage and a hanging, many-armed faceless skin.

**String Theory combinations:** Spider Sense uses a weak Threaded Slash to build the network; vibrations grant a 0.5 s parry only against a warned target. Two different crossed threads within two seconds charge one target-specific frontal Auto Block (four-second expiry, eight-second recharge guard). Countercut replaces Triple Slash and requires the caster’s own successful parry. Puppet Spiders gives the inactive Spirit bodies crawling forms and explicit graph-path commands; cut paths stop them, while possession still shares HP. Stitch by Stitch uses six missed pin anchors, Wrong Way and Unravel; recalling the pins sacrifices the web. Spider Doll randomly steals one current attack when a foe crosses an active thread, at most once per foe per three seconds.

On mobile, Anchor Thread and Wrong Way open a precise map picker using the existing attack slots. Pick anchors/links and the push side there. Tighten uses the selected anchor. No fourth attack slot is added.

**Voodoo** selects an enemy attack for slot three before the round; an empty selection can be skipped (including against an enemy with no attacks). Native attack logic handles charge, channels, summons, portals, movement, costs and held abilities. Its own identity, max HP and passive lives stay Mannequin. The chosen attack persists across ordinary rounds. Sealed Technique keeps Perfect Block and replaces Wooden Slash with Sealing Slash, locking the enemy’s last-used slot for 2.5 s (five-second per-target guard). Pinned Soul marks a Pin Shot victim for four seconds; the next copied hit on that victim gains 25% damage.

**Body Snatcher (Spirit + Voodoo)** replaces reserve dolls with possession of fallen bodies. A private empty enemy shell is available each round for 1v1. A 0.65 s rooted ritual can be interrupted by damage or stun. Possession moves to the body and borrows its attack kit and appearance without restoring HP or cooldowns. Actual eliminated enemies leave public corpses in multi-player battles. Lifeless corpses do not take damage or block shots. A body with fewer attacks supplies only those attacks.

**Identity Thief (Voodoo ×2)** removes normal Dodge. Steal Technique opens a target/slot picker; select one, two or three attacks and mix sources across successive rituals. Mid-round changes require 0.95 / 1.25 / 1.55 s of rooted, visible ritual time and are interrupted by damage or stun. A source-specific cooldown ledger follows attacks across slots and body changes, preventing duplicate-slot or swap resets. Copied once-per-round abilities retain their own use restriction. Borrowing Overload pays its self-cost and changes to the monster attack kit; copying just a monster attack does not grant the full transformation or passive lives.

The host validates all selections against the sender’s seat, match, round and actual enemy attacks. Native execution state stays on the host; snapshots contain bounded public banks, graphs, cooldowns and body information. Test commands: `node doll-magic.test.cjs`, `node doll-magic-online.test.cjs`, `node voodoo-native.test.cjs`, and `node party.test.cjs`. The copy audit covers 817 source attack cases across all current source card orders/Evolves/athletes and validates identity, HP, statistics and snapshots. Network tests use simulated transport; physical mobile and real-internet testing remain manual.

Web balance update: Anchor Thread cooldown is 0.30 s (Endless Thread 0.22 s), with 850 placement range. Anchor selection snaps within 48 units and costs only 0.08 s. New anchors automatically connect to the nearest usable free anchor when the selection is full, obstructed or out of range; failed connections do not leave orphan anchors. Thread construction is 0.08 s + length/1100 normally, or length/1500 for The Weaver. Weaver anchors have 25 HP, movement along threads is 30% faster, Thread Slide cooldown is 2.5 s, thread control hits deal 4 damage and push 145 units, and tightening spreads every 0.10 s per graph step. Anchor caps remain ten normally and forty for The Weaver; destroyed anchors still break branches.


Reinforcement usability update: Wrong Way / Wrong World needs only one press. It chooses the nearest live thread to the aim without the old 90-unit precision requirement; a thread can be armed while it is still building. The first arrow points away from the caster, and reinforcing that same thread again reverses it. Normal cooldown is 1.2 s; Weaver cooldown is 0.8 s. Caps remain three/eight powered threads. The mobile picker closes after a single selection; no second direction-selection step is required. No-thread attempts refund to a 0.15 s cooldown.
The tether prerequisite now applies to the actual Pull the Thread move, rather than every non-katana second slot. Wrong Way and stolen attacks in slot two no longer incorrectly require a prior Needle Stitch hit. Regression checks exercise the real attack entry point and simulated guest input.


## Adventure — The Threshold

The Adventure tab starts a single-player boss attempt as **The Player**, exclusive to this mode and absent from Arena/online character selection. Helmet, cloth shirt, worn sword; no cards or Evolves. Slash (22 damage, 0.72 s cooldown), three Healing Potions (55 HP, 1.2 s stationary drink interrupted by damage), and held frontal Block (85% damage reduction). 110 HP and three total lives; boss HP and remaining potions persist across lives. A two-second revival shield protects the safe respawn. Each new attempt restores lives/potions. Existing keyboard mappings, aim preview, touch controls and dodge work.

Door Man has a 260-HP first phase and a fresh 420-HP grotesque second phase. He rushes, shoots Lock, warns before teleporting between chamber doors, and adds warned door grabs and multi-lock patterns in phase two. The player retains HP, lives and potions during the transition. Death/victory dialogue now follows actual Door Man deaths; transformation dialogue follows completed scene sightings. Attempts/victories are stored on the device when localStorage is available; denied storage does not prevent play. The hidden backstory is deliberately not exposed. Adventure now continues to Flooded Harbor and the Sailer / Kraken rescue encounter.

Validation: `node adventure.test.cjs` covers abilities, interrupted potion consumption, shared lives/resources, revival protection, frontal blocking, phase transition, grabs, victory/defeat, simulated AI/render, arena separation, settings restoration, persisted retry counts, denied-storage fallback, and touch hold/release/cancel. The simulated online suite loads `adventure.js` as the published page does. Real Chromium testing is blocked in this executor by Crashpad `setsockopt: Operation not permitted`; automated VM/transport tests do not establish real-device visual or network quality.


### Door Man: growth scene and expanded boss patterns

Depleting phase one now starts an 8.4-second transformation: the whole simulation and combat input freeze, the boss dissolves from his normal body into an elongated creature, then grows to 2.65 times the previous monster drawing (roughly four times The Player’s height). The scene has its own centered framing and three timed English dialogue lines. Attempts 3 and 8 add recognition of the prepared player; no hidden backstory is disclosed. Pausing freezes the scene, and the player cannot heal or take damage during it. HP/lives/potions carry through.

Door Run creates two doors and a warned corridor across the player’s position. Door Man physically rushes between them twice in phase one, three times in phase two, with a brief warning before each return. Swept collision prevents skipping a player at high speed; each pass hits once, and sidestepping, dodging or frontal blocking work. Paths are checked for cover and arena bounds. The enlarged phase-two boss has a 48-unit physical radius. New attacks are a warned three/five-key fan and an unblockable area Door Slam. Phase two also keeps Door Grab, multi-locks, ordinary rush/Lock and teleportation. Boss speed is now 300/325 and damage multipliers 1.12/1.2; phase-two HP is 420. These changes are exclusive to the Adventure boss.

Additional automated coverage: growth scale progression/dialogue/pause/frozen resources/input, final hitbox, doorway pass counts, swept hits, one hit per pass, sidestep/dodge, key fan/area slam and normal Arena isolation.


### Slower story recognition and local developer code

Earlier builds used attempt thresholds; ordinary intro/victory dialogue now follows actual Door Man deaths, described in Chapter 2 below. Transformation dialogue uses its own persistent `one-vs-one-door-form-views` count: the first four completed viewings keep the initial lines, the fifth introduces “You’re not surprised… are you?”, and the twelfth introduces “You’ve seen this before.” Only finishing the full growth scene increments the counter, once. Starting retries, dying before phase two, and leaving during the scene do not count. The first upgraded release cannot infer old scene view counts, so this new counter begins at zero.

Developer code **PLAYER-GOD** can be entered under **Settings → Developer · Adventure**, then toggled off/on there. It prevents HP loss for The Player only in local Adventure, while locks, grabs, movement and enemy attacks remain testable. It is a local test convenience, not a secret or online permission mechanism. It is off after a page reload. Runs started with immortality enabled do not increment the attempt counter; enabling it during a run marks that run as a test. Test runs do not record victories or completed scene views, even if immortality is switched off before finishing. It never protects normal Arena/online fighters. The HUD visibly labels GOD MODE/test runs.

Automated tests cover threshold boundaries, many failed attempts without prior transformation sightings, completed/aborted scene counts, invalid/normalized developer codes, lethal-hit protection, toggling off, Arena separation and test-run counter isolation.


## Adventure Chapter 2 — Flooded Harbor

Defeating Door Man grants his permanent key and an **Enter Flooded Harbor** button. A **Continue · Flooded Harbor** button appears in Adventure setup on later visits; previous real Door Man victories are migrated to this checkpoint. Local storage can be denied without crashing, but then progress cannot survive a reload. The key changes Dodge to **Door Step**: a 190-unit short teleport, 1.35 s cooldown and 0.14 s dodge window. Landing must be free and within the arena; thin cover can be crossed. No fourth ability is added.

The harbor is a separate, freely walkable Adventure hub using the existing simple drawing style, with water, quays, lamps, buildings and a moored ship. Nell the Net Mender, Mara the Lantern Keeper, Orrin the Dockhand and Sailer have English conversations. Move near someone and use **E**, **Talk**, or the on-screen **Interact** button. Conversations freeze movement and offer Next/Leave. Sailer’s final dialogue offers boarding. Rest restores resources at the hub.

Sailer’s shared Arena/menu/Adventure drawing is now an old gray-bearded sailor in a weathered captain’s coat, with boots, cap, smoking pipe and golden paddle. Existing Sailer card/Evolve mechanics remain; literal-boat Evolve retains its boat form.

**The Last Crossing** begins on a large bounded wooden ship. Sailer has 480 HP, directional melee paddle sweeps, broad wave attacks and a pull attack. His boarding scene reveals that he intends to steal the player’s key so he can leave the harbor. He has fixed dialogue every attempt and no knowledge of player returns. On defeat he falls overboard and a **separate Kraken**, not a transformed Sailer, captures him. The rescue scene preserves current player HP, lives and potions.

Pick up the dropped **Golden Paddle** near the port side with E/Interact, or use Slash when standing near it. It changes the three slots to **Paddle Strike / Healing Potion / Brace**. Sword strikes cannot damage Kraken. Paddle Strike deals 32 damage to a nearby aimed exposed tentacle; Kraken has 480 HP. Warned sweeps and suction attacks can be dodged; facing and Bracing a tentacle strike reduces damage and exposes it. Other exposed tentacles provide openings too. Sailer's body remains visible in the Kraken’s grip. Winning rescues him, records Chapter 2 completion outside test mode and returns you to the harbor. Losing all lives offers retry of this voyage or returning to the harbor. A voyage starts with three lives/three potions; neither refills between its two phases. After rescue, speak to Sailer on deck, rest in the harbor and choose to lend the key for passage to The Olympians courtyard.

### Door Man’s death-based dialogue and surrender

A new independent counter records **each actual lost life against Door Man**, including the last life of an attempt. It does not infer past deaths from old attempt counts, count abandoned attempts, include Sailer deaths, or count test-mode deaths. Duplicate end-of-round processing cannot count a death twice. Arrival lines change at 10/30/50/71/100 deaths. Victory lines distinguish 0, 1–4, 5–9, 10–19, 20–34, 35–49, 50–70 and 71+ deaths. Transformation recognition still uses completed scene sightings (5/12), except that at 71+ deaths his dialogue becomes “No… not again” and “Please. I don’t want to hurt you anymore.”

At death 71 he does 15% less damage, moves 10% slower, gives 0.2 s more warning and waits 0.3 s more between patterns; phase-two Door Run drops to two passes. At 100 deaths: 30% less damage, 20% slower, 0.35 s extra warning and 0.6 s extra between patterns. HP is unchanged. His final exhausted lines are “There… I stopped. Was that enough?”

Validation: `node harbor.test.cjs` covers all NPC conversations and movement freezing, unlock/checkpoint restoration, Door Step through cover and ship bounds, ship and rescue scene transitions, shared resources, paddle/Brace/strike, rescue persistence, voyage retries, long fixed-step simulations/rendering of both phases, death counting/surrender and test-mode isolation. The full simulated online suite loads the harbor module; core, team and Sailer Evolve checks also run. Chromium remains blocked by this executor’s Crashpad setsockopt permissions, so VM rendering and simulated transport checks are not real-device visual/network tests.


## Combat controls and Door Man reaction windows

The separate aim/shoot stick is removed. The combat dock sits directly with the arena: movement on the left, two auxiliary attack buttons above the main attack and Dodge on the right. Desktop uses a compact horizontal ability bar with existing keyboard bindings; menu/settings/pause are grouped above the arena. Touch landscape uses side controls with a centered arena; portrait has the control dock below it. In-game header/footer clutter is hidden. Ability details/drafts/statistics no longer separate the arena from its controls.

Touch attacks always support **hold/drag/release** regardless of the desktop direct-attack preference. A tap keeps auto aim; dragging locks manual aim and release executes once. Cancel/lost pointer capture releases without firing. Held Block/Brace and other held powers can also turn using the attack-button drag. Aiming indicators appear with attacks, rather than a permanent passive player ray. Keyboard use restores desktop input behavior after touch use. Online input suppresses premature primary fire during a touch aim preview and includes manual direction on release.

Door Man’s **ordinary boss Running Man** now has a **1.1 s stationary warning**, a visible fixed lane/arrow, locked direction, a 4.8 s cooldown and 0.85 s recovery. It cannot start while the player is locked, another rush is active or the boss is recovering. Pending boss traps/projectiles are cleared for the rush warning. It strikes once and cannot retarget a player who sidesteps. This change affects the Adventure boss only, not playable Door Man’s Arena attack.

**Door Run** is intentionally fast once moving: **1600 / 1900 units/s** in phases one/two (previously 1050 / 1300). There is a **1.6 s initial warning** and **1.2 s warning before each return**. He is shown at the starting door during the warning, and the lane remains fixed. The visual lane matches the attack width; each pass can hit once. Previously agreed death-based surrender extends these warnings.

Validation: `controls-boss.test.cjs` covers locked aim/windup damage prevention/sidestep, single-hit/recovery, no leftover lock combo, fast Door Run and return warnings, mobile drag/release/cancel and held-block aim with desktop direct attacks enabled, desktop switching and removed aim-stick markup. The simulated-online suite includes an actual guest button gesture that verifies no pre-release fire and the host’s manual beam direction. Existing core, Adventure and harbor suites also run. The older Arena test’s Cheter cooldown expectation was updated from 1.0 to the already-existing 1.6 s balance value. Chromium visual checks were attempted but blocked by this executor’s Crashpad setsockopt permission error.


### Door Man key-fan marker

The key-salvo aiming lines are now hidden until the **final 0.1 s before firing**. The longer attack preparation still exists, including death-based mercy, but no persistent key aim lines are displayed during it. The old mismatch came from drawing at the boss’s scheduled position while projectiles launched from his later position. During the last 0.1 s he holds still, teleport warnings cannot move him, and shared ray geometry drives both the marker and actual 3/5 projectiles, including the 28-unit muzzle offset and 950-unit range. The marker disappears when the volley fires.

`node key-marker.test.cjs` verifies the display window, a moving-boss origin, final-position hold and every canvas ray against the emitted projectile coordinates/direction/range for both forms. Controls/boss, Adventure and harbor regression suites also pass.


### Faster boss reactions

Door Man’s rush warnings are shorter in both forms: Running Man **0.5 / 0.4 s**, first Door Run warning **0.7 / 0.55 s**, return-pass warning **0.5 / 0.4 s**. Direction locking, single-hit collision, rush speeds (1600/1900), the final 0.1 s key marker and death-based mercy remain. Tests check both forms and mercy extension.


### Melee access, stronger Door Man and Sailer's key motive

Door Man no longer retreats at the old 105/165-unit spacing. Both forms approach and hold at **88/112 units**, inside The Player’s Slash reach including the boss hit radius. Door Run routes now extend up to **250 units to each side** rather than 400, so the existing post-rush recovery can be reached and punished without changing rush speed/warnings.

Sailer approaches and holds at **90 units** instead of backing away below 190. He also stays still for **0.75 s after resolving a ship attack**, giving a melee opening. Kraken’s exposed-tentacle rescue mechanics remain.

Door Man’s damage multipliers are now **1.35 / 1.55** (previously 1.12 / 1.2), about 20%/29% stronger. Death-based surrender still scales those values proportionally.

Sailer recognizes the key, explains that every voyage returns to the same dock, and invites the player aboard under a pretext. On the ship he demands the key: “Hand me the key. I won’t ask again.” / “You don’t understand. I am not dying in this harbor.” / “I need it more than you do.” During defeat he lunges for it, the damaged railing gives way, and Kraken captures him. After rescue he admits he meant to take it and leave the player behind. This fixed story dialogue does not imply knowledge of repeated player lives.

The requested held-Slash projectile was cancelled before implementation: Slash remains a melee attack, with three ability slots. `node boss-melee.test.cjs` simulates approach and actual Slash damage against both Door forms and Sailer, a reachable portal-rush recovery, Sailer’s recovery, the damage buff/mercy scaling, key-theft dialogue and holding Slash without spawning a projectile. Controls/boss, key marker, Adventure and harbor regressions pass.


### Visible Sailer / Kraken combat effects

The Adventure ship now gives each attack its own warning and impact animation: foaming full-width Tidal Wave, directional Headwind gusts toward Sailer, golden paddle sweeps, a large suction-cupped tentacle sweep, swirling suction grabs, and tentacle slams. The paddle glows during preparation. Exposed tentacles have organic arms, suction cups and pulsing strike rings; successful Brace has a distinct gold burst. The dropped paddle glows, Sailer visibly hangs in the Kraken’s grip, and rescued Sailer appears safely on the deck. Cargo/mast/rope details replace the arena wall look on the ship.

These effects draw the existing hit regions and spawn only when the original attack resolves. They add no damage ticks, do not change cooldowns/attack delays/movement/collision, freeze on pause, expire and are capped at 24 active effects. They are cleared between phases and on rescue.

`node ship-visuals.test.cjs` checks all six effects against their resolution time, finite canvas coordinates, matching 130-unit strip warnings, once-only damage, paused/expired effects, Brace feedback and bounded/cleared state. Harbor, melee-access, controls/boss, Adventure and key-marker regressions also pass. Chromium screenshot testing was attempted but remains blocked by the executor’s Crashpad `setsockopt: Operation not permitted`, so real-browser visual review is still outstanding.


## Kraken pressure, post-rescue conversation and the Olympians crossing

Adventure Sailer now has **480 HP** (previously 310); Arena Sailer is unchanged. Kraken retains 480 HP but now combines **nine attack types**: horizontal sweep, vertical sweep, tentacle slam, suction, ink bursts, deep-sea waves, anchor drops, coiling grips and diagonal tail lashes. Nine fixed combo patterns use overlapping and staggered marked attacks. Pattern interval is **1.1 s**, falling to **0.85 s** below 45% HP. Ink briefly slows; anchors hit harder; grips pull/stun. Physical attacks can be Braced and expose tentacles; ink and water require avoiding the marked area. Every new type has its own warning and impact visual, including matching vertical strips/diagonal capsules. Exposed tentacles remain accessible and bounded effect state is retained.

After winning, **Talk to Sailer on deck** opens a safe ship area and conversation. He says there is no way out, slips a clue about “the old heart beneath—”, cuts himself off, offers help and says the harbor is freely available to rest. Reading the final line records the conversation outside developer test mode. Returning to the harbor restores resources. Existing rescued-player saves can also choose **Talk on the ship** to hear it. A separate Replay button keeps the old boss voyage available.

On the next harbor conversation, choose **Lend the key · Sail to The Olympians**. The key is temporarily unavailable during a short boat/door crossing and is returned on arrival; permanent saved ownership is never deleted. The arrival courtyard contains Runner, Swimmer and Skater as distinct NPCs with conversations, using their existing character appearances. Sailer can return you to the harbor to rest. This implements arrival and meeting the Olympians, not a new Olympians boss encounter. Test-mode progression works within the session but does not save conversations/arrival/unlocks.

`node kraken-story.test.cjs` validates 480 HP, all nine attack types and visuals, overlapping pressure, low-HP tempo, collision shapes, 45-second bounded combat simulation, the safe deck conversation/clue, harbor rest, explicit loan gating, key return, all Olympian conversations, return passage and developer save isolation. Existing ship visuals, harbor, melee access, controls/boss, Adventure and key-marker regressions also run. The full simulated online suite loads the complete runtime. Actual Chromium screenshots remain blocked by Crashpad setsockopt restrictions in this executor.


## The Olympians — a time journey for the key

The friendly athletes are named **Latissa** (Swimmer, from *latissimus dorsi*), **Solea** (Skater, from *soleus*) and **Vasta** (Runner, from *vastus lateralis*). Their default appearances are redrawn with distinct sporting outfits, hair, cap/goggles, skates, details and the existing differing skin tones. The shared drawing is used by Arena previews/default Olympic Team and Adventure NPCs/bosses; transformed age/card appearances remain. Class/ability identifiers remain unchanged.

At the Olympians courtyard, talk to any girl. They offer a journey into the past to meet Engin if you beat all three, and ask for the key if they win. The Player offers the sailor instead; Sailer answers “No.” Accepting is an explicit dialogue choice. A lost wager records a debt, but the friendly team lets you keep using the key for a rematch; no permanent inventory loss blocks retries or return travel.

The single boss attempt has **three sequential phases**, with **three lives/three potions shared across all phases**:

- **Latissa — 300 HP:** a large pool slows The Player; she swims quickly, keeps distance, casts waves/vortices/ripples and pulls toward the water. A warned dive ends near the player and she pauses on surfacing, leaving a melee opportunity.
- **Solea — 320 HP:** the pool freezes into ordinary slippery ice. She glides, leaves actual ice trails and chains warned skating passes. She can be damaged when stopped/recovering, with a visible **STOPPED · STRIKE** indicator; gliding/moving protection prevents damage until then. Icy fans/freezing circles pressure positioning.
- **Vasta — 360 HP:** sprint attacks, a baitable dodge with a 3.5 s cooldown, delayed echoes of sprint paths, slowing clock circles and a position rewind. Rewind does not restore HP or erase player damage. The last phase is the fastest.

Transitions freeze combat and preserve current player resources. Each phase has its own terrain, attack marks, character appearance and visual effects. After victory the friendly NPCs open a time rift to Engin, whom they believe may help The Player find a way home. The trial can be replayed. Wins/debts are stored only outside developer test mode.

`node olympian-trial.test.cjs` covers friendly challenge/consent/joke, names, actual water pulls/surfacing melee access, frozen terrain and stopped-only damage, shared resources/transitions, dodge cooldown, sprint echoes, non-healing rewind, information/retry/key safety, fixed-step rendering of all phases and cleanup before another boss/Arena. Core, full simulated-online and chapter regressions also run. The pre-existing age test’s global Evolve count was corrected from 32 to the already-existing 37 including Mannequin cards. Chromium screenshot testing remains blocked by the executor’s Crashpad setsockopt restriction; visual review on a real browser is still needed.


## Revised time reward and Kraken interruption

The Olympians now wager **a journey through time to Engin**, replacing their former world-explanation reward. Their challenge, victory dialogue and primary reward button all refer to this journey. Any previously saved trial winner can claim it without fighting again. After their conversation, choose **Enter the time rift · Find Engin**; the short time-travel sequence leads to an explorable **Engin’s Workshop — Before the Ruin**. Engin says he may be able to trace the player’s origin and help them get home. Talk/Look/Rest work there, and a return rift leads back to The Olympians. A separate replay button retains the optional trial rematch. Arrival is saved outside developer test mode; no Engin boss fight or final trip home is introduced here.

Sailer’s pre-Kraken scene is rewritten as **charge → interruption/grab → drag overboard → rescue**. He charges a fatal golden-paddle attack at The Player, with a visible lethal lane and “No escape” framing. At 2.6 s Kraken interrupts before the blow; the tentacle grabs him, drags him away and the paddle drops onto the deck. The final beat calls for rescue. All combat is frozen throughout; player HP/lives/potions carry unchanged into Kraken. The HUD initially shows Sailer’s final attack rather than revealing Kraken before its entrance.

`node time-reward.test.cjs` verifies saved-winner access to the new reward, paused/immune travel, Engin dialogue, return/replay, every interruption-scene beat and unchanged player resources, plus developer save isolation. Olympian trial, Kraken/harbor, visuals, melee access, controls/boss, Adventure and key-marker regressions pass. The full simulated-online suite loads the new time-rift module. Actual Chromium screenshots remain blocked by this executor’s Crashpad setsockopt restrictions.


## Curse och djurfolket

The Queen of Curses är en kunglig varelse med energikrona, svans och ett brett tandat leende. Cursed Needle märker motståndaren. Royal Decree skapar ett synligt förbannat område. Punishment öppnar ett val på de tre befintliga attackknapparna: No Escape förbannar nästa dodge, No Violence nästa attack, och tredje knappen avbryter. Förbud, tid och återstående straff syns ovanför offret. Fem kort: The Cursed Blade, This Is My Kingdom, Shared Suffering, A Thousand Curses och Forever Yours.

Vasta är nu en kanin, Latissa en delfin och Solea en igelkott, alla humanoider i medeltida kläder. Samma arter följer med i kortkombinationerna, barn-/äldreformerna, gudformerna och evos. Deras spelmekanik är oförändrad. Sailer har tydligare kortdetaljer, segel, vågor och kanonkulor.

Verifiering: `node queen.test.cjs`, `node queen-online.test.cjs` och `node creature-art.test.cjs`. Onlineprovet använder simulerad transport. Figurernas bilder har även renderats med Canvas för visuell granskning.


### Queen: The Cursed Blade och This Is My Kingdom

Katanan ersätter Needle med Soul Cut och Punishment med Soul Release. Slutliga utslagningar av alla andra deltagare, även lagkamrater, ger högst en själ per person och rond. Summons, separata relay-medlemmar, Hydras huvuden och lyckade Zombie-återupplivningar ger inga extra själar. Själarna ökar skada/räckvidd, förbrukas inte och återställs nästa rond.

This Is My Kingdom skapar ett enda växande territorium med fyra förstörbara sigill och en synlig No Dodge-regel. Drottningen måste stanna inne för att växa det. Grave Kingdom-kombinationen skapar gravar av själarna; Soul Cut väcker ett förvarnat extra gravhugg.

Cursed Blade ×2, The Hungry Blade, har endast en attack. Varje själ ger +22 skada och +30 räckvidd men −12 maxliv, minst 35. Svärdet drar siktet mot närmaste fiende under uppladdningen och spelaren kan styra emot.

Kingdom ×2, The Land Beyond Me, låser henne vid en tron. Åtta sigill driver de första två attackerna; siktriktningen väljer sigill. Sista förmågan väljer deltagaren närmast riktningen över hela banan, även lagkamrater, och visar en förvarning innan regeln aktiveras. Förstörda sigill krymper området och kostar drottningen 5 HP. Håll Dodge/Shift (Enter för lokal spelare 2) för Royal Guard: ett långsamt vridbart frontskydd med 90 hållbarhet. På mobil hålls Dodge-knappen och dras för riktning. Släpp för ett svagt knuffande svanssvep. Skyddet kan brytas; inga attacker eller nya aktiva förbannelser kan kastas medan hon garderar.

Båda evos finns i vanliga kortval, träning och Evolve-match. `queen-evolve.test.cjs` och `queen-evolve-online.test.cjs` verifierar själar, sigill, kombon, riktning, vänliga förbannelser, skydd och nätverkssynk med simulerad transport.


### Queen: de tre sista korten och evos

Shared Suffering ger 40 extra maxliv och en långsammare tankstil. Bind Suffering länkar ett mål: 35% av verklig inkommande fiendeskada delas. Med klingan laddar överförd skada nästa svärdsattack; med kungariket delas skadan mellan dess länkade fiender. Med A Thousand Curses delar hon även sjukdomar och får korta svaga själveffekter. Med Forever Yours kan en enda länk inte brytas av avstånd eller skydd resten av ronden.

A Thousand Curses sänker direkt skada och staplar Bleed, Burn, Slow och Stun-märken. Fyra Stun-märken utlöser en kort bedövning med återhämtningsintervall. Kungarikets sigill sprider varsin effekt; klingans själar lägger fler staplar på Soul Release. Forever Yours lämnar svaga permanenta förbannelser resten av ronden, även genom död, avstånd och renande effekter. Tillsammans ger de Endless Affliction. Klingan + Forever lämnar försvarssänkande ärr; kungariket + Forever låter dess regel följa offret även utanför området.

Shared Suffering ×2: One Wound, Two Bodies, 195 maxliv och låg direkt skada. 70% verklig skada och läkning delas åt båda håll med ett valt mål. Överförd skada/läkning och HP-kostnader kan inte studsa vidare.

A Thousand Curses ×2: The Living Plague, 75 maxliv, nästan ingen direkt skada och ingen vanlig Dodge. Plague Thorn, Miasma och Pandemic bygger och sprider förbannelser mellan närstående fiender.

Forever Yours ×2: Written Into the World. Förbannelser och egen offrad max-HP följer med mellan ronderna i samma match. Varje ny permanent förbannelse kostar ett maxliv; hon kan till slut förbruka sitt liv. En ny match eller återställning av träning rensar detta. Förbannelserna använder separat tillstånd så att tidsresor, återupplivning och vanliga statusrensningar inte raderar dem.

Verifiering: `node queen-afflictions.test.cjs` och `node queen-afflictions-online.test.cjs`, plus befintliga spel-/online-/evo-regressioner. Online använder simulerad transport.


## Character visual refresh (v105)
Bob (formerly The Essy Kid) is a child wearing striped clothes, overalls and an animated propeller cap. Door Man has a panelled door head, brass hardware, key ring and long keeper coat, with card-specific details. Laores has plated belly scales, ribbed wings, jaw details and lava cracks for Walking Volcano; existing egg stages, lost wings, wizard hat, plasma colours and Hydra heads remain visible. These are visual changes; character IDs, hitboxes and combat values stay the same.


## Cross-network connection fix (v107)
Quick rooms previously overrode PeerJS 1.5.4's RTC configuration with STUN only, removing its built-in public TURN fallback. Quick rooms (including PartyHost) and manual codes now share `onlineRTCConfig()` with the public PeerJS EU/US TURN servers from [the pinned library configuration](https://github.com/peers/peerjs/blob/v1.5.4/lib/util.ts). These are the library's documented public credentials, not an account API key. Direct connections remain preferred by ICE; TURN is available as fallback. This does not guarantee public relay availability or bypass every restrictive network.

Quick connections now use PeerJS BinaryPack serialization so the library fragments large snapshots instead of sending raw oversized JSON messages on SCTP. The room join deadline is 45 seconds to allow relay negotiation. A transient manual WebRTC disconnection has 15 seconds to recover; an actually closed channel still ends the connection immediately. Quick-room ICE interruptions now show a status message. All participants must reload for network build 72. Transport/configuration and regression tests are simulated; separate real internet networks still need verification on user devices.


## Online freeze and guest responsiveness (v108)
The host simulation and guest input used to run exclusively inside requestAnimationFrame. Throttling or pausing canvas frames could leave the guest with a static match and no useful input exchange. A shared `pumpGame` clock now also runs from a 25-ms online timer when frames stop arriving; elapsed time is substepped and capped, and both callers share the same timestamp to prevent double simulation. Offline keeps its previous 35-ms timestep cap. The RAF callback is rescheduled in `finally`. Online focus loss clears held input without automatically pausing everyone's match; offline focus loss still pauses. OS-level browser suspension or a fully closed host cannot be prevented.

Guest input is sent every 25 ms instead of 50 ms. The local guest character bypasses the extra 50/80-ms opponent interpolation and gets a bounded, collision-checked movement preview (at most 24 world units / 80 ms). The preview changes only presentation; the host still decides positions, damage, attack execution and cooldowns. It is disabled for stale state, stun, charging, ice, rooted states, transport/teleports and special movement. Remote characters retain interpolation, and existing latency-balanced perfect-block timing remains. These reduce guest latency; they do not eliminate the host's information or authority advantage. Network build: arena-online-73.

Validation: core/duel/party/parry/timing/relay tests pass. `latency-browser.test.cjs` additionally runs two Chromium pages with the pinned real PeerJS BinaryPack codec and a 60-ms-per-direction message bridge. It verifies guest movement, attacks and authoritative cooldowns, live updates despite focus changes, no browser errors and a 390-px viewport. Before the fix the same test advanced the host clock only ~70 ms during >1.5 s and guest movement failed; after the fix the test passes. This tests real browser event loops/codec with simulated latency, not actual cross-network WebRTC connectivity. Run a local HTTP server on 8000, provide PeerJS 1.5.4's browser bundle via `OVO_PEERJS_PATH` (default `/tmp/peerjs-1.5.4.js`) and run the browser test; `OVO_TEST_URL` can override the page URL.


## Bot planning upgrade (v109)
Bot reaction/action intervals are now Easy 650/750 ms, Normal 300/340 ms, Hard 170/210 ms and Expert 100/130 ms (the existing slight action jitter remains). Health, damage, movement speed and ability cooldowns are unchanged. Aim samples still respect reaction timing; projectile lead uses a speed family and does not extrapolate a large teleport jump. Existing character/card-specific attack scripts and spacing profiles remain.

All arenas now use radius-aware A* routing when the direct approach is blocked, sight is lost or progress stalls. Reusable walkability grids and short-lived paths are cached outside fighter snapshots. Paths can initially move away from the enemy to leave U-shaped traps, smooth only through clear swept segments and account for water/lava costs. The Labyrinth keeps its original flow-field assistance, with the new route planner handling remaining obstructions. `build-tactics.cjs` preserves the runtime planner when rebuilding the historical matchup table.

Threat checks estimate closest projectile approach and reject shots moving away or blocked by cover. Visible charge direction and nearby damaging/warning zones inform candidate escape directions. The planner checks twelve movement directions, checks clearance and compares future danger while retaining the character's preferred range. Dodge uses the planned direction only when the swept route is clear; existing ship/nuclear/sea escape routines remain. These are heuristics, not a guarantee bots never get stuck or dodge every special ability.

Validation: `bot-smarts.test.cjs` checks all six normal arena routes, a U-trap that requires an initial retreat, incoming/receding/covered projectiles, safe dodging, bounded reaction sampling and 274 legal base/card/evolution builds. `bot-browser.test.cjs` runs six Expert bots in Chromium on The Labyrinth for 30 simulated seconds with live combat and periodic canvas renders: every bot leaves spawn, states stay finite and there are no page errors. In this execution its update samples averaged ~2.0 ms, p95 ~4.9 ms, with a ~193-ms maximum including startup/rendering/GC; these are environment-specific samples, not a mobile FPS guarantee. Core, duel and party regressions pass. Historical matchup ratings in STRATEGIES.md were not regenerated and do not measure the new planner's win rates.


## Reproduced multiplayer freeze (v110)
The six-fighter browser test reproduced a second, distinct freeze: guests accepted the first few snapshots, then rejected all later states while the host kept advancing. A bot fighter reached 97/98 object fields after normal decision/render updates; generic `saneState` allowed only 96. This was an arbitrary schema-size rejection, not missing keyboard bindings. The regression fixture recreates the old rejection with real bot state.

`packOnlineFighter` now strips host-only AI decision fields without modifying the host. Generic objects allow up to 256 fields within the existing depth/array/numeric limits and a bounded transport envelope; detailed character, HP, cooldown, owner and map validation remains. Invalid authoritative HP is still rejected in tests.

Quick-room packets use JSON text inside PeerJS's chunked BinaryPack transport, preserving exact JSON numeric/undefined semantics. The envelope cap is 512 KiB of JSON text. Each guest connection has an independent snapshot acknowledgement window of two in-flight states and one replaceable latest state. Obsolete queued states are coalesced, acknowledgements release the next fresh state, old-match/unknown acknowledgements are ignored, and missing acknowledgements expire after 800 ms so the sender can retry the latest state. Control packets still use the reliable channel. Manual WebRTC's separate state channel remains unchanged.

Guests record snapshot receipt/rejection counts for diagnosis, ask for a fresh state on stalls, and display a resynchronization message. Invalid initial match data now displays an error rather than silently ignoring start. All devices must reload for `arena-online-74`.

Validation: `party-freeze.test.cjs` reproduces the old 96-field rejection and checks valid compact six-player snapshots, unchanged host AI state, invalid-HP rejection, bounded ACK queues, coalescing, lost-ACK recovery, independent windows, rematch cleanup and exact JSON numbers. `party-browser.test.cjs` passes with three human browser pages plus bot fill and with six human pages: production QuickPeer/PartyHost parsing and ACK handling, the real pinned PeerJS codec, a 60-ms-per-direction bridged network, every guest's movement/attacks, advancing clocks and zero rejected snapshots/page errors. This is real browser/application testing with simulated transport; actual separate internet routes are still not asserted. Existing full core/duel/party regressions cover draft queues, rematches and disconnect cleanup. Browser test setup is the same as the v108 latency test; `OVO_PLAYERS=3` chooses three pages, default six.


## Kraken sea-body and doubled attacks (v111)
Kraken's body now stays at the port-side water position (95, 550), outside the walkable deck, with bobbing, sea tint and foam ripples. Ship-side water is also classified as water by terrain queries. The body rejects direct damage, sword hits and incidental combat damage. Only the existing golden-paddle strike against a live exposed tentacle transfers damage to the boss. The damage gate checks the exact live tentacle in the exposure list, not an arbitrary option flag. The paddle keeps its 32 damage/1.05-s cooldown; a tentacle hit flashes gold. Exposed tentacles relocate away from mast/crate obstacles to free deck positions.

Each of the nine existing patterns emits exactly twice its previous number of attacks (including doubled low-health bonus attacks). Every follow-up has a separate mirrored/offset marker and an additional 0.65-s warning delay. Existing >=2-s Kraken warnings and the wait for all pattern warnings to finish remain; this increases attack count without silently shortening the established reaction windows.

Validation: Kraken-specific damage/geometry/count regression, Harbor, Kraken story, ship visuals, Adventure and time-reward tests pass. A real Chromium test checks water position, body immunity, actual Paddle Strike damage and twelve visible warnings for the ink pattern; canvas inspected in `kraken-water-review.png`, no page errors. Story-skip fixtures now finish Kraken through a genuine exposed tentacle instead of unrestricted body damage.


## The Olympians’ harbor home (v112)
Vasta, Latissa and Solea now live with Sailer in a house in Flooded Harbor. The existing harbor building beside the lanterns has a visible roof, windows, locked/open door and interaction marker. Before Sailer’s invitation it stays locked. After the Kraken rescue, finishing the on-deck conversation offers **SAILER · OPEN THE HOUSE** and returns the player to its doorstep. The player can enter through the door or accept Sailer’s invitation at the dock. There is no new boat voyage or key loan; `beginOlympiansVoyage` remains only as a stable internal dialogue entry point.

The interior is the existing safe Olympians chapter, now rendered as a wooden harbor house with shared table, bed, rugs, pipe shelf, stove and Latissa’s basin. Furniture/room collision matches the drawn obstacles. All three Olympians and Sailer are present. Sailer’s exit returns to the same harbor doorstep. The friendly wager, three-stage trial and time-rift reward to Engin remain accessible from the house; the greeting recognizes the rescue and their shared home.

Invitation persistence uses an additive `one-vs-one-olympians-house` save flag, with legacy checkpoint >=3 retaining access. Developer/test runs do not write it. Validation: dedicated locked-door/rescue/invitation/entry/exit/key/save/legacy/developer tests, existing Harbor/Kraken story/Olympian trial/time-reward regressions, and a Chromium test clicking the actual invitation and entry/exit buttons. Exterior and full-interior canvas captures were inspected with no page errors.


## Engin's machine room (v113)
Olympians Adventure boss damage is reduced by 15%, without changing Arena combat or trial HP. Engin lures the outsider into a locked machine to use their life to escape the arena. The Player opens an escape with Door Man's key; this starts the fight. Three phases follow: Reactor (beam, self-destruct without self damage, two-bounce orb), Beast (rush, slam, leap), and desperate Uranium V2 (wide beam, meltdown, four-bounce explosive orb). Telegraphs match collision and provide attack recovery windows. Player lives, potions and phase progress survive revives; phase changes preserve resources and clear hazards.

Engin gradually realizes his wounds will not heal and the outsider can truly kill him. Winning leaves persistent remains in the workshop, rather than a living respawned NPC. Developer wins do not save progression. Validation: dedicated story, phase, hazard, revive, save and damage tests; Olympian trial, harbor-house and time-reward regressions; Chromium exercised the actual workshop button, trap/key escape, all three forms and post-fight remains without page errors.
