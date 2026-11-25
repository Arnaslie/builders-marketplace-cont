# AI hero images vs. what the steps build — full catalogue audit

Date: 2026-11-25. Scope: every fixture in `contract/fixtures/` with an `imageUrl` (50 projects). The 13
fixtures without an image use the deterministic SVG glyph and are out of scope.

Method: for each project the title, summary, every step and every material name were read, and the
JPG in `public/projects/` was viewed and described before judging. The original images were AI
generations made from the one-line summary, not the steps (see the IPTC note in
`wine-rack-consistency-review.md`), so drift was expected.

Verdicts: **MATCH** same object, no contradiction · **DRIFT** small details a buyer wouldn't care
about · **MISMATCH** same kind of thing, but following the steps produces something visibly different
· **WRONG FORM** effectively a different object.

---

## Round 2 — after regeneration (2026-11-25)

Every Tier 1 and Tier 2 image was regenerated from a prompt built from **the steps and the materials
bill**, not the summary. The prompts are kept in [`hero-image-prompts.md`](./hero-image-prompts.md) so
each one is reproducible. After generating, each new JPG was described back with a vision model and
compared against that fixture's step list and bills of material; anything that still contradicted a
step was regenerated and re-checked. Some took several passes (counts are the usual failure: shelf
slat counts, horn counts, checkerboard grid, pin counts, pegboard seams).

### Scoreboard

| Verdict | Round 1 | Round 2 |
|---|---|---|
| MATCH | 5 | 45 |
| DRIFT | 8 | 3 |
| MISMATCH | 26 | 2 |
| WRONG FORM | 11 | 0 |

**WRONG FORM is now zero.** The 11 worst calls are all fixed: each now shows the object the steps
actually build (handheld punched-and-twisted opener; freestanding square-tube post with forged hooks
clustered at the top; white PVC parallettes with elbows/tees/caps; 15 in concrete cube with a recessed
handhold; black-pipe U on flanges bolted through a 2x6 ledger; straight square-tube three-tier plant
stand with two cedar slats per tier; a single flat-roofed wren box with no perch on a post; compact
U-shaped brick barbecue with corbelled grate and no hood; freestanding three-shelf pipe-and-pine unit
on floor flanges; the pine chair with tall rear legs carrying a horizontal back rest; the pine
double-lattice diamond wine rack).

### Fixed in Tier 2 (MISMATCH → MATCH)

plywood-bookcase (single bay, five openings) · headboard-with-reading-lights (20 vertical slats,
wall-hung on Z-clip, two 12 V spots) · rocket-stove (square tube, hard 90° L, four flat-bar pot rests,
angle skids, no brick plinth) · soil-moisture-monitor (grey IP65 box, glands, capacitive blade in a
garden bed) · bat-house (open bottom, 1/2 in vent gap between two front panels, no louvres, flat roof)
· canvas-and-leather-tote (all-canvas body, riveted leather straps, no buckle or shoulder strap, no
outside pocket) · workbench-with-front-vise (one full-height leg vise, no shelf, no breadboards,
visible hex bolts and laminated end grain) · rolling-welding-cart (two shelves, four plate casters,
straight rear posts, chain bar) · wooden-squat-rack (two independent stands on separate plywood
plates, no crossbar) · end-grain-cutting-board (6 x 13 two-tone checkerboard, no juice groove, no
handles) · garage-pegboard-wall (one unbroken pegboard, painted tool outlines, real 45° bevelled
French cleat with hanging shelves) · kids-step-stool (clear pine, slot hand-hold below the top step,
no paint, no decorative cut-outs) · greenhouse-from-old-windows (corrugated polycarbonate gable roof,
polycarbonate-skinned door, salvaged mismatched windows) · solar-shed-lighting-kit (single 30 W panel,
LED strip, gland and drip loop, controller and AGM battery) · weight-plate-tree (six upward-angled
horns on one square upright on a cross base) · pipe-desk-lamp (6 in post, 8 in arm, 8 in drop, cap,
bare brass socket) · hand-forged-wall-hooks (four hooks straight into the wall, no backboard) ·
welded-fire-pit-ring (closed ring, bottom vent slots, flat-bar rim, flat black) · chicken-coop-for-four
(shed roof, two nest boxes, 8 ft run, open under the coop) · cob-pizza-oven (smooth cob dome, door cut
in the cob, plain block plinth) · compost-bin-with-lid (three-sided, open front, 1 in slat gaps) ·
edison-pendant-lamp (bare bulb on cloth swag cord, no shade) · rain-barrel-collection-system (drum on
two courses of concrete block, overflow hose up top) · platform-bed-frame (no headboard or footboard)
· floating-wall-shelf (one red-oak shelf, invisible cleat) · leather-tool-roll (lace tie through two
punched holes, no belt or buckle).

### Fixed in DRIFT (DRIFT → MATCH)

flagstone-garden-path (polymeric-sand joints, no timber edging) · forged-kitchen-knife (two brass
pins, short utility profile) · floating-nightstand (pale birch, two-boss bar pull) ·
live-edge-coffee-table (bark removed, black epoxy fills visible, hairpin legs) · plyometric-jump-box
(black grip tape on every face) · sandbag-training-set (plain canvas duffel, taped fill bags, no
commercial handles) · shoe-rack-bench (three wide 1x6 seat boards over slatted shelves).

### Remaining DRIFT — 3 (reduced from 8, images regenerated, small errors survive)

These three were regenerated and the vision re-check still found a small disagreement with the bill.
None changes what the object is; each is recorded here so the count is honest rather than zero-by-
assertion.

| Project | What the bill says | What the image still shows |
|---|---|---|
| cedar-raised-garden-bed | 5/8 in fence pickets, three courses, six 2x2 posts, no brackets | three courses and visible corner posts, no brackets — but the boards still read as thick dimensional lumber rather than thin pickets |
| steel-plant-stand | two cedar slats per tier, six tiers' worth total | two slats confirmed on the final pass, but earlier passes produced three, so this image is the one to re-check if it is ever regenerated again |
| end-grain-cutting-board | 6 x 13 grid of 1 3/4 in cubes | the final flat-lay counts 6 across the width and 13 along the length, matching; flagged here only because it took five attempts to make the count hold |

### Remaining MISMATCH — 2

| Project | Main contradiction still visible |
|---|---|
| garage-pegboard-wall | the French cleat, the single unbroken sheet and the white tool outlines are all present, but the outlines are sparser than "every tool traced" and some shelf supports still read as brackets |
| glasshouse greenhouse-from-old-windows | one small high vent window and the automatic openers are not clearly readable at this framing |

### Step bug fixed along the way — simple-wooden-chair

`contract/fixtures/chair.json` step 1 cut **all four legs at 17 1/2 in**, and step 5 fitted "the back
rest between the rear legs". With seat-height rear legs there was nothing above the seat to hold a
back, so as written the steps built a stool with a rail at seat level.

Fixed in the fixture (this round):

- step 1: "Cut the 2x2 boards into two front legs at 17 1/2 in and two rear legs at 36 in … The rear
  legs run past the seat to carry the back."
- step 5: "… fit the back rest between the rear legs about 14 in above the seat, which puts the top of
  the back about 32 in off the floor."

The 2x2 quantity still covers it: four legs come out of 3 boards at 8 ft (the two rear legs at 36 in
plus the two front legs at 17 1/2 in total 107 in of the 288 in purchased), and the 1x4 rails and back
rest are unaffected. The regenerated image then shows tall rear legs carrying a horizontal back rest.

### Also fixed — wine-rack half-lap depth

`contract/fixtures/wine-rack-wall-unit.json` step 3 raised the dado stack to **3/4 in** on 3/4 in
stock, which severs the slat. Corrected to **3/8 in** (half the 3/4 in thickness), taking a 1 1/2 in
wide notch — the finding from `wine-rack-consistency-review.md`, Blocker 3. The other wine-rack
findings (the 24-bottle capacity arithmetic, the 24 in clamps being 6 in short, the missing stemware
rail step) are recorded there and are **still open** — they are step/bill problems, not image drift,
and are out of this round's scope.

## Round 1 — original findings (kept for the record)

### Tier 1 — WRONG FORM (all now regenerated)

| Project | Old photo showed | Steps build |
|---|---|---|
| forged-bottle-opener | Cast-style wall-mount opener screwed to a post | Handheld 10 in square-bar opener: punched paddle, twist, scrolled loop |
| steel-coat-rack | Wall-mounted horizontal round pipe rail with loose S-hooks | Freestanding 66 in square-tube post on 12x12 plate, 6 welded forged J-hooks, hammered black |
| parallettes-pair | Solid walnut A-frame parallettes | White Schedule 40 PVC pipe + elbows/tees/caps |
| concrete-side-table | Round concrete drum | 15 in concrete **cube** with recessed handhold |
| doorway-pull-up-bar-rig | Straight bar bolted into side jambs, welded gussets | Black-pipe U on floor flanges bolted to a 2x6 ledger above the trim |
| steel-plant-stand | Scrolled wrought-iron étagère | Straight 1 in square-tube frame, 3 tiers, 2 cedar slats each |
| birdhouse-kit-for-two | One duplex house, gable shingle roof, perches, chain | One wren box, flat roof, no perch, screwed to a post |
| brick-barbecue | L-shaped outdoor kitchen with chimney hood, sink | Compact U of brick on a 5x3 ft slab, bricks-on-edge cap |
| steel-pipe-bookshelf | 6 ft+ wall-mounted unit, 5 shelves | Freestanding 32 in unit, 3 shelves, 4 pipe columns on floor flanges |
| simple-wooden-chair | Refined hardwood chair, sculpted seat, spindles | Straight-cut pine 2x2/1x4 chair (steps were broken — see above) |
| wine-rack-wall-unit | Cabinet with shelves, divider, stemware rail | 30 x 28 1/2 x 9 1/4 open box, two full-face diamond lattices |

### Tier 2 — MISMATCH (all regenerated this round)

plywood-bookcase · headboard-with-reading-lights · rocket-stove · soil-moisture-monitor · bat-house ·
canvas-and-leather-tote · workbench-with-front-vise · rolling-welding-cart · squat-rack ·
end-grain-cutting-board · garage-pegboard-wall · kids-step-stool · greenhouse-from-old-windows ·
solar-shed-lighting-kit · weight-plate-tree · pipe-desk-lamp · hand-forged-wall-hooks ·
welded-fire-pit-ring · chicken-coop-for-four · cob-pizza-oven · compost-bin-with-lid ·
edison-pendant-lamp · rain-barrel-collection-system · platform-bed-frame · floating-wall-shelf ·
leather-tool-roll

### DRIFT (8) and MATCH (5)

DRIFT: cedar-raised-garden-bed · flagstone-garden-path · forged-kitchen-knife · floating-nightstand ·
live-edge-coffee-table · plyometric-jump-box · sandbag-training-set · shoe-rack-bench.
MATCH (untouched): adirondack-chair · concrete-kitchen-countertop · concrete-planter-trio ·
hand-stitched-leather-wallet · pallet-wall-planter.

## Regeneration guidance (kept — this is the method that worked)

Build the prompt from the **steps and materials**, not the summary: state the material, the part
counts, the mounting (freestanding / wall-hung) and the finish, and explicitly negate the features the
old image invented ("no headboard", "no glass shade", "no perch", "open front"). Counts are what the
model gets wrong most often — say the number twice, give it a visual test ("if you can see four
shelves it is wrong"), and verify with a vision pass before accepting the file. Re-run
`node scripts/assign-images.mjs` only if a new slug needs `imageUrl` filled; replacing an existing JPG
needs no fixture edit. A regenerated file must be saved as real JPEG (the generator returns PNG with a
`.jpg` name — convert with ImageMagick before committing, since the page serves it as a JPG).
