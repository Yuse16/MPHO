-- =============================================================================
-- Migration 001: Extensions and enum types
-- =============================================================================
-- Creates the foundational PostgreSQL extensions and enum types
-- required by all subsequent migrations.
-- =============================================================================

-- UUID generation
create extension if not exists "uuid-ossp" with schema extensions;

-- Custom enum types for MPHO domain

create type profile_status as enum (
  'active',
  'suspended',
  'deleted'
);

create type user_role as enum (
  'customer',
  'partner_operator',
  'partner_admin',
  'courier',
  'mpho_operator',
  'mpho_admin',
  'service_account'
);

create type user_role_assignment_status as enum (
  'active',
  'revoked'
);

create type customer_status as enum (
  'active',
  'suspended',
  'deleted'
);

create type city_status as enum (
  'active',
  'planned',
  'suspended'
);

create type zone_status as enum (
  'active',
  'planned',
  'suspended'
);

create type partner_status as enum (
  'pending_onboarding',
  'active',
  'paused',
  'suspended',
  'closed'
);

create type partner_capability_status as enum (
  'active',
  'suspended',
  'revoked'
);

create type recipient_surprise_mode as enum (
  'none',
  'full_surprise',
  'partial_surprise'
);

create type address_owner_type as enum (
  'customer',
  'recipient',
  'partner',
  'order_snapshot'
);
