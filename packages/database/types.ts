// =============================================================================
// Database types — generated from Supabase schema
// =============================================================================
// Run `supabase gen types typescript --local > packages/database/types.ts`
// after `supabase start` to get the latest auto-generated types.
//
// These manual types represent the Phase 2 identity/geography/partner schema.
// They serve as the source of truth until the auto-generator is available.
// =============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Enums ──────────────────────────────────────────────────────────────────

export type ProfileStatus = 'active' | 'suspended' | 'deleted';
export type UserRole = 'customer' | 'partner_operator' | 'partner_admin' | 'courier' | 'mpho_operator' | 'mpho_admin' | 'service_account';
export type UserRoleAssignmentStatus = 'active' | 'revoked';
export type CustomerStatus = 'active' | 'suspended' | 'deleted';
export type CityStatus = 'active' | 'planned' | 'suspended';
export type ZoneStatus = 'active' | 'planned' | 'suspended';
export type PartnerStatus = 'pending_onboarding' | 'active' | 'paused' | 'suspended' | 'closed';
export type PartnerCapabilityStatus = 'active' | 'suspended' | 'revoked';
export type RecipientSurpriseMode = 'none' | 'full_surprise' | 'partial_surprise';
export type AddressOwnerType = 'customer' | 'recipient' | 'partner' | 'order_snapshot';

// ─── Row types ──────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  auth_user_id: string;
  email: string | null;
  phone: string | null;
  display_name: string | null;
  status: ProfileStatus;
  default_role: UserRole;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface UserRoleAssignment {
  id: string;
  profile_id: string;
  role: UserRole;
  partner_id: string | null;
  status: UserRoleAssignmentStatus;
  created_at: string;
  revoked_at: string | null;
  created_by: string | null;
}

export interface Customer {
  id: string;
  profile_id: string;
  marketing_consent: boolean;
  preferred_currency: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  country_code: string;
  timezone: string;
  currency: string;
  status: CityStatus;
  created_at: string;
  updated_at: string;
}

export interface Zone {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  status: ZoneStatus;
  postal_codes: string[];
  boundary_geojson: Json | null;
  mphora_enabled: boolean;
  operating_hours: Json | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  owner_type: AddressOwnerType;
  owner_id: string;
  label: string | null;
  street: string;
  exterior_number: string;
  interior_number: string | null;
  neighborhood: string | null;
  postal_code: string | null;
  city_id: string;
  state: string | null;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
  references_text: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface Partner {
  id: string;
  public_name: string;
  legal_name: string | null;
  slug: string;
  status: PartnerStatus;
  city_id: string;
  primary_zone_id: string | null;
  address_id: string | null;
  phone: string | null;
  email: string | null;
  timezone: string | null;
  payout_currency: string;
  agreement_version: string | null;
  agreement_accepted_at: string | null;
  created_at: string;
  updated_at: string;
  paused_at: string | null;
  suspended_at: string | null;
  closed_at: string | null;
}

export interface PartnerCapability {
  id: string;
  partner_id: string;
  capability_code: string;
  status: PartnerCapabilityStatus;
  approved_by: string | null;
  approved_at: string | null;
  restrictions: Json | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerSchedule {
  id: string;
  partner_id: string;
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
  effective_from: string | null;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerScheduleException {
  id: string;
  partner_id: string;
  exception_date: string;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerCapacity {
  id: string;
  partner_id: string;
  capacity_type: string;
  capacity_value: number;
  active_count: number;
  valid_from: string | null;
  valid_until: string | null;
  updated_by: string | null;
  updated_at: string;
}

export interface Recipient {
  id: string;
  customer_id: string;
  name: string;
  relationship: string | null;
  phone: string | null;
  surprise_mode: RecipientSurpriseMode;
  notes: string | null;
  consent_basis: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

// ─── Insert/Update types ────────────────────────────────────────────────────
// Omits auto-generated fields (id, created_at, updated_at) for inserts.

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'last_login_at'>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'auth_user_id' | 'created_at'>>;

export type CustomerInsert = Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
export type CustomerUpdate = Partial<Omit<Customer, 'id' | 'profile_id' | 'created_at'>>;

export type CityInsert = Omit<City, 'id' | 'created_at' | 'updated_at'>;
export type CityUpdate = Partial<Omit<City, 'id' | 'created_at'>>;

export type ZoneInsert = Omit<Zone, 'id' | 'created_at' | 'updated_at'>;
export type ZoneUpdate = Partial<Omit<Zone, 'id' | 'created_at'>>;

export type PartnerInsert = Omit<Partner, 'id' | 'created_at' | 'updated_at' | 'paused_at' | 'suspended_at' | 'closed_at'>;
export type PartnerUpdate = Partial<Omit<Partner, 'id' | 'created_at'>>;

export type RecipientInsert = Omit<Recipient, 'id' | 'created_at' | 'updated_at' | 'archived_at'>;
export type RecipientUpdate = Partial<Omit<Recipient, 'id' | 'customer_id' | 'created_at'>>;

export type AddressInsert = Omit<Address, 'id' | 'created_at' | 'updated_at' | 'archived_at'>;
export type AddressUpdate = Partial<Omit<Address, 'id' | 'created_at'>>;
