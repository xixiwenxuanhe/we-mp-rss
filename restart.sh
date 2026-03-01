#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if docker ps --format '{{.Names}}' | grep -Fxq "we-mp-rss-dev"; then
  echo "[restart] detected running dev container, using docker-compose.dev.yml"
  docker compose -f docker-compose.dev.yml restart
elif docker ps --format '{{.Names}}' | grep -Fxq "we-mp-rss"; then
  echo "[restart] detected running default container, using docker-compose.yml"
  docker compose restart
else
  echo "[restart] no running we-mp-rss container found, fallback to docker-compose.yml"
  docker compose restart
fi

echo "[restart] done"
