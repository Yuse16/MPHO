'use client'

import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'

export function CartButton({ className }: { className?: string }) {
  const { count, lastAddedId } = useCart()
  const [completedBumpId, setCompletedBumpId] = useState<string | null>(null)
  const bump = lastAddedId !== null && lastAddedId !== completedBumpId

  useEffect(() => {
    if (lastAddedId) {
      const t = window.setTimeout(() => setCompletedBumpId(lastAddedId), 350)
      return () => window.clearTimeout(t)
    }
  }, [lastAddedId])

  return (
    <button
      type="button"
      aria-label={`Ver carrito, ${count} ${count === 1 ? 'artículo' : 'artículos'}`}
      className={cn(
        'glass relative flex size-11 items-center justify-center rounded-full transition-all duration-200 hover:border-[color:var(--color-border-lime)] active:scale-95',
        className,
      )}
    >
      <ShoppingCart className="size-5 text-foreground" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-[color:var(--color-lime)] px-1 text-[11px] font-bold text-[color:var(--color-primary-foreground)] transition-transform duration-300',
            bump && 'scale-125',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}
