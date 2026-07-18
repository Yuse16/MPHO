'use client'

import { PackageOpen } from 'lucide-react'
import { ProductCard } from './product-card'
import type { Product } from '@/lib/data'

export function ProductCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="glass mx-4 flex flex-col items-center gap-2 rounded-2xl px-6 py-10 text-center lg:mx-8">
        <PackageOpen className="size-8 text-faint" />
        <p className="text-sm font-medium text-muted-foreground">
          Por ahora no hay regalos con entrega rápida confirmada para tu zona.
        </p>
        <p className="text-xs text-faint">Vuelve a intentarlo más tarde.</p>
      </div>
    )
  }

  return (
    <div
      className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-auto lg:max-w-7xl lg:grid lg:snap-none lg:grid-cols-4 lg:overflow-visible lg:px-8 xl:grid-cols-5"
      role="list"
      aria-label="Regalos con entrega rápida"
    >
      {products.map((p) => (
        <div
          key={p.id}
          role="listitem"
          className="w-[62%] shrink-0 snap-start min-[480px]:w-[44%] sm:w-[38%] lg:w-auto"
        >
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  )
}
