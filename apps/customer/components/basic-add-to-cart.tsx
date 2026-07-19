'use client'

import { useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function BasicAddToCart({ listingId }: { listingId: string }) {
  const { addItem, loading, error: cartError } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  async function addSelection() {
    setAdded(await addItem({ listingId, quantity }))
  }

  return (
    <section className="mt-8 border-t border-border-soft pt-7" aria-labelledby="add-title">
      <h2 id="add-title" className="text-lg font-bold">
        Agrega este regalo
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        La disponibilidad y el precio se validarán nuevamente antes de confirmar el pedido.
      </p>
      <label className="mt-5 block max-w-32 text-sm">
        Cantidad
        <input
          type="number"
          min={1}
          max={20}
          step={1}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="mt-2 min-h-12 w-full rounded-xl border border-border-soft bg-black/20 p-3"
        />
      </label>
      <button
        type="button"
        onClick={() => void addSelection()}
        disabled={loading}
        aria-busy={loading}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border-lime px-6 py-3 font-bold text-lime transition-colors hover:bg-lime/10 disabled:opacity-50"
      >
        {added ? <Check className="size-5" aria-hidden="true" /> : <ShoppingCart className="size-5" aria-hidden="true" />}
        {added ? 'Agregado al carrito' : 'Agregar al carrito'}
      </button>
      {cartError && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {cartError}
        </p>
      )}
    </section>
  )
}
