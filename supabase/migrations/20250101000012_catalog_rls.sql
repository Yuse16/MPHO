-- =============================================================================
-- Migration 012: Catalog RLS policies
-- =============================================================================
-- Public read access for published catalog data.
-- Partner-scoped write access for their own listings.
-- =============================================================================

-- ─── Base grants (required before RLS evaluates) ────────────────────────────
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON tags TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON product_tags TO anon, authenticated;
GRANT SELECT ON listings TO anon, authenticated;
GRANT SELECT ON listing_zones TO anon, authenticated;
GRANT SELECT ON listing_variants TO anon, authenticated;
GRANT SELECT ON listing_options TO anon, authenticated;
GRANT SELECT ON media_assets TO anon, authenticated;

-- ─── Categories ──────────────────────────────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read active categories
CREATE POLICY categories_select_public ON categories
  FOR SELECT
  USING (status = 'active');

-- ─── Tags ────────────────────────────────────────────────────────────────────
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Anyone can read active tags
CREATE POLICY tags_select_public ON tags
  FOR SELECT
  USING (status = 'active');

-- ─── Products ────────────────────────────────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active products
CREATE POLICY products_select_public ON products
  FOR SELECT
  USING (status = 'active');

-- ─── Product Tags ────────────────────────────────────────────────────────────
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

-- Anyone can read product tags (join table inherits product visibility)
CREATE POLICY product_tags_select_public ON product_tags
  FOR SELECT
  USING (true);

-- ─── Listings ────────────────────────────────────────────────────────────────
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Anyone can read published listings
CREATE POLICY listings_select_published ON listings
  FOR SELECT
  USING (status = 'published');

-- Partners can read their own listings (any status)
CREATE POLICY listings_select_partner_own ON listings
  FOR SELECT
  USING (
    partner_id IN (
      SELECT ur.partner_id FROM user_roles ur
      WHERE ur.profile_id = (
        SELECT id FROM profiles WHERE auth_user_id = auth.uid()
      )
      AND ur.role IN ('partner_operator', 'partner_admin')
      AND ur.status = 'active'
    )
  );

-- Partners can update their own listings (submitted/changes_requested)
CREATE POLICY listings_update_partner_own ON listings
  FOR UPDATE
  USING (
    partner_id IN (
      SELECT ur.partner_id FROM user_roles ur
      WHERE ur.profile_id = (
        SELECT id FROM profiles WHERE auth_user_id = auth.uid()
      )
      AND ur.role IN ('partner_operator', 'partner_admin')
      AND ur.status = 'active'
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT ur.partner_id FROM user_roles ur
      WHERE ur.profile_id = (
        SELECT id FROM profiles WHERE auth_user_id = auth.uid()
      )
      AND ur.role IN ('partner_operator', 'partner_admin')
      AND ur.status = 'active'
    )
  );

-- ─── Listing Zones ───────────────────────────────────────────────────────────
ALTER TABLE listing_zones ENABLE ROW LEVEL SECURITY;

-- Public read for listing zones (inherits listing visibility through join)
CREATE POLICY listing_zones_select_public ON listing_zones
  FOR SELECT
  USING (true);

-- ─── Listing Variants ────────────────────────────────────────────────────────
ALTER TABLE listing_variants ENABLE ROW LEVEL SECURITY;

-- Anyone can read active variants (inherits listing visibility through join)
CREATE POLICY listing_variants_select_public ON listing_variants
  FOR SELECT
  USING (status = 'active');

-- ─── Listing Options ─────────────────────────────────────────────────────────
ALTER TABLE listing_options ENABLE ROW LEVEL SECURITY;

-- Anyone can read active options (inherits listing visibility through join)
CREATE POLICY listing_options_select_public ON listing_options
  FOR SELECT
  USING (status = 'active');

-- ─── Media Assets ────────────────────────────────────────────────────────────
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Anyone can read public media
CREATE POLICY media_assets_select_public ON media_assets
  FOR SELECT
  USING (visibility = 'public' AND status = 'active');

-- Partners can read their own media
CREATE POLICY media_assets_select_partner_own ON media_assets
  FOR SELECT
  USING (
    owner_type = 'listing'
    AND owner_id IN (
      SELECT l.id FROM listings l
      WHERE l.partner_id IN (
        SELECT ur.partner_id FROM user_roles ur
        WHERE ur.profile_id = (
          SELECT id FROM profiles WHERE auth_user_id = auth.uid()
        )
        AND ur.role IN ('partner_operator', 'partner_admin')
        AND ur.status = 'active'
      )
    )
  );
