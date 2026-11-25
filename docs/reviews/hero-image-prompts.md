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

## Round 3 — the five that would not clear, plus the thirteen SVG-tier projects

Model: `google/gemini-3.1-flash-image`, 4:3, one prompt per project, saved as PNG then converted to
the house 1200x896 JPEG:

```bash
magick in.png -resize 1200x896^ -gravity center -extent 1200x896 -strip -quality 84 out.jpg
```

Each prompt below is the one that produced the accepted file. Where a project took several attempts,
the earlier attempts are described in the audit; only the accepted prompt is kept here so the file
stays reproducible.

### What Round 3 changed about the method

Round 2's "say the count twice" was not enough on its own. Three additions did the work:

1. **A proportion, not just a number.** For the cutting board, "13 squares long by 6 wide" failed
   four times; "the long edge spans 88% of the frame width and the short edge 41%, so the board is
   2.17 times longer than wide" held first time. Aspect ratio is something the model can measure
   against the frame; a bare count is not.
2. **A reference object for material thickness.** For the raised bed, naming "5/8 in fence picket, as
   thin as a hardback book's edge, compared with the picket fence in the background" finally beat
   "thick 2x6 lumber is wrong". Comparing against a second object in the same frame works where an
   absolute dimension does not.
3. **Enumerate the boards and say what is NOT there.** For the cedar gate, listing the seven boards by
   role (three uprights, two rails, one brace, one offcut) and adding "seventy percent of the face is
   empty air, if you count four verticals it is wrong" produced the sparse braced frame the steps
   build. Earlier prompts described the gate as "braced" and got a picket gate twice.
4. **Choose the camera angle to expose the joint.** The French cleat only became checkable once the
   prompt asked for a three-quarter view from the END of the shelf run, so the two 45-degree bevels
   could be seen mated in cross-section. No head-on prompt was ever going to show it.
5. **Never write the part list as a numbered or bulleted list.** The cedar gate came back as an
   annotated diagram with "1", "2", "3" burned onto the boards when the prompt said "Board 1, the hinge
   stile…". Describe the same counts in prose. See the gate entry below.
6. **One last check for stray text.** After the vision comparison, ask the vision model plainly whether
   any text, number, label or watermark appears anywhere. Three false positives showed up in this
   round and all three were legitimately part of the scene, not annotations: paint-can labels on the
   pegboard shelf, COMPOST on a compost bag, and book titles (one of them a children's book) on the
   shelves and the chalk table. Judge the returns against the house style — a prop's own printing is
   realistic, a callout drawn by the model is not.

### Round 3 prompts (verbatim)

Running order matches the generation log. `-vN` suffixes are discarded attempts.

**cedar-raised-garden-bed** (accepted: v6)

> Photorealistic photograph of a finished homemade raised garden bed in a kitchen garden, photographed
> from a low three-quarter angle so you see the long front wall and the short end wall.
>
> DIMENSIONS: 4 ft x 8 ft footprint, 17 in deep. The 4 x 8 footprint against a 17 in depth means the
> wall is SHORT and looks like a shallow trough, not a tall box.
>
> THE WALL MATERIAL — read this as the single most important instruction. The wall is built from
> western red cedar FENCE PICKETS, the same thin dog-ear picket you buy in a bundle at the lumber
> yard: each board is 5/8 INCH THICK — that is 0.625 in, about the thickness of a phone — and 5 1/2 in
> wide. Because they are so thin, the top edge of the wall is a NARROW strip, roughly 5/8 in wide, and
> the wall itself looks like a light, slatted picket structure. You can see the thin edge clearly along
> the whole top of the wall, catching the light as a narrow line. THE BOARDS ARE DEFINITELY NOT 2x6
> LUMBER: a 2x6 is 1 1/2 in thick (nearly three times thicker) and would look like heavy cribbing.
> Self-test: look along the top edge of the wall. If that edge is a thick chunky slab of timber you
> could rest a mug on, it is wrong. It must be a thin 5/8 in lip, and the shadow it throws on the board
> below must be a thin hard line.
>
> THE COURSES: exactly THREE thin pickets high on every wall — bottom, middle, top — and then the soil
> surface. Three. No fourth board. No cap rail, no top trim, no 2x4 rail along the top.
>
> THE POSTS: six slender 2x2 cedar posts (1 1/2 in square, so thin square battens not chunky 4x4s),
> one in each corner and one at the middle of each long side, standing inside the wall with their tops
> flush — nothing protruding above the top picket.
>
> JOINERY: on the long side the pickets butt together over the middle post, board ends and visible
> screw heads at that joint. Hardware cloth liner stapled inside, just visible above the soil line,
> folded over the top rim as a thin grey mesh lip.
>
> Setting: soil and a gravel path, tall vegetables behind, late-afternoon light. Warm earthy colour
> grade, shallow depth of field. 4:3 landscape, the bed filling most of the frame. No people, no text,
> no watermark, no border.

**steel-plant-stand** (accepted: v3)

> A high three-quarter view looking DOWN onto a finished homemade three-tier steel and cedar plant
> stand, camera about 30 degrees above the top tier so you are looking onto the wood surface of the top
> tier and can see all of it clearly. The stand stands in a bright room against a pale wall.
>
> ON THE TOP TIER, LOOKING DOWN, THERE ARE EXACTLY TWO BOARDS. Two wide cedar planks laid side by side
> with a narrow 1/4 in gap running between them down the middle of the tier. The planks are each 6 in
> wide and 24 in long, so together they cover the whole 12 in depth of the tier. There is no third
> plank, no third seam, no short filler piece at either end — each plank spans the full 24 in. Count
> them: left plank, right plank. Two. Self-test: if you see a seam splitting either plank into a short
> and long piece, that is wrong; each plank is one continuous 24 in board. Self-test: two boards per
> tier, so three tiers hold six boards in total.
>
> The stand is 36 in tall, 24 in wide, 12 in deep — tall and narrow, like a narrow bookshelf with three
> levels.
>
> FRAME: straight 1 in x 1 in SQUARE steel tube with crisp square corners, flat black satin enamel,
> short visible weld beads where the rails meet the legs. Each tier is a closed rectangular steel frame
> welded to the four legs at three heights — bottom tier 4 in off the floor, middle tier at 18 in, top
> tier level with the leg tops. Flat black plastic caps in the four leg ends on the floor. NO
> stretchers or crossbars between the legs below the bottom tier, NO diagonal braces, NO scrolled or
> decorative ironwork, NO glass.
>
> A couple of small terracotta plant pots sit on the middle tier. Soft window light, warm neutral
> colour grade, shallow depth of field. No people, no text, no watermark, no border.

**end-grain-cutting-board** (accepted: v4)

> Overhead flat-lay photograph, camera exactly perpendicular looking straight down at a pale wooden
> countertop.
>
> GEOMETRY, given as proportions of the 4:3 frame: the cutting board lies horizontally. Its long edge
> spans 88% of the image width. Its short edge is exactly 41% of the image width, so the board is a
> long, low, narrow rectangle — 2.17 times longer than it is wide. There is bare counter visible above
> and below the board as two wide horizontal bands. The board is NOT square and NOT slightly elongated:
> it is a long plank.
>
> THE COLOURED GRID INSIDE THE BOARD: the board's top face is an end-grain checkerboard of hard maple
> (pale cream) and black walnut (very dark brown) cubes, each 1 3/4 in square. The pattern is 13
> squares long and 6 squares wide, so each square is a slightly wide rectangle in the frame: thirteen
> squares across the long edge, six squares down the short edge.
>
> Count the long edge as you draw it, left to right: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 — that
> is thirteen squares spanning the whole long edge, and every one of the thirteen is about the same
> width. Now the short edge, top to bottom: 1, 2, 3, 4, 5, 6 — six squares spanning the whole short
> edge. Because the board is 2.17:1 and the grid is 13:6 = 2.17:1, every square is a true square, not a
> stretched rectangle. Self-test: if the squares look stretched into tall rectangles, you have drawn
> too few columns. Self-test: thirteen columns means the dark and pale squares alternate six or seven
> times across the board's length — if you count only four or five alternations, it is wrong.
>
> Squares alternate in BOTH directions (no two same-colour squares share an edge), separated by fine
> dark glue lines, each face showing end-grain growth rings.
>
> FINISH: soft 1/4 in roundover on all four edges. NO juice groove, NO routed perimeter channel, NO
> finger notch, NO cut-out handles, NO carved logo.
>
> Four small black rubber feet visible under the near corners. Soft even overhead light, very short
> shadows, warm neutral colour grade, slight vignette.
>
> No people, no text, no watermark, no border.

**garage-pegboard-wall** (accepted: v5)

> Photorealistic photograph of a finished DIY garage pegboard tool wall, shot from a THREE-QUARTER
> angle from the LEFT END of the wall, at about chest height, so you are looking along the wall and can
> see the END PROFILE of the shelves and their mounting — this framing is chosen precisely so the
> French cleat joint is visible in cross-section at the near end of the shelves.
>
> THE WALL: one continuous white pegboard sheet, 8 ft x 4 ft, screwed to pale pine 1x3 furring strips
> that hold it 3/4 in off the wall — from this angle you can clearly see the gap and the strips behind
> the board at the near end. Silver finish washers under the screws. The board's grid of small round
> holes runs unbroken across it; no seams, one sheet.
>
> THE FRENCH CLEAT, seen in profile at the near end, and this is the whole reason for the angle: fixed
> to the wall above the pegboard is a pine cleat strip whose top edge has been ripped at 45 degrees on
> a circular saw, so its cross-section is a WEDGE — full thickness at its bottom face, tapering to a
> thin knife edge at its top, the bevel sloping down and away from the wall. Hung on it are pine
> shelves whose back plates carry a matching 24 in cleat strip bevelled at 45 degrees facing down and
> in. At the near end of the closest shelf you can see the TWO WEDGES MATED FACE TO FACE, wood on wood,
> a clean 45-degree joint, with the shelf's weight pulling the joint tight. There is no metal anywhere
> in that joint: NO L-bracket, NO angle bracket, NO steel standard, NO triangle brace, NO screws
> visible on the outside of the joint.
>
> THE SHELVES: exactly THREE, each 10 in deep and 24 in wide, with a 5 1/2 in back plate under the back
> edge. Seen at this angle they step away from you along the wall. A few paint tins and boxes sit on
> them.
>
> THE TOOLS: below the shelves the board is densely covered with hand tools on metal pegboard hooks —
> twenty or more: hammers, wrenches, pliers, snips, screwdrivers, a tape measure, a level, a hacksaw.
> Every single tool has a crisp WHITE PAINTED OUTLINE traced tightly around its own silhouette, so
> white shapes are everywhere on the board, plus about six empty outlines for tools currently in use.
>
> Soft even garage daylight, warm workshop colour grade, shallow depth of field on the far end of the
> wall. 4:3 landscape, the near end of the wall filling the frame. No people, no text, no watermark, no
> border.

**greenhouse-from-old-windows** (accepted: v3)

> Photorealistic photograph of a finished homemade walk-in greenhouse built from salvaged mismatched
> wooden windows, seen from outside at a three-quarter angle on a soft overcast day in a back garden,
> with the long side wall and the front gable both in view.
>
> WALLS: the walls are a patchwork of fourteen completely mismatched salvaged white-painted wooden
> window sashes — a tall narrow two-over-two sash, a small square casement with six panes, a wide
> two-pane sash, a little four-pane number, each a different size, different pane layout, different
> amount of weathering and peeling white paint. The 2x4 wall framing between them is adapted to the
> window sizes, so no two openings match, and short offcut boards fill the odd gaps. Beads of clear
> silicone sealant run along where several windows meet their framing. The whole assembly is screwed
> together, plainly recycled and slightly wonky but sound.
>
> VENTS — make these unmistakable: along the top of the long side wall there are EXACTLY TWO small high
> windows, hinged along their TOP edge and propped open outward like awnings, each tilted about 30
> degrees away from the wall so you see under it. On each of those two open vents a slim AUTOMATIC VENT
> OPENER is clearly visible: a long silver-and-brass cylinder, about 12 in long, mounted between the
> vent sash and the wall frame, its piston arm extended and holding the sash open. Two cylinders, one
> per vent, bright metal against the pale wood, easy to pick out. Not a row of five transom lights;
> just two small open vents with two visible cylinders.
>
> ROOF: a gabled roof of 2x4 rafters skinned with CLEAR CORRUGATED POLYCARBONATE panels — the ribs
> clearly visible running down the slope, translucent, glowing with daylight — plus a matching
> corrugated polycarbonate gable end above the front wall. Washer-headed roofing screws sit in the ribs
> with white closure strips at the panel edges.
>
> DOOR: a 2x4 framed door skinned with a translucent polycarbonate offcut, hung on two black exterior
> hinges with a galvanised gravity gate latch.
>
> BASE: pressure-treated 4x4 sills sitting up on grey concrete deck pier blocks set at the corners and
> along the long sides, clearly raised off the ground, over gravel.
>
> All exposed wood and window frames painted soft sage-green exterior latex. Lawn and hedge behind, soft
> sky. Natural colour grade, shallow depth of field on the background. The greenhouse fills most of the
> frame. No people, no text, no watermark, no border.

### Round 3 prompts — the thirteen promoted from the SVG tier

Each is reproduced verbatim below in the same form. They follow the house style and the four rules
above; where a project's step list named a count or a named joint (three uprights, six hooks, twelve
jars, six stakes, two strikes), the prompt states it and negates the nearest wrong version.

**cedar-gate** (accepted: v5)

Note the regression this one produced. v4 wrote the layout as a bulleted list of roles ("Board 1, the
hinge stile…", "Board 2, the centre upright…"), and the model rendered those roles as literal numbered
callouts burned into the photograph — an annotated, diagram-like image, which the house style forbids.
v5 states the same counts in prose and adds an explicit "no numbering, no labels, no diagram style".
Any prompt that enumerates parts must be prose, not a numbered list.

> Photorealistic photograph of a finished homemade cedar garden gate hung between two posts in a
> garden fence line, seen from the outside in soft daylight. Plain photograph only — no captions, no
> annotations, no numbering, no arrows, no diagram style.
>
> THE GATE IS A SPARSE BRACED FRAME, AND THE FACE IS MOSTLY EMPTY AIR. The gate is 36 in wide. Every
> board is a cedar 1x4 — exactly 3 1/2 in wide and 3/4 in thick. Seven boards were cut from four 6 ft
> lengths, and six of them are visible in the gate.
>
> Across the 36 in width there are exactly THREE vertical boards and no more: a hinge stile at the far
> left edge, a latch stile at the far right edge, and a single centre upright standing squarely in the
> middle between them. Because each board is only 3 1/2 in wide, that leaves two big clear windows of
> daylight — about 17 in of empty space either side of the centre upright — and you can see the shrubs
> and hedge behind through both of them.
>
> Across the gate there are exactly TWO horizontal rails, one at the top and one about 6 in above the
> bottom edge. They are fixed to the outside face of the stiles. Between them runs ONE diagonal brace,
> a single 1x4 rising from the bottom hinge corner up to the top latch corner, and it is fixed with a
> row of wide-face screws you can see along its length, crossing both windows corner to corner.
>
> Self-test before you finish: count the vertical boards on the gate face. Three. If there are four or
> five, or the gate looks like a row of pickets, or the face is solid rather than open, the image is
> wrong.
>
> The boards are weathered pale cedar with two coats of clear exterior sealer, matte, no paint, a few
> small filled screw holes.
>
> HARDWARE: two galvanised 8 in strap hinges on the left stile, one near the top and one near the
> bottom. A galvanised drop rod on the right: a vertical steel rod running down through two guide eyes
> on the latch stile and dropping into a round keeper plate bolted to the right post, holding the gate
> down.
>
> POSTS: two pressure-treated 4x4 posts, one each side, each standing on its own raised concrete collar
> at the base. A simple horizontal-board fence at the same height continues left and right, softly out of
> focus.
>
> NO numbers, NO labels, NO letters, NO captions anywhere in the image. NO picket gate, NO arch, NO
> lattice, NO scrollwork, NO solid panels.
>
> Soft daylight, shallow depth of field on the garden, warm natural colour grade. 4:3 landscape, the
> gate filling most of the frame, no people, no text, no watermark, no border.

**cedar-planter-boxes**

> Photorealistic photograph of a finished matched PAIR of homemade square cedar planter boxes on a
> stone patio in soft late-afternoon daylight, shot three-quarter on from a low angle so both boxes and
> their tops are in view.
>
> THE BOXES: each box is a 24 in square box, 24 in on every side, built from western red cedar 1x6
> boards stood on edge as the four sides — so each face is a clean run of vertical cedar 6 in boards,
> four sides per box, twelve 24 in lengths in total across the pair. Slim cedar corner blocks sit
> inside the corners so the box edges show a crisp square corner with no visible fasteners on the
> outside faces. Each box stands on its own pair of cedar blocking strips screwed across the underside,
> lifting the base 2 in clear of the patio so there is a visible shadow gap under the box. Count: TWO
> boxes, sitting side by side. Each is twice as wide as it is tall.
>
> THE RIM AND DRAINAGE: the top rim is sanded smooth with the corners rounded over by hand, and
> stained. On the top face of each box the cedar boards read as a rim with the soil inside. Small 1/4
> in drainage holes are drilled through the bottom boards; a couple of drips of water mark the patio
> under one box.
>
> FINISH: two coats of a warm semi-transparent exterior stain on the OUTSIDE faces only, leaving the
> inside pale, unfinished cedar — you can see the tonal difference at the rim.
>
> Both boxes hold a few small plants and soft soil, not overflowing.
>
> NO tapered or flared panels, NO decorative lattice or X-braces, NO metal corner brackets or steel
> edging, NO legs or feet — the boxes sit on their flat base strips, NO wheels.
>
> Setting: a flagstone patio with a pale rendered house wall behind, soft shadow. Shallow depth of
> field, warm wood tones. 4:3 landscape, both boxes filling most of the frame, no people, no text, no
> watermark, no border.

**closet-wardrobe-rack**

> Photorealistic photograph of a finished DIY wall-hung closet wardrobe rack in a bright bedroom, shot
> straight on from a few feet away so the whole rack is in frame, filled with hanging clothes and
> shoes.
>
> CONSTRUCTION: the rack hangs entirely ON the wall — it has no legs and does not touch the floor. TWO
> vertical 2x4 standards run down the wall, screwed into the studs, and ONE horizontal 2x4 top rail
> spans across the top of the two standards, forming a simple n-shape open frame with nothing else. The
> 2x4s are visible as chunky bare stud lumber, sanded and left natural or lightly clear-coated, not
> painted.
>
> THE ROD: a heavy-duty 1 in diameter closet rod, 48 in long, sits in drilled sockets in the two
> vertical standards and spans between them, carrying a run of clothes on hangers. The rod is metal,
> and you can see it seated in the round socket drilled into the wood. Under it hang about a dozen
> garments on wooden and metal hangers.
>
> THE SHOE SHELF: below the rod, a single lower shoe shelf — one plain 3/4 in board — supported on two
> small wood cleats screwed to the standards, and sitting 16 in above the floor. A few pairs of shoes
> sit on it. Just ONE shelf; not a rack of shelves.
>
> Both standards are plumb and level with each other, and the whole assembly is squared so the rod sags
> under no visible load.
>
> NO cabinet carcass, NO side panels or doors, NO drawers, NO second shelf, NO floor-standing unit, NO
> diagonal braces, NO wire shelving.
>
> Setting: a plain painted wall behind, wooden floor, soft window light from the left. Shallow depth of
> field on the background, warm neutral colour grade. 4:3 landscape, the rack filling most of the
> frame, no people, no text, no watermark, no border.

**corner-workbench** (accepted: v2)

> Photorealistic photograph of a finished homemade right-angle corner workbench in the corner of a
> garage, shot from a high three-quarter angle looking down into the corner so both top slabs and the
> vise are visible.
>
> SIZE, stated plainly: the bench is intentionally compact — it fits into a corner with only 2 ft of
> worktop each way, so the whole thing is about 2 ft deep and 2 ft wide along each wall, standing 36 in
> tall. It is a small corner bench, not a big L-shaped kitchen island: it should look modest, tucked
> into the corner, with the room's floor visible in front of it.
>
> THE TOP: TWO square birch plywood slabs, each 2 ft x 2 ft and 3/4 in thick, joined along a 45-degree
> mitered seam so the pair forms a right-angle L that nests into the corner. Count the slabs: two. The
> mitered seam runs diagonally out from the inside corner and is clearly visible. The plywood's layered
> edges show on the front, and the top is finished with two coats of Danish oil — warm honey, matte,
> with a faint sheen.
>
> THE VISE, and this is a hard requirement: a 6 in quick-release woodworking vise is mounted so its
> jaws are IN LINE WITH THE BENCHTOP — the top of the vise jaws sits exactly level with the plywood
> surface, not above it, and the vise body is recessed into the front apron under the top edge. You see
> the wooden jaw faces flush in the benchtop's front edge, with the steel screw and handle below,
> projecting forward. If the vise sits on top of the bench or its jaws stand proud above the surface,
> the image is wrong. A piece of scrap wood is clamped in the flush jaws to show it working.
>
> THE FRAME: four 2x4 legs — one at each outer corner of the L — screwed to short 2x4 aprons beneath the
> top, with visible screw heads. No leg in the inside corner.
>
> THE LOWER SHELF: ONE full-width lower shelf on cleats, 18 in off the floor, holding a paint tin and a
> small toolbox. Under the top, small triangular corner gussets at the inside corner.
>
> NO drawers, NO castors, NO pegboard or backboard above, NO overhanging lip, NO second bench, NO
> shelves above, NO sink or taps.
>
> Setting: bare block and plaster walls in a corner, concrete floor, a few hand tools laid flat on the
> bench. Soft window light from the right. Shallow depth of field, warm neutral colour grade. 4:3
> landscape, the bench and vice filling most of the frame, no people, no text, no watermark, no border.

**dog-food-stand**

> Photorealistic photograph of a finished homemade raised dog bowl stand in a bright kitchen corner,
> photographed three-quarter on from just above floor height so the side panels and the top are both
> visible.
>
> THE STAND: two flat side panels of 1/2 in sanded plywood stand vertically about 20 in apart, joined
> by ONE horizontal top crosspiece near the top and ONE lower shelf board near the bottom. Two side
> panels, one top crosspiece, one bottom shelf. That is the structure.
>
> THE TOP: the top is a closed panel across the back on which TWO large stainless steel anti-gullet dog
> bowls (10 in diameter) sit side by side in cut openings — so the bowls sit down into the closed top
> surface and the front of the top is open. The bowls are big and generous, one full of kibble and one
> of water.
>
> THE FRONT: the front is completely OPEN — no door, no front panel — so you can see under the top into
> the space between the panels and see the bowls from below. A single small cleat is screwed under the
> shelf between the two side panels as a stiffener.
>
> THE SIDE PROFILE SHAPE, important: each side panel has a large 10 in round hole cut through it,
> positioned 6 in up from the bottom edge and 2 in back from the front edge. So each side panel is a
> flat plywood slab with a big circular cut-out — you can see through the hole. Two panels, two round
> holes.
>
> FINISH: 1/2 in sanded plywood with its layered edges visible, coated in a water-based polyurethane,
> warm pale blonde, matte. Visible countersunk screws at the joints.
>
> The stand is roughly 22 in wide, 20 in deep and 18 in tall — low, wide and open, not a tall cabinet.
> Count: TWO bowls, TWO side panels each with ONE round hole, ONE top, ONE lower shelf.
>
> NO solid box or cabinet with a closed front, NO drawers or doors, NO legs with turned profiles, NO
> metal frame, NO raised feeding platform with a ramp, NO third bowl.
>
> Setting: pale kitchen floor, white wall, soft daylight from a window. Shallow depth of field on the
> background, warm neutral colour grade. 4:3 landscape, the stand filling most of the frame, no people,
> no text, no watermark, no border.

**floating-shelves** (accepted: v2)

> Photorealistic photograph of a finished trio of homemade floating wall shelves on a warm off-white
> plaster wall, shot straight on at eye level so all three shelves sit level in a column.
>
> EXACTLY THREE pine shelves, identical in length, each 3 ft long, 8 in deep and 1 in thick, finished
> with Danish oil to a warm honey matte sheen. They are stacked one above another with generous even
> spacing, aligned perfectly flush at both ends. Count them: one, two, three. Not two, not four.
>
> THE FLOATING LOOK: there is NO visible hardware anywhere. No metal brackets, no L-brackets, no black
> steel cleat rail, no threaded rods, no corbels, no standards, no screws. Each shelf appears to grow
> straight out of the plaster with only a thin crisp shadow line where it meets the wall, and the
> underside of each shelf is completely clean and flat from end to end — a bare board with a visible
> wood underside. The fixing is a hidden internal 45-degree cleat, entirely invisible from outside.
>
> ON THE SHELVES: the top shelf carries a leaning stack of three hardback books and a small unglazed
> clay pot; the middle shelf carries a small pale ceramic vase with two dried grass stems; the bottom
> shelf is nearly empty with one flat stone dish. Nothing heavy, nothing overhanging the front edge.
>
> Light: soft daylight from a window at the left, so each shelf casts a soft shadow down and right on
> the plaster, and the wall shows gentle paint texture. Warm neutral colour grade, shallow depth of
> field.
>
> NO ladder or étagère frame, NO vertical side supports or gables, NO glass, NO rope, NO leather
> straps, NO visible black rail across the wall, NO decorative scalloped brackets.
>
> 4:3 landscape, the three shelves filling most of the frame, no people, no text, no watermark, no
> border.

**garden-storage-bench**

> Photorealistic photograph of a finished homemade cedar garden storage bench standing against a garden
> wall on a paved patio, photographed three-quarter on from the front so you can see the seat is OPEN
> and lifted on its hinge.
>
> THE BENCH: a cedar bench with a hinged seat. Two solid end frames, each built as a U of cedar 1x4
> boards with a flat arm cap on top, joined by a back frame. The back has a run of horizontal cedar
> back slats across it, and the arm tops are capped with a rounded cedar board. Under the seat is an
> open storage box lined with a liner panel, about 30 in wide, holding a coiled hose, a pair of
> secateurs, a trowel and a folded cushion.
>
> THE LIFTING SEAT: the seat is a frame of cedar slats hinged to the BACK with a long stainless piano
> hinge running the full width of the seat along the back edge, and the seat is PROPPED OPEN at about
> 45 degrees, held by two 12 in seat-lid support stays — slim metal folding stays, one on each side,
> clearly visible bracing from the seat frame to the bench side. The seat slats run front to back along
> the seat frame with small gaps between them, and you can see the underside of the slats and the hinge
> knuckles.
>
> FINISH: western red cedar, warm reddish-brown, sealed twice with a matte exterior sealer, no paint.
>
> Count: TWO end frames, ONE lifting seat of about six cedar slats with TWO stays, ONE back of about
> four horizontal slats, TWO arm caps, ONE storage liner box.
>
> NO closed lid with no mechanism, NO toolbox or metal chest, NO castors, NO backrest of vertical
> spindles, NO footrest, NO decorative scrollwork.
>
> Setting: a warm brick garden wall behind, a flagstone patio, a few pots. Soft natural daylight.
> Shallow depth of field on the wall, warm colour grade. 4:3 landscape, the bench filling most of the
> frame, no people, no text, no watermark, no border.

**kids-chalk-table**

> Photorealistic photograph of a finished homemade kids' chalk table with two bench seats, in a bright
> playroom, photographed three-quarter on from a low child's eye height so you see the tabletop and
> both benches.
>
> THE TABLE: one low table about 2 ft tall with a large flat TOP painted with matte black chalkboard
> paint, chalked with a few child's chalk squiggles and a hopscotch grid, and a shallow chalk ledge.
> The top is edged with pale pine and every edge is heavily rounded over.
>
> THE FRAME: the table is pine — 1x6 pine boards for the top, and legs cut from 3x3 softwood post.
> FOUR legs, one at each corner, glued and screwed to SIX aprons: two long aprons and two short aprons
> under the top, plus two stretcher aprons. Count the table legs: four.
>
> THE BENCHES: TWO matching bench seats, one on the long side of the table (and visible second one at
> the far side), each bench a simple pine plank seat on its own two legs, at kid height so a
> five-year-old can sit and reach the top. Each bench is a plain slatted plank with rounded edges.
>
> FINISH: the tabletop is BLACK chalkboard paint, three coats. Everything else — aprons, legs, bench
> seats — is bare pine finished with one coat of clear water-based sealer, so the pine is pale honey
> and the top is black. That contrast is the look.
>
> Count: ONE table, TWO benches, FOUR table legs, two bench seats.
>
> NO adult-height dining table, NO chairs with backs, NO drawers, NO paint in bright primary colours,
> NO chalkboard on the benches, NO metal frame, NO castors.
>
> Setting: pale wooden playroom floor, a white wall with a low shelf, soft window light. Small chalk
> sticks and a cloth on the tabletop. Shallow depth of field, warm neutral colour grade. 4:3 landscape,
> table and benches filling most of the frame, no people, no text, no watermark, no border.

**magnetic-spice-rack**

> Photorealistic photograph of a finished homemade magnetic fridge spice rack, shot close and straight
> on at the SIDE of a stainless steel refrigerator, filling the frame.
>
> THE RACK: THREE steel strips, each 18 in long and 5/8 in wide, mounted HORIZONTALLY on the fridge
> side, one above the other, spaced evenly about 6 in apart, screwed or adhered flat to the fridge's
> steel side panel. Count the strips: three. They are narrow brushed-steel flat bar with filed,
> deburred ends, and they sit only a few millimetres proud of the fridge surface.
>
> THE JARS: small clear glass spice jars, about 4 oz, with flat metal screw lids. Each jar's LID is
> glued to a round neodymium magnet disc, and the lid-magnet assembly sticks up onto the steel strip, so
> the lid is stuck to the strip and the glass jar body hangs below it, held by its own threads. About a
> dozen jars in three rows — four jars under each of the three strips, so twelve jars total, in a neat
> grid. Each jar holds a different spice — paprika, cumin, turmeric, oregano, cinnamon, chilli flakes,
> peppercorns — so the jars are visually varied in colour. The heaviest jars, the fuller ones, are on
> the BOTTOM row.
>
> FINISH: brushed steel strips, clean glass, brass-ish or silver lids, each lid with a round magnet disc
> bonded to its top with two-part epoxy, and a little squeeze-out of epoxy visible on a couple.
>
> NO wooden rack, NO wall-mounted shelf, NO brackets or screws into a wall — it is on the fridge's steel
> side. NO labels or printed text on the strips.
>
> Setting: the side of a modern stainless fridge, a kitchen counter edge just visible at the bottom,
> soft kitchen light raking across so the steel strips catch a highlight. Shallow depth of field,
> cool-neutral colour grade with warm spice colours. 4:3 landscape, the rack filling the frame. No
> people, no legible text, no watermark, no border.

**pegboard-tool-rack**

> Photorealistic photograph of a finished homemade 4 ft x 4 ft pegboard tool rack on a bare garage
> wall, shot straight on so the square panel fills the frame.
>
> THE PANEL: ONE square 4 ft x 4 ft panel of 1/8 in white pegboard with its regular grid of small round
> holes running edge to edge, unbroken, no seams, no second panel. It is mounted on a frame of pine 1x2
> furring strips fixed to the wall studs, so the panel stands about 3/4 in off the wall and you can see
> a thin dark gap and the pale furring strip edge at the top, sides and bottom. The panel is screwed to
> the frame with 1 in screws every 8 in around the perimeter — visible screw heads evenly spaced around
> the edge, about twenty of them.
>
> ON THE PANEL: a working arrangement of pegboard hooks holding tools — a row of screwdrivers, a pair
> of pliers, a hammer, a set of spanners, snips, and a handsaw. The heavy tools are spaced further
> apart, about an extra 4 in clear around them, so they do not crowd. A pair of screwdriver/snips
> HOLDERS is fitted at arm height, about 40 in up from the bottom of the panel, holding the
> screwdrivers and snips upright. At the bottom right a single small shelf BRACKET carries a small
> metal tool box.
>
> NO painted tool outlines on this one, NO French cleats, NO wooden shelves across the panel, NO dense
> floor-to-ceiling wall of tools — this is one modest 4 ft square panel with an orderly tool
> arrangement.
>
> Finish: white pegboard, bare pine frame, chrome and black tools. Soft even daylight from the side to
> make the holes read. Warm workshop colour grade, slight vignette. 4:3 landscape, the panel filling
> most of the frame. No people, no text, no watermark, no border.

**potting-bench**

> Photorealistic photograph of a finished homemade potting bench in a greenhouse or mud room,
> photographed three-quarter on from the front so the working top and the lower shelf are both
> visible.
>
> THE BENCH: two solid END PANELS cut from 3/4 in exterior plywood, each a flat slab with a square flat
> top and a rectangular NOTCH cut out toward the bottom of its front edge — the notch is where the lower
> shelf apron sits, so each end panel has a visible step cut out of its front lower edge. The working
> top is at 36 in, a comfortable standing height, so the bench is about 3 ft tall.
>
> THE TOP: the top is not a single slab — it is a run of SLATS across two 2x4 aprons, with a clear 1/4
> in gap between each slat so water and soil fall through. Count roughly seven slats across the top,
> with the gaps plainly visible, and the top surface flush with the top of the end panels. A few
> trowels and a pot of compost sit on it.
>
> THE LOWER SHELF: below, a slatted lower shelf sitting in the notches, its boards set about 1/2 in
> apart, holding a stack of terracotta pots and a bag of compost.
>
> THE BACK: a back trim piece and a PEG RAIL drilled with SIX steel hooks in a row, at about shoulder
> height, with trowels, a dibber and snips hanging from some of the hooks. Count the hooks: six in one
> row.
>
> FINISH: 3/4 in exterior plywood with its layered edges exposed, finished with two coats of a clear
> deck sealer, pale warm pine tone, matte.
>
> NO cupboard doors, NO drawers, NO solid single-piece top, NO back panel of pegboard, NO wheels, NO
> stainless steel worktop, NO sink.
>
> Setting: a bright greenhouse or garden room with a window and potted seedlings behind, a concrete or
> brick floor. Soft daylight, shallow depth of field on the background, warm natural colour grade. 4:3
> landscape, the bench filling most of the frame, no people, no text, no watermark, no border.

**shoe-shelf**

> Photorealistic photograph of a finished homemade entryway shoe shelf standing on a wooden floor
> beside a front door, photographed three-quarter on from a low angle so both tiers and the back panels
> are visible.
>
> THE RACK: two flat pine SIDE PANELS, each 24 in long front to back and about 14 in tall, standing
> vertically as the two ends. Between them, TWO horizontal pine shelf boards, each 28 in long and about
> 9 in wide, spanning the gap. Count the shelves: exactly TWO — a lower shelf and a top shelf — not
> three, not four. The lower shelf sits about 4 in above the floor on pocket-hole screws driven in from
> the side panels; the top shelf sits 12 in above the lower one. The gap between the two shelves is open
> and you can see the wall and floor behind through it.
>
> THE RAISED BACK: behind each shelf a short BACK PANEL of pine, about 6 in tall, stands up from the
> back edge of the shelf against the wall, so shoes resting on a shelf cannot scuff the plaster. Two
> short back panels, one behind each shelf — they are low upstands, not a full-height back, and they
> stop well below the top of the rack.
>
> FINISH: pine, sanded to 120 grit, one coat of furniture oil, warm honey tone, matte, with visible
> grain and pocket-hole plugs in the side panels.
>
> Footwear: four or five pairs of everyday shoes and trainers arranged on the two shelves, and a couple
> of pairs of boots on the floor under the bottom shelf. Nothing overhangs.
>
> NO three-tier ladder rack, NO tall bookshelf, NO wicker baskets, NO metal frame, NO doors, NO coat
> hooks on the rack, NO castors.
>
> Setting: a pale oak hallway floor, a painted wall, a front door edge just out of focus at the left.
> Soft daylight from the left, shallow depth of field, warm neutral colour grade. 4:3 landscape, the
> rack filling most of the frame, no people, no text, no watermark, no border.

**tomato-cages**

> Photorealistic photograph of a finished set of homemade wire tomato cages in a vegetable garden in
> soft summer light, photographed at a slight three-quarter angle at about waist height.
>
> THE CAGES: SIX identical cylindrical cages, each made from a 6 ft length of 2 in x 4 in welded wire
> mesh rolled into a cylinder about 2 ft in diameter and 3 ft tall, with the overlapping cut ends wired
> together along a vertical seam of twisted 18 gauge galvanised tie wire. Because the mesh is a
> rectangular welded grid, each cage reads unmistakably as GALVANISED WIRE MESH rolled into a tube —
> you can see the square grid of galvanised wire, the rough cut wire ends at the top and bottom, and
> the tie-wire twists down the seam. Count the cages: six in a row, unevenly spaced like a real garden.
> They are NOT the store-bought green conical spirals: no tapering, no cone shape, no plastic coating,
> no folding hinge.
>
> THE TOP RING: the top edge of each cage is crimped and gathered to a smaller circle about 5 ft in
> circumference, so the very top of the cylinder draws in slightly to make a ring the plant grows up
> through the centre. You can see the top ring of twisted wire on each cage.
>
> THE STAKES: beside each cage a 6 ft bamboo stake stands driven into the soil, and the stake is tied to
> the cage with a green garden twist tie at TWO heights — one about knee high and one about chest high.
> Count: each cage has one stake and two tie points.
>
> THE PLANTS: each cage has a growing tomato plant climbing up inside it, with green fruit and a few
> ripe red ones, leaves pushing out through the mesh.
>
> GROUND AND SETTING: dark garden soil, a few other vegetables and a soft green background of the
> garden. Soft overcast summer daylight, shallow depth of field behind the front row, natural warm
> colour grade.
>
> NO store-bought conical cages, NO wooden stakes lashed with string into teepees, NO trellis panels,
> NO greenhouse.
>
> 4:3 landscape, the cages filling most of the frame, no people, no text, no watermark, no border.
