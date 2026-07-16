BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT extensions.plan(38);
CREATE TEMP TABLE phase7_test_state(order_id uuid);
GRANT SELECT, INSERT ON phase7_test_state TO authenticated;

INSERT INTO public.profiles(id,auth_user_id,email,status,default_role) VALUES
('81000000-0000-4000-8000-000000000001','81000000-0000-4000-8000-000000000011','phase7-c@test.local','active','customer'),
('82000000-0000-4000-8000-000000000002','82000000-0000-4000-8000-000000000022','phase7-o@test.local','active','mpho_operator'),
('83000000-0000-4000-8000-000000000003','83000000-0000-4000-8000-000000000033','phase7-a@test.local','active','mpho_admin'),
('84000000-0000-4000-8000-000000000004','84000000-0000-4000-8000-000000000044','phase7-p@test.local','active','partner_operator');
INSERT INTO public.customers(id,profile_id) VALUES('81000000-0000-4000-8000-000000000101','81000000-0000-4000-8000-000000000001');
INSERT INTO public.user_roles(profile_id,role) VALUES
('81000000-0000-4000-8000-000000000001','customer'),
('82000000-0000-4000-8000-000000000002','mpho_operator'),
('83000000-0000-4000-8000-000000000003','mpho_admin'),
('84000000-0000-4000-8000-000000000004','partner_operator');
INSERT INTO public.partners(id,public_name,slug,status,city_id,timezone)
SELECT '85000000-0000-4000-8000-000000000005','Second internal test source','second-internal-test-source','active',id,'America/Monterrey' FROM public.cities WHERE name='Saltillo';
UPDATE public.listings SET partner_id='85000000-0000-4000-8000-000000000005',source_type='partner_local' WHERE id='f1000000-0000-0000-0000-000000000002';

SELECT extensions.ok(NOT has_table_privilege('authenticated','public.order_reviews','SELECT'),'reviews have no direct authenticated read');
SELECT extensions.ok(NOT has_table_privilege('authenticated','public.order_reviews','INSERT'),'reviews have no direct authenticated write');
SELECT extensions.ok(NOT has_table_privilege('authenticated','public.order_availability_checks','UPDATE'),'checks have no direct authenticated write');
SELECT extensions.ok(NOT has_table_privilege('authenticated','public.quote_components','INSERT'),'components have no direct authenticated write');
SELECT extensions.ok(NOT has_table_privilege('authenticated','public.audit_logs','SELECT'),'audit logs have no direct authenticated read');
SELECT extensions.hasnt_column('public','orders','responsible_partner_id','Phase 7 creates no responsible partner');
SELECT extensions.hasnt_table('public','order_assignment_attempts','Phase 7 creates no assignment attempts');
SELECT extensions.hasnt_table('public','payments','Phase 7 creates no payments');

SELECT set_config('request.jwt.claims','{"sub":"81000000-0000-4000-8000-000000000011","role":"authenticated"}',true);
SET LOCAL ROLE authenticated;
SELECT extensions.is(public.mutate_customer_cart('add_item','{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":1}',0)#>>'{ok}','true','Customer creates compatible local cart');
SELECT extensions.throws_ok($$SELECT public.mutate_customer_cart('add_item','{"listingId":"f1000000-0000-0000-0000-000000000002","variantId":null,"optionIds":[],"quantity":1}',1)$$,'P0001','INCOMPATIBLE_CART_ITEM','different internal source is rejected without exposing identity');
SELECT extensions.is(public.mutate_customer_cart('put_recipient','{"name":"PII recipient","phone":"8440000000","surpriseMode":"none"}',1)#>>'{ok}','true','recipient staged');
SELECT extensions.is(public.mutate_customer_cart('put_address',jsonb_build_object('street','PII street','exteriorNumber','1','cityId',(SELECT id FROM public.cities WHERE name='Saltillo'),'zoneId',(SELECT z.id FROM public.zones z JOIN public.cities c ON c.id=z.city_id WHERE c.name='Saltillo' AND z.slug='centro'),'countryCode','MX'),2)#>>'{ok}','true','address staged');
SELECT extensions.is(public.mutate_customer_cart('put_delivery',jsonb_build_object('requestedDeliveryAt',now()+interval '2 days'),3)#>>'{ok}','true','requested date staged');
SELECT extensions.is(public.create_customer_draft_order((public.get_customer_cart()#>>'{cart,id}')::uuid,4,'phase7-draft-key','86000000-0000-4000-8000-000000000001')#>>'{order,state}','draft','draft created');
INSERT INTO phase7_test_state SELECT id FROM public.orders;
SELECT extensions.is(public.submit_customer_order_review((SELECT order_id FROM phase7_test_state),1,'phase7-submit-key','86000000-0000-4000-8000-000000000002')#>>'{order,state}','quote_pending','Customer submits review');
SELECT extensions.is(public.submit_customer_order_review((SELECT order_id FROM phase7_test_state),1,'phase7-submit-key','86000000-0000-4000-8000-000000000003')#>>'{replayed}','true','submit review replays safely');
SELECT extensions.throws_ok('SELECT count(*) FROM public.order_reviews','42501','permission denied for table order_reviews','Customer cannot directly read internal reviews');
SELECT extensions.ok(position('partner' in public.get_customer_order((SELECT order_id FROM phase7_test_state))::text)=0,'Customer DTO contains no partner identity');

RESET ROLE;
SELECT set_config('request.jwt.claims','{"sub":"84000000-0000-4000-8000-000000000044","role":"authenticated"}',true);
SET LOCAL ROLE authenticated;
SELECT extensions.is(public.list_central_order_reviews()#>>'{error,code}','FORBIDDEN','Partner has no Central review access');

RESET ROLE;
SELECT set_config('request.jwt.claims','{"sub":"82000000-0000-4000-8000-000000000022","role":"authenticated"}',true);
SET LOCAL ROLE authenticated;
SELECT extensions.is(public.list_central_order_reviews()#>>'{ok}','true','operator can list masked reviews');
SELECT extensions.ok(position('PII recipient' in public.list_central_order_reviews()::text)=0,'Central queue masks recipient PII');
SELECT extensions.is(public.central_review_command((SELECT order_id FROM phase7_test_state),'run_checks','{}',2,'phase7-checks-key','86000000-0000-4000-8000-000000000004')#>>'{ok}','true','operator runs derived checks');
SELECT extensions.is(public.central_review_command((SELECT order_id FROM phase7_test_state),'set_check',jsonb_build_object('dimension','schedule','status','validated','expiresAt',now()+interval '30 minutes','sourceReference','manual pilot'),3,'phase7-schedule-key','86000000-0000-4000-8000-000000000005')#>>'{ok}','true','operator validates schedule temporarily');
SELECT extensions.is(public.central_review_command((SELECT order_id FROM phase7_test_state),'set_check',jsonb_build_object('dimension','capacity','status','validated','expiresAt',now()+interval '30 minutes','sourceReference','manual pilot'),4,'phase7-capacity-key','86000000-0000-4000-8000-000000000006')#>>'{ok}','true','operator validates capacity temporarily');
SELECT extensions.is(public.central_review_command((SELECT order_id FROM phase7_test_state),'set_check',jsonb_build_object('dimension','personalization','status','validated','expiresAt',now()+interval '30 minutes','sourceReference','manual pilot'),5,'phase7-personal-key','86000000-0000-4000-8000-000000000007')#>>'{ok}','true','operator validates personalization temporarily');
SELECT extensions.is(public.central_review_command((SELECT order_id FROM phase7_test_state),'propose_delivery',jsonb_build_object('amountMinor',9900,'sourceType','manual_verified','sourceReference','verified-local-test','reason','Verified test delivery','expiresAt',now()+interval '30 minutes','pricingVersion','phase-7-test-v1'),6,'phase7-delivery-key','86000000-0000-4000-8000-000000000008')#>>'{ok}','true','operator proposes sourced delivery');
SELECT extensions.is(public.central_review_command((SELECT order_id FROM phase7_test_state),'finalize_quote','{}',7,'phase7-operator-final-key','86000000-0000-4000-8000-000000000009')#>>'{error,code}','FORBIDDEN','operator cannot finalize quote');

RESET ROLE;
SELECT set_config('request.jwt.claims','{"sub":"83000000-0000-4000-8000-000000000033","role":"authenticated"}',true);
SET LOCAL ROLE authenticated;
SELECT extensions.is(public.central_review_command((SELECT order_id FROM phase7_test_state),'approve_delivery',jsonb_build_object('componentId',(public.get_central_order_review((SELECT order_id FROM phase7_test_state))#>>'{review,delivery,id}')),7,'phase7-approve-key','86000000-0000-4000-8000-000000000010')#>>'{ok}','true','admin approves delivery separately');
SELECT extensions.is(public.central_review_command((SELECT order_id FROM phase7_test_state),'finalize_quote','{}',8,'phase7-final-key','86000000-0000-4000-8000-000000000011')#>>'{ok}','true','admin finalizes quote');
RESET ROLE;
SELECT extensions.is((SELECT current_state::text FROM public.orders),'quoted','order reaches quoted and no later state');
SELECT extensions.ok((SELECT total_is_final AND delivery_amount_minor=9900 AND service_amount_minor=0 FROM public.orders),'final quote has approved delivery and explicit zero service');
SELECT extensions.is((SELECT source_type FROM public.quote_components WHERE component_type='service'),'pilot_no_service_fee','zero service has explicit source');
SELECT extensions.ok((SELECT expires_at<=now()+interval '30 minutes' FROM public.quotes WHERE id=(SELECT quote_id FROM public.orders)),'final quote TTL is at most 30 minutes');
SELECT extensions.is((SELECT count(*) FROM public.audit_logs WHERE metadata::text !~ 'PII recipient|PII street|8440000000'),8::bigint,'audit records are redacted');
UPDATE public.quotes SET expires_at=now()-interval '1 second' WHERE id=(SELECT quote_id FROM public.orders);
SELECT set_config('request.jwt.claims','{"sub":"81000000-0000-4000-8000-000000000011","role":"authenticated"}',true);
SET LOCAL ROLE authenticated;
SELECT extensions.is(public.get_customer_order((SELECT order_id FROM phase7_test_state))#>>'{state}','quote_pending','expired quote regresses to quote_pending on authoritative read');
RESET ROLE;
SELECT extensions.is((SELECT status::text FROM public.quotes WHERE invalidation_reason='quote_expired'),'expired','expired final quote is preserved and marked expired');
SELECT extensions.ok((SELECT delivery_amount_minor IS NULL AND service_amount_minor IS NULL AND total_known_amount_minor=subtotal_amount_minor AND NOT total_is_final FROM public.orders),'expired final amounts are removed from the active order');
SET LOCAL ROLE authenticated;
SELECT extensions.ok(public.get_customer_order((SELECT order_id FROM phase7_test_state))#>>'{quoteExpiresAt}' IS NULL,'Customer DTO hides the expiry of a quote that is no longer valid');
RESET ROLE;

SELECT * FROM extensions.finish();
ROLLBACK;
