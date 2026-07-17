-- =============================================================================
-- Migration 011: Catalog tables
-- =============================================================================
-- Creates the catalog model: categories, tags, products, listings, variants,
-- options, media assets. Based on DOCS/17 and DOCS/25.
-- =============================================================================

-- ─── Categories ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   uuid REFERENCES categories(id) ON DELETE SET NULL,
  name        text NOT NULL,
  slug        text NOT NULL,
  type        category_type NOT NULL,
  description text,
  image_url   text,
  status      city_status NOT NULL DEFAULT 'active',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_slug_unique UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─── Tags ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tags (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  slug       text NOT NULL,
  type       tag_type NOT NULL,
  status     city_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tags_slug_unique UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_tags_type ON tags(type);
CREATE INDEX IF NOT EXISTS idx_tags_status ON tags(status);

-- ─── Products ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  slug           text NOT NULL,
  description    text,
  product_type   product_type NOT NULL,
  category_id    uuid REFERENCES categories(id) ON DELETE SET NULL,
  brand          text,
  attributes     jsonb,
  dimensions     jsonb,
  weight_grams   integer,
  is_fragile     boolean NOT NULL DEFAULT false,
  is_perishable  boolean NOT NULL DEFAULT false,
  is_restricted  boolean NOT NULL DEFAULT false,
  status         product_status NOT NULL DEFAULT 'draft',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  archived_at    timestamptz,
  CONSTRAINT products_slug_unique UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);

CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─── Product Tags ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_tags (
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id     uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- ─── Listings ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id                uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  partner_id                uuid REFERENCES partners(id) ON DELETE SET NULL,
  source_type               listing_source_type NOT NULL,
  external_source_id        uuid,
  customer_title            text NOT NULL,
  customer_description      text,
  status                    listing_status NOT NULL DEFAULT 'draft',
  availability_mode         availability_mode NOT NULL DEFAULT 'partner_confirmation',
  base_price_amount_minor   bigint CHECK (base_price_amount_minor >= 0),
  currency                  text NOT NULL DEFAULT 'MXN',
  preparation_minutes       integer,
  last_verified_at          timestamptz,
  verification_expires_at   timestamptz,
  substitution_policy       text,
  cancellation_note         text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now(),
  published_at              timestamptz,
  paused_at                 timestamptz,
  archived_at               timestamptz,
  CONSTRAINT listings_partner_for_local CHECK (
    (source_type = 'partner_local' AND partner_id IS NOT NULL)
    OR source_type != 'partner_local'
  )
);

CREATE INDEX IF NOT EXISTS idx_listings_product ON listings(product_id);
CREATE INDEX IF NOT EXISTS idx_listings_partner ON listings(partner_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_source ON listings(source_type);
CREATE INDEX IF NOT EXISTS idx_listings_published ON listings(published_at) WHERE status = 'published';

CREATE TRIGGER listings_set_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─── Listing Zones ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_zones (
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  zone_id    uuid NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  status     city_status NOT NULL DEFAULT 'active',
  PRIMARY KEY (listing_id, zone_id)
);

-- ─── Listing Variants ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_variants (
  id                                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id                        uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  name                              text NOT NULL,
  sku                               text,
  attributes                        jsonb,
  price_adjustment_amount_minor     bigint NOT NULL DEFAULT 0,
  currency                          text NOT NULL DEFAULT 'MXN',
  status                            city_status NOT NULL DEFAULT 'active',
  created_at                        timestamptz NOT NULL DEFAULT now(),
  updated_at                        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listing_variants_listing ON listing_variants(listing_id);

CREATE TRIGGER listing_variants_set_updated_at BEFORE UPDATE ON listing_variants FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─── Listing Options ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_options (
  id                                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id                        uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  option_type                       text NOT NULL,
  label                             text NOT NULL,
  is_required                       boolean NOT NULL DEFAULT false,
  configuration                     jsonb NOT NULL DEFAULT '{}',
  price_adjustment_amount_minor     bigint NOT NULL DEFAULT 0,
  currency                          text NOT NULL DEFAULT 'MXN',
  capability_required               text,
  preparation_minutes_delta         integer NOT NULL DEFAULT 0,
  status                            city_status NOT NULL DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_listing_options_listing ON listing_options(listing_id);

-- ─── Media Assets ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_assets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type      text NOT NULL,
  owner_id        uuid NOT NULL,
  storage_bucket  text NOT NULL DEFAULT 'public',
  storage_path    text NOT NULL,
  visibility      media_visibility NOT NULL DEFAULT 'public',
  mime_type       text,
  size_bytes      bigint,
  width           integer,
  height          integer,
  alt_text        text,
  sort_order      integer NOT NULL DEFAULT 0,
  status          city_status NOT NULL DEFAULT 'active',
  created_by      uuid REFERENCES profiles(id),
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_owner ON media_assets(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_media_visibility ON media_assets(visibility);
