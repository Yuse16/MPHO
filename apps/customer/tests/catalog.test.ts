import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PublicCatalogRow } from '@mpho/database'

const catalogMocks = vi.hoisted(() => ({ rpc: vi.fn() }))

vi.mock('@/lib/supabase/public', () => ({
  createPublicSupabaseClient: () => ({ rpc: catalogMocks.rpc }),
  PublicSupabaseConfigurationError: class extends Error {},
}))

import {
  getCatalogCategories,
  getCatalogListingBySlug,
  getCatalogListings,
  mapListingRows,
} from '@/lib/catalog'

const validRow: PublicCatalogRow = {
  listing_id: 'f1000000-0000-0000-0000-000000000001',
  product_id: 'e1000000-0000-0000-0000-000000000001',
  slug: 'rosas-premium',
  name: 'Rosas Premium',
  short_description: 'Descripción corta',
  full_description: 'Descripción completa',
  price_amount_minor: 129000,
  currency: 'MXN',
  image_url: '/storage/v1/object/public/public/products/rosas.jpg',
  image_alt: 'Rosas rojas',
  category_id: 'a1000000-0000-0000-0000-000000000001',
  category_slug: 'flores',
  category_name: 'Flores',
  featured: false,
  personalization_available: false,
  scheduled_delivery_available: false,
  mphora_candidate: false,
}

describe('public catalog contract', () => {
  beforeEach(() => {
    catalogMocks.rpc.mockReset()
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://127.0.0.1:54321')
  })

  it('maps only approved public DTO fields', () => {
    const result = mapListingRows([validRow])
    expect(result.status).toBe('SUCCESS_WITH_DATA')
    if (result.status !== 'SUCCESS_WITH_DATA') return

    const listing = result.data[0]
    expect(listing).toMatchObject({
      listingId: validRow.listing_id,
      slug: 'rosas-premium',
      price: { amountMinor: 129000, currency: 'MXN' },
    })
    expect(Object.keys(listing ?? {})).not.toEqual(
      expect.arrayContaining(['partnerId', 'externalSourceId', 'internalCost', 'internalNotes', 'lastVerifiedAt']),
    )
  })

  it('rejects an invalid relationship instead of fabricating an empty product', () => {
    const result = mapListingRows([{ ...validRow, product_id: '' }])
    expect(result.status).toBe('INVALID_RESPONSE')

    const incompleteCategory = mapListingRows([{ ...validRow, category_slug: '' }])
    expect(incompleteCategory.status).toBe('INVALID_RESPONSE')
  })

  it('does not present a permission failure as an empty catalog', async () => {
    catalogMocks.rpc.mockResolvedValue({
      data: null,
      error: { code: '42501', message: 'denied', details: '', hint: '', name: 'PostgrestError' },
    })
    const result = await getCatalogListings()
    expect(result.status).toBe('PERMISSION_ERROR')
    expect(result.data).toBeNull()
  })

  it('returns not-found semantics for an unknown slug', async () => {
    catalogMocks.rpc.mockResolvedValue({ data: [], error: null })
    const result = await getCatalogListingBySlug('no-existe')
    expect(result).toEqual({ status: 'SUCCESS_EMPTY', data: null })
  })

  it('passes the category filter to the controlled RPC', async () => {
    catalogMocks.rpc.mockResolvedValue({ data: [validRow], error: null })
    const result = await getCatalogListings({ categorySlug: 'flores' })
    expect(result.status).toBe('SUCCESS_WITH_DATA')
    expect(catalogMocks.rpc).toHaveBeenCalledWith('get_public_catalog', expect.objectContaining({ p_category_slug: 'flores' }))
  })

  it('uses the server-calculated category listing count', async () => {
    catalogMocks.rpc.mockResolvedValue({
      data: [{
        id: validRow.category_id,
        slug: 'flores',
        name: 'Flores',
        description: null,
        image_url: null,
        listing_count: 3,
      }],
      error: null,
    })
    const result = await getCatalogCategories()
    expect(result.status).toBe('SUCCESS_WITH_DATA')
    if (result.status === 'SUCCESS_WITH_DATA') expect(result.data[0]?.listingCount).toBe(3)
  })
})
