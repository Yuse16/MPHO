import { Gift } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer-empty-state'
import { CustomerPageHeading } from '@/components/customer-page-heading'
import { CustomerShell } from '@/components/customer-shell'
import { ProductCard } from '@/components/product-card'
import { getCatalogListings } from '@/lib/catalog'
import type { Product } from '@/lib/data'

export default async function ExplorePage() {
  const result = await getCatalogListings({ limit: 24 })
  const products: Product[] =
    result.status === 'SUCCESS_WITH_DATA'
      ? result.data.map((listing) => ({
          id: listing.listingId,
          slug: listing.slug,
          name: listing.name,
          description:
            listing.shortDescription ??
            listing.fullDescription ??
            'Consulta los detalles y condiciones de este regalo.',
          price: listing.price,
          image: listing.image?.url ?? '/placeholder.svg',
          alt: listing.image?.alt ?? listing.name,
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

        {products.length > 0 ? (
          <section aria-label="Regalos disponibles" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <CustomerEmptyState
            icon={Gift}
            title={result.status === 'SUCCESS_EMPTY' ? 'Todavía no hay regalos disponibles' : 'Estamos actualizando el catálogo'}
            description={
              result.status === 'SUCCESS_EMPTY'
                ? 'Cuando haya regalos publicados y validados por MPHO, aparecerán en este espacio.'
                : 'No pudimos consultar el catálogo en este momento. Intenta de nuevo más tarde.'
            }
            action={{ href: '/hadia', label: 'Conocer HADIA' }}
          />
        )}
      </main>
    </CustomerShell>
  )
}
