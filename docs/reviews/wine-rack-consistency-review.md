# Wine Rack Wall Unit — instructions vs finished product

Reviewed page: https://builders-marketplace-cont.vercel.app/projects/wine-rack-wall-unit
Source of truth: `contract/fixtures/wine-rack-wall-unit.json` (the page renders this file; the deployed
image is byte-identical to `public/projects/wine-rack-wall-unit.jpg` — md5
`084be35331d1ec664795aac63c5b4901`, confirmed with curl: HTTP 200, same hash).
Prices read live from the rendered grid and cross-checked against `contract/prices.json`.

**Verdict: not safe to publish as-is. The steps and the photo describe two different objects, and one
instruction severs the stock.** The Commander's suspicion is confirmed: the glass holders exist only in
the photo — they are in no step and in no line item.

## Blocker 1 — The photo is not the object these steps build
`contract/fixtures/wine-rack-wall-unit.json:12-16` build a 30 × 28 1/2 × 9 1/4 in open box with **two
full-face 45° diamond lattices**, front and back. That is a square-ish panel of nothing but bottle
cradles.

The photo (`public/projects/wine-rack-wall-unit.jpg`, 1200 × 896) shows a different cabinet:
- top shelf, then an upper cubby row split by a divider (holds a canister, cigar box, corkscrew, plant);
- a mid shelf;
- diagonal cradles only in the **left and right side bays**, ~4 per bay, one lattice layer visible;
- an **open centre** where five bottles stand upright on the shelf, no lattice behind them;
- a **stemware rail** under the bottom board.

Carcass measures ≈ 670 × 568 px outer — roughly 1.2 : 1 wide against the fixture's 1.05 : 1 box. The
ratio alone is the weakest part of this finding; the arrangement is the decisive one. There is no
sequence of steps 1-5 that yields shelves, a divider, side bays, a centre void and a rail, and no
quantity of 1x10 in the bill (2 boards = 12 ft) covers a top, a mid shelf and a bottom.

Context: the file carries an IPTC `trainedAlgorithmicMedia` / `photoshop:Credit="Made with Google AI"`
XMP block — it is an AI illustration generated from the one-line summary, not from the steps. "Match the
photo" is therefore a spec decision, not a build claim.

**Fix (pick one):**
- (a) Rewrite the steps to the illustrated object — carcass with top/mid/bottom plus a centre divider,
  side bays carrying the diagonal cradles, plus the stemware rail — and grow the 1x10 line to 4 boards;
  or
- (b) Regenerate the image from the current steps (single square lattice box) and keep the steps.
  Either way the species problem in Blocker 5 must be settled.

## Blocker 2 — The glass holders are in no step and no line item (Commander's hunch, confirmed)
The photo's underside rail: a full-width track of sliding wooden spacer blocks carrying roughly 12-14
glasses hung inverted by their bases, stems dropping through the gaps. (I cropped and upscaled the rail
band; the exact block count is not reliably countable from this render, so I am not asserting one.)

`grep -rniE "stemware|wine glass|glass holder|glass rack|spacer block" contract/` returns **nothing**.
Steps 1-5 never mention it. No line item builds it.

**Fix:** add a step, e.g.
> "Cut fourteen 2 1/2 x 1 1/2 in spacer blocks from 1x2 offcuts. Screw them to the underside of the
> bottom board on 3 in centres, 1/2 in back from the front edge, so the gaps take a glass base and the
> stems hang free. Hang one glass and check the fit before the last four go on."

The 8 × 1x2 boards are already fully committed to the lattices (see Blocker 4), so if the lattices stay
full-face this rail needs its own line item — a third 1x2 board, or one 1x3.

## Blocker 3 — The half-lap depth is a through-cut
`:14` "dado stack raised to 3/4 in (half the 1 1/2 in slat width)".

On 1x2 stock (3/4 in thick × 1 1/2 in wide) a half-lap is **3/8 in deep** — half the *thickness* — and
**1 1/2 in wide**. Raising the blade 3/4 in on 3/4 in stock cuts the slat clean in half. Steps 1-5 as
written cannot produce a joint that "presses together by hand".

**Fix:** "with the dado stack raised to 3/8 in (half the 3/4 in slat thickness), taking a 1 1/2 in wide
notch to match the mating slat."

## Blocker 4 — "24 bottles" cannot follow from "4 1/2 in grid", and the board count is knife-edge
`:13` "45 degrees on a 4 1/2 in grid" + `:6` "holds 24 bottles", interior face 28 1/2 in square
(812.25 sq in). With slat pitch p, the clear opening across the diamond is p√2 − 1.5 in.

| reading of "4 1/2 in grid" | pitch | clear opening | cells per lattice | 1x2 needed (2 lattices) |
|---|---|---|---|---|
| slat centrelines (most natural) | 4.50 in | 4.86 in | ~40 | ~60 lin ft |
| clear opening measured 4 1/2 in | 4.24 in | 4.50 in | ~45 | ~64 lin ft |
| pitch that yields exactly 24 | 5.82 in | 6.73 in | 24 | ~44 lin ft |

Every reading misses 24. The two natural readings give about 40 cradles per lattice — a buyer who reads
"24 bottle" and lays out on 4 1/2 in centres builds a rack that holds 40, in a box the bill barely
covers: the clearest readings consume 60-64 of the **64 linear feet** purchased, with zero allowance for
the 45° end trimming that `:15` then requires. "4 1/2 in grid" is also undefined — "grid" appears
nowhere else in the contract, so a reader has no convention to fall back on.

**Fix:** state pitch and capacity together and make the board count follow, e.g. "on 5 13/16 in centres
— 4 5/16 in clear openings, 24 cradles per lattice" (that reading needs 7 boards, so the 1x2 line drops
from 8 to 7, freeing the offcut board the stemware rail wants). Add "grid = slat centre to slat centre".

## Blocker 5 — The photo's material is not the bill's material
The rack in the photo is dark walnut/oak hardwood with a visible figure and warm brown tone; `:21` and
`:42` specify "common pine" and "select pine", finished with "natural" Danish oil. Pine with natural oil
comes out pale straw-coloured. The hero image therefore advertises a piece the listed materials cannot
produce. Settle it with Blocker 1: either change the species on the bill (stain or walnut stock, and
then the cost re-fetches) or generate a pine-coloured image.

## Blocker 6 — The clamps are 6 in too short for the first glue-up
`:12` glues up a 30 in wide box; `:133` buys "24 in bar clamps, 2 pack" (live grid: WEN Quick-Adjust
Steel Bar Clamps 2-pack, $31.58). A 24 in bar clamp has about 24 in of reach — 6 in short of the 30 in
top/bottom joints and 4 1/2 in short of the 28 1/2 in side joints. Nothing in steps 1-5 can be clamped
with the tool the bill sells.

**Fix:** "36 in bar clamps, 2 pack" (the price cache needs a re-fetch; the line id stays).

## Nits (optional)
- `:14` a 1 1/2 in wide notch is two passes for most 8 in dado stacks (typically 3/4-13/16 in wide).
  One sentence stops the user thinking their stack is broken. Related: two lattices at ~40 cells means
  ~160 crossings, ~320 dado passes — `:8` "6 hours" is optimistic before glue-up, sanding and two coats.
- `:15` front lattice flush, back lattice 1 in in from the back edge leaves 8 1/4 in between cradle
  centrelines inside a 9 1/4 in deep box. A 750 ml bottle is 11 1/2-12 in long, so it must overhang the
  front face by 3 1/4-3 3/4 in — unlike the photo's recessed bays. "So each bottle rests on both" is
  true; the consequence is worth one clause.
- `:126` 1 pt of Danish oil for "two coats" on ~53 sq ft of surface (slats ~21, carcass ~20, interior
  ~11) — two coats is ~106 sq ft against roughly 25-30 sq ft per coat per pint. **Arithmetic only, not
  verified against a can label.** The live line is $49.99 for a *1 gal* can, which contradicts the
  fixture's "1 pt" — the label and the price disagree, which is its own small alarm.
- The materials list has no applicator (rag or brush) for the finish.

## Checked and clean (no finding)
- Cart arithmetic verified independently against the live grid: 17 line items; $173.01 materials +
  $863.94 tools = **$1,036.95**; the 4 `ownedDefault` rows carry $0.00; by-retailer subtotals
  (truevalue 729.99, lowes 115.82, Home Depot 75.26, menards 53.49, bestbuy 50.90, officedepot 11.49)
  sum to the total. Quantity×unit price is applied correctly (1x10 × 2 = $27.96, 1x2 × 8 = $31.84).
- 1x10 quantity is right for the box as written: 30 + 30 + 28 1/2 + 28 1/2 = 117 in against 144 in
  purchased — and 28 1/2 is the correct side length for butt joints in a 30 in box.
- An 8 in dado stack in a 10 in jobsite saw is a normal pairing.
- "Miter gauge at 90 degrees" is correct — the notch is cut square across the slat even though the slat
  sits at 45° in the finished lattice.
- No `wine-rack` test exists; `npx vitest run` gives 74/74 passing across 8 files, none of which touch
  this fixture. CI cannot catch any of the above.
