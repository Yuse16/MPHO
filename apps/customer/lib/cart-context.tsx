'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Product } from './data'

type CartItem = Product & { qty: number }

type CartState = {
  items: CartItem[]
  count: number
  lastAddedId: string | null
  addItem: (product: Product) => void
  removeItem: (id: string) => void
}

const CartContext = createContext<CartState | null>(null)

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setLastAddedId(product.id)
    window.setTimeout(() => setLastAddedId((cur) => (cur === product.id ? null : cur)), 1200)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  const value = useMemo(
    () => ({ items, count, lastAddedId, addItem, removeItem }),
    [items, count, lastAddedId, addItem, removeItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
