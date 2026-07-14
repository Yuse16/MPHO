'use client'

import { useEffect, useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'

export function FloatingCartButton() {
  const { count, lastAddedId } = useCart()
  const [dismissedId, setDismissedId] = useState<string | null>(null)
  const visible = lastAddedId !== null && lastAddedId !== dismissedId

  useEffect(() => {
    if (lastAddedId) {
      const t = window.setTimeout(() => setDismissedId(lastAddedId), 1600)
      return () => window.clearTimeout(t)
    }
  }, [lastAddedId])

  return (
    <div
      aria-live="polite"
      className={cn(
        'fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 transition-all duration-300 lg:bottom-8',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <div className="glass-elevated flex items-center gap-3 rounded-full border-[color:var(--color-border-lime)] py-2.5 pl-3 pr-4 shadow-lg">
        <span className="flex size-8 items-center justify-center rounded-full bg-[color:var(--color-lime)] text-[color:var(--color-primary-foreground)]">
          <Check className="size-4" />
        </span>
        <span className="text-sm font-semibold text-foreground">Agregado al carrito</span>
        <span className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs font-bold text-[color:var(--color-lime)]">
          <ShoppingCart className="size-3.5" />
          {count}
        </span>
      </div>
    </div>
  )
}
