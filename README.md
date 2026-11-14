# Builders Marketplace

> A Pinterest-style catalogue of hands-on projects (furniture, gym equipment, forged knives). Every project page carries a materials-and-tools grid with prices and where to buy, and an AI agent can build your cart from your budget and the tools you already own.

Built for the [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/). This repository (`builders-marketplace-cont`) is **the active fork**, continued after the competition deadline closed; the original `builders-marketplace` repo is frozen and gets no further commits.

## Features

- Browse project ideas (seeded: chair, squat rack, knife) in a Pinterest-style gallery.
- Per-project **AG Grid** table of materials and tools: quantity, price, retailer, buy link.
- Real prices and product matches from the **Channel3** product search API (prices come from a committed cache, not a live scrape).
- **Shopping agent**: builds the cart from the grid, skips tools you already own, swaps cheaper items within your budget (Anthropic Claude via `LLM_API_KEY`).
- **Checkout is coming soon.** The original PayPal sandbox checkout was replaced with a placeholder pending a **Stripe** integration. The cart still prices itself and shows totals, but no payment is collected and nothing is charged.

## Run locally

Two services: the Next.js web app at the repo root and the FastAPI API in `api/`.
Prerequisites: Node.js 20 and [uv](https://docs.astral.sh/uv/) (uv installs Python 3.12 if needed).

```bash
git clone https://github.com/Arnaslie/builders-marketplace-cont.git
cd builders-marketplace-cont
cp .env.example .env     # then fill in the values
```

Web (http://localhost:3000):

```bash
npm ci
npm run dev              # production: npm run build && npm start
```

API (http://localhost:8000, interactive docs at http://localhost:8000/docs):

```bash
cd api
uv sync                                      # creates api/.venv from api/uv.lock
uv run uvicorn app.main:app --reload --port 8000
uv run pytest                                # tests
uv run python scripts/export_openapi.py      # regenerate contract/openapi.json after model changes
```

To run the app with the live API, set `NEXT_PUBLIC_API_URL` to the deployed API URL before building
(checkpoint: Next inlines `NEXT_PUBLIC_*` at build time). Unset, the app falls back to the bundled
project files in `contract/fixtures/` and the cart cannot be priced.

The API allows browser calls from `CORS_ALLOW_ORIGINS` (comma-separated; default
`http://localhost:3000`).

### API contract

`contract/openapi.json` is the agreed API contract, generated from the Pydantic models
in `api/app/models.py`. The frontend generates TypeScript types from it with `npm run gen:types`
(which writes `lib/api/schema.d.ts`). Seed data lives in `contract/fixtures/`, one file per project;
the API reads every `*.json` in that directory, so adding a project is a new file, not a code change.
Change a model, re-export, and commit both files together; `api/tests` and the verification skill
fail if they drift.

Required environment variables are listed in `.env.example`: `LLM_API_KEY` (Anthropic, for the agent),
optional `CHANNEL3_API_KEY`, `AG_GRID_LICENSE_KEY`, and `AG_CHARTS_LICENSE_KEY`. PayPal keys are no
longer required now that checkout is stubbed.

## Deploy

The app is split across two hosts (Vercel for the web, Railway for the FastAPI API):

| Service | Host | Build | Start / Runtime |
|---|---|---|---|
| Web (Next.js) | Vercel | `npm ci && npm run build` | Vercel runs `npm start` on the Node runtime |
| API (FastAPI) | Railway | `Dockerfile` (repo root): builds `python:3.12`, `uv sync --locked --no-dev` | `.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port $PORT` (set `$PORT` at runtime) |

The FastAPI service needs to stay running (it holds the in-memory cart and order state), so it belongs
on Railway's always-on container hosting, not on Vercel's function runtime. Set the API's
`CORS_ALLOW_ORIGINS` to the Vercel web URL, and set `NEXT_PUBLIC_API_URL` to the Railway API URL on
the Vercel project (re-provision the `LLM_API_KEY` Secret on Railway to keep the agent cart; AG Grid,
Channel3 and PayPal keys need not be re-provisioned).

> **What was removed in the fork (checklist):** `render.yaml` and the Render-only CI workflows
> (`keep-warm.yml`, `paypal-e2e.yml`) were deleted, and the PayPal checkout was replaced with a
> "coming soon" stub. `build.yml` is host-agnostic and remains.

## Tech stack

- Next.js 15 (App Router) on Node 20 for the web app
- Python 3.12, FastAPI and Pydantic v2 for the API, managed with uv
- [AG Grid](https://www.ag-grid.com/) Community (the `ag-grid-community` and `ag-grid-react` packages) for the materials grid; Enterprise mode needs `AG_GRID_LICENSE_KEY`
- [Channel3](https://trychannel3.com/developers) product search API
- LLM provider: [Anthropic Claude](https://docs.anthropic.com/) (key in `LLM_API_KEY`)
- Hosting: [Vercel](https://vercel.com/) (web) + [Railway](https://railway.com/) (API); formerly Render

## License

MIT, see [LICENSE](LICENSE). Copyright (c) 2026 Builders Marketplace contributors.