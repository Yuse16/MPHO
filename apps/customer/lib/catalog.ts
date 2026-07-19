import type { PostgrestError } from '@supabase/supabase-js'
import type { PublicCatalogCategory, PublicCatalogListing } from '@mpho/types'
import type { PublicCatalogCategoryRow, PublicCatalogRow } from '@mpho/database'
import {
  createPublicSupabaseClient,
  PublicSupabaseConfigurationError,
} from '@/lib/supabase/public'

export type CatalogErrorCode =
  | 'NETWORK_ERROR'
  | 'PERMISSION_ERROR'
  | 'INVALID_QUERY'
  | 'INVALID_RESPONSE'
  | 'CONFIGURATION_ERROR'

export type CatalogResult<T> =
  | { status: 'SUCCESS_WITH_DATA'; data: T }
  | { status: 'SUCCESS_EMPTY'; data: T }
  | { status: CatalogErrorCode; data: null; message: string }

export const MAX_CATALOG_RESULTS = 100
export const MAX_CATALOG_SEARCH_LENGTH = 80

export async function getCatalogListings(options?: {
  categorySlug?: string
  limit?: number
  offset?: number
}): Promise<CatalogResult<PublicCatalogListing[]>> {
  try {
    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase.rpc('get_public_catalog', {
      p_category_slug: options?.categorySlug ?? undefined,
      p_listing_slug: undefined,
      p_result_limit: options?.limit ?? 20,
      p_result_offset: options?.offset ?? 0,
    })
    if (error) return catalogError(error)
    return mapListingRows(data ?? [])
  } catch (error) {
    return unexpectedCatalogError(error)
  }
}

export async function getCatalogListingBySlug(
  slug: string,
): Promise<CatalogResult<PublicCatalogListing | null>> {
  if (!slug.trim()) {
    return { status: 'INVALID_QUERY', data: null, message: 'The product slug is required.' }
  }

  try {
    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase.rpc('get_public_catalog', {
      p_category_slug: undefined,
      p_listing_slug: slug,
      p_result_limit: 1,
      p_result_offset: 0,
    })
    if (error) return catalogError(error)

    const mapped = mapListingRows(data ?? [])
    if (mapped.status === 'SUCCESS_EMPTY') {
      return { status: 'SUCCESS_EMPTY', data: null }
    }
    if (mapped.status !== 'SUCCESS_WITH_DATA') return mapped
    return { status: 'SUCCESS_WITH_DATA', data: mapped.data[0] ?? null }
  } catch (error) {
    return unexpectedCatalogError(error)
  }
}

export async function getCatalogCategories(): Promise<CatalogResult<PublicCatalogCategory[]>> {
  try {
    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase.rpc('get_public_catalog_categories')
    if (error) return catalogError(error)

    const categories: PublicCatalogCategory[] = []
    for (const row of data ?? []) {
      const mapped = mapCategoryRow(row)
      if (!mapped) {
        return invalidResponse('A public catalog category did not match its contract.')
      }
      categories.push(mapped)
    }
    return categories.length
      ? { status: 'SUCCESS_WITH_DATA', data: categories }
      : { status: 'SUCCESS_EMPTY', data: [] }
  } catch (error) {
    return unexpectedCatalogError(error)
  }
}

export function getFeaturedListings(limit = 6) {
  return getCatalogListings({ limit })
}

export function normalizeCatalogSearch(value: string | undefined): string {
  return value?.trim().replace(/\s+/g, ' ').slice(0, MAX_CATALOG_SEARCH_LENGTH) ?? ''
}

export function filterCatalogListings(
  listings: PublicCatalogListing[],
  search: string,
): PublicCatalogListing[] {
  const normalizedSearch = normalizeSearchText(normalizeCatalogSearch(search))
  if (!normalizedSearch) return listings

  const terms = normalizedSearch.split(' ')
  return listings.filter((listing) => {
    const searchableText = normalizeSearchText(
      [
        listing.name,
        listing.shortDescription,
        listing.fullDescription,
        listing.category?.name,
      ]
        .filter(isNonEmptyString)
        .join(' '),
    )
    return terms.every((term) => searchableText.includes(term))
  })
}

export function mapListingRows(rows: PublicCatalogRow[]): CatalogResult<PublicCatalogListing[]> {
  const listings: PublicCatalogListing[] = []
  for (const row of rows) {
    const mapped = mapListingRow(row)
    if (!mapped) {
      return invalidResponse('A public catalog listing did not match its contract.')
    }
    listings.push(mapped)
  }

  return listings.length
    ? { status: 'SUCCESS_WITH_DATA', data: listings }
    : { status: 'SUCCESS_EMPTY', data: [] }
}

function mapListingRow(row: PublicCatalogRow): PublicCatalogListing | null {
  const categoryValues = [row.category_id, row.category_slug, row.category_name]
  const hasAnyCategoryValue = categoryValues.some((value) => value !== null)

  if (
    !isNonEmptyString(row.listing_id) ||
    !isNonEmptyString(row.product_id) ||
    !isNonEmptyString(row.slug) ||
    !isNonEmptyString(row.name) ||
    !Number.isSafeInteger(row.price_amount_minor) ||
    row.price_amount_minor < 0 ||
    row.currency !== 'MXN' ||
    (hasAnyCategoryValue && !categoryValues.every(isNonEmptyString))
  ) {
    return null
  }

  const category =
    isNonEmptyString(row.category_id) &&
    isNonEmptyString(row.category_slug) &&
    isNonEmptyString(row.category_name)
      ? { id: row.category_id, slug: row.category_slug, name: row.category_name }
      : null
  const imageUrl = absolutePublicMediaUrl(row.image_url)

  return {
    listingId: row.listing_id,
    productId: row.product_id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    price: { amountMinor: row.price_amount_minor, currency: 'MXN' },
    image: imageUrl ? { url: imageUrl, alt: isNonEmptyString(row.image_alt) ? row.image_alt : row.name } : null,
    category,
    featured: row.featured,
    personalizationAvailable: row.personalization_available,
    scheduledDeliveryAvailable: row.scheduled_delivery_available,
    mphoraCandidate: row.mphora_candidate,
  }
}

function mapCategoryRow(row: PublicCatalogCategoryRow): PublicCatalogCategory | null {
  if (
    !isNonEmptyString(row.id) ||
    !isNonEmptyString(row.slug) ||
    !isNonEmptyString(row.name) ||
    !Number.isSafeInteger(row.listing_count) ||
    row.listing_count < 0
  ) {
    return null
  }
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    imageUrl: absolutePublicMediaUrl(row.image_url),
    listingCount: row.listing_count,
  }
}

function absolutePublicMediaUrl(path: string | null) {
  if (!path) return null
  if (!path.startsWith('/storage/v1/object/public/')) return null
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return baseUrl ? new URL(path, baseUrl).toString() : null
}

function catalogError(error: PostgrestError): CatalogResult<never> {
  if (error.code === '42501') {
    return { status: 'PERMISSION_ERROR', data: null, message: 'Catalog access was denied.' }
  }
  if (error.code.startsWith('PGRST') || error.code.startsWith('22')) {
    return { status: 'INVALID_QUERY', data: null, message: 'The catalog query was rejected.' }
  }
  return { status: 'NETWORK_ERROR', data: null, message: 'The catalog service is unavailable.' }
}

function unexpectedCatalogError(error: unknown): CatalogResult<never> {
  if (error instanceof PublicSupabaseConfigurationError) {
    return { status: 'CONFIGURATION_ERROR', data: null, message: error.message }
  }
  return { status: 'NETWORK_ERROR', data: null, message: 'The catalog service is unavailable.' }
}

function invalidResponse(message: string): CatalogResult<never> {
  return { status: 'INVALID_RESPONSE', data: null, message }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-MX')
}

export function formatPrice(money: PublicCatalogListing['price']): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(money.amountMinor / 100)
}
