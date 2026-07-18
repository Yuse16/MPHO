BEGIN;

CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT extensions.plan(83);

INSERT INTO public.cities (id, name, state, country_code, timezone, status)
VALUES (
  '91000000-0000-4000-8000-000000000001',
  'Ciudad aislamiento identidad',
  'Coahuila',
  'MX',
  'America/Monterrey',
  'active'
);

INSERT INTO public.partners (
  id, public_name, legal_name, slug, status, city_id, email,
  agreement_version, agreement_accepted_at
)
VALUES
  (
    '93000000-0000-4000-8000-000000000001',
    'Partner A de prueba',
    'Partner A interno',
    'partner-identidad-a',
    'active',
    '91000000-0000-4000-8000-000000000001',
    'partner-a@example.test',
    'security-test',
    now()
  ),
  (
    '93000000-0000-4000-8000-000000000002',
    'Partner B de prueba',
    'Partner B interno',
    'partner-identidad-b',
    'active',
    '91000000-0000-4000-8000-000000000001',
    'partner-b@example.test',
    'security-test',
    now()
  );

INSERT INTO public.profiles (
  id, auth_user_id, email, display_name, status, default_role
)
VALUES
  (
    '92000000-0000-4000-8000-000000000001',
    '91100000-0000-4000-8000-000000000001',
    'customer@example.test',
    'Customer test',
    'active',
    'customer'
  ),
  (
    '92000000-0000-4000-8000-000000000002',
    '91100000-0000-4000-8000-000000000002',
    'partner-a-admin@example.test',
    'Partner A admin',
    'active',
    'partner_admin'
  ),
  (
    '92000000-0000-4000-8000-000000000003',
    '91100000-0000-4000-8000-000000000003',
    'partner-b-admin@example.test',
    'Partner B admin',
    'active',
    'partner_admin'
  ),
  (
    '92000000-0000-4000-8000-000000000004',
    '91100000-0000-4000-8000-000000000004',
    'partner-a-operator@example.test',
    'Partner A operator',
    'active',
    'partner_operator'
  ),
  (
    '92000000-0000-4000-8000-000000000005',
    '91100000-0000-4000-8000-000000000005',
    'suspended@example.test',
    'Suspended Partner admin',
    'suspended',
    'partner_admin'
  ),
  (
    '92000000-0000-4000-8000-000000000006',
    '91100000-0000-4000-8000-000000000006',
    'service-flow@example.test',
    'Service flow target',
    'active',
    'customer'
  );

INSERT INTO public.customers (id, profile_id)
VALUES (
  '92500000-0000-4000-8000-000000000001',
  '92000000-0000-4000-8000-000000000001'
);

INSERT INTO public.user_roles (
  id, profile_id, role, partner_id, status, revoked_at
)
VALUES
  (
    '94000000-0000-4000-8000-000000000001',
    '92000000-0000-4000-8000-000000000001',
    'customer',
    null,
    'active',
    null
  ),
  (
    '94000000-0000-4000-8000-000000000002',
    '92000000-0000-4000-8000-000000000001',
    'courier',
    null,
    'revoked',
    now()
  ),
  (
    '94000000-0000-4000-8000-000000000003',
    '92000000-0000-4000-8000-000000000002',
    'partner_admin',
    '93000000-0000-4000-8000-000000000001',
    'active',
    null
  ),
  (
    '94000000-0000-4000-8000-000000000004',
    '92000000-0000-4000-8000-000000000003',
    'partner_admin',
    '93000000-0000-4000-8000-000000000002',
    'active',
    null
  ),
  (
    '94000000-0000-4000-8000-000000000005',
    '92000000-0000-4000-8000-000000000004',
    'partner_operator',
    '93000000-0000-4000-8000-000000000001',
    'active',
    null
  ),
  (
    '94000000-0000-4000-8000-000000000006',
    '92000000-0000-4000-8000-000000000005',
    'partner_admin',
    '93000000-0000-4000-8000-000000000001',
    'active',
    null
  );

INSERT INTO public.partner_capabilities (
  id, partner_id, capability_code, status
)
VALUES
  (
    '95000000-0000-4000-8000-000000000001',
    '93000000-0000-4000-8000-000000000001',
    'identity_test_a',
    'active'
  ),
  (
    '95000000-0000-4000-8000-000000000002',
    '93000000-0000-4000-8000-000000000002',
    'identity_test_b',
    'active'
  );

INSERT INTO public.partner_schedules (
  id, partner_id, day_of_week, opens_at, closes_at, is_closed
)
VALUES
  (
    '96000000-0000-4000-8000-000000000001',
    '93000000-0000-4000-8000-000000000001',
    1,
    '09:00',
    '18:00',
    false
  ),
  (
    '96000000-0000-4000-8000-000000000002',
    '93000000-0000-4000-8000-000000000002',
    1,
    '10:00',
    '17:00',
    false
  );

INSERT INTO public.partner_schedule_exceptions (
  id, partner_id, exception_date, is_closed, reason
)
VALUES
  (
    '97000000-0000-4000-8000-000000000001',
    '93000000-0000-4000-8000-000000000001',
    current_date + 30,
    true,
    'Prueba de aislamiento A'
  ),
  (
    '97000000-0000-4000-8000-000000000002',
    '93000000-0000-4000-8000-000000000002',
    current_date + 31,
    true,
    'Prueba de aislamiento B'
  );

INSERT INTO public.partner_capacity (
  id, partner_id, capacity_type, capacity_value, active_count
)
VALUES
  (
    '98000000-0000-4000-8000-000000000001',
    '93000000-0000-4000-8000-000000000001',
    'identity_test',
    1,
    0
  ),
  (
    '98000000-0000-4000-8000-000000000002',
    '93000000-0000-4000-8000-000000000002',
    'identity_test',
    1,
    0
  );

-- Base grants enforce property-level authorization before RLS is evaluated.
SELECT extensions.ok(
  NOT has_table_privilege('authenticated', 'public.profiles', 'INSERT'),
  'authenticated cannot insert profiles'
);
SELECT extensions.ok(
  has_column_privilege('authenticated', 'public.profiles', 'display_name', 'UPDATE'),
  'authenticated can update the allowlisted display_name column'
);
SELECT extensions.ok(
  NOT has_column_privilege('authenticated', 'public.profiles', 'status', 'UPDATE'),
  'authenticated cannot update profile status'
);
SELECT extensions.ok(
  NOT has_table_privilege('authenticated', 'public.user_roles', 'INSERT'),
  'authenticated cannot insert role assignments'
);
SELECT extensions.ok(
  NOT has_table_privilege('authenticated', 'public.user_roles', 'UPDATE'),
  'authenticated cannot update role assignments'
);
SELECT extensions.ok(
  NOT has_table_privilege('anon', 'public.partners', 'SELECT'),
  'anon cannot list Partner records'
);
SELECT extensions.ok(
  NOT has_table_privilege('authenticated', 'public.partners', 'UPDATE'),
  'authenticated cannot update Partner master data'
);
SELECT extensions.ok(
  has_column_privilege('authenticated', 'public.partner_schedules', 'opens_at', 'UPDATE'),
  'authenticated has the allowlisted schedule update privilege'
);
SELECT extensions.ok(
  NOT has_column_privilege('authenticated', 'public.partner_schedules', 'partner_id', 'UPDATE'),
  'authenticated cannot change a schedule Partner assignment'
);
SELECT extensions.ok(
  NOT has_function_privilege('public', 'public.has_active_partner_membership(uuid,boolean)', 'EXECUTE'),
  'Partner membership helper is not executable by PUBLIC'
);
SELECT extensions.ok(
  has_function_privilege('authenticated', 'public.has_active_partner_membership(uuid,boolean)', 'EXECUTE'),
  'Partner membership helper is executable by authenticated callers'
);
SELECT extensions.ok(
  NOT (SELECT prosecdef FROM pg_proc WHERE oid = 'public.auth_uid()'::regprocedure),
  'auth_uid uses invoker rights'
);
SELECT extensions.ok(
  NOT has_function_privilege('public', 'public.has_role(public.user_role)', 'EXECUTE'),
  'role helper is not executable by PUBLIC'
);
SELECT extensions.ok(
  NOT has_function_privilege('anon', 'public.has_role(public.user_role)', 'EXECUTE'),
  'role helper is not executable by anon'
);
SELECT extensions.ok(
  has_function_privilege('authenticated', 'public.has_role(public.user_role)', 'EXECUTE'),
  'role helper is executable by authenticated callers'
);
SELECT extensions.ok(
  NOT has_function_privilege('authenticated', 'public.handle_new_user()', 'EXECUTE'),
  'signup trigger function cannot be invoked directly by authenticated callers'
);
SELECT extensions.ok(
  (
    SELECT bool_and(proconfig @> ARRAY['search_path=""'])
    FROM pg_proc
    WHERE oid IN (
      'public.auth_roles()'::regprocedure,
      'public.auth_profile_id()'::regprocedure,
      'public.has_role(public.user_role)'::regprocedure,
      'public.is_mpho_staff()'::regprocedure,
      'public.handle_new_user()'::regprocedure,
      'public.has_active_partner_membership(uuid,boolean)'::regprocedure
    )
  ),
  'all identity SECURITY DEFINER functions pin an empty search_path'
);

SET LOCAL ROLE anon;
SELECT extensions.is(
  (SELECT count(*) FROM public.profiles),
  0::bigint,
  'anonymous catalog evaluation cannot read profile rows'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.user_roles),
  0::bigint,
  'anonymous catalog evaluation cannot read role-assignment rows'
);
RESET ROLE;

-- Customer identity and role-assignment protections.
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"91100000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);
SET LOCAL ROLE authenticated;

SELECT extensions.is(
  (SELECT count(*) FROM public.profiles WHERE id = '92000000-0000-4000-8000-000000000001'),
  1::bigint,
  'customer can read the own profile'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.profiles WHERE id = '92000000-0000-4000-8000-000000000002'),
  0::bigint,
  'customer cannot read another profile'
);
SELECT extensions.lives_ok(
  $$UPDATE public.profiles
    SET display_name = 'Nombre seguro', phone = '8440000000'
    WHERE id = '92000000-0000-4000-8000-000000000001'$$,
  'customer can update own safe profile fields'
);
SELECT extensions.is(
  (SELECT display_name FROM public.profiles WHERE id = '92000000-0000-4000-8000-000000000001'),
  'Nombre seguro'::text,
  'safe profile update is persisted'
);
SELECT extensions.throws_ok(
  $$UPDATE public.profiles SET default_role = 'partner_admin'
    WHERE id = '92000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot change default_role'
);
SELECT extensions.throws_ok(
  $$UPDATE public.profiles SET status = 'active'
    WHERE id = '92000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot change profile status or self-reactivate'
);
SELECT extensions.throws_ok(
  $$UPDATE public.profiles SET auth_user_id = '91100000-0000-4000-8000-000000000099'
    WHERE id = '92000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot change auth_user_id'
);
SELECT extensions.throws_ok(
  $$UPDATE public.profiles SET id = '92000000-0000-4000-8000-000000000099'
    WHERE id = '92000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot change profile id'
);
SELECT extensions.throws_ok(
  $$UPDATE public.profiles SET email = 'attacker@example.test'
    WHERE id = '92000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot change the profile email snapshot directly'
);
SELECT extensions.throws_ok(
  $$UPDATE public.profiles SET created_at = now()
    WHERE id = '92000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot change profile created_at'
);
SELECT extensions.throws_ok(
  $$UPDATE public.profiles SET updated_at = now()
    WHERE id = '92000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot set profile updated_at directly'
);
SELECT extensions.throws_ok(
  $$UPDATE public.profiles SET last_login_at = now()
    WHERE id = '92000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot set last_login_at directly'
);
SELECT extensions.throws_ok(
  $$INSERT INTO public.profiles (auth_user_id, email)
    VALUES ('91100000-0000-4000-8000-000000000099', 'insert@example.test')$$,
  '42501', NULL,
  'customer cannot insert a direct profile'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.user_roles WHERE profile_id = '92000000-0000-4000-8000-000000000001'),
  2::bigint,
  'customer can read own active and revoked role records'
);
SELECT extensions.throws_ok(
  $$INSERT INTO public.user_roles (profile_id, role, partner_id)
    VALUES (
      '92000000-0000-4000-8000-000000000001',
      'partner_admin',
      '93000000-0000-4000-8000-000000000001'
    )$$,
  '42501', NULL,
  'customer cannot insert a Partner role'
);
SELECT extensions.throws_ok(
  $$UPDATE public.user_roles SET role = 'partner_admin'
    WHERE id = '94000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot change role'
);
SELECT extensions.throws_ok(
  $$UPDATE public.user_roles SET partner_id = '93000000-0000-4000-8000-000000000001'
    WHERE id = '94000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot choose a Partner assignment'
);
SELECT extensions.throws_ok(
  $$UPDATE public.user_roles SET status = 'revoked'
    WHERE id = '94000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot change role status'
);
SELECT extensions.throws_ok(
  $$UPDATE public.user_roles SET revoked_at = null
    WHERE id = '94000000-0000-4000-8000-000000000002'$$,
  '42501', NULL,
  'customer cannot clear revoked_at'
);
SELECT extensions.throws_ok(
  $$UPDATE public.user_roles SET created_by = '92000000-0000-4000-8000-000000000001'
    WHERE id = '94000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'customer cannot alter role audit ownership'
);
SELECT extensions.throws_ok(
  $$UPDATE public.user_roles SET status = 'active', revoked_at = null
    WHERE id = '94000000-0000-4000-8000-000000000002'$$,
  '42501', NULL,
  'customer cannot reactivate a revoked assignment'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.partners),
  0::bigint,
  'customer cannot see Partner master data'
);
SELECT extensions.is(
  public.auth_uid(),
  auth.uid(),
  'auth_uid is equivalent to canonical auth.uid'
);
SELECT extensions.lives_ok(
  $$UPDATE public.customers SET marketing_consent = true
    WHERE id = '92500000-0000-4000-8000-000000000001'$$,
  'customer can update an allowlisted customer preference'
);
SELECT extensions.is(
  (SELECT marketing_consent FROM public.customers WHERE id = '92500000-0000-4000-8000-000000000001'),
  true,
  'allowlisted customer preference update is persisted'
);
SELECT extensions.throws_ok(
  $$INSERT INTO public.customers (profile_id)
    VALUES ('92000000-0000-4000-8000-000000000006')$$,
  '42501', NULL,
  'customer cannot insert the signup extension row directly'
);

-- Partner A can see only its scope and may update only its safe schedule fields.
RESET ROLE;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"91100000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);
SET LOCAL ROLE authenticated;

SELECT extensions.is(
  (SELECT count(*) FROM public.partners WHERE id = '93000000-0000-4000-8000-000000000001'),
  1::bigint,
  'Partner admin can read the assigned Partner'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.partners WHERE id = '93000000-0000-4000-8000-000000000002'),
  0::bigint,
  'Partner admin cannot read another Partner'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.partner_capabilities WHERE partner_id = '93000000-0000-4000-8000-000000000001'),
  1::bigint,
  'Partner admin can read own capabilities'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.partner_capabilities WHERE partner_id = '93000000-0000-4000-8000-000000000002'),
  0::bigint,
  'Partner admin cannot read another Partner capabilities'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.partner_schedules WHERE partner_id = '93000000-0000-4000-8000-000000000001'),
  1::bigint,
  'Partner admin can read own schedules'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.partner_schedules WHERE partner_id = '93000000-0000-4000-8000-000000000002'),
  0::bigint,
  'Partner admin cannot read another Partner schedules'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.partner_capacity WHERE partner_id = '93000000-0000-4000-8000-000000000001'),
  1::bigint,
  'Partner admin can read own capacity'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.partner_capacity WHERE partner_id = '93000000-0000-4000-8000-000000000002'),
  0::bigint,
  'Partner admin cannot read another Partner capacity'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.partner_schedule_exceptions WHERE partner_id = '93000000-0000-4000-8000-000000000001'),
  1::bigint,
  'Partner admin can read own schedule exceptions'
);
SELECT extensions.is(
  (SELECT count(*) FROM public.partner_schedule_exceptions WHERE partner_id = '93000000-0000-4000-8000-000000000002'),
  0::bigint,
  'Partner admin cannot read another Partner schedule exceptions'
);
SELECT extensions.lives_ok(
  $$UPDATE public.partner_schedules
    SET opens_at = '08:30', closes_at = '17:30'
    WHERE id = '96000000-0000-4000-8000-000000000001'$$,
  'Partner admin can update safe fields on own schedule'
);
SELECT extensions.is(
  (SELECT opens_at FROM public.partner_schedules WHERE id = '96000000-0000-4000-8000-000000000001'),
  '08:30'::time,
  'own safe schedule update is persisted'
);
SELECT extensions.throws_ok(
  $$UPDATE public.partner_schedules
    SET partner_id = '93000000-0000-4000-8000-000000000002'
    WHERE id = '96000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'Partner admin cannot reassign a schedule'
);
SELECT extensions.throws_ok(
  $$UPDATE public.partner_schedules
    SET id = '96000000-0000-4000-8000-000000000099'
    WHERE id = '96000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'Partner admin cannot change a schedule id'
);
SELECT extensions.throws_ok(
  $$UPDATE public.partner_schedules SET created_at = now()
    WHERE id = '96000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'Partner admin cannot change schedule created_at'
);
SELECT extensions.throws_ok(
  $$UPDATE public.partner_schedules SET updated_at = now()
    WHERE id = '96000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'Partner admin cannot set schedule updated_at directly'
);
SELECT extensions.lives_ok(
  $$UPDATE public.partner_schedules
    SET opens_at = '07:00'
    WHERE id = '96000000-0000-4000-8000-000000000002'$$,
  'cross-Partner schedule update is rejected without leaking row existence'
);
SELECT extensions.throws_ok(
  $$UPDATE public.partners SET status = 'active'
    WHERE id = '93000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'Partner admin cannot change Partner status'
);
SELECT extensions.throws_ok(
  $$UPDATE public.partners SET city_id = '91000000-0000-4000-8000-000000000001'
    WHERE id = '93000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'Partner admin cannot change Partner territory'
);
SELECT extensions.throws_ok(
  $$UPDATE public.partners SET agreement_version = 'attacker-controlled'
    WHERE id = '93000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'Partner admin cannot change agreement fields'
);
SELECT extensions.throws_ok(
  $$UPDATE public.partner_capabilities SET status = 'active'
    WHERE id = '95000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'Partner admin cannot self-approve capabilities'
);
SELECT extensions.throws_ok(
  $$UPDATE public.partner_capacity SET capacity_value = 99
    WHERE id = '98000000-0000-4000-8000-000000000001'$$,
  '42501', NULL,
  'Partner admin cannot alter authoritative capacity directly'
);
SELECT extensions.throws_ok(
  $$INSERT INTO public.partner_schedule_exceptions (
      partner_id, exception_date, is_closed
    ) VALUES (
      '93000000-0000-4000-8000-000000000001', current_date + 60, true
    )$$,
  '42501', NULL,
  'Partner admin cannot insert operational exceptions directly'
);

-- Partner operator has read scope but no regular schedule mutation policy.
RESET ROLE;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"91100000-0000-4000-8000-000000000004","role":"authenticated"}',
  true
);
SET LOCAL ROLE authenticated;
SELECT extensions.lives_ok(
  $$UPDATE public.partner_schedules
    SET opens_at = '07:30'
    WHERE id = '96000000-0000-4000-8000-000000000001'$$,
  'Partner operator schedule update is rejected without leaking row existence'
);

RESET ROLE;
SELECT extensions.is(
  (SELECT opens_at FROM public.partner_schedules WHERE id = '96000000-0000-4000-8000-000000000001'),
  '08:30'::time,
  'Partner operator did not change the schedule'
);
SELECT extensions.is(
  (SELECT opens_at FROM public.partner_schedules WHERE id = '96000000-0000-4000-8000-000000000002'),
  '10:00'::time,
  'Partner admin did not change another Partner schedule'
);

-- Suspended profiles cannot use an otherwise active Partner assignment.
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"91100000-0000-4000-8000-000000000005","role":"authenticated"}',
  true
);
SET LOCAL ROLE authenticated;
SELECT extensions.is(
  (SELECT count(*) FROM public.partners),
  0::bigint,
  'suspended Partner profile cannot read Partner data'
);

-- Controlled service role remains capable of legitimate administration.
RESET ROLE;
SET LOCAL ROLE service_role;
SELECT extensions.lives_ok(
  $$INSERT INTO public.user_roles (
      id, profile_id, role, partner_id, status
    ) VALUES (
      '94000000-0000-4000-8000-000000000099',
      '92000000-0000-4000-8000-000000000006',
      'partner_operator',
      '93000000-0000-4000-8000-000000000001',
      'active'
    )$$,
  'service_role can create a legitimate role assignment'
);
SELECT extensions.is(
  (SELECT role FROM public.user_roles WHERE id = '94000000-0000-4000-8000-000000000099'),
  'partner_operator'::public.user_role,
  'service role assignment is persisted'
);
SELECT extensions.lives_ok(
  $$UPDATE public.user_roles SET status = 'revoked', revoked_at = now()
    WHERE id = '94000000-0000-4000-8000-000000000099'$$,
  'service_role can revoke a role assignment'
);
SELECT extensions.lives_ok(
  $$UPDATE public.partners SET status = 'paused'
    WHERE id = '93000000-0000-4000-8000-000000000001'$$,
  'service_role can manage Partner status'
);
SELECT extensions.lives_ok(
  $$UPDATE public.partners SET status = 'active'
    WHERE id = '93000000-0000-4000-8000-000000000001'$$,
  'service_role can restore Partner status through a controlled path'
);

-- Supabase Auth signup remains the authoritative creation path.
RESET ROLE;
SELECT extensions.lives_ok(
  $$INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '91100000-0000-4000-8000-000000000099',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'signup-security@example.test',
      '',
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Signup security test"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )$$,
  'Auth signup trigger creates identity records without client table INSERT grants'
);
SELECT extensions.is(
  (
    SELECT status
    FROM public.profiles
    WHERE auth_user_id = '91100000-0000-4000-8000-000000000099'
  ),
  'active'::public.profile_status,
  'signup creates an active profile'
);
SELECT extensions.is(
  (
    SELECT default_role
    FROM public.profiles
    WHERE auth_user_id = '91100000-0000-4000-8000-000000000099'
  ),
  'customer'::public.user_role,
  'signup profile defaults to customer'
);
SELECT extensions.is(
  (
    SELECT count(*)
    FROM public.customers AS c
    JOIN public.profiles AS p ON p.id = c.profile_id
    WHERE p.auth_user_id = '91100000-0000-4000-8000-000000000099'
  ),
  1::bigint,
  'signup creates the customer extension row'
);
SELECT extensions.is(
  (
    SELECT ur.role
    FROM public.user_roles AS ur
    JOIN public.profiles AS p ON p.id = ur.profile_id
    WHERE p.auth_user_id = '91100000-0000-4000-8000-000000000099'
  ),
  'customer'::public.user_role,
  'signup creates only the customer role'
);
SELECT extensions.is(
  (
    SELECT email
    FROM public.profiles
    WHERE auth_user_id = '91100000-0000-4000-8000-000000000099'
  ),
  'signup-security@example.test'::text,
  'signup copies the Auth email into the read-only profile snapshot'
);

SELECT * FROM extensions.finish();
ROLLBACK;
