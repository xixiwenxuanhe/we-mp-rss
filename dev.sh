#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

CURRENT_COUNTRY="$(curl -fsS --max-time 5 ipinfo.io/country 2>/dev/null | tr -d '\r\n' || true)"
if [[ -n "$CURRENT_COUNTRY" ]]; then
  echo "[dev] current country: $CURRENT_COUNTRY"
else
  echo "[dev] current country: unknown"
fi

echo "[dev] build frontend"
bash web_ui/build.sh

echo "[dev] docker compose (dev) build"
docker compose -f docker-compose.dev.yml build

echo "[dev] docker compose (dev) up -d"
docker compose -f docker-compose.dev.yml up -d

echo "[dev] done"
