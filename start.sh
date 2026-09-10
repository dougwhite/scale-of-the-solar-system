#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "$0")"
command -v npm >/dev/null 2>&1 || { echo 'Install Node.js 20 or newer first: https://nodejs.org'; exit 1; }
npm install --no-audit --no-fund
exec npm start
