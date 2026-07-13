-- =============================================================================
-- Migration 003: Identity tables (profiles, user_roles, customers)
-- =============================================================================
-- Core identity layer linking Supabase Auth users to MPHO roles and profiles.
-- =============================================================================

-- Profiles: one per authenticated user
create table public.profiles (
  id            uuid primary key default extensions.uuid_generate_v4(),
  auth_user_id  uuid unique not null,
  email         text,
  phone         text,
  display_name  text,
  status        profile_status not null default 'active',
  default_role  user_role not null default 'customer',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  last_login_at timestamptz
);

comment on table  public.profiles is 'Maps each Supabase auth user to an MPHO profile.';
comment on column public.profiles.auth_user_id is 'References supabase.auth.users.id — never store passwords here.';
comment on column public.profiles.default_role is 'Primary role used for default navigation and UI routing.';
comment on column public.profiles.status is 'active = normal; suspended = locked; deleted = soft-deleted.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- User roles: many-to-many assignment of roles to profiles
create table public.user_roles (
  id          uuid primary key default extensions.uuid_generate_v4(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  role        user_role not null,
  partner_id  uuid,  -- FK added after partners table is created
  status      user_role_assignment_status not null default 'active',
  created_at  timestamptz not null default now(),
  revoked_at  timestamptz,
  created_by  uuid references public.profiles(id)
);

comment on table public.user_roles is 'Role assignments. Partner roles require a non-null partner_id.';

-- Customers: customer-specific extension of profiles
create table public.customers (
  id                  uuid primary key default extensions.uuid_generate_v4(),
  profile_id          uuid unique not null references public.profiles(id) on delete cascade,
  marketing_consent   boolean not null default false,
  preferred_currency  text not null default 'MXN',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.customers is 'Customer-specific data, extends profiles. One-to-one with profiles.';

create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- Auth helper functions (depend on profiles + user_roles)
-- =============================================================================

-- Returns all active roles for the current user
create or replace function public.auth_roles()
returns setof user_role
language sql
stable
security definer
as $$
  select ur.role
  from public.user_roles ur
  join public.profiles p on p.id = ur.profile_id
  where p.auth_user_id = auth_uid()
    and ur.status = 'active'
    and ur.revoked_at is null;
$$;

-- Returns the profile id of the currently authenticated user
create or replace function public.auth_profile_id()
returns uuid
language sql
stable
security definer
as $$
  select id from public.profiles where auth_user_id = auth_uid();
$$;

-- Checks if the current user has a specific role
create or replace function public.has_role(check_role user_role)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.auth_roles() where auth_roles = check_role
  );
$$;

-- Checks if the current user is an mpho admin or operator
create or replace function public.is_mpho_staff()
returns boolean
language sql
stable
security definer
as $$
  select public.has_role('mpho_admin') or public.has_role('mpho_operator');
$$;
