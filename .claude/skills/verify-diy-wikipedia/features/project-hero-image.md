# Project hero image matches the steps

Every project page at `/projects/<slug>` shows a hero image from `public/projects/<slug>.jpg` when
the fixture's `imageUrl` is set, or the free deterministic SVG glyph when it is not. This feature
checks that the hero JPG actually loads and is served byte-identical to the file in the repo, so a
regenerated image can be proven to be the one the page shows.

## Sub-features

- `hero-served`: `/projects/simple-wooden-chair` returns 200 and its HTML references
  `src="/projects/simple-wooden-chair.jpg"`.
- `hero-bytes`: `GET /projects/simple-wooden-chair.jpg` returns 200 and the md5 of the response
  equals the md5 of `public/projects/simple-wooden-chair.jpg` in the repo.
- `hero-tier-complete`: every published fixture now has an `imageUrl`, so no project page renders the
  free SVG glyph. Sampled on the thirteen slugs promoted from the SVG tier in this round
  (`cedar-gate`, `cedar-planter-boxes`, `closet-wardrobe-rack`, `corner-workbench`, `dog-food-stand`,
  `floating-shelves`, `garden-storage-bench`, `kids-chalk-table`, `magnetic-spice-rack`,
  `pegboard-tool-rack`, `potting-bench`, `shoe-shelf`, `tomato-cages`): each page references its own
  `.jpg`, and none contains `class="thumb-placeholder"` (the SVG-glyph wrapper).
- `hero-community-grid`: the AG Grid materials table on the same page still renders and recomputes
  (see [web-pages.md](./web-pages.md) `project-grid`); run the `materials-grid` driver.
- `steps-rendered`: the page body contains step 1 of `contract/fixtures/chair.json` verbatim, so a
  fixture step edit is proven to reach the page.

## How to get to it (user POV)

- Open `/`, click any project card, and the hero image is at the top of the project page beside the
  title. A project with no `imageUrl` shows the line-drawing glyph instead.

## Driving it with verify.sh

Preconditions:

- `$V doctor "$RUN"` exits 0.
- The run was launched without `NEXT_PUBLIC_API_URL`, so pages read `contract/fixtures/*.json`.

- **Hero served.** `$V get "$RUN" /projects/simple-wooden-chair hero-page`. `evidence/hero-page.status`
  is `200`; `grep -o 'src="/projects/simple-wooden-chair.jpg"' evidence/hero-page.body` matches.
- **Hero bytes.** `curl -sS "$($V url "$RUN" /projects/simple-wooden-chair.jpg)" -o /tmp/hero.jpg`
  then `md5sum /tmp/hero.jpg public/projects/simple-wooden-chair.jpg`. The two hashes must match.
- **Photo tier complete.** For each of the thirteen slugs above run
  `$V get "$RUN" /projects/<slug> hero-<slug>`, then
  `grep -c 'src="/projects/<slug>.jpg"' .verify/$RUN/evidence/hero-<slug>.body` prints at least `1`
  and `grep -c 'class="thumb-placeholder"' .verify/$RUN/evidence/hero-<slug>.body` prints `0`.
  A quicker whole-catalogue check: `node scripts/assign-images.mjs` prints
  `free tier : 0  (deterministic SVG, zero cost)`.
- **Steps reach the page.** `grep -o 'Cut the 2x2 boards into two front legs at 17 1/2 in' evidence/hero-page.body`
  matches (that phrase is step 1 of `chair.json` since the rear-leg fix; update this string if the
  fixture step is reworded).
- **Grid unaffected.** `$V drive "$RUN" materials-grid` must print
  `drive materials-grid: PASS` and exit 0. It asserts `allRows = 17` (12 lines + 2 group headers +
  2 subtotals + 1 pinned total), `rows = 12` line rows, `ownedTicked = 3`, `totalInitial = "$250.67"`,
  `totalAfterUntick = "$349.67"`, `qtyAfter = "5"`, `totalAfterQty = "$356.23"`.
- **Screenshot.** `$V shot "$RUN" /projects/simple-wooden-chair hero-page` for the layout.

## Gotchas

- `next start` serves `public/` statically, so a regenerated JPG needs a fresh `launch` (which copies
  the working tree) before the new bytes are served. Editing the file under a running server will
  not change the response.
- The AG Grid renders client-side, so the `shot` shows an empty grid box; it is layout proof only.
  Rows and totals are proven by `$V drive "$RUN" materials-grid`.
- The driver targets the pine 2x2 qty cell by row id (`chair-pine-2x2`), not `row-index="0"`: row 0
  is the `Tools (6)` group header. Counting `#materials-grid .ag-row[row-id]` naively gives 17, not
  12 — exclude ids starting `header:`/`subtotal:` and the `total` row, as `LINE_ROW` does.
- The image audit itself is judgement, not an automated assertion: see
  `docs/reviews/ai-image-vs-steps-audit.md` and `docs/reviews/hero-image-prompts.md`. This feature
  proves the page serves the right file; it cannot prove the photo matches the steps.
