#!/bin/sh
set -eu

status_output="$(supabase status -o env)"
extract_status_value() {
  name="$1"
  printf '%s\n' "$status_output" | sed -n "s/^${name}=\"\(.*\)\"$/\1/p"
}

NEXT_PUBLIC_SUPABASE_URL="$(extract_status_value API_URL)"
NEXT_PUBLIC_SUPABASE_ANON_KEY="$(extract_status_value ANON_KEY)"

: "${NEXT_PUBLIC_SUPABASE_URL:?Supabase API_URL is unavailable}"
: "${NEXT_PUBLIC_SUPABASE_ANON_KEY:?Supabase ANON_KEY is unavailable}"

rest_url="${NEXT_PUBLIC_SUPABASE_URL}/rest/v1"
project_id="$(sed -n 's/^project_id = "\(.*\)"/\1/p' supabase/config.toml)"
db_container="supabase_db_${project_id}"
product_id='eeeeeeee-0000-0000-0000-000000000091'
listing_id='ffffffff-0000-0000-0000-000000000091'
variant_id='aaaaaaaa-0000-0000-0000-000000000091'
option_id='bbbbbbbb-0000-0000-0000-000000000091'
tag_id='d1000000-0000-0000-0000-000000000001'

database_request() {
  sql="$1"
  docker exec "$db_container" psql \
    --username postgres \
    --dbname postgres \
    --set ON_ERROR_STOP=1 \
    --command "$sql" >/dev/null
}

anon_get() {
  path="$1"
  output="$2"
  curl --silent --show-error \
    --output "$output" \
    --write-out '%{http_code}' \
    --header "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
    --header "Authorization: Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
    "${rest_url}/${path}"
}

anon_rpc() {
  function_name="$1"
  body="$2"
  output="$3"
  curl --silent --show-error \
    --output "$output" \
    --write-out '%{http_code}' \
    --request POST \
    --header "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
    --header "Authorization: Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
    --header 'Content-Type: application/json' \
    --data "$body" \
    "${rest_url}/rpc/${function_name}"
}

assert_code() {
  actual="$1"
  expected="$2"
  label="$3"
  if [ "$actual" != "$expected" ]; then
    echo "FAIL ${label}: expected HTTP ${expected}, received ${actual}" >&2
    exit 1
  fi
}

assert_denied() {
  actual="$1"
  label="$2"
  case "$actual" in
    401|403) ;;
    *)
      echo "FAIL ${label}: expected HTTP 401/403, received ${actual}" >&2
      exit 1
      ;;
  esac
}

cleanup() {
  database_request "DELETE FROM public.products WHERE id = '${product_id}';" >/dev/null 2>&1 || true
}
trap cleanup EXIT
cleanup

database_request "
  BEGIN;
  INSERT INTO public.products (
    id, name, slug, description, product_type, category_id, status
  ) VALUES (
    '${product_id}', 'Producto REST privado', 'producto-rest-privado',
    'Fixture privado', 'product',
    'a1000000-0000-0000-0000-000000000001', 'draft'
  );
  INSERT INTO public.listings (
    id, product_id, source_type, external_source_id, customer_title,
    customer_description, status, availability_mode, base_price_amount_minor,
    currency, last_verified_at, cancellation_note
  ) VALUES (
    '${listing_id}', '${product_id}', 'external_curated',
    'dddddddd-0000-0000-0000-000000000091', 'Listing REST privado',
    'No debe ser público', 'draft', 'partner_confirmation', 10000, 'MXN',
    '2026-07-14T00:00:00Z', 'Interna'
  );
  INSERT INTO public.listing_variants (
    id, listing_id, name, price_adjustment_amount_minor, currency, status
  ) VALUES (
    '${variant_id}', '${listing_id}', 'Variante privada', 0, 'MXN', 'active'
  );
  INSERT INTO public.listing_options (
    id, listing_id, option_type, label, price_adjustment_amount_minor, currency, status
  ) VALUES (
    '${option_id}', '${listing_id}', 'message', 'Opción privada', 0, 'MXN', 'active'
  );
  INSERT INTO public.listing_zones (listing_id, zone_id, status)
  SELECT '${listing_id}', id, 'active'
  FROM public.zones
  WHERE status = 'active'
  ORDER BY id
  LIMIT 1;
  INSERT INTO public.product_tags (product_id, tag_id)
  VALUES ('${product_id}', '${tag_id}');
  COMMIT;
"

temporary="$(mktemp -d)"
trap 'cleanup; rm -rf "$temporary"' EXIT

code="$(anon_get 'listings?select=id,status&id=eq.f1000000-0000-0000-0000-000000000001' "$temporary/published.json")"
assert_code "$code" 200 'published listing'
published_count="$(jq 'length' "$temporary/published.json")"
[ "$published_count" -eq 1 ] || { echo "FAIL published listing count: ${published_count}" >&2; exit 1; }
echo "PASS published listing: HTTP ${code}, rows=${published_count}"

code="$(anon_get "listings?select=id,status&id=eq.${listing_id}" "$temporary/draft.json")"
assert_code "$code" 200 'draft listing RLS'
draft_count="$(jq 'length' "$temporary/draft.json")"
[ "$draft_count" -eq 0 ] || { echo "FAIL draft listing visible" >&2; exit 1; }
echo "PASS draft listing hidden: HTTP ${code}, rows=${draft_count}"

for field in partner_id external_source_id last_verified_at cancellation_note; do
  code="$(anon_get "listings?select=${field}&limit=1" "$temporary/${field}.json")"
  assert_denied "$code" "$field"
  echo "PASS ${field} denied: HTTP ${code}"
done

code="$(anon_get "listing_variants?select=id&listing_id=eq.${listing_id}" "$temporary/variants.json")"
assert_code "$code" 200 'draft variants'
[ "$(jq 'length' "$temporary/variants.json")" -eq 0 ] || { echo 'FAIL draft variant visible' >&2; exit 1; }
echo "PASS draft variants hidden: HTTP ${code}, rows=0"

code="$(anon_get "listing_options?select=id&listing_id=eq.${listing_id}" "$temporary/options.json")"
assert_code "$code" 200 'draft options'
[ "$(jq 'length' "$temporary/options.json")" -eq 0 ] || { echo 'FAIL draft option visible' >&2; exit 1; }
echo "PASS draft options hidden: HTTP ${code}, rows=0"

code="$(anon_get "listing_zones?select=listing_id&listing_id=eq.${listing_id}" "$temporary/zones.json")"
assert_code "$code" 200 'draft zones'
[ "$(jq 'length' "$temporary/zones.json")" -eq 0 ] || { echo 'FAIL draft zone visible' >&2; exit 1; }
echo "PASS draft zones hidden: HTTP ${code}, rows=0"

code="$(anon_get "product_tags?select=product_id&product_id=eq.${product_id}" "$temporary/tags.json")"
assert_code "$code" 200 'unpublished product tags'
[ "$(jq 'length' "$temporary/tags.json")" -eq 0 ] || { echo 'FAIL unpublished product tag visible' >&2; exit 1; }
echo "PASS unpublished product tags hidden: HTTP ${code}, rows=0"

code="$(anon_rpc get_public_catalog '{"p_category_slug":"flores"}' "$temporary/category.json")"
if [ "$code" != 200 ]; then
  jq '{code, message, details, hint}' "$temporary/category.json" >&2
fi
assert_code "$code" 200 'category RPC'
category_count="$(jq 'length' "$temporary/category.json")"
category_wrong="$(jq '[.[] | select(.category_slug != "flores")] | length' "$temporary/category.json")"
[ "$category_count" -eq 3 ] && [ "$category_wrong" -eq 0 ] || { echo 'FAIL category filter' >&2; exit 1; }
echo "PASS categorySlug=flores: HTTP ${code}, rows=${category_count}, wrong_category=${category_wrong}"

code="$(anon_rpc get_public_catalog '{"p_listing_slug":"rosas-premium"}' "$temporary/slug.json")"
assert_code "$code" 200 'slug RPC'
slug_count="$(jq 'length' "$temporary/slug.json")"
[ "$slug_count" -eq 1 ] || { echo "FAIL slug row count: ${slug_count}" >&2; exit 1; }
echo "PASS slug=rosas-premium: HTTP ${code}, rows=${slug_count}"

code="$(anon_rpc get_public_catalog '{"p_listing_slug":"no-existe"}' "$temporary/missing.json")"
assert_code "$code" 200 'missing slug RPC'
missing_count="$(jq 'length' "$temporary/missing.json")"
[ "$missing_count" -eq 0 ] || { echo 'FAIL missing slug was not empty' >&2; exit 1; }
echo "PASS missing slug controlled: HTTP ${code}, rows=${missing_count}"

echo 'Result: PASS (anonymous PostgREST catalog boundary)'
