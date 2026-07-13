-- =============================================================================
-- Migration 006: Partner tables
-- =============================================================================
-- Partner businesses, their capabilities, schedules, and capacity.
-- =============================================================================

create table public.partners (
  id                    uuid primary key default extensions.uuid_generate_v4(),
  public_name           text not null,
  legal_name            text,
  slug                  text not null unique,
  status                partner_status not null default 'pending_onboarding',
  city_id               uuid not null references public.cities(id) on delete restrict,
  primary_zone_id       uuid references public.zones(id) on delete set null,
  address_id            uuid references public.addresses(id) on delete set null,
  phone                 text,
  email                 text,
  timezone              text,
  payout_currency       text not null default 'MXN',
  agreement_version     text,
  agreement_accepted_at timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  paused_at             timestamptz,
  suspended_at          timestamptz,
  closed_at             timestamptz
);

comment on table public.partners is 'Partner businesses (Puntos MPHO). public_name is customer-facing.';

create trigger partners_set_updated_at
  before update on public.partners
  for each row execute function public.handle_updated_at();

create index idx_partners_city_id on public.partners (city_id);
create index idx_partners_status on public.partners (status);
create index idx_partners_slug on public.partners (slug);

-- Now add the FK from user_roles to partners
alter table public.user_roles
  add constraint user_roles_partner_id_fkey
  foreign key (partner_id) references public.partners(id) on delete set null;

-- Partner capabilities (e.g. 'wrapping', 'personalization', 'package_receiving')
create table public.partner_capabilities (
  id              uuid primary key default extensions.uuid_generate_v4(),
  partner_id      uuid not null references public.partners(id) on delete cascade,
  capability_code text not null,
  status          partner_capability_status not null default 'active',
  approved_by     uuid references public.profiles(id),
  approved_at     timestamptz,
  restrictions    jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (partner_id, capability_code)
);

comment on table public.partner_capabilities is 'Capabilities approved for each partner (wrapping, personalization, etc.).';

create trigger partner_capabilities_set_updated_at
  before update on public.partner_capabilities
  for each row execute function public.handle_updated_at();

-- Partner schedules (day-of-week operating hours)
create table public.partner_schedules (
  id            uuid primary key default extensions.uuid_generate_v4(),
  partner_id    uuid not null references public.partners(id) on delete cascade,
  day_of_week   smallint not null check (day_of_week between 0 and 6),
  opens_at      time,
  closes_at     time,
  is_closed     boolean not null default false,
  effective_from date,
  effective_to   date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.partner_schedules is 'Regular weekly schedule per partner.';

create trigger partner_schedules_set_updated_at
  before update on public.partner_schedules
  for each row execute function public.handle_updated_at();

create index idx_partner_schedules_partner_id on public.partner_schedules (partner_id);

-- Partner schedule exceptions (holidays, temporary closures)
create table public.partner_schedule_exceptions (
  id            uuid primary key default extensions.uuid_generate_v4(),
  partner_id    uuid not null references public.partners(id) on delete cascade,
  exception_date date not null,
  opens_at      time,
  closes_at     time,
  is_closed     boolean not null default true,
  reason        text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger partner_schedule_exceptions_set_updated_at
  before update on public.partner_schedule_exceptions
  for each row execute function public.handle_updated_at();

-- Partner capacity (orders, MPHORA, package receiving, preparation)
create table public.partner_capacity (
  id              uuid primary key default extensions.uuid_generate_v4(),
  partner_id      uuid not null references public.partners(id) on delete cascade,
  capacity_type   text not null,
  capacity_value  integer not null check (capacity_value >= 0),
  active_count    integer not null default 0 check (active_count >= 0),
  valid_from      timestamptz,
  valid_until     timestamptz,
  updated_by      uuid references public.profiles(id),
  updated_at      timestamptz not null default now()
);

comment on table public.partner_capacity is 'Operational capacity limits per partner. Types: general, mphora, package_receiving, preparation.';

create trigger partner_capacity_set_updated_at
  before update on public.partner_capacity
  for each row execute function public.handle_updated_at();

create index idx_partner_capacity_partner_id on public.partner_capacity (partner_id);
