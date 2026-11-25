# Hero image regeneration — prompts derived from steps, not summaries

Companion to `ai-image-vs-steps-audit.md`. The root cause recorded there is that every hero JPG was
prompted from the fixture's one-line `summary`. These prompts are built from the **steps and the
materials bill** instead, and each one names the invented features the old photo added so the model has
to actively avoid them.

## House style (appended to every prompt)

Taken from the approved `adirondack-chair.jpg` reference: a real, lived-in setting rather than a white
studio sweep, soft natural window light, shallow depth of field, finished-build quality, 4:3 landscape,
subject filling the frame, no text, no watermark, no border. The object must look handmade — visible
joinery, screws, weld beads, brush marks — not a mass-produced catalogue item.

## Why each Tier 1 prompt says what it says

| Project | The prompt pins | The old photo invented |
|---|---|---|
| forged-bottle-opener | 10 in square bar, punched paddle with a 3/4 in drifted hole, centre twist, scrolled hanging loop, beeswax black finish | a cast wall-mount opener screwed to a post |
| steel-coat-rack | 66 in square-tube post on a 12x12x3/8 in plate, six forged J-hooks staggered at 60-64 in, hammered black | a wall rail with loose S-hooks |
| parallettes-pair | white Schedule 40 PVC, 20 in handle / 6 in uprights / 5 1/2 in feet, elbows, tees, eight caps, taped grips | solid walnut A-frames |
| concrete-side-table | 15 in concrete **cube**, one recessed handhold, grey, felt pads | a round drum |
| doorway-pull-up-bar-rig | black-pipe U on floor flanges bolted through a 2x6 ledger on the wall above the trim | a bar in the side jambs with welded gussets |
| steel-plant-stand | straight 1 in square tube, four 36 in legs, three identical tiers, two cedar slats per tier, satin black | a scrolled wrought-iron étagère |
| birdhouse-kit-for-two | one wren box, no perch, 1 in entrance, post-mounted, unfinished cedar | a duplex with perches hung on a chain |
| brick-barbecue | compact brick U on a 5x3 ft slab, centre divider wood store, corbelled grate at 34 in, brick-on-edge cap | an L-shaped outdoor kitchen with a chimney hood and sink |
| steel-pipe-bookshelf | freestanding 32 in unit, three stained pine shelves, four pipe columns on floor flanges | a 6 ft wall-mounted rack with five shelves |
| simple-wooden-chair | 17 1/2 in front legs, 36 in rear legs carrying a single horizontal back rest 14 in above the seat | a sculpted hardwood chair with spindles |
| wine-rack-wall-unit | 30 x 28 1/2 x 9 1/4 in pine box, two full-face 45-degree diamond lattices, French-cleat hung, natural Danish oil | a cabinet with shelves, a centre divider and a stemware rail |

The same method was applied to every Tier 2 and DRIFT project, and `image_analyze` was run on each new
JPG against its step list before the verdict in the audit was changed.
