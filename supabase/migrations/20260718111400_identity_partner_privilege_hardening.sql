-- =============================================================================
-- Identity and Partner privilege hardening
-- =============================================================================
-- Removes client-side authority over identity, role-assignment, Partner approval,
-- territory, agreement, capability, and capacity fields. The only authenticated
-- writes retained are explicitly allowlisted profile/customer preferences and a
-- Partner administrator's own regular schedule fields.

-- Use Supabase Auth's canonical identity function. The historical helper parsed
-- the same JWT sub claim manually and did not need SECURITY DEFINER privileges.
create or replace function public.auth_uid()
returns uuid
language sql
stable
security invoker
set search_path = ''
as $$
  select auth.uid();
$$;

revoke all on function public.auth_uid() from public;
grant execute on function public.auth_uid() to anon;
grant execute on function public.auth_uid() to authenticated;
grant execute on function public.auth_uid() to service_role;

-- The Auth trigger remains the only signup writer. Qualifying every object and
-- pinning an empty search_path prevents search-path substitution attacks.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_profile_id uuid;
begin
  insert into public.profiles (
    auth_user_id,
    email,
    phone,
    display_name,
    status,
    default_role
  )
  values (
    new.id,
    coalesce(new.email, new.raw_user_meta_data->>'email'),
    coalesce(new.phone, new.raw_user_meta_data->>'phone'),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'active'::public.profile_status,
    'customer'::public.user_role
  )
  returning id into new_profile_id;

  insert into public.customers (
    profile_id,
    marketing_consent,
    preferred_currency
  )
  values (
    new_profile_id,
    coalesce((new.raw_user_meta_data->>'marketing_consent')::boolean, false),
    'MXN'
  );

  insert into public.user_roles (profile_id, role, status)
  values (
    new_profile_id,
    'customer'::public.user_role,
    'active'::public.user_role_assignment_status
  );

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;

-- Existing identity helpers are used by RLS and therefore require definer
-- rights to avoid policy recursion. Pin their search_path, qualify every object,
-- and reject suspended/deleted profiles before returning identity or roles.
create or replace function public.auth_roles()
returns setof public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select ur.role
  from public.user_roles as ur
  join public.profiles as p on p.id = ur.profile_id
  where p.auth_user_id = auth.uid()
    and p.status = 'active'::public.profile_status
    and ur.status = 'active'::public.user_role_assignment_status
    and ur.revoked_at is null;
$$;

create or replace function public.auth_profile_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.id
  from public.profiles as p
  where p.auth_user_id = auth.uid()
    and p.status = 'active'::public.profile_status;
$$;

create or replace function public.has_role(check_role public.user_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.auth_roles() as assigned_role
    where assigned_role = check_role
  );
$$;

create or replace function public.is_mpho_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_role('mpho_admin'::public.user_role)
    or public.has_role('mpho_operator'::public.user_role);
$$;

revoke all on function public.auth_roles() from public;
revoke all on function public.auth_profile_id() from public;
revoke all on function public.has_role(public.user_role) from public;
revoke all on function public.is_mpho_staff() from public;
revoke all on function public.auth_roles() from anon;
revoke all on function public.auth_profile_id() from anon;
revoke all on function public.has_role(public.user_role) from anon;
revoke all on function public.is_mpho_staff() from anon;
grant execute on function public.auth_roles() to authenticated, service_role;
grant execute on function public.auth_profile_id() to authenticated, service_role;
grant execute on function public.has_role(public.user_role) to authenticated, service_role;
grant execute on function public.is_mpho_staff() to authenticated, service_role;

-- Policies that call the restricted helpers must only apply to authenticated
-- sessions. This also keeps anonymous catalog policy evaluation independent of
-- privileged helper execution.
alter policy "profiles_select_mpho_staff" on public.profiles to authenticated;
alter policy "profiles_select_own" on public.profiles to authenticated;
alter policy "user_roles_select_mpho_admin" on public.user_roles to authenticated;
alter policy "user_roles_select_own" on public.user_roles to authenticated;
alter policy "customers_select_mpho_staff" on public.customers to authenticated;
alter policy "cities_select_mpho_staff" on public.cities to authenticated;
alter policy "zones_select_mpho_staff" on public.zones to authenticated;
alter policy "addresses_select_mpho_staff" on public.addresses to authenticated;
alter policy "partners_select_mpho_staff" on public.partners to authenticated;
alter policy "partner_capabilities_select_mpho_staff" on public.partner_capabilities to authenticated;
alter policy "partner_schedules_select_mpho_staff" on public.partner_schedules to authenticated;
alter policy "partner_schedule_exceptions_select_mpho_staff" on public.partner_schedule_exceptions to authenticated;
alter policy "partner_capacity_select_mpho_staff" on public.partner_capacity to authenticated;
alter policy "recipients_select_mpho_staff" on public.recipients to authenticated;

-- Canonical Partner membership check used by Partner-scoped RLS policies.
-- It derives both the user and the Partner from server-side identity records.
create or replace function public.has_active_partner_membership(
  p_partner_id uuid,
  p_require_admin boolean
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as p
    join public.user_roles as ur on ur.profile_id = p.id
    join public.partners as partner on partner.id = ur.partner_id
    where p.auth_user_id = auth.uid()
      and p.status = 'active'::public.profile_status
      and ur.partner_id = p_partner_id
      and ur.role in (
        'partner_operator'::public.user_role,
        'partner_admin'::public.user_role
      )
      and ur.status = 'active'::public.user_role_assignment_status
      and ur.revoked_at is null
      and partner.status in (
        'active'::public.partner_status,
        'paused'::public.partner_status
      )
      and (
        not p_require_admin
        or ur.role = 'partner_admin'::public.user_role
      )
  );
$$;

revoke all on function public.has_active_partner_membership(uuid, boolean) from public;
revoke all on function public.has_active_partner_membership(uuid, boolean) from anon;
grant execute on function public.has_active_partner_membership(uuid, boolean) to authenticated;
grant execute on function public.has_active_partner_membership(uuid, boolean) to service_role;

-- -----------------------------------------------------------------------------
-- Profiles: signup is owned by the Auth trigger. Authenticated users can only
-- edit display_name and phone on their own existing row. Email remains managed
-- by Supabase Auth and is not writable through public.profiles.
-- -----------------------------------------------------------------------------
-- Anonymous catalog policies evaluate identity subqueries with an empty Auth
-- subject. Preserve SELECT so those policies resolve to no identity rows rather
-- than raising, while keeping all anonymous writes revoked.
revoke insert, update, delete on table public.profiles from anon;
grant select on table public.profiles to anon;
revoke insert, update, delete on table public.profiles from authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, phone) on table public.profiles to authenticated;
grant select, insert, update on table public.profiles to service_role;

drop policy if exists "profiles_insert_authenticated" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

-- Customer extension rows are also created by the signup trigger. Only the
-- two non-authoritative preference fields are directly editable by customers.
revoke insert, update, delete on table public.customers from authenticated;
grant select on table public.customers to authenticated;
grant update (marketing_consent, preferred_currency) on table public.customers to authenticated;
grant select, insert, update on table public.customers to service_role;

drop policy if exists "customers_insert_own" on public.customers;
drop policy if exists "customers_update_own" on public.customers;

create policy "customers_update_own"
  on public.customers for update
  to authenticated
  using (profile_id = public.auth_profile_id())
  with check (profile_id = public.auth_profile_id());

-- -----------------------------------------------------------------------------
-- Role assignments: no browser role, including mpho_admin, may mutate these
-- rows directly. Privileged administration must use a controlled server path.
-- Revocation is represented by status/revoked_at; DELETE is intentionally absent.
-- -----------------------------------------------------------------------------
revoke insert, update, delete on table public.user_roles from anon;
grant select on table public.user_roles to anon;
revoke insert, update, delete on table public.user_roles from authenticated;
grant select on table public.user_roles to authenticated;
grant select, insert, update on table public.user_roles to service_role;

drop policy if exists "user_roles_insert_mpho_admin" on public.user_roles;
drop policy if exists "user_roles_update_mpho_admin" on public.user_roles;

-- -----------------------------------------------------------------------------
-- Partner master data: Partner identity is internal and cannot be listed by
-- anonymous/customer clients. No authenticated browser role can modify approval,
-- territory, agreement, suspension, or administrative fields directly.
-- -----------------------------------------------------------------------------
revoke all on table public.partners from anon;
revoke insert, update, delete on table public.partners from authenticated;
grant select on table public.partners to authenticated;
grant select, insert, update on table public.partners to service_role;

drop policy if exists "partners_select_public" on public.partners;
drop policy if exists "partners_select_own" on public.partners;
drop policy if exists "partners_insert_mpho_admin" on public.partners;
drop policy if exists "partners_update_mpho_admin" on public.partners;

create policy "partners_select_own"
  on public.partners for select
  to authenticated
  using (public.has_active_partner_membership(id, false));

-- Capabilities and capacity are authoritative operational controls. Schedule
-- exceptions also affect operational availability, so all three require a
-- controlled server path rather than direct client writes.
revoke insert, update, delete on table public.partner_capabilities from authenticated;
grant select on table public.partner_capabilities to authenticated;
grant select, insert, update on table public.partner_capabilities to service_role;

drop policy if exists "partner_capabilities_select_own" on public.partner_capabilities;
drop policy if exists "partner_capabilities_insert_mpho_admin" on public.partner_capabilities;
drop policy if exists "partner_capabilities_update_mpho_admin" on public.partner_capabilities;

create policy "partner_capabilities_select_own"
  on public.partner_capabilities for select
  to authenticated
  using (public.has_active_partner_membership(partner_id, false));

revoke insert, update, delete on table public.partner_schedule_exceptions from authenticated;
grant select on table public.partner_schedule_exceptions to authenticated;
grant select, insert, update on table public.partner_schedule_exceptions to service_role;

drop policy if exists "partner_schedule_exceptions_select_own" on public.partner_schedule_exceptions;
drop policy if exists "partner_schedule_exceptions_insert_mpho_admin" on public.partner_schedule_exceptions;

create policy "partner_schedule_exceptions_select_own"
  on public.partner_schedule_exceptions for select
  to authenticated
  using (public.has_active_partner_membership(partner_id, false));

revoke insert, update, delete on table public.partner_capacity from authenticated;
grant select on table public.partner_capacity to authenticated;
grant select, insert, update on table public.partner_capacity to service_role;

drop policy if exists "partner_capacity_select_own" on public.partner_capacity;
drop policy if exists "partner_capacity_insert_mpho_admin" on public.partner_capacity;
drop policy if exists "partner_capacity_update_mpho_admin" on public.partner_capacity;

create policy "partner_capacity_select_own"
  on public.partner_capacity for select
  to authenticated
  using (public.has_active_partner_membership(partner_id, false));

-- Partner administrators may edit only their own regular operating-hour fields.
-- partner_id, identifiers, and audit timestamps are protected by column grants.
revoke insert, update, delete on table public.partner_schedules from authenticated;
grant select on table public.partner_schedules to authenticated;
grant update (
  day_of_week,
  opens_at,
  closes_at,
  is_closed,
  effective_from,
  effective_to
) on table public.partner_schedules to authenticated;
grant select, insert, update on table public.partner_schedules to service_role;

drop policy if exists "partner_schedules_select_own" on public.partner_schedules;
drop policy if exists "partner_schedules_update_own" on public.partner_schedules;
drop policy if exists "partner_schedules_insert_mpho_admin" on public.partner_schedules;

create policy "partner_schedules_select_own"
  on public.partner_schedules for select
  to authenticated
  using (public.has_active_partner_membership(partner_id, false));

create policy "partner_schedules_update_own"
  on public.partner_schedules for update
  to authenticated
  using (public.has_active_partner_membership(partner_id, true))
  with check (public.has_active_partner_membership(partner_id, true));

-- Partner address/zone scopes must use the same active membership invariant.
drop policy if exists "zones_select_partner" on public.zones;
create policy "zones_select_partner"
  on public.zones for select
  to authenticated
  using (
    exists (
      select 1
      from public.partners as p
      where p.city_id = zones.city_id
        and public.has_active_partner_membership(p.id, false)
    )
  );

drop policy if exists "addresses_select_partner" on public.addresses;
drop policy if exists "addresses_insert_partner" on public.addresses;

create policy "addresses_select_partner"
  on public.addresses for select
  to authenticated
  using (
    owner_type = 'partner'
    and public.has_active_partner_membership(owner_id, false)
  );

create policy "addresses_insert_partner"
  on public.addresses for insert
  to authenticated
  with check (
    owner_type = 'partner'
    and public.has_active_partner_membership(owner_id, true)
  );
