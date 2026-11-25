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

## Round 3 — drift closed (2026-11-25)

Round 3 regenerated the five images Round 2 could not clear and generated real hero photos for the
thirteen fixtures that had been left on the deterministic SVG tier, so the whole catalogue is now on
the photo tier. Same method throughout: prompt built from **the steps and the materials bill**, then
`image_analyze` on the result against that fixture's step list, regenerating until the description
contradicted no step. The prompts are kept verbatim in
[`hero-image-prompts.md`](./hero-image-prompts.md).

### Scoreboard

| Verdict | Round 1 | Round 2 | Round 3 |
|---|---|---|---|
| MATCH | 5 | 45 | 63 |
| DRIFT | 8 | 3 | 0 |
| MISMATCH | 26 | 2 | 0 |
| WRONG FORM | 11 | 0 | 0 |

**All three counts are zero.** The five Round 2 hold-outs are described above; the thirteen SVG-tier
projects moved to MATCH with their new photos (they previously carried no photo verdict at all).

### Round 3 — the five regenerated

cedar-raised-garden-bed · steel-plant-stand · end-grain-cutting-board · garage-pegboard-wall ·
greenhouse-from-old-windows. See the two tables above for the before/after on each.

### Round 3 — the thirteen new photos (SVG tier → photo tier)

cedar-gate · cedar-planter-boxes · closet-wardrobe-rack · corner-workbench · dog-food-stand ·
floating-shelves · garden-storage-bench · kids-chalk-table · magnetic-spice-rack · pegboard-tool-rack ·
potting-bench · shoe-shelf · tomato-cages

Each was prompted from its own step list and bill of material, and each JPG was installed with
`node scripts/assign-images.mjs --backfill`, which wrote the `imageUrl` into the fixture. The
deterministic SVG glyph is still in the codebase and still renders for any future fixture without an
`imageUrl`; it is simply unused by the current catalogue.

**WRONG FORM is zero.** The 11 worst calls are all fixed: each now shows the object the steps
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

### Remaining DRIFT — 0 (was 3)

All three were regenerated again and cleared on the vision re-check.

| Project | What the bill says | What the previous image showed | What the new image shows |
|---|---|---|---|
| cedar-raised-garden-bed | 5/8 in fence pickets, three courses, six 2x2 posts, no brackets | three courses and visible corner posts, no brackets — but the boards read as thick dimensional lumber rather than thin pickets | three thin pickets per wall, a narrow 5/8 in top lip, folded hardware-cloth rim showing above the soil, six flush 2x2 posts, no brackets |
| steel-plant-stand | two cedar slats per tier, six tiers' worth total | two slats on the final pass, but earlier passes produced three | 3 tiers x exactly 2 cedar slats, one central seam per tier, square tube, plastic leg caps |
| end-grain-cutting-board | 6 x 13 grid of 1 3/4 in cubes, no juice groove | counted 8 x 12 with routed juice grooves on both long edges | 13 squares along the length x 6 across the width, flat face, no groove, no handles, rubber feet |

### Remaining MISMATCH — 0 (was 2)

| Project | Contradiction in the previous image | What the new image shows |
|---|---|---|
| garage-pegboard-wall | the French cleat, the single unbroken sheet and the white tool outlines were present, but the outlines were sparser than "every tool traced" and shelf supports read as brackets | one unbroken 8 x 4 ft sheet on visible pine furring strips with finish washers, ~20 tools each traced in white plus empty outlines, three shelves hung on a 45-degree bevel read in profile at the near end, no metal brackets |
| greenhouse-from-old-windows | one small high vent window and the automatic openers were not clearly readable | two top-hinged high vents propped open, each with a visible solar wax-cylinder automatic opener, corrugated polycarbonate gable roof, mismatched salvaged sashes, polycarbonate-skinned door on deck piers |

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

## Projects on the SVG tier — none left

Before Round 3, 13 published fixtures had no `imageUrl` and no JPG in `public/projects/`, so the page
drew the deterministic SVG glyph — a blueprint generated from the project's own steps, so it cannot
drift the way the summary-prompted photos did. Round 3 generated a photo for every one of them and
`node scripts/assign-images.mjs --backfill` wrote the `imageUrl` into each fixture. Current state:

```
node scripts/assign-images.mjs
  fixtures scanned : 63
  photo tier       : 63  (have a public/projects JPG)
  free tier        : 0   (deterministic SVG, zero cost)
```

The glyph tier is kept in the codebase (`components/project-image.tsx` falls back to
`ProjectImageIcon` whenever `imageUrl` is null), so a newly added fixture still renders a visual at
zero cost. It is simply unused by the current 63.

| Slug | Title |
|---|---|
| cedar-gate | Cedar Garden Gate |
| cedar-planter-boxes | Cedar Planter Boxes |
| closet-wardrobe-rack | DIY Closet Wardrobe Rack |
| corner-workbench | Corner Workbench |
| dog-food-stand | Raised Dog Bowl Stand |
| floating-shelves | Floating Shelf Trio |
| garden-storage-bench | Garden Storage Bench |
| kids-chalk-table | Kids' Chalk Table |
| magnetic-spice-rack | Magnetic Fridge Spice Rack |
| pegboard-tool-rack | Pegboard Tool Rack |
| potting-bench | Potting Bench |
| shoe-shelf | Entryway Shoe Shelf |
| tomato-cages | Homemade Tomato Cages |