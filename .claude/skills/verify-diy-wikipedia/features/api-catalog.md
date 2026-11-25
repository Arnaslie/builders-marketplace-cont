# API catalog: every project is real and checkoutable

The API serves all 63 projects in `contract/fixtures/*.json` the same way. The 47 that used to be
SAMPLE listings (`contract/samples.json`, ids `mock-...`, refused at checkout with 422) are ordinary
fixtures with ids `proj-<slug>`, priced from `contract/prices.json` like the flagships, and they
reach PayPal at checkout.

## Sub-features

- `catalog-list` `GET /projects` lists 63 projects, none with a `mock-` id, in fixture file-name order.
- `catalog-detail` `GET /projects/floating-wall-shelf` (a former sample) returns `200`, id `proj-floating-wall-shelf`.
- `catalog-cart` `POST /cart` for that project returns `200` with a non-zero subtotal.
- `catalog-checkout` `POST /checkout/orders` for that project returns `201` with a PayPal sandbox
  approve link when PayPal sandbox credentials are set, `503` when they are not. Never `422`.

## How to get to it (user POV)

- The gallery lists every project; opening `/projects/floating-wall-shelf` shows its grid; the
  agent panel links to `/cart?project=floating-wall-shelf`, whose PayPal button calls
  `/checkout/orders`.

## Driving it with verify.sh

Preconditions:

- For `catalog-checkout` with a real order, export only the PayPal sandbox keys before launch,
  read from `.env` without sourcing it (an AG license value in `.env` is not shell-safe):
  `eval "$(python3 -I -c 'import re;[print(f"export {k}={v!r}") for k,v in (l.rstrip("\n").split("=",1) for l in open(".env") if re.match(r"PAYPAL_(CLIENT_ID|CLIENT_SECRET)=", l))]')"`
  then `RUN=$($V launch)`. `launch` never copies `.env`; the API inherits the exported variables.
- `$V doctor "$RUN"` exits 0.

- **List.** `$V api "$RUN" GET /projects api-catalog`. Status `200`. Then
  `python3 -I -c 'import json,sys; b=json.load(open(sys.argv[1])); print(len(b), sum(p["id"].startswith("mock-") for p in b), b[0]["slug"])' .verify/$RUN/evidence/api-catalog.body`
  prints `63 0 adirondack-chair`.
- **Detail.** `$V api "$RUN" GET /projects/floating-wall-shelf api-former-sample`. Status `200`;
  `grep -o '"id":"proj-floating-wall-shelf"' .verify/$RUN/evidence/api-former-sample.body` matches.
- **Cart.** `$V api "$RUN" POST /cart api-former-sample-cart '{"projectId":"proj-floating-wall-shelf","owned":[]}'`.
  Status `200`; `"projectId":"proj-floating-wall-shelf"` in the body and `subtotal` is not `"0.00"`.
- **Checkout.** `$V api "$RUN" POST /checkout/orders api-former-sample-order '{"projectId":"proj-floating-wall-shelf","owned":[]}'`.
  With credentials: status `201`, body `"status":"CREATED"`, and an `approve` link on
  `https://www.sandbox.paypal.com/`. Without: status `503`. Any `422` with "Sample project" is a regression.

## Gotchas

- Prices come from the committed Channel3 cache, so totals change whenever `price_cache.py` is
  re-run. Assert on shape and status here, not on exact totals.
- Lines Channel3 could not price (`misses` in `prices.json`) keep their authored fixture price.
- A `201` proves PayPal sandbox created the order (the server rejects a create response without an
  id, a CREATED/APPROVED status and an approve link). It does not prove payment; capture needs a
  sandbox buyer to approve in the browser.
