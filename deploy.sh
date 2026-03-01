#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

CURRENT_COUNTRY="$(curl -fsS --max-time 5 ipinfo.io/country 2>/dev/null | tr -d '\r\n' || true)"
if [[ -n "$CURRENT_COUNTRY" ]]; then
  echo "[deploy] current country: $CURRENT_COUNTRY"
else
  echo "[deploy] current country: unknown"
fi

echo "[deploy] build frontend"
bash web_ui/build.sh

echo "[deploy] docker compose build"
docker compose build

echo "[deploy] docker compose up -d"
docker compose up -d

echo "[deploy] done"
