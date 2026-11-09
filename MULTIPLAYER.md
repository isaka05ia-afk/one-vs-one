# Träning, sikte och flerspelarlägen · v61

## Spela

Välj **Spelformat**: 1v1, 1v1v1, 1v1v1v1, 2v2 eller 3v3.

- **Offline / Mot bot:** exakt en människa; alla andra platser är botar med slumpade karaktärer och vald svårighetsgrad. Valet för två på samma tangentbord visas inte i menyn.
- **Online:** värden väljer format och skapar en fyrsiffrig kod. Alla gäster ansluter med samma kod; de behöver inte välja samma format i förväg. Lobbyn visar spelarnummer och lag. Blå/röd är lag; i alla-mot-alla är varje plats ett eget lag.
- **Fyll lediga platser med botar:** värden kan starta med färre människor, även ensam. En botkaraktär kan väljas per ledig plats eller slumpas. Med botfyllning avstängd krävs att alla platser är upptagna innan start.
- Värden startar matchen. Gästerna styr var sin plats; de kan inte välja vilket spelarnummer ett kommando ska styra.

Varje gäst har en direkt anslutning till värden. Värden kör spelmotorn och skickar tillstånd till alla gäster. Värdens flik måste vara öppen. PeerJS används för att hitta rummet; ingen ny spelserver behöver installeras. Manuella reservkoder behålls för vanliga 1v1-rum utan botfyllning. Flerpersonsrummen använder fyrsiffrig kod.

Om en gäst kopplar från tar en bot över när botfyllning är på. Annars slås platsen ut. Om värden lämnar avslutas anslutningen för gästerna. Återanslutning under pågående match och byte av värd ingår inte. En match med saknade människor och botfyllning av kan inte startas om med tomma mänskliga platser; skapa ett nytt rum.

## Rundor och lag

En utslagen spelare kan följa resten av ronden. Den sista levande spelaren/det sista levande laget vinner. Vid tidsgränsen jämförs lagets kvarvarande HP med lagets sammanlagda max-HP. Lika resultat ger oavgjort.

Quick Match är en rond utan kort. Övriga format spelas till tre rondvinster, med högst fem rundor. Om ingen nått tre efter fem rundor avgör antalet vinster; delad högstapoäng ger oavgjort. Lagkamrater får samma rondpoäng. Förlorande spelare väljer kort i turordning, botar väljer automatiskt. Alla behåller gränsen på två kort och kan hoppa över.

Vanliga skadeattacker och spawns träffar fiender. Jollen och Paper kan fånga och flytta lagkamrater utan skada. Whirlpool och Gravity Well kan dra även lagkamrater utan att skada dem. Vanliga portaldörrar delas inom laget; familjedörrar är fortfarande skjutplatser. Reaktorstrålen och Tractor Beam gör 25 % skada på lagkamrater; Tractor Beam drar bara fiender. Lagkamraters livmätare visas blå från varje spelares perspektiv. Koner, strålar och explosioner kan träffa flera fiender. Yogas cirkel kan läka lagkamrater. Engins egna orber och egen radioaktivitet kan fortfarande skada honom; fientliga kopior fortsätter vara fientliga mot alla. Kids Pools regler gäller även vuxna lagkamrater.

## Sikta före skott

**Sikta före skott** är på från början och kan stängas av i Inställningar.

- Håll en attackknapp: räckvidd/riktning visas. Släpp: använd attacken.
- Dator: sikta med musen och håll/släpp attacktangenten eller vänster musknapp.
- Mobil: tryck snabbt för autosikte mot en synlig fiende om det finns någon. Dra från attackknappen för manuellt sikte, eller använd höger spak och släpp.
- Avbruten pekgest, förlorad pekfångst, paus eller byte av inställning avbryter utan skott.
- No Pain laddas samtidigt och behåller sin 0,8-sekundersgräns/HP-kostnad.
- Attackens riktning skickas med själva kommandot. Ett senare autosiktespaket får inte ändra en redan släppt attacks riktning.

## Träningsbana

Välj **Träningsbana** under Spelläge. Välj karaktär, dummykaraktär, upp till två lagliga kort i valordning och rond/drakstadium 1–5. Dummyn kan stå still, röra sig eller slåss. Odödlighet för spelare och dummy kan stängas av; ingen cooldown är ett separat val. Skada/träffar/DPS visas och **Återställ träning** tömmer effekter och börjar om med samma inställningar och karta. Träningen har ingen tidsgräns eller kortdraft.

## Testning

Kör:

```
node test.cjs
node online.test.cjs
node arena.test.cjs
node party.test.cjs
```

Den gamla förmåge-/kort-/kontrollsviten och tvåklientssviten behålls. Nya tester omfattar alla format offline/online, sex separata klienter, botfyllning på/av, separat input/attack/kortbehörighet, utslagning och lagseger, seriella förlorarkort, rematch, botövertagande, snapshots med ägare över index 1, release-/dragsikte inklusive nätverksordningsfelet, No Pain, träning och säkra träningsstarter på alla sex kartor. Dessutom körs 174 femsekunders sexbotssimuleringar: grunduppsättningar, alla singelkort och alla lagliga ordnade kortpar.

Testerna kör den riktiga spelmotorn med simulerad DOM/canvas. WebRTC/PeerJS-transporten är simulerad. Chromium kunde inte starta i denna miljö (`setsockopt: Operation not permitted`, SIGTRAP), så grafiskt mobiltest, faktisk FPS och anslutningar över riktiga internetnät har inte verifierats här. Strategirapporten från v59 avser dueller; den är ingen ny balansmätning av 3v3.

## Laores balans och terräng · v61

HP, fart, cooldowns och rundutveckling behålls. Attackskadan jämfört med v60 skalas till 80/90/100/115/125 procent i form 1–5, inklusive motsvarande magi-/plasmaattacker. No Time to Wait använder fortfarande Elder-formen direkt och behåller åldrandet. Inferno och Plasma Beam kan riktas om under sin ensekundsuppladdning, även via gästens mus/högerspak.

Skapad is och skapade pooler använder samma terrängfråga som banans is och vatten, oavsett vem som skapade dem. Det ger vanlig glidning, skridskoåkarens isbonus och vatteneffekter även på lagkamrater; Sailer och simmaren behåller sina vattenundantag. Utgångna fläckar räknas inte. Yogas Healing Circle läker alla levande, markbundna lagkamraters aktiva karaktär inom fältet.

Nya tester: `node teamplay.test.cjs` och `node teamplay-online.test.cjs`. De täcker lagkamraters transport, grepp, virvel, portaler, livfärg, reducerad reaktorträff, is-/vattenregler, lagläkning och riktning under laddning med fyra simulerade onlineklienter.
