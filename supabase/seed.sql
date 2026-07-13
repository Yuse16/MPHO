-- =============================================================================
-- Seed data for local development
-- =============================================================================
-- Runs after migrations on `supabase db reset`.
-- =============================================================================

-- Saltillo zones
insert into public.zones (city_id, name, slug, status, postal_codes, mphora_enabled)
select
  c.id,
  z.name,
  z.slug,
  z.status::zone_status,
  z.postal_codes::text[],
  z.mphora_enabled
from public.cities c
cross join (values
  ('Centro', 'centro', 'active', array['66000', '66001'], true),
  ('Macroplaza', 'macroplaza', 'active', array['66010', '66011'], true),
  ('Tecnológico', 'tecnologico', 'active', array['66020', '66021'], false),
  ('San Francisco', 'san-francisco', 'active', array['66030', '66031'], false),
  ('Obispado', 'obispado', 'active', array['66040', '66041'], false),
  ('Villas del Cobre', 'villas-del-cobre', 'planned', array['66196'], false)
) as z(name, slug, status, postal_codes, mphora_enabled)
where c.name = 'Saltillo' and c.status = 'active';

-- Ramos Arizpe zones (planned)
insert into public.zones (city_id, name, slug, status, postal_codes, mphora_enabled)
select
  c.id,
  z.name,
  z.slug,
  z.status::zone_status,
  z.postal_codes::text[],
  false
from public.cities c
cross join (values
  ('Centro', 'centro', 'planned', array['25900']),
  ('Industrial', 'industrial', 'planned', array['25901'])
) as z(name, slug, status, postal_codes)
where c.name = 'Ramos Arizpe' and c.status = 'planned';
