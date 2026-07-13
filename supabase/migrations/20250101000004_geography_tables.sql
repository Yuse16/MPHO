-- =============================================================================
-- Migration 004: Geography tables (cities, zones)
-- =============================================================================
-- Defines operational cities and delivery zones.
-- Saltillo is active; Ramos Arizpe is planned for future activation.
-- =============================================================================

create table public.cities (
  id            uuid primary key default extensions.uuid_generate_v4(),
  name          text not null,
  state         text not null,
  country_code  text not null default 'MX',
  timezone      text not null default 'America/Monterrey',
  currency      text not null default 'MXN',
  status        city_status not null default 'planned',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (name, state, country_code)
);

comment on table public.cities is 'Operational cities. Only active cities are visible to customers.';

create trigger cities_set_updated_at
  before update on public.cities
  for each row execute function public.handle_updated_at();

-- Seed: initial operating cities
insert into public.cities (name, state, country_code, timezone, currency, status)
values
  ('Saltillo', 'Coahuila', 'MX', 'America/Monterrey', 'MXN', 'active'),
  ('Ramos Arizpe', 'Coahuila', 'MX', 'America/Monterrey', 'MXN', 'planned');

-- Zones: delivery areas within a city
create table public.zones (
  id                  uuid primary key default extensions.uuid_generate_v4(),
  city_id             uuid not null references public.cities(id) on delete restrict,
  name                text not null,
  slug                text not null,
  status              zone_status not null default 'planned',
  postal_codes        text[] default '{}',
  boundary_geojson    jsonb,
  mphora_enabled      boolean not null default false,
  operating_hours     jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (city_id, slug)
);

comment on table public.zones is 'Delivery zones within a city. Slug is unique per city.';
comment on column public.zones.mphora_enabled is 'Whether MPHORA fast delivery is enabled in this zone.';
comment on column public.zones.operating_hours is 'JSON object with day-of-week operating hours.';

create trigger zones_set_updated_at
  before update on public.zones
  for each row execute function public.handle_updated_at();

create index idx_zones_city_id on public.zones (city_id);
create index idx_zones_status on public.zones (status);
