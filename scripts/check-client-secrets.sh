#!/bin/sh
set -eu

if grep -R -n -E 'SUPABASE_SERVICE_ROLE_KEY|service_role' apps \
  --exclude-dir='.next' \
  --exclude-dir='node_modules' \
  --exclude-dir='dist' \
  --exclude-dir='coverage' \
  --include='*.ts' \
  --include='*.tsx' \
  --include='*.js' \
  --include='*.mjs'; then
  echo "Privileged Supabase credential reference found in application code." >&2
  exit 1
fi
