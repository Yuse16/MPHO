import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PublicCatalogListing } from '@mpho/types'

const mocks = vi.hoisted(() => ({ listing: vi.fn(), configuration: vi.fn(), notFound: vi.fn() }))

vi.mock('@/lib/catalog', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/catalog')>()),
  getCatalogListingBySlug: mocks.listing,
}))
vi.mock('@/lib/quotes', () => ({ getQuoteConfiguration: mocks.configuration }))
vi.mock('next/navigation', () => ({
  notFound: () => {
    mocks.notFound()
    throw new Error('NEXT_NOT_FOUND')
  },
}))
vi.mock('@/components/customer-shell', () => ({
  CustomerShell: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('@/components/basic-add-to-cart', () => ({
  BasicAddToCart: ({ listingId }: { listingId: string }) => (
    <button type="button">Agregar {listingId}</button>
  ),
}))
vi.mock('@/components/quote-calculator', () => ({
  QuoteCalculator: () => <button type="button">Agregar selección al carrito</button>,
}))
vi.mock('@/components/catalog-retry-button', () => ({
  CatalogRetryButton: () => <button type="button">Intentar de nuevo</button>,
}))

import ProductPage from '@/app/producto/[slug]/page'

const listing: PublicCatalogListing = {
  listingId: 'f1000000-0000-4000-8000-000000000001',
  productId: 'e1000000-0000-4000-8000-000000000001',
  slug: 'ramo-calido',
  name: 'Ramo cálido',
  shortDescription: 'Flores en tonos cálidos',
  fullDescription: null,
  price: { amountMinor: 90000, currency: 'MXN' },
  image: null,
  category: { id: 'a1000000-0000-4000-8000-000000000001', slug: 'flores', name: 'Flores' },
  featured: false,
  personalizationAvailable: false,
  scheduledDeliveryAvailable: false,
  mphoraCandidate: false,
}

describe('/producto/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.listing.mockResolvedValue({ status: 'SUCCESS_WITH_DATA', data: listing })
    mocks.configuration.mockResolvedValue(null)
  })

  it('renders only the real product and integrates the cart action', async () => {
    render(await ProductPage({ params: Promise.resolve({ slug: listing.slug }) }))

    expect(screen.getByRole('heading', { name: 'Ramo cálido' })).toBeInTheDocument()
    expect(screen.getByText('$900')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al catálogo' })).toHaveAttribute(
      'href',
      '/explorar',
    )
    expect(screen.getByRole('button', { name: `Agregar ${listing.listingId}` })).toBeInTheDocument()
  })

  it('uses notFound for an unknown or unavailable public product', async () => {
    mocks.listing.mockResolvedValue({ status: 'SUCCESS_EMPTY', data: null })

    await expect(
      ProductPage({ params: Promise.resolve({ slug: 'no-disponible' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(mocks.notFound).toHaveBeenCalledOnce()
  })

  it('renders a recoverable query error without exposing internals', async () => {
    mocks.listing.mockResolvedValue({
      status: 'NETWORK_ERROR',
      data: null,
      message: 'database internals',
    })
    render(await ProductPage({ params: Promise.resolve({ slug: listing.slug }) }))

    expect(screen.getByRole('alert')).toHaveTextContent('No pudimos consultar este regalo')
    expect(screen.getByRole('button', { name: 'Intentar de nuevo' })).toBeInTheDocument()
    expect(document.body).not.toHaveTextContent('database internals')
  })

  it('does not add a configurable product when its options cannot be loaded', async () => {
    mocks.listing.mockResolvedValue({
      status: 'SUCCESS_WITH_DATA',
      data: { ...listing, personalizationAvailable: true },
    })
    render(await ProductPage({ params: Promise.resolve({ slug: listing.slug }) }))

    expect(screen.getByRole('alert')).toHaveTextContent('No pudimos cargar las opciones')
    expect(screen.queryByRole('button', { name: new RegExp(`Agregar ${listing.listingId}`) })).not.toBeInTheDocument()
  })
})
