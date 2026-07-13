-- =============================================================================
-- Seed data for local development
-- =============================================================================
-- Runs after migrations on `supabase db reset`.
-- Migration 013 seeds core zones; this adds extras and updates config.
-- =============================================================================

-- Additional Saltillo zone not in migration 013
INSERT INTO public.zones (city_id, name, slug, status, postal_codes, mphora_enabled)
SELECT
  c.id,
  z.name,
  z.slug,
  z.status::zone_status,
  z.postal_codes::text[],
  z.mphora_enabled
FROM public.cities c
CROSS JOIN (VALUES
  ('Villas del Cobre', 'villas-del-cobre', 'planned', array['66196'], false)
) AS z(name, slug, status, postal_codes, mphora_enabled)
WHERE c.name = 'Saltillo' AND c.state = 'Coahuila'
ON CONFLICT (city_id, slug) DO NOTHING;
