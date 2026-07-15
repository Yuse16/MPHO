#!/bin/sh
set -eu

temporary="$(mktemp)"
trap 'rm -f "$temporary"' EXIT

supabase db diff --local --schema public > "$temporary"

if grep -Eqi '^[[:space:]]*(create|alter|drop|grant|revoke|comment|insert|update|delete)[[:space:]]' "$temporary"; then
  cat "$temporary"
  echo "Schema drift detected between migrations and the local database." >&2
  exit 1
fi
