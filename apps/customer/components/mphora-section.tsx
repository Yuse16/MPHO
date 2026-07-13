import { Zap, ChevronRight } from 'lucide-react'
import { ProductCarousel } from './product-carousel'
import { getFeaturedListings, formatPrice } from '@/lib/catalog'
import type { Product } from '@/lib/data'

export async function MphoraSection() {
  const listings = await getFeaturedListings(5)

  const products: Product[] = listings.map((item) => ({
    id: item.listing.id,
    name: item.listing.customer_title,
    description: item.product.description?.slice(0, 60) ?? item.listing.customer_description?.slice(0, 60) ?? '',
    price: item.listing.base_price_amount_minor / 100,
    image: item.primary_media
      ? `/images/${item.primary_media.storage_path}`
      : '/placeholder.svg',
    tag: 'Entrega hoy',
    alt: item.primary_media?.alt_text ?? item.listing.customer_title,
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

        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-[color:var(--color-mphora)]"
        >
          Ver más
          <ChevronRight className="size-4" />
        </button>
      </div>

      <ProductCarousel products={products} />
    </section>
  )
}
