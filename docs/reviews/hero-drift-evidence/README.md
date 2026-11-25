# Verification evidence — hero image drift round 3

Produced by `.claude/skills/verify-diy-wikipedia/verify.sh` on this branch, run `hero-final`.
Source revision at time of run: `33cdef80a409adb3cd2fa3e094e22b62a2b5205d+dirty` (the `+dirty` is
this branch's uncommitted tree, which is exactly what was verified).

## Doctor — every line `ok`

```
ok   web process group 140900 alive
ok   web port 3100 held by pid 140923 (pgid 140900)
ok   web /healthz -> {"status":"ok"} 200
ok   web serving build UJET_tj2lC36YEpE1L_cE
ok   api process group 140905 alive
ok   api port 3200 held by pid 140905 (pgid 140905)
ok   api /healthz -> {"status":"ok"} 200
ok   api /openapi.json matches contract/openapi.json
```

Raw copy: [`doctor.txt`](./doctor.txt).

## `get` — every route this PR touches

Eighteen project pages: the five regenerated and the thirteen promoted off the SVG tier. Each row is
one `verify.sh get` plus one `curl` of the hero JPG compared by md5 with the file in the repo.

```
cedar-gate                   status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
cedar-planter-boxes          status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
closet-wardrobe-rack         status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
corner-workbench             status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
dog-food-stand               status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
floating-shelves             status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
garden-storage-bench         status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
kids-chalk-table             status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
magnetic-spice-rack          status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
pegboard-tool-rack           status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
potting-bench                status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
shoe-shelf                   status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
tomato-cages                 status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
cedar-raised-garden-bed      status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
steel-plant-stand            status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
end-grain-cutting-board      status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
garage-pegboard-wall         status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
greenhouse-from-old-windows  status=200 imgref=1 glyph=0 jpg=200 bytes=SAME
```

`imgref=1` is `grep -c 'src="/projects/<slug>.jpg"'` on the served HTML; `glyph=0` is
`grep -c 'class="thumb-placeholder"'` — the SVG-glyph wrapper — which must be zero once a fixture has
an `imageUrl`.

The fixture count also moved from 50 to 63, which shifts pagination, so the pages that depend on it
were re-driven too:

```
home=200  page7=200  links7=3  page8=404  health=200  404=404
```

`page7` correctly holds the last three cards ("Projects 61-63 of 63"), and `page8` 404s — the
boundary the updated `features/home-page.md` now states.

Step text still reaches the page (proves the fixture edits are live):

```
Cut the 2x2 boards into two front legs at 17 1/2 in
```

## Drivers

```
drive materials-grid: PASS      (allRows=17 rows=12 ownedTicked=3 total=$250.67 -> $349.67 -> $356.23)
drive listing-views:  PASS      (8 page/width combos, 10 cards each, 0 console errors)
```

## Screenshots

`shot-*.png` are full-page loads at 1280x800. The AG Grid is client-rendered so its rows appear empty
in a pre-hydration shot — that is why the grid is proven by the driver above, not by the picture. The
hero images, headings and pagination are what these show.

| File | Page |
|---|---|
| `shot-home.png` | `/` |
| `shot-page7.png` | `/?page=7`, the last three cards |
| `shot-cedar-gate.png` | `/projects/cedar-gate` (promoted from SVG tier) |
| `shot-tomato-cages.png` | `/projects/tomato-cages` (promoted from SVG tier) |
| `shot-cedar-raised-garden-bed.png` | `/projects/cedar-raised-garden-bed` (DRIFT → MATCH) |
| `shot-steel-plant-stand.png` | `/projects/steel-plant-stand` (DRIFT → MATCH) |
| `shot-end-grain-cutting-board.png` | `/projects/end-grain-cutting-board` (DRIFT → MATCH) |
| `shot-garage-pegboard-wall.png` | `/projects/garage-pegboard-wall` (MISMATCH → MATCH) |
| `shot-greenhouse-from-old-windows.png` | `/projects/greenhouse-from-old-windows` (MISMATCH → MATCH) |
