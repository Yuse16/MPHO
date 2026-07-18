import { AlertTriangle, Gift, SearchX } from 'lucide-react'
import { CatalogFilters } from '@/components/catalog-filters'
import { CatalogRetryButton } from '@/components/catalog-retry-button'
import { CustomerEmptyState } from '@/components/customer-empty-state'
import { CustomerPageHeading } from '@/components/customer-page-heading'
import { CustomerShell } from '@/components/customer-shell'
import { ProductCard } from '@/components/product-card'
import {
  filterCatalogListings,
  getCatalogCategories,
  getCatalogListings,
  MAX_CATALOG_RESULTS,
  normalizeCatalogSearch,
} from '@/lib/catalog'
import type { Product } from '@/lib/data'

type ExploreSearchParams = {
  q?: string | string[]
  categoria?: string | string[]
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<ExploreSearchParams>
}) {
  const params = await searchParams
  const search = normalizeCatalogSearch(firstValue(params.q))
  const category = normalizeCategory(firstValue(params.categoria))
  const [result, categoryResult] = await Promise.all([
    getCatalogListings({ categorySlug: category || undefined, limit: MAX_CATALOG_RESULTS }),
    getCatalogCategories(),
  ])
  const categories =
    categoryResult.status === 'SUCCESS_WITH_DATA' ? categoryResult.data : []
  const categoriesLoaded =
    categoryResult.status === 'SUCCESS_WITH_DATA' || categoryResult.status === 'SUCCESS_EMPTY'
  const listings = result.status === 'SUCCESS_WITH_DATA' ? result.data : []
  const filteredListings = filterCatalogListings(listings, search)
  const products: Product[] =
    filteredListings.length > 0
      ? filteredListings.map((listing) => ({
          id: listing.listingId,
          slug: listing.slug,
          name: listing.name,
          description:
            listing.shortDescription ??
            listing.fullDescription ??
            'Consulta la información disponible de este regalo.',
          price: listing.price,
          image: listing.image?.url ?? null,
          alt: listing.image?.alt ?? listing.name,
          requiresConfiguration: listing.personalizationAvailable,
        }))
      : []

  return (
    <CustomerShell>
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-10 sm:px-8 lg:pb-16 lg:pt-14">
        <CustomerPageHeading
          eyebrow="Catálogo MPHO"
          title="Explora regalos"
          description="Descubre opciones publicadas por MPHO. La disponibilidad, preparación y entrega se validan antes de confirmar cada pedido."
        />

        <CatalogFilters
          categories={categories}
          search={search}
          category={category}
          categoriesLoaded={categoriesLoaded}
        />

        {categoryResult.status !== 'SUCCESS_WITH_DATA' &&
          categoryResult.status !== 'SUCCESS_EMPTY' && (
            <p
              role="status"
              className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-sm text-amber-100"
            >
              Las categorías no están disponibles por el momento. La búsqueda general sigue activa.
            </p>
          )}

        {isCatalogError(result.status) ? (
          <section
            role="alert"
            className="glass flex min-h-72 flex-col items-center justify-center rounded-[2rem] px-6 py-12 text-center"
          >
            <span className="flex size-16 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/5 text-amber-200">
              <AlertTriangle className="size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-foreground sm:text-2xl">
              No pudimos consultar el catálogo
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              La información no está disponible en este momento. Intenta nuevamente sin perder tus filtros.
            </p>
            <CatalogRetryButton />
          </section>
        ) : products.length > 0 ? (
          <>
            <p role="status" className="mb-5 text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? 'regalo encontrado' : 'regalos encontrados'}
            </p>
            <section
              aria-label="Regalos disponibles"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          </>
        ) : search || category ? (
          <CustomerEmptyState
            icon={SearchX}
            title="No encontramos coincidencias"
            description="Prueba con otra búsqueda o elimina los filtros para ver todas las opciones publicadas."
          />
        ) : (
          <CustomerEmptyState
            icon={Gift}
            title="Todavía no hay regalos disponibles"
            description="Cuando haya regalos publicados y validados por MPHO, aparecerán en este espacio."
            action={{ href: '/hadia', label: 'Conocer HADIA' }}
          />
        )}
      </main>
    </CustomerShell>
  )
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function normalizeCategory(value: string | undefined): string {
  const category = value?.trim().slice(0, 80) ?? ''
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category) ? category : ''
}

function isCatalogError(status: string): boolean {
  return status !== 'SUCCESS_WITH_DATA' && status !== 'SUCCESS_EMPTY'
}
