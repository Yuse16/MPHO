#!/bin/sh
set -eu

matches=$(grep -R -n -E 'SUPABASE_SERVICE_ROLE_KEY|service_role' apps \
  --exclude-dir='.next' \
  --exclude-dir='node_modules' \
  --exclude-dir='dist' \
  --exclude-dir='coverage' \
  --include='*.ts' \
  --include='*.tsx' \
  --include='*.js' \
  --include='*.mjs' | grep -v -E '^apps/(customer/lib/supabase/payment-admin|central/lib/payment-admin)\.ts:' || true)
if [ -n "$matches" ]; then
  printf '%s\n' "$matches"
  echo "Privileged Supabase credential reference found in application code." >&2
  exit 1
fi

# The sole approved exception must remain isolated and server-only.
grep -q "^import 'server-only'$" apps/customer/lib/supabase/payment-admin.ts
grep -q 'SUPABASE_SERVICE_ROLE_KEY' apps/customer/lib/supabase/payment-admin.ts
grep -q "^import 'server-only'$" apps/central/lib/payment-admin.ts
grep -q 'SUPABASE_SERVICE_ROLE_KEY' apps/central/lib/payment-admin.ts
