# Seal

The masthead seal (top-right) is a navy coin with the site name on its top arc, a plain gold lower
band, and a shield with a red compass star. On the index (`/`) the coin slowly spins around its
vertical axis; once a visitor clicks into a page (a project, the recommend form, the cart, or any
non-listing route) it holds still. The lower band is plain gold: the old red
`BUILDERS MARKETPLACE` band text is gone, and the full name now reads `BUILDERS MARKETPLACE` in
white on the top arc.

## Sub-features

- `seal-label` renders the top-arc label text `BUILDERS MARKETPLACE` and no red lower-band label.
- `seal-spins-on-index` advances the coin rotation on `/`.
- `seal-holds-on-pages` keeps the rotation fixed at `0` on `/projects/<slug>` and `/recommend`.

## How to get to it (user POV)

- Open `/` (the seal spins), then click any project card (the seal stops).

## Driving it with verify.sh

Preconditions:

- `$V doctor "$RUN"` exits 0.

- **Browser proof.** Run `$V drive "$RUN" seal`. It must print `PASS` and exit 0. In real
  Chromium it asserts: the `.masthead .seal` container exists with `data-spinning="true"` on `/`
  and `"false"` on `/projects/simple-wooden-chair` and `/recommend`; the flat SVG's top-arc
  `<textPath>` reads `BUILDERS MARKETPLACE`; no `<text>` carries the red lower-band fill
  (`#c8102e`) any more; and after the three.js coin builds, `data-rotation` increases on `/` over
  two seconds while it stays exactly `0` on the other two routes. Evidence:
  `evidence/seal.json`, `seal-index.png`, `seal-project.png`, `seal-recommend.png`.

## Gotchas

- `data-spinning` is set from the route path at render time, so it is reliable on the flat SVG and
  the coin alike. `data-rotation` only appears once the three.js coin has built (WebGL), so the
  driver waits on it and reads the angle twice to prove motion or stillness.
- The coin is held mounted by the root layout across client navigations; the spin decision is
  re-read from the current pathname every frame, so it must stay live rather than be captured once.
- `usePathname` in Next 15 returns the pathname without query string, so `/?page=5` still spins.
