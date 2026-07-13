// =============================================================================
// @mpho/database — public API
// =============================================================================

export {
  getSupabaseBrowserClient,
  getSupabaseServerClient,
  getSupabaseMiddlewareClient,
} from './client';

export type {
  // Enums
  ProfileStatus,
  UserRole,
  UserRoleAssignmentStatus,
  CustomerStatus,
  CityStatus,
  ZoneStatus,
  PartnerStatus,
  PartnerCapabilityStatus,
  RecipientSurpriseMode,
  AddressOwnerType,
  // Row types
  Profile,
  UserRoleAssignment,
  Customer,
  City,
  Zone,
  Address,
  Partner,
  PartnerCapability,
  PartnerSchedule,
  PartnerScheduleException,
  PartnerCapacity,
  Recipient,
  // Insert/Update types
  ProfileInsert,
  ProfileUpdate,
  CustomerInsert,
  CustomerUpdate,
  CityInsert,
  CityUpdate,
  ZoneInsert,
  ZoneUpdate,
  PartnerInsert,
  PartnerUpdate,
  RecipientInsert,
  RecipientUpdate,
  AddressInsert,
  AddressUpdate,
} from './types';
