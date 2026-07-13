-- =============================================================================
-- Migration 009: Auth signup trigger
-- =============================================================================
-- Automatically creates a profile + customer record when a new user signs up
-- via Supabase Auth.
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  new_profile_id uuid;
begin
  -- Create the profile
  insert into public.profiles (auth_user_id, email, phone, display_name, status, default_role)
  values (
    new.id,
    coalesce(new.email, new.raw_user_meta_data->>'email'),
    coalesce(new.phone, new.raw_user_meta_data->>'phone'),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'active',
    'customer'
  )
  returning id into new_profile_id;

  -- Create the customer record
  insert into public.customers (profile_id, marketing_consent, preferred_currency)
  values (
    new_profile_id,
    coalesce((new.raw_user_meta_data->>'marketing_consent')::boolean, false),
    'MXN'
  );

  -- Assign the customer role
  insert into public.user_roles (profile_id, role, status)
  values (new_profile_id, 'customer', 'active');

  return new;
end;
$$;

comment on function public.handle_new_user() is 'Creates profile + customer + role assignment on Supabase Auth signup.';

-- Attach trigger to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
