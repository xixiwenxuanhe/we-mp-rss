#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

DIST_DIR="${SCRIPT_DIR}/dist"
TARGET_DIR="${ROOT_DIR}/static"

cd "${SCRIPT_DIR}"
yarn install
yarn build

echo "正在复制构建文件到${TARGET_DIR}..."
rm -rf "${TARGET_DIR:?}"/*
cp -rf "${DIST_DIR}/"* "${TARGET_DIR}/"
