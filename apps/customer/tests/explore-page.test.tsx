import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PublicCatalogCategory, PublicCatalogListing } from '@mpho/types'

const catalog = vi.hoisted(() => ({
  listings: vi.fn(),
  categories: vi.fn(),
}))

vi.mock('@/lib/catalog', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/catalog')>()),
  getCatalogListings: catalog.listings,
  getCatalogCategories: catalog.categories,
}))
vi.mock('@/components/customer-shell', () => ({
  CustomerShell: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('@/components/product-card', () => ({
  ProductCard: ({ product }: { product: { name: string; slug: string } }) => (
    <a href={`/producto/${product.slug}`}>{product.name}</a>
  ),
}))
vi.mock('@/components/catalog-retry-button', () => ({
  CatalogRetryButton: () => <button type="button">Intentar de nuevo</button>,
}))

import ExplorePage from '@/app/explorar/page'

const listings: PublicCatalogListing[] = [
  {
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
  },
  {
    listingId: 'f1000000-0000-4000-8000-000000000002',
    productId: 'e1000000-0000-4000-8000-000000000002',
    slug: 'caja-dulce',
    name: 'Caja dulce',
    shortDescription: 'Selección de chocolates',
    fullDescription: null,
    price: { amountMinor: 75000, currency: 'MXN' },
    image: null,
    category: { id: 'a1000000-0000-4000-8000-000000000002', slug: 'chocolates', name: 'Chocolates' },
    featured: false,
    personalizationAvailable: false,
    scheduledDeliveryAvailable: false,
    mphoraCandidate: false,
  },
]
const categories: PublicCatalogCategory[] = [
  {
    id: 'a1000000-0000-4000-8000-000000000001',
    slug: 'flores',
    name: 'Flores',
    description: null,
    imageUrl: null,
    listingCount: 1,
  },
]

describe('/explorar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    catalog.listings.mockResolvedValue({ status: 'SUCCESS_WITH_DATA', data: listings })
    catalog.categories.mockResolvedValue({ status: 'SUCCESS_WITH_DATA', data: categories })
  })

  it('renders valid public listings and navigates to their detail', async () => {
    render(await ExplorePage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByRole('link', { name: 'Ramo cálido' })).toHaveAttribute(
      'href',
      '/producto/ramo-calido',
    )
    expect(screen.getByText('2 regalos encontrados')).toBeInTheDocument()
  })

  it('applies search and category from searchParams without a client request', async () => {
    render(
      await ExplorePage({
        searchParams: Promise.resolve({ q: 'cálido', categoria: 'flores' }),
      }),
    )

    expect(screen.getByRole('link', { name: 'Ramo cálido' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Caja dulce' })).not.toBeInTheDocument()
    expect(catalog.listings).toHaveBeenCalledWith({ categorySlug: 'flores', limit: 100 })
    expect(screen.getByRole('link', { name: 'Limpiar filtros' })).toHaveAttribute('href', '/explorar')
  })

  it('keeps an unavailable category visible instead of hiding the active URL filter', async () => {
    catalog.listings.mockResolvedValueOnce({ status: 'SUCCESS_EMPTY', data: [] })
    render(
      await ExplorePage({
        searchParams: Promise.resolve({ categoria: 'categoria-retirada' }),
      }),
    )

    expect(screen.getByRole('option', { name: 'La categoría seleccionada ya no está disponible' }))
      .toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'Categoría' })).toHaveValue('categoria-retirada')
    expect(screen.getByRole('link', { name: 'Limpiar filtros' })).toBeInTheDocument()
  })

  it('distinguishes an empty catalog from a search without matches', async () => {
    catalog.listings.mockResolvedValueOnce({ status: 'SUCCESS_EMPTY', data: [] })
    const emptyView = render(await ExplorePage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByText('Todavía no hay regalos disponibles')).toBeInTheDocument()
    emptyView.unmount()

    render(await ExplorePage({ searchParams: Promise.resolve({ q: 'sin coincidencias' }) }))
    expect(screen.getByText('No encontramos coincidencias')).toBeInTheDocument()
  })

  it('shows a recoverable non-technical error state', async () => {
    catalog.listings.mockResolvedValue({
      status: 'NETWORK_ERROR',
      data: null,
      message: 'internal failure',
    })
    render(await ExplorePage({ searchParams: Promise.resolve({ q: 'ramo' }) }))

    expect(screen.getByRole('alert')).toHaveTextContent('No pudimos consultar el catálogo')
    expect(screen.getByRole('button', { name: 'Intentar de nuevo' })).toBeInTheDocument()
    expect(document.body).not.toHaveTextContent('internal failure')
  })
})
