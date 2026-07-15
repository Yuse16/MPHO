// Domain aliases are built on the generated Supabase schema. The generated file
// is the SQL source of truth; this module only adds stable domain names.
import type {
  Database,
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from './types.generated'

export type { Database, Json } from './types.generated'

export type ProfileStatus = Enums<'profile_status'>
export type UserRole = Enums<'user_role'>
export type UserRoleAssignmentStatus = Enums<'user_role_assignment_status'>
export type CityStatus = Enums<'city_status'>
export type ZoneStatus = Enums<'zone_status'>
export type PartnerStatus = Enums<'partner_status'>
export type PartnerCapabilityStatus = Enums<'partner_capability_status'>
export type RecipientSurpriseMode = Enums<'recipient_surprise_mode'>
export type AddressOwnerType = Enums<'address_owner_type'>
export type CategoryType = Enums<'category_type'>
export type ProductStatus = Enums<'product_status'>
export type ProductType = Enums<'product_type'>
export type TagType = Enums<'tag_type'>
export type ListingStatus = Enums<'listing_status'>
export type ListingSourceType = Enums<'listing_source_type'>
export type AvailabilityMode = Enums<'availability_mode'>
export type MediaVisibility = Enums<'media_visibility'>
export type QuoteStatus = Enums<'quote_status'>
export type QuoteAvailabilityStatus = Enums<'quote_availability_status'>
export type CartStatus = Enums<'cart_status'>
export type OrderState = Enums<'order_state'>

export type Profile = Tables<'profiles'>
export type UserRoleAssignment = Tables<'user_roles'>
export type Customer = Tables<'customers'>
export type City = Tables<'cities'>
export type Zone = Tables<'zones'>
export type Address = Tables<'addresses'>
export type Partner = Tables<'partners'>
export type PartnerCapability = Tables<'partner_capabilities'>
export type PartnerSchedule = Tables<'partner_schedules'>
export type PartnerScheduleException = Tables<'partner_schedule_exceptions'>
export type PartnerCapacity = Tables<'partner_capacity'>
export type Recipient = Tables<'recipients'>
export type Category = Tables<'categories'>
export type Tag = Tables<'tags'>
export type Product = Tables<'products'>
export type ProductTag = Tables<'product_tags'>
export type Listing = Tables<'listings'>
export type ListingZone = Tables<'listing_zones'>
export type ListingVariant = Tables<'listing_variants'>
export type ListingOption = Tables<'listing_options'>
export type MediaAsset = Tables<'media_assets'>
export type Quote = Tables<'quotes'>
export type QuoteItem = Tables<'quote_items'>
export type Cart = Tables<'carts'>
export type CartItem = Tables<'cart_items'>
export type CartItemOption = Tables<'cart_item_options'>
export type CartItemPersonalization = Tables<'cart_item_personalizations'>
export type CartRecipient = Tables<'cart_recipients'>
export type CartDeliveryAddress = Tables<'cart_delivery_addresses'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type OrderStateHistory = Tables<'order_state_history'>

export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>
export type CustomerInsert = TablesInsert<'customers'>
export type CustomerUpdate = TablesUpdate<'customers'>
export type CityInsert = TablesInsert<'cities'>
export type CityUpdate = TablesUpdate<'cities'>
export type ZoneInsert = TablesInsert<'zones'>
export type ZoneUpdate = TablesUpdate<'zones'>
export type PartnerInsert = TablesInsert<'partners'>
export type PartnerUpdate = TablesUpdate<'partners'>
export type RecipientInsert = TablesInsert<'recipients'>
export type RecipientUpdate = TablesUpdate<'recipients'>
export type AddressInsert = TablesInsert<'addresses'>
export type AddressUpdate = TablesUpdate<'addresses'>
export type CategoryInsert = TablesInsert<'categories'>
export type CategoryUpdate = TablesUpdate<'categories'>
export type TagInsert = TablesInsert<'tags'>
export type TagUpdate = TablesUpdate<'tags'>
export type ProductInsert = TablesInsert<'products'>
export type ProductUpdate = TablesUpdate<'products'>
export type ListingInsert = TablesInsert<'listings'>
export type ListingUpdate = TablesUpdate<'listings'>
export type ListingVariantInsert = TablesInsert<'listing_variants'>
export type ListingVariantUpdate = TablesUpdate<'listing_variants'>
export type ListingOptionInsert = TablesInsert<'listing_options'>
export type ListingOptionUpdate = TablesUpdate<'listing_options'>
export type MediaAssetInsert = TablesInsert<'media_assets'>
export type MediaAssetUpdate = TablesUpdate<'media_assets'>
export type QuoteInsert = TablesInsert<'quotes'>
export type QuoteItemInsert = TablesInsert<'quote_items'>
export type CartInsert = TablesInsert<'carts'>
export type CartItemInsert = TablesInsert<'cart_items'>
export type OrderInsert = TablesInsert<'orders'>
export type OrderItemInsert = TablesInsert<'order_items'>

export type PublicCatalogRow =
  Database['public']['Functions']['get_public_catalog']['Returns'][number]
export type PublicCatalogCategoryRow =
  Database['public']['Functions']['get_public_catalog_categories']['Returns'][number]
