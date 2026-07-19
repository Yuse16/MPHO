'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Zap, Check, ImageOff } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice, type Product } from '@/lib/data'
import { cn } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const { addItem, lastAddedId, loading } = useCart()
  const [imgError, setImgError] = useState(false)
  const justAdded = lastAddedId === product.id

  return (
    <article className="glass group flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:border-[color:var(--color-border-lime)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Link href={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`} className="absolute inset-0 z-0">
          {imgError || !product.image ? (
            <div className="flex size-full items-center justify-center bg-[color:var(--color-background-2)] text-faint">
              <span className="flex flex-col items-center gap-2 text-xs">
                <ImageOff className="size-8" aria-hidden="true" />
                Imagen no disponible
              </span>
            </div>
          ) : (
            <Image
              src={product.image}
              alt={product.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 22vw, 60vw"
              onError={() => setImgError(true)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {product.tag && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-[color:var(--color-mphora)]/50 bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-mphora)] backdrop-blur-sm">
            <Zap className="size-3" aria-hidden="true" />
            {product.tag}
          </span>
        )}

      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="text-sm font-bold text-foreground">
          <Link href={`/producto/${product.slug}`} className="transition-colors hover:text-lime">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-faint">{product.description}</p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="text-base font-extrabold text-foreground">
            {formatPrice(product.price)}
          </p>

          {product.requiresConfiguration ? (
            <Link
              href={`/producto/${product.slug}`}
              aria-label={`Configurar ${product.name}`}
              className="flex min-h-10 items-center justify-center rounded-full border border-border-lime bg-lime/10 px-3 text-xs font-bold text-lime transition-colors hover:bg-lime hover:text-primary-foreground"
            >
              Configurar
            </Link>
          ) : (
            <button
              type="button"
              aria-label={`Agregar ${product.name} al carrito`}
              onClick={() => void addItem({ listingId: product.id })}
              disabled={loading}
              aria-busy={loading}
              className={cn(
                'flex size-10 items-center justify-center rounded-full border transition-all duration-200 active:scale-90',
                justAdded
                  ? 'border-[color:var(--color-lime)] bg-[color:var(--color-lime)] text-[color:var(--color-primary-foreground)]'
                  : 'border-[color:var(--color-border-lime)] bg-[color:var(--color-lime)]/10 text-[color:var(--color-lime)] hover:bg-[color:var(--color-lime)] hover:text-[color:var(--color-primary-foreground)]',
              )}
            >
              {justAdded ? (
                <Check className="size-5" aria-hidden="true" />
              ) : (
                <Plus className="size-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        <span className="sr-only" aria-live="polite">
          {justAdded ? `${product.name} se agregó al carrito.` : ''}
        </span>
      </div>
    </article>
  )
}
