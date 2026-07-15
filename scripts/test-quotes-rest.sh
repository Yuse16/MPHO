#!/bin/sh
set -eu

status_output="$(supabase status -o env)"
extract() { printf '%s\n' "$status_output" | sed -n "s/^$1=\"\(.*\)\"$/\1/p"; }
api_url="$(extract API_URL)"
anon_key="$(extract ANON_KEY)"
: "${api_url:?API_URL unavailable}" "${anon_key:?ANON_KEY unavailable}"
rest_url="${api_url}/rest/v1"
project_id="$(sed -n 's/^project_id = "\(.*\)"/\1/p' supabase/config.toml)"
db_container="supabase_db_${project_id}"
temporary="$(mktemp -d)"
email_a="phase5-a-$$@example.test"
email_b="phase5-b-$$@example.test"
password='Local-only-quote-test-42!'

db() { docker exec "$db_container" psql --username postgres --dbname postgres --set ON_ERROR_STOP=1 --tuples-only --no-align --command "$1"; }
cleanup() { db "DELETE FROM auth.users WHERE email IN ('${email_a}','${email_b}');" >/dev/null 2>&1 || true; rm -rf "$temporary"; }
trap cleanup EXIT

signup() {
  email="$1"; output="$2"
  curl --silent --show-error --output "$output" --request POST --header "apikey: ${anon_key}" --header 'Content-Type: application/json' --data "{\"email\":\"${email}\",\"password\":\"${password}\"}" "${api_url}/auth/v1/signup"
  jq -er '.access_token' "$output"
}
rpc() {
  name="$1"; token="$2"; body="$3"; output="$4"
  curl --silent --show-error --output "$output" --write-out '%{http_code}' --request POST --header "apikey: ${anon_key}" --header "Authorization: Bearer ${token}" --header 'Content-Type: application/json' --data "$body" "${rest_url}/rpc/${name}"
}
assert_200() { [ "$1" = 200 ] || { echo "FAIL $2: HTTP $1" >&2; exit 1; }; }

code="$(rpc calculate_public_quote "$anon_key" '{"p_request":{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":2}]}}' "$temporary/preview.json")"
assert_200 "$code" 'public preview'
[ "$(jq -r '.quote.subtotal.amountMinor' "$temporary/preview.json")" = 258000 ]
[ "$(jq -r '.quote.delivery' "$temporary/preview.json")" = null ]
[ "$(jq -r '.quote.availabilityStatus' "$temporary/preview.json")" = requires_review ]
jq -e '[(.. | objects | keys[]) | select(test("partner|cost|commission|earning"; "i"))] | length == 0' "$temporary/preview.json" >/dev/null
echo 'PASS public preview: authoritative subtotal, unknown delivery, no partner/internal fields'

code="$(rpc calculate_public_quote "$anon_key" '{"p_request":{"unitPrice":1,"total":1,"discount":1,"partnerId":"attacker","items":[{"listingId":"f1000000-0000-0000-0000-000000000001","optionIds":[],"quantity":1}]}}' "$temporary/tampered.json")"
assert_200 "$code" 'tampered preview'
[ "$(jq -r '.quote.subtotal.amountMinor' "$temporary/tampered.json")" = 129000 ]
echo 'PASS manipulated browser prices ignored by authoritative database calculation'

for fixture in \
  'draft|{"p_request":{"items":[{"listingId":"00000000-0000-0000-0000-000000000000","optionIds":[],"quantity":1}]}}|LISTING_NOT_FOUND' \
  'variant|{"p_request":{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":"00000000-0000-0000-0000-000000000001","optionIds":[],"quantity":1}]}}|VARIANT_INVALID' \
  'option|{"p_request":{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","optionIds":["00000000-0000-0000-0000-000000000001"],"quantity":1}]}}|OPTION_INVALID' \
  'zone|{"p_request":{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","optionIds":[],"quantity":1}],"zoneId":"00000000-0000-0000-0000-000000000001"}}|ZONE_UNAVAILABLE'
do
  label="${fixture%%|*}"; remainder="${fixture#*|}"; body="${remainder%|*}"; expected="${fixture##*|}"
  code="$(rpc calculate_public_quote "$anon_key" "$body" "$temporary/${label}.json")"; assert_200 "$code" "$label"
  [ "$(jq -r '.error.code' "$temporary/${label}.json")" = "$expected" ] || { echo "FAIL ${label}" >&2; exit 1; }
  echo "PASS ${label}: ${expected}"
done

token_a="$(signup "$email_a" "$temporary/a.json")"
token_b="$(signup "$email_b" "$temporary/b.json")"
create_body='{"p_request":{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","optionIds":[],"quantity":1}]},"p_idempotency_key":"rest-phase5-key"}'
code="$(rpc create_customer_quote "$token_a" "$create_body" "$temporary/create.json")"; assert_200 "$code" 'persisted quote'
quote_id="$(jq -er '.quote.id' "$temporary/create.json")"
code="$(rpc create_customer_quote "$token_a" "$create_body" "$temporary/repeat.json")"; assert_200 "$code" 'idempotent repeat'
[ "$(jq -r '.quote.id' "$temporary/repeat.json")" = "$quote_id" ]
[ "$(db "SELECT count(*) FROM public.quotes WHERE idempotency_key='rest-phase5-key';")" = 1 ]
echo 'PASS persisted quote and database-backed idempotency'

code="$(rpc get_customer_quote "$token_a" "{\"p_quote_id\":\"${quote_id}\"}" "$temporary/own.json")"; assert_200 "$code" 'own quote'
[ "$(jq -r '.id' "$temporary/own.json")" = "$quote_id" ]
code="$(rpc get_customer_quote "$token_b" "{\"p_quote_id\":\"${quote_id}\"}" "$temporary/foreign.json")"; assert_200 "$code" 'foreign quote'
[ "$(jq -r '.' "$temporary/foreign.json")" = null ]
echo 'PASS Customer A access and Customer B not-found isolation'

echo 'Result: PASS (quote REST/RPC boundary)'
