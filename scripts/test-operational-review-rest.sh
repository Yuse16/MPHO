#!/bin/sh
set -eu
status_output="$(supabase status -o env)"
extract(){ printf '%s\n' "$status_output"|sed -n "s/^$1=\"\(.*\)\"$/\1/p"; }
api_url="$(extract API_URL)";anon_key="$(extract ANON_KEY)";service_key="$(extract SERVICE_ROLE_KEY)";rest_url="${api_url}/rest/v1"
project_id="$(sed -n 's/^project_id = "\(.*\)"/\1/p' supabase/config.toml)";db_container="supabase_db_${project_id}"
temporary="$(mktemp -d)";email_c="phase7-c-$$@example.test";email_o="phase7-o-$$@example.test";email_a="phase7-a-$$@example.test";password='Local-only-phase7-test-42!'
db(){ docker exec "$db_container" psql --username postgres --dbname postgres --set ON_ERROR_STOP=1 --tuples-only --no-align --command "$1"; }
cleanup(){ db "DELETE FROM auth.users WHERE email IN ('${email_c}','${email_o}','${email_a}');" >/dev/null 2>&1||true;rm -rf "$temporary";};trap cleanup EXIT
signup(){ curl -sS -o "$2" -X POST -H "apikey: ${anon_key}" -H 'Content-Type: application/json' --data "{\"email\":\"$1\",\"password\":\"${password}\"}" "${api_url}/auth/v1/signup";jq -er '.access_token' "$2"; }
rpc(){ curl -sS -o "$4" -X POST -H "apikey: ${anon_key}" -H "Authorization: Bearer $2" -H 'Content-Type: application/json' --data "$3" "${rest_url}/rpc/$1"; }
token_c="$(signup "$email_c" "$temporary/c.json")";token_o="$(signup "$email_o" "$temporary/o.json")";token_a="$(signup "$email_a" "$temporary/a.json")"
profile_o="$(db "SELECT id FROM public.profiles WHERE email='${email_o}';")";profile_a="$(db "SELECT id FROM public.profiles WHERE email='${email_a}';")"
db "DELETE FROM public.customers WHERE profile_id IN ('${profile_o}','${profile_a}'); DELETE FROM public.user_roles WHERE profile_id IN ('${profile_o}','${profile_a}'); UPDATE public.profiles SET default_role='mpho_operator' WHERE id='${profile_o}'; UPDATE public.profiles SET default_role='mpho_admin' WHERE id='${profile_a}'; INSERT INTO public.user_roles(profile_id,role) VALUES('${profile_o}','mpho_operator'),('${profile_a}','mpho_admin');" >/dev/null
city_id="$(db "SELECT id FROM public.cities WHERE name='Saltillo';")";zone_id="$(db "SELECT id FROM public.zones WHERE city_id='${city_id}' AND slug='centro';")"
rpc mutate_customer_cart "$token_c" '{"p_operation":"add_item","p_payload":{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":1},"p_expected_version":0}' "$temporary/cart.json"
cart_id="$(jq -er '.cart.id' "$temporary/cart.json")"
rpc mutate_customer_cart "$token_c" '{"p_operation":"put_recipient","p_payload":{"name":"REST private recipient","phone":"8440000000","surpriseMode":"none"},"p_expected_version":1}' "$temporary/recipient.json"
rpc mutate_customer_cart "$token_c" "{\"p_operation\":\"put_address\",\"p_payload\":{\"street\":\"REST private street\",\"exteriorNumber\":\"1\",\"cityId\":\"${city_id}\",\"zoneId\":\"${zone_id}\",\"countryCode\":\"MX\"},\"p_expected_version\":2}" "$temporary/address.json"
future="$(date -u -v+2d '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null||date -u -d '+2 days' '+%Y-%m-%dT%H:%M:%SZ')"
rpc mutate_customer_cart "$token_c" "{\"p_operation\":\"put_delivery\",\"p_payload\":{\"requestedDeliveryAt\":\"${future}\"},\"p_expected_version\":3}" "$temporary/date.json"
rpc create_customer_draft_order "$token_c" "{\"p_cart_id\":\"${cart_id}\",\"p_expected_version\":4,\"p_idempotency_key\":\"phase7-rest-draft\",\"p_request_id\":\"87000000-0000-4000-8000-000000000001\"}" "$temporary/draft.json"
order_id="$(jq -er '.order.id' "$temporary/draft.json")"
rpc submit_customer_order_review "$token_c" "{\"p_order_id\":\"${order_id}\",\"p_expected_version\":1,\"p_idempotency_key\":\"phase7-rest-submit\",\"p_request_id\":\"87000000-0000-4000-8000-000000000002\"}" "$temporary/submit.json"
[ "$(jq -r '.order.state' "$temporary/submit.json")" = quote_pending ];! grep -qi 'partner\|aliado\|punto mpho' "$temporary/submit.json"
echo 'PASS Customer enters neutral quote_pending without internal identity'
command(){ rpc central_review_command "$1" "{\"p_order_id\":\"${order_id}\",\"p_command\":\"$2\",\"p_payload\":$3,\"p_expected_version\":$4,\"p_idempotency_key\":\"$5\",\"p_request_id\":\"$6\"}" "$7"; }
command "$token_o" run_checks '{}' 2 phase7-rest-checks 87000000-0000-4000-8000-000000000003 "$temporary/checks.json"
expiry="$(date -u -v+30M '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null||date -u -d '+30 minutes' '+%Y-%m-%dT%H:%M:%SZ')"
command "$token_o" set_check "{\"dimension\":\"schedule\",\"status\":\"validated\",\"expiresAt\":\"${expiry}\",\"sourceReference\":\"REST manual\"}" 3 phase7-rest-schedule 87000000-0000-4000-8000-000000000004 "$temporary/schedule.json"
command "$token_o" set_check "{\"dimension\":\"capacity\",\"status\":\"validated\",\"expiresAt\":\"${expiry}\",\"sourceReference\":\"REST manual\"}" 4 phase7-rest-capacity 87000000-0000-4000-8000-000000000005 "$temporary/capacity.json"
command "$token_o" set_check "{\"dimension\":\"personalization\",\"status\":\"validated\",\"expiresAt\":\"${expiry}\",\"sourceReference\":\"REST manual\"}" 5 phase7-rest-personal 87000000-0000-4000-8000-000000000006 "$temporary/personal.json"
command "$token_o" propose_delivery "{\"amountMinor\":9900,\"sourceType\":\"manual_verified\",\"sourceReference\":\"REST verified\",\"reason\":\"REST verified delivery\",\"expiresAt\":\"${expiry}\",\"pricingVersion\":\"phase-7-rest-v1\"}" 6 phase7-rest-delivery 87000000-0000-4000-8000-000000000007 "$temporary/delivery.json"
component_id="$(jq -er '.review.delivery.id' "$temporary/delivery.json")"
command "$token_a" approve_delivery "{\"componentId\":\"${component_id}\"}" 7 phase7-rest-approve 87000000-0000-4000-8000-000000000008 "$temporary/approve.json"
command "$token_a" finalize_quote '{}' 8 phase7-rest-final 87000000-0000-4000-8000-000000000009 "$temporary/final.json"
rpc get_customer_order "$token_c" "{\"p_order_id\":\"${order_id}\"}" "$temporary/customer-final.json"
jq -e '.state=="quoted" and .totalIsFinal==true and .delivery.amountMinor==9900 and .service.amountMinor==0 and .quoteExpiresAt!=null' "$temporary/customer-final.json" >/dev/null
jq -e '[(..|objects|keys[])|select(test("partner|sourceType|internalReason|checks";"i"))]|length==0' "$temporary/customer-final.json" >/dev/null
echo 'PASS approved delivery, explicit zero service and safe immutable final quote'
auth_user_id="$(db "SELECT auth_user_id FROM public.profiles WHERE email='${email_c}';")"
rpc begin_payment_checkout "$service_key" "{\"p_auth_user_id\":\"${auth_user_id}\",\"p_order_id\":\"${order_id}\",\"p_expected_version\":9,\"p_idempotency_key\":\"phase8-rest-checkout\",\"p_request_id\":\"88000000-0000-4000-8000-000000000001\",\"p_environment\":\"test\",\"p_minimum_seconds\":600}" "$temporary/begin-payment.json"
attempt_id="$(jq -er '.attemptId' "$temporary/begin-payment.json")";external_reference="$(jq -er '.externalReference' "$temporary/begin-payment.json")";amount_minor="$(jq -er '.amountMinor' "$temporary/begin-payment.json")";payment_expiry="$(jq -er '.expiresAt' "$temporary/begin-payment.json")"
case "$external_reference" in *"$order_id"*|MPHO-*) echo 'FAIL external reference is not opaque' >&2;exit 1;;esac
rpc complete_payment_checkout "$service_key" "{\"p_attempt_id\":\"${attempt_id}\",\"p_preference_id\":\"fake-preference-phase8\",\"p_checkout_url\":\"https://sandbox.mercadopago.com.mx/checkout/v1/redirect\",\"p_provider_expires_at\":\"${payment_expiry}\",\"p_request_id\":\"88000000-0000-4000-8000-000000000002\"}" "$temporary/complete-payment.json"
jq -e '.ok==true and .order.state=="pending_payment" and .order.payment.checkoutUrl!=null and (.order.payment|has("providerPaymentId")|not)' "$temporary/complete-payment.json" >/dev/null
payment_time="$(date -u '+%Y-%m-%dT%H:%M:%SZ')";provider_payment_id="fake-payment-$$"
rpc register_payment_provider_event "$service_key" "{\"p_environment\":\"test\",\"p_event_id\":\"fake-event-$$\",\"p_event_type\":\"payment\",\"p_action\":\"payment.updated\",\"p_resource_id\":\"${provider_payment_id}\",\"p_signature_valid\":true,\"p_live_mode\":false,\"p_request_id\":\"fake-request-$$\",\"p_payload_hash\":\"0000000000000000000000000000000000000000000000000000000000000000\",\"p_sanitized\":{\"source\":\"phase8_rest_fake\"}}" "$temporary/event.json"
event_id="$(jq -er '.eventId' "$temporary/event.json")"
payment_payload="{\"id\":\"${provider_payment_id}\",\"status\":\"approved\",\"statusDetail\":\"accredited\",\"normalizedStatus\":\"approved\",\"externalReference\":\"${external_reference}\",\"preferenceId\":null,\"amountMinor\":${amount_minor},\"currency\":\"MXN\",\"liveMode\":false,\"applicationId\":null,\"createdAt\":\"${payment_time}\",\"approvedAt\":\"${payment_time}\",\"refunded\":false}"
rpc process_provider_payment "$service_key" "{\"p_event_id\":\"${event_id}\",\"p_payment\":${payment_payload},\"p_expected_environment\":\"test\",\"p_expected_application_id\":\"phase8-test-app\"}" "$temporary/approved.json"
jq -e '.ok==true and .status=="approved"' "$temporary/approved.json" >/dev/null
rpc process_provider_payment "$service_key" "{\"p_event_id\":\"${event_id}\",\"p_payment\":${payment_payload},\"p_expected_environment\":\"test\",\"p_expected_application_id\":\"phase8-test-app\"}" "$temporary/replay.json"
jq -e '.ok==true and .replayed==true' "$temporary/replay.json" >/dev/null
rpc get_customer_order "$token_c" "{\"p_order_id\":\"${order_id}\"}" "$temporary/customer-paid.json"
jq -e '.state=="paid" and .paidAt!=null and .payment.status=="approved" and (.payment|has("providerPaymentId")|not) and (.payment|has("providerStatusDetail")|not)' "$temporary/customer-paid.json" >/dev/null
echo 'PASS fake provider approval changes pending_payment to paid once with a safe Customer DTO'
echo 'Result: PASS (Phase 7 review and Phase 8 payment REST/RPC boundary)'
