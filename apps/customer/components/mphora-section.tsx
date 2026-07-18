import { Zap, ChevronRight } from 'lucide-react'
import { ProductCarousel } from './product-carousel'
import { getFeaturedListings } from '@/lib/catalog'
import type { Product } from '@/lib/data'
import Link from 'next/link'

export async function MphoraSection() {
  const result = await getFeaturedListings(5)
  const listings = result.status === 'SUCCESS_WITH_DATA'
    ? result.data.filter((listing) => listing.mphoraCandidate)
    : []

  const products: Product[] = listings.map((item) => ({
    id: item.listingId,
    slug: item.slug,
    name: item.name,
    description: item.shortDescription?.slice(0, 60) ?? item.fullDescription?.slice(0, 60) ?? '',
    price: item.price,
    image: item.image?.url ?? '/placeholder.svg',
    tag: 'Entrega hoy',
    alt: item.image?.alt ?? item.name,
  }))

  return (
    <section id="mphora" aria-label="MPHORA, entrega rápida" className="space-y-4">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-3 px-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-[color:var(--color-mphora)]/15">
              <Zap className="size-3.5 text-[color:var(--color-mphora)]" />
            </span>
            <h2 className="text-lg font-bold lg:text-xl">
              Lo necesitas hoy{' '}
              <span className="text-[color:var(--color-mphora)]">MPHORA</span>
            </h2>
          </div>
          <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
            Regalos disponibles para preparación y entrega rápida en tu zona.
          </p>
        </div>

        <Link
          href="/hadia"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-[color:var(--color-mphora)]"
        >
          Ver más
          <ChevronRight className="size-4" />
        </Link>
      </div>

      {result.status !== 'SUCCESS_WITH_DATA' && result.status !== 'SUCCESS_EMPTY' ? (
        <div role="alert" className="glass mx-4 rounded-2xl px-6 py-8 text-center text-sm text-muted-foreground lg:mx-8">
          No pudimos consultar las opciones MPHORA. Intenta de nuevo más tarde.
        </div>
      ) : (
        <ProductCarousel products={products} />
      )}
    </section>
  )
}
