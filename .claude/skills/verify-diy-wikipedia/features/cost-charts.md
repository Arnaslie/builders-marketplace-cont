# Cost-breakdown charts

Issue #8. Under the materials grid on `/projects/<slug>` a "Cost Breakdown" section shows two AG
Charts: a donut "Tools vs materials" and a horizontal bar "Spend by retailer". They cover only
what is left to buy: lines ticked "Already own it" are excluded, and agent swaps change the
price/retailer of the swapped line. State lives in `components/project-shopping.tsx`, maths in
`lib/cost-breakdown.ts`.

Licence: `AG_CHARTS_LICENSE_KEY` (server env, optional). Blank = AG Charts Community, and
`#cost-charts` has `data-charts="community"`. With a key, `ag-charts-enterprise` is lazy-loaded and
`data-charts` becomes `enterprise`. Not covered here: no key is available to the skill.

## Sub-features

- `charts-render` `#cost-by-category` and `#cost-by-retailer` each contain a `canvas`.
- `charts-community-default` with no key, `#cost-charts[data-charts]` is `community`.
- `charts-follow-owned` unticking an owned line raises the charts' total by that line's cost.
- `charts-match-grid` the summary line total equals `#materials-total` before and after a toggle.
- `charts-empty` when everything is owned, `#cost-charts-empty` replaces the charts.

## How to get to it (user POV)

- Open `/projects/simple-wooden-chair`, scroll to "Cost Breakdown", tick/untick "Already own it".

## Driving it with verify.sh

Preconditions: `$V doctor "$RUN"` exits 0.

- **Server HTML.** `$V get "$RUN" /projects/simple-wooden-chair project-chair` -> `200`; body
  contains `Cost Breakdown`, `id="cost-charts"`, `id="cost-by-category"`, and a summary
  `Tools: $193.97, Materials: $56.70. Total to buy: $250.67.`
- **Screenshot.** `$V shot "$RUN" /projects/simple-wooden-chair project-chair` (pre-hydration, so
  the canvases are empty there; use the driver for the rendered charts).
- **Interactive.** `$V drive "$RUN" cost-charts` -> exit 0, every line `ok`; writes
  `evidence/cost-charts.json`, `cost-charts-loaded.png`, `cost-charts-after-untick.png`.
- **Unknown slug.** `$V get "$RUN" /projects/nope project-404` -> `404`.
