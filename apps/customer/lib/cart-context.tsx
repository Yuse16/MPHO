'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './auth-context'
import type { CartItem, CartPersonalization, CustomerCart } from './cart'
import type { CartItemSelection } from './cart-item-selection'

type AddSelection = {
  listingId: string
  variantId?: string | null
  optionIds?: string[]
  quantity?: number
  personalization?: Omit<CartPersonalization, 'approvedAt'> | null
}

type CartState = {
  cart: CustomerCart | null
  items: CustomerCart['items']
  count: number
  lastAddedId: string | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addItem: (selection: AddSelection) => Promise<boolean>
  removeItem: (id: string) => Promise<boolean>
  replaceCart: (cart: CustomerCart) => void
}

type CartResponse = {
  cart?: CustomerCart | null
  error?: { code?: string; message?: string }
}

const CartContext = createContext<CartState | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState<CustomerCart | null>(null)
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/cart', { cache: 'no-store' })
      const body = (await response.json()) as CartResponse
      if (!response.ok) throw new Error(cartErrorMessage('load', body.error?.code))
      setCart(body.cart ?? null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible cargar el carrito.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      queueMicrotask(() => setCart(null))
      return
    }

    let active = true
    queueMicrotask(() => {
      if (active) {
        setLoading(true)
        setError(null)
      }
    })
    void fetch('/api/cart', { cache: 'no-store' })
      .then(async (response) => ({ response, body: (await response.json()) as CartResponse }))
      .then(({ response, body }) => {
        if (!active) return
        if (!response.ok) throw new Error(cartErrorMessage('load', body.error?.code))
        setCart(body.cart ?? null)
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'No fue posible cargar el carrito.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [authLoading, user])

  const addItem = useCallback(
    async (input: AddSelection) => {
      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
        return false
      }

      const selection = normalizeSelection(input)
      if (!selection) {
        setError('La cantidad debe ser un número entero entre 1 y 20.')
        return false
      }

      const matchingItem = cart?.items.find((item) => matchesSelection(item, selection))
      const quantity = (matchingItem?.quantity ?? 0) + selection.quantity
      if (quantity > 20) {
        setError('Puedes agregar hasta 20 unidades de la misma selección.')
        return false
      }

      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          matchingItem ? `/api/cart/items/${matchingItem.id}` : '/api/cart/items',
          {
            method: matchingItem ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              expectedVersion: cart?.version ?? 0,
              ...selection,
              quantity,
            }),
          },
        )
        const body = (await response.json()) as CartResponse
        if (!response.ok) {
          if (body.error?.code === 'VERSION_CONFLICT') await refresh()
          throw new Error(cartErrorMessage('add', body.error?.code))
        }
        setCart(body.cart ?? null)
        setLastAddedId(selection.listingId)
        window.setTimeout(
          () =>
            setLastAddedId((current) =>
              current === selection.listingId ? null : current,
            ),
          1200,
        )
        return true
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'No fue posible agregar el regalo.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [cart, pathname, refresh, router, user],
  )

  const removeItem = useCallback(
    async (id: string) => {
      if (!cart) return false
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/cart/items/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expectedVersion: cart.version }),
        })
        const body = (await response.json()) as CartResponse
        if (!response.ok) {
          if (body.error?.code === 'VERSION_CONFLICT') await refresh()
          throw new Error(cartErrorMessage('remove', body.error?.code))
        }
        if (body.cart) setCart(body.cart)
        return true
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'No fue posible eliminar el artículo.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [cart, refresh],
  )

  const items = useMemo(() => cart?.items ?? [], [cart])
  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const value = useMemo(
    () => ({
      cart,
      items,
      count,
      lastAddedId,
      loading,
      error,
      refresh,
      addItem,
      removeItem,
      replaceCart: setCart,
    }),
    [cart, items, count, lastAddedId, loading, error, refresh, addItem, removeItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}

function normalizeSelection(input: AddSelection): CartItemSelection | null {
  const quantity = input.quantity ?? 1
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 20) return null
  return {
    listingId: input.listingId,
    variantId: input.variantId ?? null,
    optionIds: [...new Set(input.optionIds ?? [])].sort(),
    quantity,
    personalization: normalizePersonalization(input.personalization),
  }
}

function normalizePersonalization(
  personalization: AddSelection['personalization'],
): CartItemSelection['personalization'] {
  if (!personalization) return null
  const recipientName = personalization.recipientName?.trim() || null
  const message = personalization.message?.trim() || null
  const instructions = personalization.instructions?.trim() || null
  if (!recipientName && !message && !instructions) return null
  return {
    recipientName,
    message,
    instructions,
    spellingConfirmed: personalization.spellingConfirmed,
  }
}

function matchesSelection(item: CartItem, selection: CartItemSelection): boolean {
  if (item.listingId !== selection.listingId || item.variantId !== selection.variantId) return false
  const itemOptions = item.options.map((option) => option.id).sort()
  if (
    itemOptions.length !== selection.optionIds.length ||
    itemOptions.some((option, index) => option !== selection.optionIds[index])
  ) {
    return false
  }
  return matchesPersonalization(item.personalization, selection.personalization)
}

function matchesPersonalization(
  current: CartPersonalization | null,
  selected: CartItemSelection['personalization'],
): boolean {
  if (!current || !selected) return current === null && selected === null
  return (
    current.recipientName === selected.recipientName &&
    current.message === selected.message &&
    current.instructions === selected.instructions &&
    current.spellingConfirmed === selected.spellingConfirmed
  )
}

function cartErrorMessage(
  action: 'load' | 'add' | 'remove',
  code: string | undefined,
): string {
  if (code === 'VERSION_CONFLICT') {
    return 'El carrito cambió en otra sesión. Actualizamos su contenido; inténtalo nuevamente.'
  }
  if (code === 'INCOMPATIBLE_CART_ITEM') {
    return 'Este regalo necesita gestionarse por separado. Crea otro pedido para continuar.'
  }
  if (action === 'load') return 'No fue posible cargar el carrito.'
  if (action === 'remove') return 'No fue posible eliminar el artículo.'
  return 'No fue posible agregar el regalo.'
}
