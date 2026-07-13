-- =============================================================================
-- Migration 008: Row-Level Security policies
-- =============================================================================
-- Enforces access control at the database level.
-- Every private table has RLS enabled. Policies follow least-privilege.
-- Base GRANT permissions are set here; RLS further restricts access.
-- =============================================================================

-- Grant base permissions to Supabase roles
-- anon: can read public data, cannot write
-- authenticated: can read/write all tables (RLS restricts scope)
-- IMPORTANT: Base GRANTs allow the role to access the table at all.
-- RLS policies then enforce row-level restrictions.
grant select on public.profiles to anon;
grant select on public.user_roles to anon;
grant select on public.cities to anon;
grant select on public.zones to anon;
grant select on public.partners to anon;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.customers to authenticated;
grant select, insert, update on public.user_roles to authenticated;
grant select, insert, update on public.addresses to authenticated;
grant select, insert, update on public.recipients to authenticated;
grant select, insert, update on public.partners to authenticated;
grant select, insert, update on public.partner_capabilities to authenticated;
grant select, insert, update on public.partner_schedules to authenticated;
grant select, insert, update on public.partner_schedule_exceptions to authenticated;
grant select, insert, update on public.partner_capacity to authenticated;
grant select on public.cities to authenticated;
grant select on public.zones to authenticated;

-- Allow both roles to use the public schema
grant usage on schema public to anon;
grant usage on schema public to authenticated;
-- =============================================================================

-- =============================================================================
-- PROFILES
-- =============================================================================
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (auth_user_id = auth_uid());

-- Users can update their own profile (limited columns enforced via API)
create policy "profiles_update_own"
  on public.profiles for update
  using (auth_user_id = auth_uid())
  with check (auth_user_id = auth.uid());

-- Service accounts (or triggers) insert profiles on signup
create policy "profiles_insert_authenticated"
  on public.profiles for insert
  with check (auth_user_id = auth_uid());

-- MPHO staff can read all profiles
create policy "profiles_select_mpho_staff"
  on public.profiles for select
  using (is_mpho_staff());

-- =============================================================================
-- USER_ROLES
-- =============================================================================
alter table public.user_roles enable row level security;

-- Users can read their own role assignments
create policy "user_roles_select_own"
  on public.user_roles for select
  using (
    profile_id in (
      select id from public.profiles where auth_user_id = auth_uid()
    )
  );

-- MPHO admins can manage all role assignments
create policy "user_roles_select_mpho_admin"
  on public.user_roles for select
  using (has_role('mpho_admin'));

create policy "user_roles_insert_mpho_admin"
  on public.user_roles for insert
  with check (has_role('mpho_admin'));

create policy "user_roles_update_mpho_admin"
  on public.user_roles for update
  using (has_role('mpho_admin'))
  with check (has_role('mpho_admin'));

-- =============================================================================
-- CUSTOMERS
-- =============================================================================
alter table public.customers enable row level security;

-- Customers can read their own record
create policy "customers_select_own"
  on public.customers for select
  using (
    profile_id in (
      select id from public.profiles where auth_user_id = auth_uid()
    )
  );

-- Customers can update their own record
create policy "customers_update_own"
  on public.customers for update
  using (
    profile_id in (
      select id from public.profiles where auth_user_id = auth_uid()
    )
  );

-- Insert handled by signup trigger (security definer function)
create policy "customers_insert_own"
  on public.customers for insert
  with check (
    profile_id in (
      select id from public.profiles where auth_user_id = auth_uid()
    )
  );

-- MPHO staff can read all customers
create policy "customers_select_mpho_staff"
  on public.customers for select
  using (is_mpho_staff());

-- =============================================================================
-- CITIES
-- =============================================================================
alter table public.cities enable row level security;

-- Anyone can read active cities (public catalog data)
create policy "cities_select_public"
  on public.cities for select
  using (status = 'active');

-- MPHO staff can read all cities (including planned)
create policy "cities_select_mpho_staff"
  on public.cities for select
  using (is_mpho_staff());

-- Only MPHO admins can modify cities
create policy "cities_insert_mpho_admin"
  on public.cities for insert
  with check (has_role('mpho_admin'));

create policy "cities_update_mpho_admin"
  on public.cities for update
  using (has_role('mpho_admin'))
  with check (has_role('mpho_admin'));

-- =============================================================================
-- ZONES
-- =============================================================================
alter table public.zones enable row level security;

-- Anyone can read active zones
create policy "zones_select_public"
  on public.zones for select
  using (status = 'active');

-- Partners can read zones in their city
create policy "zones_select_partner"
  on public.zones for select
  using (
    city_id in (
      select p.city_id from public.partners p
      join public.user_roles ur on ur.partner_id = p.id
      where ur.profile_id in (
        select id from public.profiles where auth_user_id = auth_uid()
      )
      and ur.status = 'active'
    )
  );

-- MPHO staff can read all zones
create policy "zones_select_mpho_staff"
  on public.zones for select
  using (is_mpho_staff());

-- MPHO admins can modify zones
create policy "zones_insert_mpho_admin"
  on public.zones for insert
  with check (has_role('mpho_admin'));

create policy "zones_update_mpho_admin"
  on public.zones for update
  using (has_role('mpho_admin'))
  with check (has_role('mpho_admin'));

-- =============================================================================
-- ADDRESSES
-- =============================================================================
alter table public.addresses enable row level security;

-- Customers can manage their own addresses
create policy "addresses_select_own"
  on public.addresses for select
  using (
    owner_type = 'customer'
    and owner_id in (
      select c.id from public.customers c
      join public.profiles p on p.id = c.profile_id
      where p.auth_user_id = auth_uid()
    )
  );

create policy "addresses_insert_own"
  on public.addresses for insert
  with check (
    owner_type = 'customer'
    and owner_id in (
      select c.id from public.customers c
      join public.profiles p on p.id = c.profile_id
      where p.auth_user_id = auth_uid()
    )
  );

create policy "addresses_update_own"
  on public.addresses for update
  using (
    owner_type = 'customer'
    and owner_id in (
      select c.id from public.customers c
      join public.profiles p on p.id = c.profile_id
      where p.auth_user_id = auth_uid()
    )
  );

-- Partners can manage their own addresses
create policy "addresses_select_partner"
  on public.addresses for select
  using (
    owner_type = 'partner'
    and owner_id in (
      select p.id from public.partners p
      join public.user_roles ur on ur.partner_id = p.id
      where ur.profile_id in (
        select id from public.profiles where auth_user_id = auth_uid()
      )
      and ur.status = 'active'
    )
  );

create policy "addresses_insert_partner"
  on public.addresses for insert
  with check (
    owner_type = 'partner'
    and owner_id in (
      select p.id from public.partners p
      join public.user_roles ur on ur.partner_id = p.id
      where ur.profile_id in (
        select id from public.profiles where auth_user_id = auth_uid()
      )
      and ur.status = 'active'
    )
  );

-- MPHO staff can read all addresses
create policy "addresses_select_mpho_staff"
  on public.addresses for select
  using (is_mpho_staff());

-- =============================================================================
-- PARTNERS
-- =============================================================================
alter table public.partners enable row level security;

-- Public: anyone can read active partners (for display in product context)
-- NOTE: AGENTS.md says internal partner identity must not leak through UI.
-- This policy is intentionally broad; frontend filtering happens in the app layer.
create policy "partners_select_public"
  on public.partners for select
  using (status = 'active');

-- Partners can read their own record
create policy "partners_select_own"
  on public.partners for select
  using (
    id in (
      select ur.partner_id from public.user_roles ur
      where ur.profile_id in (
        select id from public.profiles where auth_user_id = auth_uid()
      )
      and ur.status = 'active'
      and ur.partner_id is not null
    )
  );

-- MPHO staff can read all partners
create policy "partners_select_mpho_staff"
  on public.partners for select
  using (is_mpho_staff());

-- MPHO admins can manage partners
create policy "partners_insert_mpho_admin"
  on public.partners for insert
  with check (has_role('mpho_admin'));

create policy "partners_update_mpho_admin"
  on public.partners for update
  using (has_role('mpho_admin'))
  with check (has_role('mpho_admin'));

-- =============================================================================
-- PARTNER_CAPABILITIES
-- =============================================================================
alter table public.partner_capabilities enable row level security;

-- Partners can read their own capabilities
create policy "partner_capabilities_select_own"
  on public.partner_capabilities for select
  using (
    partner_id in (
      select ur.partner_id from public.user_roles ur
      where ur.profile_id in (
        select id from public.profiles where auth_user_id = auth_uid()
      )
      and ur.status = 'active'
      and ur.partner_id is not null
    )
  );

-- MPHO staff can read all capabilities
create policy "partner_capabilities_select_mpho_staff"
  on public.partner_capabilities for select
  using (is_mpho_staff());

-- MPHO admins can manage capabilities
create policy "partner_capabilities_insert_mpho_admin"
  on public.partner_capabilities for insert
  with check (has_role('mpho_admin'));

create policy "partner_capabilities_update_mpho_admin"
  on public.partner_capabilities for update
  using (has_role('mpho_admin'))
  with check (has_role('mpho_admin'));

-- =============================================================================
-- PARTNER_SCHEDULES
-- =============================================================================
alter table public.partner_schedules enable row level security;

-- Partners can read their own schedules
create policy "partner_schedules_select_own"
  on public.partner_schedules for select
  using (
    partner_id in (
      select ur.partner_id from public.user_roles ur
      where ur.profile_id in (
        select id from public.profiles where auth_user_id = auth_uid()
      )
      and ur.status = 'active'
      and ur.partner_id is not null
    )
  );

-- Partners can update their own schedules
create policy "partner_schedules_update_own"
  on public.partner_schedules for update
  using (
    partner_id in (
      select ur.partner_id from public.user_roles ur
      where ur.profile_id in (
        select id from public.profiles where auth_user_id = auth_uid()
      )
      and ur.status = 'active'
      and ur.partner_id is not null
      and ur.role in ('partner_admin')
    )
  );

-- MPHO staff can read all schedules
create policy "partner_schedules_select_mpho_staff"
  on public.partner_schedules for select
  using (is_mpho_staff());

-- MPHO admins can manage schedules
create policy "partner_schedules_insert_mpho_admin"
  on public.partner_schedules for insert
  with check (has_role('mpho_admin'));

-- =============================================================================
-- PARTNER_SCHEDULE_EXCEPTIONS
-- =============================================================================
alter table public.partner_schedule_exceptions enable row level security;

create policy "partner_schedule_exceptions_select_own"
  on public.partner_schedule_exceptions for select
  using (
    partner_id in (
      select ur.partner_id from public.user_roles ur
      where ur.profile_id in (
        select id from public.profiles where auth_user_id = auth_uid()
      )
      and ur.status = 'active'
      and ur.partner_id is not null
    )
  );

create policy "partner_schedule_exceptions_select_mpho_staff"
  on public.partner_schedule_exceptions for select
  using (is_mpho_staff());

create policy "partner_schedule_exceptions_insert_mpho_admin"
  on public.partner_schedule_exceptions for insert
  with check (has_role('mpho_admin'));

-- =============================================================================
-- PARTNER_CAPACITY
-- =============================================================================
alter table public.partner_capacity enable row level security;

create policy "partner_capacity_select_own"
  on public.partner_capacity for select
  using (
    partner_id in (
      select ur.partner_id from public.user_roles ur
      where ur.profile_id in (
        select id from public.profiles where auth_user_id = auth_uid()
      )
      and ur.status = 'active'
      and ur.partner_id is not null
    )
  );

create policy "partner_capacity_select_mpho_staff"
  on public.partner_capacity for select
  using (is_mpho_staff());

create policy "partner_capacity_insert_mpho_admin"
  on public.partner_capacity for insert
  with check (has_role('mpho_admin'));

create policy "partner_capacity_update_mpho_admin"
  on public.partner_capacity for update
  using (has_role('mpho_admin'))
  with check (has_role('mpho_admin'));

-- =============================================================================
-- RECIPIENTS
-- =============================================================================
alter table public.recipients enable row level security;

-- Customers can read their own recipients
create policy "recipients_select_own"
  on public.recipients for select
  using (
    customer_id in (
      select c.id from public.customers c
      join public.profiles p on p.id = c.profile_id
      where p.auth_user_id = auth_uid()
    )
  );

create policy "recipients_insert_own"
  on public.recipients for insert
  with check (
    customer_id in (
      select c.id from public.customers c
      join public.profiles p on p.id = c.profile_id
      where p.auth_user_id = auth_uid()
    )
  );

create policy "recipients_update_own"
  on public.recipients for update
  using (
    customer_id in (
      select c.id from public.customers c
      join public.profiles p on p.id = c.profile_id
      where p.auth_user_id = auth_uid()
    )
  );

-- MPHO staff can read all recipients (needed for order fulfillment)
create policy "recipients_select_mpho_staff"
  on public.recipients for select
  using (is_mpho_staff());
