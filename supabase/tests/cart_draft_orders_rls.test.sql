BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT extensions.plan(49);

INSERT INTO public.profiles(id,auth_user_id,email,status,default_role) VALUES
('61000000-0000-4000-8000-000000000001','61000000-0000-4000-8000-000000000011','cart-a@test.local','active','customer'),
('62000000-0000-4000-8000-000000000002','62000000-0000-4000-8000-000000000022','cart-b@test.local','active','customer'),
('63000000-0000-4000-8000-000000000003','63000000-0000-4000-8000-000000000033','cart-p@test.local','active','partner_operator');
INSERT INTO public.customers(id,profile_id) VALUES
('61000000-0000-4000-8000-000000000101','61000000-0000-4000-8000-000000000001'),
('62000000-0000-4000-8000-000000000202','62000000-0000-4000-8000-000000000002');
INSERT INTO public.user_roles(profile_id,role) VALUES
('61000000-0000-4000-8000-000000000001','customer'),
('62000000-0000-4000-8000-000000000002','customer'),
('63000000-0000-4000-8000-000000000003','partner_operator');

INSERT INTO public.listing_variants(id,listing_id,name,sku,price_adjustment_amount_minor,currency,status) VALUES
('64000000-0000-4000-8000-000000000001','f1000000-0000-0000-0000-000000000001','Grande','TEST-V-G',1000,'MXN','active'),
('64000000-0000-4000-8000-000000000002','f1000000-0000-0000-0000-000000000002','Ajena','TEST-V-X',1000,'MXN','active');
INSERT INTO public.listing_options(id,listing_id,label,option_type,price_adjustment_amount_minor,currency,status) VALUES
('65000000-0000-4000-8000-000000000001','f1000000-0000-0000-0000-000000000001','Moño','addon',500,'MXN','active'),
('65000000-0000-4000-8000-000000000002','f1000000-0000-0000-0000-000000000002','Ajena','addon',500,'MXN','active');

SELECT extensions.ok(NOT has_table_privilege('anon','public.carts','SELECT'),'anon cannot read carts');
SELECT extensions.ok(NOT has_table_privilege('authenticated','public.carts','INSERT'),'authenticated cannot insert carts directly');
SELECT extensions.ok(NOT has_table_privilege('authenticated','public.carts','UPDATE'),'authenticated cannot update carts directly');
SELECT extensions.ok(NOT has_table_privilege('authenticated','public.orders','INSERT'),'authenticated cannot insert orders directly');
SELECT extensions.ok(NOT has_table_privilege('authenticated','public.orders','UPDATE'),'authenticated cannot update orders directly');
SELECT extensions.ok(has_table_privilege('authenticated','public.carts','SELECT'),'authenticated has owner-scoped cart read');
SELECT extensions.ok(has_table_privilege('authenticated','public.orders','SELECT'),'authenticated has owner-scoped order read');
SELECT extensions.hasnt_column('public','orders','responsible_partner_id','orders has no responsible partner column');
SELECT extensions.hasnt_column('public','orders','payment_status','orders has no payment status column');
SELECT extensions.hasnt_column('public','orders','delivery_status','orders has no delivery status column');

SELECT set_config('request.jwt.claims','{"sub":"61000000-0000-4000-8000-000000000011","role":"authenticated"}',true);
SET LOCAL ROLE authenticated;
SELECT extensions.is(public.get_customer_cart()#>'{cart}','null'::jsonb,'new Customer starts without a persisted cart');
SELECT extensions.is(public.mutate_customer_cart('add_item','{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":"64000000-0000-4000-8000-000000000001","optionIds":["65000000-0000-4000-8000-000000000001"],"quantity":1,"personalization":{"recipientName":"Ana","message":"Feliz día","instructions":"Tarjeta blanca","spellingConfirmed":true}}',0)#>>'{ok}','true','valid item creates the active cart');
SELECT extensions.is((public.get_customer_cart()#>>'{cart,version}')::integer,1,'successful mutation increments version');
SELECT extensions.is(public.mutate_customer_cart('add_item','{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":1}',0)#>>'{error,code}','VERSION_CONFLICT','stale expectedVersion is rejected');
SELECT extensions.is((public.get_customer_cart()#>>'{cart,version}')::integer,1,'stale mutation does not change version');
SELECT extensions.is(public.mutate_customer_cart('add_item','{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":"64000000-0000-4000-8000-000000000002","optionIds":[],"quantity":1}',1)#>>'{error,code}','VARIANT_INVALID','foreign variant is rejected');
SELECT extensions.is(public.mutate_customer_cart('add_item','{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":["65000000-0000-4000-8000-000000000002"],"quantity":1}',1)#>>'{error,code}','OPTION_INVALID','foreign option is rejected');
SELECT extensions.is(public.mutate_customer_cart('add_item','{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":["65000000-0000-4000-8000-000000000001","65000000-0000-4000-8000-000000000001"],"quantity":1}',1)#>>'{error,code}','OPTION_INVALID','duplicate option is rejected');
SELECT extensions.is(public.mutate_customer_cart('add_item','{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":21}',1)#>>'{error,code}','INVALID_QUANTITY','quantity above documented limit is rejected');
SELECT extensions.is(public.mutate_customer_cart('add_item','{"listingId":"f1000000-0000-0000-0000-000000000001","variantId":null,"optionIds":[],"quantity":1,"personalization":{"message":"<script>alert(1)</script>","spellingConfirmed":true}}',1)#>>'{error,code}','PERSONALIZATION_INVALID','HTML personalization is rejected');
SELECT extensions.is(public.mutate_customer_cart('add_item',jsonb_build_object('listingId','f1000000-0000-0000-0000-000000000001','variantId',null,'optionIds','[]'::jsonb,'quantity',1,'personalization',jsonb_build_object('message',repeat('x',501),'spellingConfirmed',true)),1)#>>'{error,code}','PERSONALIZATION_TOO_LONG','oversized personalization is rejected');

SELECT extensions.is(public.mutate_customer_cart('put_recipient','{"sourceRecipientId":null,"name":"Persona destinataria","relationship":"Amistad","phone":"8440000000","surpriseMode":"partial_surprise","deliveryNote":"Llamar al llegar"}',1)#>>'{ok}','true','recipient is persisted in cart only');
SELECT extensions.is((SELECT count(*) FROM public.recipients),0::bigint,'cart recipient is not saved automatically');
SELECT extensions.is(public.mutate_customer_cart('put_address',jsonb_build_object('sourceAddressId',null,'label','Casa','street','Hidalgo','exteriorNumber','100','interiorNumber',null,'neighborhood','Centro','postalCode','25000','cityId',(SELECT id FROM public.cities WHERE name='Saltillo'),'zoneId',(SELECT z.id FROM public.zones z JOIN public.cities c ON c.id=z.city_id WHERE c.name='Saltillo' AND z.status='active' LIMIT 1),'state','Coahuila','countryCode','MX','references','Portón negro'),2)#>>'{ok}','true','address is persisted in cart only');
SELECT extensions.is((SELECT count(*) FROM public.addresses WHERE owner_type='customer' AND owner_id='61000000-0000-4000-8000-000000000101'),0::bigint,'cart address is not saved automatically');
SELECT extensions.is(public.mutate_customer_cart('put_delivery',jsonb_build_object('requestedDeliveryAt',(now()-interval '1 hour')),3)#>>'{error,code}','DELIVERY_DATE_INVALID','past requested date is rejected');
SELECT extensions.is(public.mutate_customer_cart('put_delivery',jsonb_build_object('requestedDeliveryAt',(now()+interval '2 days')),3)#>>'{ok}','true','future requested date is accepted');

SELECT extensions.is((public.create_customer_draft_order((public.get_customer_cart()#>>'{cart,id}')::uuid,4,'phase6-order-key-a','66000000-0000-4000-8000-000000000001')#>>'{ok}')::boolean,true,'valid conversion creates a draft');
SELECT extensions.is((SELECT current_state::text FROM public.orders),'draft','only draft state is created');
SELECT extensions.is((SELECT count(*) FROM public.orders),1::bigint,'one order is created');
SELECT extensions.is((SELECT count(*) FROM public.quotes),1::bigint,'a fresh quote is created');
SELECT extensions.is((SELECT total_is_final FROM public.orders),false,'requires_review draft remains non-final');
SELECT extensions.is((SELECT status::text FROM public.carts),'converted','cart becomes converted');
SELECT extensions.is((SELECT converted_order_id FROM public.carts),(SELECT id FROM public.orders),'cart links to created order');
SELECT extensions.is((SELECT count(*) FROM public.order_state_history WHERE from_state IS NULL AND to_state='draft' AND actor_type='customer' AND reason_code='draft_created'),1::bigint,'only NULL to draft initial event exists');
SELECT extensions.is((SELECT count(*) FROM public.order_items),1::bigint,'order item snapshot is created');
SELECT extensions.ok(position('partner' in public.get_customer_order((SELECT id FROM public.orders))::text)=0,'order DTO contains no partner field');
SELECT extensions.is((public.create_customer_draft_order((SELECT id FROM public.carts),4,'phase6-order-key-a','66000000-0000-4000-8000-000000000002')#>>'{replayed}')::boolean,true,'same idempotency key and effective payload replays');
SELECT extensions.is(public.create_customer_draft_order((SELECT id FROM public.carts),5,'phase6-order-key-a','66000000-0000-4000-8000-000000000003')#>>'{error,code}','IDEMPOTENCY_CONFLICT','same key with different effective version conflicts');
SELECT extensions.is((SELECT count(*) FROM public.orders),1::bigint,'replays create no duplicate order');

RESET ROLE;
SELECT set_config('request.jwt.claims','{"sub":"62000000-0000-4000-8000-000000000022","role":"authenticated"}',true);
SET LOCAL ROLE authenticated;
SELECT extensions.is((SELECT count(*) FROM public.carts),0::bigint,'Customer B cannot read Customer A cart');
SELECT extensions.is((SELECT count(*) FROM public.cart_recipients),0::bigint,'Customer B cannot read Customer A recipient');
SELECT extensions.is((SELECT count(*) FROM public.cart_delivery_addresses),0::bigint,'Customer B cannot read Customer A address');
SELECT extensions.is((SELECT count(*) FROM public.orders),0::bigint,'Customer B cannot read Customer A order');
SELECT extensions.is(public.get_customer_order((SELECT id FROM public.orders LIMIT 1)),NULL::jsonb,'foreign order returns not-found semantics');

RESET ROLE;
SELECT set_config('request.jwt.claims','{"sub":"63000000-0000-4000-8000-000000000033","role":"authenticated"}',true);
SET LOCAL ROLE authenticated;
SELECT extensions.is((SELECT count(*) FROM public.carts),0::bigint,'partner cannot read carts');
SELECT extensions.is((SELECT count(*) FROM public.cart_recipients),0::bigint,'partner cannot read recipient PII');
SELECT extensions.is((SELECT count(*) FROM public.cart_delivery_addresses),0::bigint,'partner cannot read address PII');
SELECT extensions.is((SELECT count(*) FROM public.orders),0::bigint,'partner cannot read draft orders');

RESET ROLE;
SELECT * FROM extensions.finish();
ROLLBACK;
