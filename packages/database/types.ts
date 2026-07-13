// =============================================================================
// Database types — generated from Supabase schema
// =============================================================================
// Run `supabase gen types typescript --local > packages/database/types.ts`
// after `supabase start` to get the latest auto-generated types.
//
// These manual types represent the Phase 2-4 identity/geography/partner/catalog schema.
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
export type CategoryType = 'product' | 'occasion' | 'recipient' | 'style';
export type ProductStatus = 'active' | 'draft' | 'archived';
export type ProductType = 'product' | 'service' | 'bundle' | 'add_on';
export type TagType = 'style' | 'feature' | 'delivery' | 'seasonal';
export type TagStatus = 'active' | 'archived';
export type ListingStatus = 'draft' | 'submitted' | 'published' | 'changes_requested' | 'suspended' | 'archived';
export type ListingSourceType = 'partner_local' | 'external_curated' | 'mpho_owned_future';
export type AvailabilityMode = 'instant' | 'partner_confirmation' | 'by_order';
export type MediaOwnerType = 'product' | 'listing' | 'partner' | 'order' | 'brand';
export type MediaVisibility = 'public' | 'private' | 'restricted';
export type MediaStatus = 'active' | 'archived';

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

// ─── Catalog types (Phase 4) ────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  type: TagType;
  status: TagStatus;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  product_type: ProductType;
  category_id: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductTag {
  product_id: string;
  tag_id: string;
}

export interface Listing {
  id: string;
  product_id: string;
  partner_id: string | null;
  source_type: ListingSourceType;
  customer_title: string;
  customer_description: string | null;
  status: ListingStatus;
  availability_mode: AvailabilityMode;
  base_price_amount_minor: number;
  currency: string;
  preparation_minutes: number | null;
  external_source_url: string | null;
  external_observed_price_minor: number | null;
  external_last_validated_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingZone {
  listing_id: string;
  zone_id: string;
  status: ProductStatus;
  created_at: string;
}

export interface ListingVariant {
  id: string;
  listing_id: string;
  name: string;
  slug: string;
  sku: string | null;
  price_amount_minor: number;
  currency: string;
  stock_quantity: number | null;
  stock_mode: string;
  status: TagStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ListingOption {
  id: string;
  listing_id: string;
  name: string;
  slug: string;
  option_type: string;
  values: Json;
  default_value: string | null;
  price_impact_minor: number;
  required: boolean;
  sort_order: number;
  status: TagStatus;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  owner_type: MediaOwnerType;
  owner_id: string;
  storage_bucket: string;
  storage_path: string;
  visibility: MediaVisibility;
  mime_type: string;
  alt_text: string | null;
  sort_order: number;
  status: MediaStatus;
  created_at: string;
  updated_at: string;
}

// ─── Composite query types ──────────────────────────────────────────────────
// Types returned by catalog queries joining listings + products + media.

export interface CatalogListing {
  listing: Listing;
  product: Product & { category: Category | null };
  tags: Tag[];
  primary_media: MediaAsset | null;
  listing_zones: { zone: Zone }[];
  min_price: number;
  max_price: number;
}

export interface CatalogCategory {
  category: Category;
  listing_count: number;
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

export type CategoryInsert = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type CategoryUpdate = Partial<Omit<Category, 'id' | 'created_at'>>;

export type TagInsert = Omit<Tag, 'id' | 'created_at' | 'updated_at'>;
export type TagUpdate = Partial<Omit<Tag, 'id' | 'created_at'>>;

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<Omit<Product, 'id' | 'created_at'>>;

export type ListingInsert = Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'published_at'>;
export type ListingUpdate = Partial<Omit<Listing, 'id' | 'created_at'>>;

export type ListingVariantInsert = Omit<ListingVariant, 'id' | 'created_at' | 'updated_at'>;
export type ListingVariantUpdate = Partial<Omit<ListingVariant, 'id' | 'created_at'>>;

export type ListingOptionInsert = Omit<ListingOption, 'id' | 'created_at' | 'updated_at'>;
export type ListingOptionUpdate = Partial<Omit<ListingOption, 'id' | 'created_at'>>;

export type MediaAssetInsert = Omit<MediaAsset, 'id' | 'created_at' | 'updated_at'>;
export type MediaAssetUpdate = Partial<Omit<MediaAsset, 'id' | 'created_at'>>;
