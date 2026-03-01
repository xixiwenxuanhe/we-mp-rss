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

USE_PROXY=false
while getopts ":p" opt; do
  case "$opt" in
    p) USE_PROXY=true ;;
    *) echo "Usage: $0 [-p]" >&2; exit 1 ;;
  esac
done

HTTP_PROXY_VAL="${HTTP_PROXY:-${http_proxy:-}}"
HTTPS_PROXY_VAL="${HTTPS_PROXY:-${https_proxy:-}}"
NO_PROXY_VAL="${NO_PROXY:-${no_proxy:-}}"

if [[ "$USE_PROXY" == "true" ]]; then
  HTTP_PROXY_VAL="http://host.docker.internal:7897"
  HTTPS_PROXY_VAL="http://host.docker.internal:7897"
  NO_PROXY_VAL="${NO_PROXY_VAL:-localhost,127.0.0.1,host.docker.internal}"
  echo "[dev] proxy forced to ${HTTP_PROXY_VAL}"
fi

echo "[dev] build frontend"
bash web_ui/build.sh

echo "[dev] docker compose (dev) build"
if [[ "$USE_PROXY" == "true" ]]; then
  docker build \
    --add-host=host.docker.internal:host-gateway \
    -f Dockerfile \
    -t we-mp-rss:local \
    --build-arg HTTP_PROXY="${HTTP_PROXY_VAL}" \
    --build-arg HTTPS_PROXY="${HTTPS_PROXY_VAL}" \
    --build-arg NO_PROXY="${NO_PROXY_VAL}" \
    .
else
  docker compose -f docker-compose.dev.yml build
fi

echo "[dev] docker compose (dev) up -d"
if [[ "$USE_PROXY" == "true" ]]; then
  docker compose -f docker-compose.dev.yml up -d --no-build
else
  docker compose -f docker-compose.dev.yml up -d
fi

echo "[dev] done"
