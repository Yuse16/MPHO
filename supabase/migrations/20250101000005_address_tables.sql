-- =============================================================================
-- Migration 005: Address tables
-- =============================================================================
-- Polymorphic addresses for customers, recipients, partners, and order snapshots.
-- =============================================================================

create table public.addresses (
  id                uuid primary key default extensions.uuid_generate_v4(),
  owner_type        address_owner_type not null,
  owner_id          uuid not null,
  label             text,
  street            text not null,
  exterior_number   text not null,
  interior_number   text,
  neighborhood      text,
  postal_code       text,
  city_id           uuid not null references public.cities(id) on delete restrict,
  state             text,
  country_code      text not null default 'MX',
  latitude          numeric,
  longitude         numeric,
  references_text   text,
  is_default        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  archived_at       timestamptz
);

comment on table  public.addresses is 'Polymorphic addresses. owner_type + owner_id identify the owner.';
comment on column public.addresses.owner_type is 'customer | recipient | partner | order_snapshot';
comment on column public.addresses.archived_at is 'Soft-deleted addresses are never physically removed.';

create trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.handle_updated_at();

create index idx_addresses_owner on public.addresses (owner_type, owner_id);
create index idx_addresses_city_id on public.addresses (city_id);
