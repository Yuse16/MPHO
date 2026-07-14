BEGIN;

CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT extensions.plan(24);

INSERT INTO public.products (
  id, name, slug, description, product_type, category_id, status
) VALUES (
  'eeeeeeee-0000-0000-0000-000000000001',
  'Producto privado de prueba',
  'producto-privado-prueba',
  'No debe ser público',
  'product',
  'a1000000-0000-0000-0000-000000000001',
  'draft'
);

INSERT INTO public.listings (
  id, product_id, source_type, external_source_id, customer_title,
  customer_description, status, availability_mode, base_price_amount_minor,
  currency, last_verified_at, verification_expires_at, substitution_policy,
  cancellation_note
) VALUES (
  'ffffffff-0000-0000-0000-000000000001',
  'eeeeeeee-0000-0000-0000-000000000001',
  'external_curated',
  'dddddddd-0000-0000-0000-000000000001',
  'Listing privado de prueba',
  'No debe ser público',
  'draft',
  'external_by_order',
  10000,
  'MXN',
  now(),
  now() + interval '1 hour',
  'customer_approval_required',
  'Nota interna de cancelación'
);

-- A second published listing for the same product proves the public product slug
-- remains unique and does not reveal partner/listing multiplicity.
INSERT INTO public.listings (
  id, product_id, source_type, customer_title, customer_description, status,
  availability_mode, base_price_amount_minor, currency, published_at, created_at
) VALUES (
  'ffffffff-0000-0000-0000-000000000002',
  'e1000000-0000-0000-0000-000000000001',
  'external_curated',
  'Rosas Premium',
  'Segunda oferta publicada del mismo producto',
  'published',
  'partner_confirmation',
  129000,
  'MXN',
  now(),
  now() + interval '1 minute'
);

INSERT INTO public.listing_variants (
  id, listing_id, name, attributes, price_adjustment_amount_minor, currency, status
) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000101', 'ffffffff-0000-0000-0000-000000000001', 'Privada', '{}', 0, 'MXN', 'active'),
  ('aaaaaaaa-0000-0000-0000-000000000102', 'f1000000-0000-0000-0000-000000000001', 'Pública', '{}', 0, 'MXN', 'active');

INSERT INTO public.listing_options (
  id, listing_id, option_type, label, is_required, configuration,
  price_adjustment_amount_minor, currency, status
) VALUES (
  'bbbbbbbb-0000-0000-0000-000000000101',
  'ffffffff-0000-0000-0000-000000000001',
  'message',
  'Opción privada',
  false,
  '{}',
  0,
  'MXN',
  'active'
);

INSERT INTO public.listing_zones (listing_id, zone_id, status)
SELECT
  'ffffffff-0000-0000-0000-000000000001',
  id,
  'active'
FROM public.zones
WHERE status = 'active'
ORDER BY id
LIMIT 1;

INSERT INTO public.product_tags (product_id, tag_id)
VALUES (
  'eeeeeeee-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000001'
);

INSERT INTO public.media_assets (
  owner_type, owner_id, storage_bucket, storage_path, visibility, status
) VALUES (
  'product',
  'eeeeeeee-0000-0000-0000-000000000001',
  'private-evidence',
  'private/catalog-test.jpg',
  'internal',
  'active'
);

SELECT extensions.ok(
  NOT has_column_privilege('anon', 'public.listings', 'partner_id', 'SELECT'),
  'anon cannot select partner_id'
);
SELECT extensions.ok(
  NOT has_column_privilege('anon', 'public.listings', 'external_source_id', 'SELECT'),
  'anon cannot select external_source_id'
);
SELECT extensions.ok(
  NOT has_column_privilege('anon', 'public.listings', 'last_verified_at', 'SELECT'),
  'anon cannot select last_verified_at'
);
SELECT extensions.ok(
  NOT has_column_privilege('anon', 'public.listings', 'verification_expires_at', 'SELECT'),
  'anon cannot select verification_expires_at'
);
SELECT extensions.ok(
  NOT has_column_privilege('anon', 'public.listings', 'cancellation_note', 'SELECT'),
  'anon cannot select cancellation_note'
);
SELECT extensions.ok(
  NOT has_column_privilege('anon', 'public.listings', 'substitution_policy', 'SELECT'),
  'anon cannot select substitution_policy'
);
SELECT extensions.ok(
  NOT has_column_privilege('authenticated', 'public.listings', 'partner_id', 'SELECT'),
  'authenticated customers cannot select partner_id'
);

SET LOCAL ROLE anon;

SELECT extensions.is(
  (SELECT count(*) FROM public.listings WHERE id = 'ffffffff-0000-0000-0000-000000000001'),
  0::bigint,
  'anon cannot read a draft listing'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.listings WHERE id = 'f1000000-0000-0000-0000-000000000001'),
  1::bigint,
  'anon can read a published listing'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.products WHERE id = 'eeeeeeee-0000-0000-0000-000000000001'),
  0::bigint,
  'a product without a published listing is not public'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.listing_variants WHERE id = 'aaaaaaaa-0000-0000-0000-000000000101'),
  0::bigint,
  'anon cannot read a variant of a draft listing'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.listing_variants WHERE id = 'aaaaaaaa-0000-0000-0000-000000000102'),
  1::bigint,
  'anon can read an active variant of a published listing'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.listing_options WHERE id = 'bbbbbbbb-0000-0000-0000-000000000101'),
  0::bigint,
  'anon cannot read an option of a draft listing'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.listing_zones WHERE listing_id = 'ffffffff-0000-0000-0000-000000000001'),
  0::bigint,
  'anon cannot read zones of a draft listing'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.product_tags WHERE product_id = 'eeeeeeee-0000-0000-0000-000000000001'),
  0::bigint,
  'anon cannot read tags of an unpublished product'
);
SELECT extensions.throws_ok(
  'SELECT id FROM public.media_assets LIMIT 1',
  '42501',
  NULL,
  'anon cannot query media records directly'
);
SELECT extensions.throws_ok(
  'SELECT partner_id FROM public.listings LIMIT 1',
  '42501',
  NULL,
  'anon receives a permission error for partner_id'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.get_public_catalog(p_listing_slug => 'rosas-premium')),
  1::bigint,
  'public RPC returns a published product by slug'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.get_public_catalog(p_listing_slug => 'producto-privado-prueba')),
  0::bigint,
  'public RPC does not return a draft product'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.get_public_catalog(p_category_slug => 'flores')),
  3::bigint,
  'category filter returns only published flower products'
);
SELECT extensions.is(
  (SELECT name FROM public.get_public_catalog(p_listing_slug => 'rosas-premium') LIMIT 1),
  'Rosas Premium'::text,
  'slug query maps to the correct public product'
);
SELECT extensions.ok(
  (SELECT image_url IS NOT NULL FROM public.get_public_catalog(p_listing_slug => 'rosas-premium') LIMIT 1),
  'published product media is available through the controlled RPC'
);

RESET ROLE;
SET LOCAL ROLE authenticated;

SELECT extensions.is(
  (SELECT count(*) FROM public.listings WHERE id = 'ffffffff-0000-0000-0000-000000000001'),
  0::bigint,
  'an authenticated customer cannot read a draft listing'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.get_public_catalog(p_listing_slug => 'rosas-premium')),
  1::bigint,
  'an authenticated customer uses the same safe public DTO'
);

RESET ROLE;
SELECT * FROM extensions.finish();
ROLLBACK;
