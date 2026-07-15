#!/bin/sh
set -eu
status_output="$(supabase status -o env)"
extract(){ printf '%s\n' "$status_output"|sed -n "s/^$1=\"\(.*\)\"$/\1/p"; }
api_url="$(extract API_URL)";anon_key="$(extract ANON_KEY)";rest_url="${api_url}/rest/v1"
project_id="$(sed -n 's/^project_id = "\(.*\)"/\1/p' supabase/config.toml)";db_container="supabase_db_${project_id}"
temporary="$(mktemp -d)";email_a="phase6-a-$$@example.test";email_b="phase6-b-$$@example.test";email_p="phase6-p-$$@example.test";password='Local-only-cart-test-42!'
db(){ docker exec "$db_container" psql --username postgres --dbname postgres --set ON_ERROR_STOP=1 --tuples-only --no-align --command "$1"; }
cleanup(){ db "DELETE FROM auth.users WHERE email IN ('${email_a}','${email_b}','${email_p}');" >/dev/null 2>&1||true;rm -rf "$temporary";};trap cleanup EXIT
signup(){ curl -sS -o "$2" -X POST -H "apikey: ${anon_key}" -H 'Content-Type: application/json' --data "{\"email\":\"$1\",\"password\":\"${password}\"}" "${api_url}/auth/v1/signup";jq -er '.access_token' "$2"; }
rpc(){ curl -sS -o "$4" -w '%{http_code}' -X POST -H "apikey: ${anon_key}" -H "Authorization: Bearer $2" -H 'Content-Type: application/json' --data "$3" "${rest_url}/rpc/$1"; }
token_a="$(signup "$email_a" "$temporary/a.json")";token_b="$(signup "$email_b" "$temporary/b.json")";token_p="$(signup "$email_p" "$temporary/p.json")"
profile_p="$(db "SELECT id FROM public.profiles WHERE email='${email_p}';")";customer_p="$(db "SELECT id FROM public.customers WHERE profile_id='${profile_p}';")";db "DELETE FROM public.user_roles WHERE profile_id='${profile_p}'; DELETE FROM public.customers WHERE id='${customer_p}'; UPDATE public.profiles SET default_role='partner_operator' WHERE id='${profile_p}'; INSERT INTO public.user_roles(profile_id,role) VALUES('${profile_p}','partner_operator');" >/dev/null

add='{"p_operation":"add_item","p_payload":{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":1,"personalization":{"message":"Texto privado","spellingConfirmed":true}},"p_expected_version":0}'
[ "$(rpc mutate_customer_cart "$token_a" "$add" "$temporary/add.json")" = 200 ];[ "$(jq -r '.cart.version' "$temporary/add.json")" = 1 ];cart_id="$(jq -er '.cart.id' "$temporary/add.json")"
echo 'PASS REST cart created with authoritative selection and version 1'

rpc mutate_customer_cart "$token_a" '{"p_operation":"add_item","p_payload":{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":1},"p_expected_version":1}' "$temporary/tab1.json" >/dev/null & pid1=$!
rpc mutate_customer_cart "$token_a" '{"p_operation":"add_item","p_payload":{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":1},"p_expected_version":1}' "$temporary/tab2.json" >/dev/null & pid2=$!
wait "$pid1";wait "$pid2";[ "$(jq -s '[.[].ok]|map(select(.==true))|length' "$temporary/tab1.json" "$temporary/tab2.json")" = 1 ];[ "$(jq -s '[.[].error.code]|map(select(.=="VERSION_CONFLICT"))|length' "$temporary/tab1.json" "$temporary/tab2.json")" = 1 ]
echo 'PASS concurrent tabs produce one mutation and one typed version conflict'

version=2;city_id="$(db "SELECT id FROM public.cities WHERE name='Saltillo';")";zone_id="$(db "SELECT z.id FROM public.zones z JOIN public.cities c ON c.id=z.city_id WHERE c.name='Saltillo' AND z.status='active' LIMIT 1;")"
rpc mutate_customer_cart "$token_a" "{\"p_operation\":\"put_recipient\",\"p_payload\":{\"name\":\"Nombre privado\",\"phone\":\"8440000000\",\"surpriseMode\":\"none\"},\"p_expected_version\":${version}}" "$temporary/recipient.json" >/dev/null;version=3
rpc mutate_customer_cart "$token_a" "{\"p_operation\":\"put_address\",\"p_payload\":{\"street\":\"Calle privada\",\"exteriorNumber\":\"1\",\"cityId\":\"${city_id}\",\"zoneId\":\"${zone_id}\",\"countryCode\":\"MX\"},\"p_expected_version\":${version}}" "$temporary/address.json" >/dev/null;version=4
future="$(date -u -v+2d '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null||date -u -d '+2 days' '+%Y-%m-%dT%H:%M:%SZ')";rpc mutate_customer_cart "$token_a" "{\"p_operation\":\"put_delivery\",\"p_payload\":{\"requestedDeliveryAt\":\"${future}\"},\"p_expected_version\":${version}}" "$temporary/delivery.json" >/dev/null;version=5
[ "$(db "SELECT count(*) FROM public.recipients r WHERE r.name='Nombre privado';")" = 0 ];[ "$(db "SELECT count(*) FROM public.addresses a WHERE a.street='Calle privada';")" = 0 ]
echo 'PASS recipient and address remain cart-only PII'

draft="{\"p_cart_id\":\"${cart_id}\",\"p_expected_version\":${version},\"p_idempotency_key\":\"rest-phase6-key\",\"p_request_id\":\"76000000-0000-4000-8000-000000000001\"}"
rpc create_customer_draft_order "$token_a" "$draft" "$temporary/draft1.json" >/dev/null & pid1=$!;rpc create_customer_draft_order "$token_a" "$draft" "$temporary/draft2.json" >/dev/null & pid2=$!;wait "$pid1";wait "$pid2"
order1="$(jq -er '.order.id' "$temporary/draft1.json")";order2="$(jq -er '.order.id' "$temporary/draft2.json")";[ "$order1" = "$order2" ];[ "$(db "SELECT count(*) FROM public.orders WHERE idempotency_key='rest-phase6-key';")" = 1 ];[ "$(db "SELECT count(*) FROM public.quotes WHERE id IN (SELECT quote_id FROM public.orders WHERE id='${order1}');")" = 1 ];[ "$(jq -r '.order.totalIsFinal' "$temporary/draft1.json")" = false ];jq -e '[(..|objects|keys[])|select(test("partner|payment|reservation|deliveryProvider";"i"))]|length==0' "$temporary/draft1.json" >/dev/null
echo 'PASS atomic requires_review draft, fresh quote, idempotent race, and safe DTO'

rpc get_customer_order "$token_b" "{\"p_order_id\":\"${order1}\"}" "$temporary/foreign.json" >/dev/null;[ "$(jq -r '.' "$temporary/foreign.json")" = null ]
rpc get_customer_cart "$token_p" '{}' "$temporary/partner.json" >/dev/null;[ "$(jq -r '.error.code' "$temporary/partner.json")" = UNAUTHORIZED ];! grep -q 'Nombre privado\|Calle privada\|8440000000\|Texto privado' "$temporary/foreign.json" "$temporary/partner.json"
echo 'PASS Customer B and partner cannot discover order or cart PII'

echo 'Result: PASS (Phase 6 cart/order REST and concurrency boundary)'
