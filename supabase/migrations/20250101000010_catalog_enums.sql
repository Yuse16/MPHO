-- =============================================================================
-- Migration 010: Catalog enum types
-- =============================================================================
-- Adds enums required for the catalog and listing model.
-- Based on DOCS/17_CATALOG_AND_INVENTORY.md and DOCS/25_DATABASE_SCHEMA.md.
-- =============================================================================

-- Product definition type
DO $$ BEGIN
  CREATE TYPE product_type AS ENUM ('product', 'service', 'bundle', 'add_on');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Category taxonomy type
DO $$ BEGIN
  CREATE TYPE category_type AS ENUM ('product', 'occasion', 'recipient', 'style');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Tag taxonomy type
DO $$ BEGIN
  CREATE TYPE tag_type AS ENUM ('style', 'delivery', 'feature', 'seasonal');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Listing publication status
DO $$ BEGIN
  CREATE TYPE listing_status AS ENUM ('draft', 'submitted', 'under_review', 'changes_requested', 'approved', 'published', 'paused', 'rejected', 'archived');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Listing source type
DO $$ BEGIN
  CREATE TYPE listing_source_type AS ENUM ('partner_local', 'external_curated', 'mpho_owned_future');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Availability mode
DO $$ BEGIN
  CREATE TYPE availability_mode AS ENUM ('tracked_stock', 'partner_confirmation', 'scheduled_capacity', 'external_by_order', 'unavailable');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Product publication status (for product definitions)
DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Media visibility
DO $$ BEGIN
  CREATE TYPE media_visibility AS ENUM ('public', 'partner_only', 'internal');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
