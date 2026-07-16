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

-- Local-only pilot fulfillment source used by Phase 7 review tests. Its identity
-- is internal and is never returned by Customer catalog/order DTOs.
INSERT INTO public.partners(id, public_name, slug, status, city_id, primary_zone_id, timezone, agreement_version, agreement_accepted_at)
SELECT 'b7000000-0000-4000-8000-000000000001', 'Origen piloto interno', 'origen-piloto-interno', 'active', c.id,
  (SELECT z.id FROM public.zones z WHERE z.city_id=c.id AND z.slug='centro' LIMIT 1),
  'America/Monterrey', 'local-test-only', now()
FROM public.cities c WHERE c.name='Saltillo' AND c.state='Coahuila'
ON CONFLICT(id) DO NOTHING;

UPDATE public.listings
SET source_type='partner_local', partner_id='b7000000-0000-4000-8000-000000000001'
WHERE id BETWEEN 'f1000000-0000-0000-0000-000000000001' AND 'f1000000-0000-0000-0000-000000000012';
