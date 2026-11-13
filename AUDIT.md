# Combat audit

Real engine; mocked DOM/canvas; seeded RNG; 20 Hz; 25-second quick rounds; each configuration vs all six base rosters at the same round; all six maps rotated; alternating sides; three spacing policies; expert difficulty. Opponents have no cards. Wins at timeout use remaining HP fraction, matching game rules. These are comparative samples, not proof of optimal play. Visual/mobile/WebRTC behavior requires separate browser testing.

278 configurations, 5004 matches. Every roster has exactly five card families. Selfish participant choices belong to one family. Ordered pairs and all five dragon rounds are included.

## BOB

Cards: cheter, big_hands, gloves, jacket, full_name.

Best sampled configurations (out of six opponents each):

- gloves + full_name; round 3; rush; 6/6; mean HP margin 0.788
- gloves + big_hands; round 3; kite; 6/6; mean HP margin 0.787
- cheter + gloves; round 3; adaptive; 6/6; mean HP margin 0.700

## DOOR MAN

Cards: hotel, late, magic, family, no_speed.

Best sampled configurations (out of six opponents each):

- magic + family; round 3; rush; 6/6; mean HP margin 0.546
- magic; round 3; adaptive; 6/6; mean HP margin 0.448
- family + hotel; round 3; rush; 6/6; mean HP margin 0.420

## LAORES THE DRAGON

Cards: lizard, studied, no_wait, toothless, hydra.

Best sampled configurations (out of six opponents each):

- no_wait + studied; round 1; kite; 6/6; mean HP margin 0.867
- studied + toothless; round 5; adaptive; 6/6; mean HP margin 0.787
- no_wait + lizard; round 2; kite; 6/6; mean HP margin 0.781

## ENGIN

Cards: heavy_armor, uranium_v2, veins, infected, magic_tech.

Best sampled configurations (out of six opponents each):

- uranium_v2 + heavy_armor; round 3; adaptive; 6/6; mean HP margin 0.735
- uranium_v2; round 3; kite; 6/6; mean HP margin 0.664
- heavy_armor + uranium_v2; round 3; rush; 6/6; mean HP margin 0.596

## OLYMPIC TEAM

Cards: selfish, so_power, too_old, kids, no_pain.

Best sampled configurations (out of six opponents each):

- too_old + selfish_runner; round 3; adaptive; 6/6; mean HP margin 0.641
- selfish_runner + too_old; round 3; adaptive; 6/6; mean HP margin 0.514
- selfish_swimmer + kids; round 3; adaptive; 6/6; mean HP margin 0.214

## SAILER

Cards: my_home, capten, canons, real_ship, drunk.

Best sampled configurations (out of six opponents each):

- canons + drunk; round 3; kite; 6/6; mean HP margin 0.725
- capten + canons; round 3; rush; 6/6; mean HP margin 0.668
- canons + capten; round 3; kite; 6/6; mean HP margin 0.565

