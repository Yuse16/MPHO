-- Phase 4.1: explicit public catalog boundary and least-privilege catalog access.
-- Existing migrations remain immutable; this migration corrects their grants/RLS.

-- Remove broad table grants first. Public roles receive only the columns listed below.
REVOKE ALL ON TABLE
  public.categories,
  public.tags,
  public.products,
  public.product_tags,
  public.listings,
  public.listing_zones,
  public.listing_variants,
  public.listing_options,
  public.media_assets
FROM anon, authenticated;

GRANT SELECT (id, parent_id, name, slug, type, description, image_url, status, sort_order)
  ON public.categories TO anon, authenticated;
GRANT SELECT (id, name, slug, type, status)
  ON public.tags TO anon, authenticated;
GRANT SELECT (id, name, slug, description, product_type, category_id, status)
  ON public.products TO anon, authenticated;
GRANT SELECT (product_id, tag_id)
  ON public.product_tags TO anon, authenticated;
GRANT SELECT (
  id,
  product_id,
  customer_title,
  customer_description,
  status,
  availability_mode,
  base_price_amount_minor,
  currency,
  published_at
) ON public.listings TO anon, authenticated;
GRANT SELECT (listing_id, zone_id, status)
  ON public.listing_zones TO anon, authenticated;
GRANT SELECT (
  id,
  listing_id,
  name,
  attributes,
  price_adjustment_amount_minor,
  currency,
  status
) ON public.listing_variants TO anon, authenticated;
GRANT SELECT (
  id,
  listing_id,
  option_type,
  label,
  is_required,
  configuration,
  price_adjustment_amount_minor,
  currency,
  status
) ON public.listing_options TO anon, authenticated;

-- Replace permissive public policies. Child visibility is always checked at the parent.
DROP POLICY IF EXISTS products_select_public ON public.products;
CREATE POLICY products_select_public ON public.products
  FOR SELECT
  USING (
    status = 'active'
    AND EXISTS (
      SELECT 1
      FROM public.listings AS listing
      WHERE listing.product_id = products.id
        AND listing.status = 'published'
    )
  );

DROP POLICY IF EXISTS product_tags_select_public ON public.product_tags;
CREATE POLICY product_tags_select_public ON public.product_tags
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.products AS product
      JOIN public.listings AS listing ON listing.product_id = product.id
      JOIN public.tags AS tag ON tag.id = product_tags.tag_id
      WHERE product.id = product_tags.product_id
        AND product.status = 'active'
        AND listing.status = 'published'
        AND tag.status = 'active'
    )
  );

DROP POLICY IF EXISTS listing_zones_select_public ON public.listing_zones;
CREATE POLICY listing_zones_select_public ON public.listing_zones
  FOR SELECT
  USING (
    status = 'active'
    AND EXISTS (
      SELECT 1
      FROM public.listings AS listing
      WHERE listing.id = listing_zones.listing_id
        AND listing.status = 'published'
    )
  );

DROP POLICY IF EXISTS listing_variants_select_public ON public.listing_variants;
CREATE POLICY listing_variants_select_public ON public.listing_variants
  FOR SELECT
  USING (
    status = 'active'
    AND EXISTS (
      SELECT 1
      FROM public.listings AS listing
      WHERE listing.id = listing_variants.listing_id
        AND listing.status = 'published'
    )
  );

DROP POLICY IF EXISTS listing_options_select_public ON public.listing_options;
CREATE POLICY listing_options_select_public ON public.listing_options
  FOR SELECT
  USING (
    status = 'active'
    AND EXISTS (
      SELECT 1
      FROM public.listings AS listing
      WHERE listing.id = listing_options.listing_id
        AND listing.status = 'published'
    )
  );

DROP POLICY IF EXISTS media_assets_select_public ON public.media_assets;
CREATE POLICY media_assets_select_public ON public.media_assets
  FOR SELECT
  USING (
    visibility = 'public'
    AND status = 'active'
    AND (
      (
        owner_type = 'product'
        AND EXISTS (
          SELECT 1
          FROM public.products AS product
          JOIN public.listings AS listing ON listing.product_id = product.id
          WHERE product.id = media_assets.owner_id
            AND product.status = 'active'
            AND listing.status = 'published'
        )
      )
      OR (
        owner_type = 'listing'
        AND EXISTS (
          SELECT 1
          FROM public.listings AS listing
          WHERE listing.id = media_assets.owner_id
            AND listing.status = 'published'
        )
      )
    )
  );

-- A controlled RPC is the customer-facing API. It returns no partner, supplier,
-- verification, cost, margin, internal-note, contact, or private-media field.
CREATE OR REPLACE FUNCTION public.get_public_catalog(
  p_category_slug text DEFAULT NULL,
  p_listing_slug text DEFAULT NULL,
  p_result_limit integer DEFAULT 20,
  p_result_offset integer DEFAULT 0
)
RETURNS TABLE (
  listing_id uuid,
  product_id uuid,
  slug text,
  name text,
  short_description text,
  full_description text,
  price_amount_minor bigint,
  currency text,
  image_url text,
  image_alt text,
  category_id uuid,
  category_slug text,
  category_name text,
  featured boolean,
  personalization_available boolean,
  scheduled_delivery_available boolean,
  mphora_candidate boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT
    listing.id,
    product.id,
    product.slug,
    listing.customer_title,
    listing.customer_description,
    product.description,
    listing.base_price_amount_minor,
    listing.currency,
    CASE
      WHEN media.id IS NULL THEN NULL
      ELSE '/storage/v1/object/public/' || media.storage_bucket || '/' || media.storage_path
    END,
    media.alt_text,
    category.id,
    category.slug,
    category.name,
    false,
    EXISTS (
      SELECT 1
      FROM public.listing_options AS listing_option
      WHERE listing_option.listing_id = listing.id
        AND listing_option.status = 'active'
    ),
    false,
    false
  FROM public.listings AS listing
  JOIN public.products AS product ON product.id = listing.product_id
  LEFT JOIN public.categories AS category ON category.id = product.category_id
  LEFT JOIN LATERAL (
    SELECT asset.id, asset.storage_bucket, asset.storage_path, asset.alt_text
    FROM public.media_assets AS asset
    WHERE asset.visibility = 'public'
      AND asset.status = 'active'
      AND (
        (asset.owner_type = 'product' AND asset.owner_id = product.id)
        OR (asset.owner_type = 'listing' AND asset.owner_id = listing.id)
      )
    ORDER BY asset.sort_order, asset.created_at
    LIMIT 1
  ) AS media ON true
  WHERE listing.status = 'published'
    AND listing.published_at IS NOT NULL
    AND product.status = 'active'
    AND listing.base_price_amount_minor IS NOT NULL
    AND listing.currency = 'MXN'
    AND listing.id = (
      SELECT candidate.id
      FROM public.listings AS candidate
      WHERE candidate.product_id = product.id
        AND candidate.status = 'published'
        AND candidate.published_at IS NOT NULL
        AND candidate.base_price_amount_minor IS NOT NULL
        AND candidate.currency = 'MXN'
      ORDER BY candidate.created_at DESC, candidate.id
      LIMIT 1
    )
    AND (p_category_slug IS NULL OR category.slug = p_category_slug)
    AND (p_listing_slug IS NULL OR product.slug = p_listing_slug)
  ORDER BY listing.created_at DESC, listing.id
  LIMIT LEAST(GREATEST(COALESCE(p_result_limit, 20), 1), 100)
  OFFSET GREATEST(COALESCE(p_result_offset, 0), 0);
$function$;

REVOKE ALL ON FUNCTION public.get_public_catalog(text, text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_catalog(text, text, integer, integer)
  TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_public_catalog_categories()
RETURNS TABLE (
  id uuid,
  slug text,
  name text,
  description text,
  image_url text,
  listing_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT
    category.id,
    category.slug,
    category.name,
    category.description,
    category.image_url,
    count(DISTINCT product.id)
  FROM public.categories AS category
  LEFT JOIN public.products AS product
    ON product.category_id = category.id
    AND product.status = 'active'
  LEFT JOIN public.listings AS listing
    ON listing.product_id = product.id
    AND listing.status = 'published'
    AND listing.published_at IS NOT NULL
    AND listing.base_price_amount_minor IS NOT NULL
    AND listing.currency = 'MXN'
  WHERE category.status = 'active'
    AND category.type = 'product'
  GROUP BY category.id, category.slug, category.name, category.description, category.image_url, category.sort_order
  ORDER BY category.sort_order, category.name;
$function$;

REVOKE ALL ON FUNCTION public.get_public_catalog_categories() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_catalog_categories() TO anon, authenticated;

-- If Storage is installed, public reads are limited to media records that pass
-- the catalog visibility policy. Private evidence and unrelated objects remain denied.
DO $block$
BEGIN
  IF to_regclass('storage.objects') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS catalog_public_objects_select ON storage.objects';
    EXECUTE $policy$
      CREATE POLICY catalog_public_objects_select ON storage.objects
      FOR SELECT TO anon, authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.media_assets AS asset
          WHERE asset.storage_bucket = storage.objects.bucket_id
            AND asset.storage_path = storage.objects.name
            AND asset.visibility = 'public'
            AND asset.status = 'active'
            AND (
              (
                asset.owner_type = 'product'
                AND EXISTS (
                  SELECT 1 FROM public.listings AS listing
                  JOIN public.products AS product ON product.id = listing.product_id
                  WHERE product.id = asset.owner_id
                    AND product.status = 'active'
                    AND listing.status = 'published'
                )
              )
              OR (
                asset.owner_type = 'listing'
                AND EXISTS (
                  SELECT 1 FROM public.listings AS listing
                  WHERE listing.id = asset.owner_id
                    AND listing.status = 'published'
                )
              )
            )
        )
      )
    $policy$;
  END IF;
END
$block$;
