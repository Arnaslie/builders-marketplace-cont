# Builders Marketplace API — container for the FastAPI backend.
# Sits at the repo root and COPYs the whole repo so contract/fixtures
# resolve correctly (api/app/store.py climbs to <root>/contract/fixtures).
# Removing this Dockerfile makes Railpack auto-detect: with package.json at
# the root it builds a NODE image and "pip" is not found. Keep this file.

FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    UV_VERSION=0.12.24

WORKDIR /app

# Whole repo on purpose: the API reads contract/fixtures + contract/openapi.json.
COPY . .

RUN pip install "uv==${UV_VERSION}" \
    && cd api \
    && uv sync --locked --no-dev

WORKDIR /app/api

EXPOSE 8000

# --port $PORT is expanded by Railway at runtime; default 8000 locally.
CMD ["sh", "-c", ".venv/bin/uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]