-- =============================================================================
-- Migration 002: Database helper functions (no table dependencies)
-- =============================================================================
-- Reusable PostgreSQL functions that do not depend on any tables.
-- Table-dependent auth functions are in migration 003b.
-- =============================================================================

-- Automatically update updated_at on row modification
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Returns the auth user id of the currently authenticated user
create or replace function public.auth_uid()
returns uuid
language sql
stable
security definer
as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid;
$$;
