'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Heart, Plus, Zap, Check, ImageOff } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice, type Product } from '@/lib/data'
import { cn } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const { addItem, lastAddedId, loading } = useCart()
  const [fav, setFav] = useState(false)
  const [imgError, setImgError] = useState(false)
  const justAdded = lastAddedId === product.id

  return (
    <article className="glass group flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:border-[color:var(--color-border-lime)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {imgError ? (
          <div className="flex size-full items-center justify-center bg-[color:var(--color-background-2)] text-faint">
            <ImageOff className="size-8" aria-label="Imagen no disponible" />
          </div>
        ) : (
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.alt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 22vw, 60vw"
            onError={() => setImgError(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {product.tag && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-[color:var(--color-mphora)]/50 bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-mphora)] backdrop-blur-sm">
            <Zap className="size-3" />
            {product.tag}
          </span>
        )}

        <button
          type="button"
          aria-label={fav ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
          aria-pressed={fav}
          onClick={() => setFav((f) => !f)}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm transition-transform active:scale-90"
        >
          <Heart
            className={cn(
              'size-4 transition-colors',
              fav ? 'fill-[color:var(--color-mphora)] text-[color:var(--color-mphora)]' : 'text-white',
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="text-sm font-bold text-foreground">{product.name}</h3>
        <p className="mt-0.5 text-xs text-faint">{product.description}</p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="text-base font-extrabold text-foreground">
            {formatPrice(product.price)}
          </p>

          <button
            type="button"
            aria-label={`Agregar ${product.name} al carrito`}
            onClick={() => void addItem({ listingId: product.id })}
            disabled={loading}
            className={cn(
              'flex size-10 items-center justify-center rounded-full border transition-all duration-200 active:scale-90',
              justAdded
                ? 'border-[color:var(--color-lime)] bg-[color:var(--color-lime)] text-[color:var(--color-primary-foreground)]'
                : 'border-[color:var(--color-border-lime)] bg-[color:var(--color-lime)]/10 text-[color:var(--color-lime)] hover:bg-[color:var(--color-lime)] hover:text-[color:var(--color-primary-foreground)]',
            )}
          >
            {justAdded ? <Check className="size-5" /> : <Plus className="size-5" />}
          </button>
        </div>
      </div>
    </article>
  )
}
