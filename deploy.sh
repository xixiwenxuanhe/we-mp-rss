#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "[deploy] build frontend"
bash web_ui/build.sh

echo "[deploy] docker compose build"
docker compose build

echo "[deploy] docker compose up -d"
docker compose up -d

echo "[deploy] done"
