BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT extensions.plan(21);

INSERT INTO public.profiles (id, auth_user_id, email, status, default_role) VALUES
('51000000-0000-4000-8000-000000000001','51000000-0000-4000-8000-000000000011','a@test.local','active','customer'),
('52000000-0000-4000-8000-000000000002','52000000-0000-4000-8000-000000000022','b@test.local','active','customer'),
('53000000-0000-4000-8000-000000000003','53000000-0000-4000-8000-000000000033','p@test.local','active','partner_operator');
INSERT INTO public.customers (id, profile_id) VALUES
('51000000-0000-4000-8000-000000000101','51000000-0000-4000-8000-000000000001'),
('52000000-0000-4000-8000-000000000202','52000000-0000-4000-8000-000000000002');
INSERT INTO public.user_roles (profile_id, role) VALUES
('51000000-0000-4000-8000-000000000001','customer'),
('52000000-0000-4000-8000-000000000002','customer'),
('53000000-0000-4000-8000-000000000003','partner_operator');

SELECT extensions.ok(NOT has_table_privilege('anon', 'public.quotes', 'SELECT'), 'anon cannot read quotes');
SELECT extensions.ok(NOT has_table_privilege('anon', 'public.quotes', 'INSERT'), 'anon cannot insert quotes');
SELECT extensions.is((public.calculate_public_quote('{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":2}]}'::jsonb)#>>'{ok}')::boolean, true, 'public preview succeeds');
SELECT extensions.is((public.calculate_public_quote('{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":2}]}'::jsonb)#>>'{quote,subtotal,amountMinor}')::bigint, 258000::bigint, 'authoritative subtotal is calculated');
SELECT extensions.is(public.calculate_public_quote('{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":1}]}'::jsonb)#>'{quote,delivery}', 'null'::jsonb, 'unknown delivery is null');
SELECT extensions.is((public.calculate_public_quote('{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":1}]}'::jsonb)#>>'{quote,totalIsFinal}')::boolean, false, 'unknown components prevent a final total');
SELECT extensions.ok(position('partner' in public.calculate_public_quote('{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":1}]}'::jsonb)::text) = 0, 'public quote contains no partner data');

INSERT INTO public.products (id,name,slug,product_type,status) VALUES ('54000000-0000-4000-8000-000000000001','Draft','draft-phase-5','product','draft');
INSERT INTO public.listings (id,product_id,source_type,customer_title,status,availability_mode,base_price_amount_minor,currency) VALUES ('54000000-0000-4000-8000-000000000002','54000000-0000-4000-8000-000000000001','external_curated','Draft','draft','external_by_order',100,'MXN');
SELECT extensions.is(public.calculate_public_quote('{"items":[{"listingId":"54000000-0000-4000-8000-000000000002","optionIds":[],"quantity":1}]}'::jsonb)#>>'{error,code}', 'LISTING_NOT_PUBLIC', 'draft listing is unavailable');
SELECT extensions.is(public.calculate_public_quote('{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":"54000000-0000-4000-8000-000000000003","optionIds":[],"quantity":1}]}'::jsonb)#>>'{error,code}', 'VARIANT_INVALID', 'invalid variant is rejected');
SELECT extensions.is(public.calculate_public_quote('{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","optionIds":["54000000-0000-4000-8000-000000000004"],"quantity":1}]}'::jsonb)#>>'{error,code}', 'OPTION_INVALID', 'invalid option is rejected');
SELECT extensions.is(public.calculate_public_quote('{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","optionIds":[],"quantity":1}],"zoneId":"54000000-0000-4000-8000-000000000005"}'::jsonb)#>>'{error,code}', 'ZONE_UNAVAILABLE', 'invalid zone is rejected');
SELECT extensions.is((public.calculate_public_quote('{"unitPrice":1,"total":1,"discount":1,"partnerId":"private","items":[{"listingId":"f1000000-0000-0000-0000-000000000001","optionIds":[],"quantity":1}]}'::jsonb)#>>'{quote,subtotal,amountMinor}')::bigint, 129000::bigint, 'database ignores manipulated browser prices and partner id');

SELECT set_config('request.jwt.claims', '{"sub":"51000000-0000-4000-8000-000000000011","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
SELECT extensions.is((public.create_customer_quote('{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","optionIds":[],"quantity":1}]}'::jsonb, 'phase5-key-a')#>>'{ok}')::boolean, true, 'customer creates a persisted quote');
SELECT extensions.is((SELECT count(*) FROM public.quotes), 1::bigint, 'customer sees own quote');
SELECT extensions.is((public.create_customer_quote('{"items":[{"listingId":"f1000000-0000-0000-0000-000000000001","optionIds":[],"quantity":99}]}'::jsonb, 'phase5-key-a')#>>'{quote,subtotal,amountMinor}')::bigint, 129000::bigint, 'same idempotency key returns original quote');
SELECT extensions.is((SELECT count(*) FROM public.quotes), 1::bigint, 'idempotency creates no duplicate');
SELECT extensions.ok(has_table_privilege('authenticated', 'public.quotes', 'SELECT'), 'authenticated has owner-scoped select');
SELECT extensions.ok(NOT has_table_privilege('authenticated', 'public.quotes', 'UPDATE'), 'customer cannot modify quote totals or customer id');

RESET ROLE;
SELECT set_config('request.jwt.claims', '{"sub":"52000000-0000-4000-8000-000000000022","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
SELECT extensions.is((SELECT count(*) FROM public.quotes), 0::bigint, 'customer B cannot read customer A quote');
SELECT extensions.is(public.get_customer_quote((SELECT id FROM public.quotes WHERE id IS NOT NULL LIMIT 1)), NULL::jsonb, 'foreign quote is returned as not found');

RESET ROLE;
SELECT set_config('request.jwt.claims', '{"sub":"53000000-0000-4000-8000-000000000033","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
SELECT extensions.is((SELECT count(*) FROM public.quotes), 0::bigint, 'partner cannot read customer quotes');

RESET ROLE;
SELECT * FROM extensions.finish();
ROLLBACK;
