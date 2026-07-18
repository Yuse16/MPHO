'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './auth-context'
import type { CartPersonalization, CustomerCart } from './cart'

type AddSelection = { listingId: string; variantId?: string | null; optionIds?: string[]; quantity?: number; personalization?: Omit<CartPersonalization, 'approvedAt'> | null }
type CartState = { cart: CustomerCart | null; items: CustomerCart['items']; count: number; lastAddedId: string | null; loading: boolean; error: string | null; refresh: () => Promise<void>; addItem: (selection: AddSelection) => Promise<boolean>; removeItem: (id: string) => Promise<boolean>; replaceCart: (cart: CustomerCart) => void }

const CartContext = createContext<CartState | null>(null)

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState<CustomerCart | null>(null)
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) { setCart(null); return }
    setLoading(true); setError(null)
    try { const response=await fetch('/api/cart',{cache:'no-store'});const body=await response.json() as {cart?:CustomerCart|null;error?:{message?:string}};if(!response.ok)throw new Error(body.error?.message??'No fue posible cargar el carrito.');setCart(body.cart??null) }
    catch(cause){setError(cause instanceof Error?cause.message:'No fue posible cargar el carrito.')}
    finally{setLoading(false)}
  },[user])

  useEffect(()=>{
    if(authLoading)return
    if(!user){queueMicrotask(()=>setCart(null));return}
    let active=true
    queueMicrotask(()=>{if(active){setLoading(true);setError(null)}})
    void fetch('/api/cart',{cache:'no-store'}).then(async(response)=>({response,body:await response.json() as {cart?:CustomerCart|null;error?:{message?:string}}})).then(({response,body})=>{if(!active)return;if(!response.ok)throw new Error(body.error?.message??'No fue posible cargar el carrito.');setCart(body.cart??null)}).catch((cause:unknown)=>{if(active)setError(cause instanceof Error?cause.message:'No fue posible cargar el carrito.')})
      .finally(()=>{if(active)setLoading(false)})
    return()=>{active=false}
  },[authLoading,user])

  const addItem = useCallback(async (selection:AddSelection) => {
    if(!user){router.push(`/login?redirect=${encodeURIComponent(pathname)}`);return false}
    setLoading(true);setError(null)
    try{const response=await fetch('/api/cart/items',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedVersion:cart?.version??0,listingId:selection.listingId,variantId:selection.variantId??null,optionIds:selection.optionIds??[],quantity:selection.quantity??1,personalization:selection.personalization??null})});const body=await response.json() as {cart?:CustomerCart;error?:{code?:string;message?:string}};if(!response.ok){if(body.error?.code==='VERSION_CONFLICT')await refresh();throw new Error(body.error?.message??'No fue posible agregar el regalo.')}setCart(body.cart??null);setLastAddedId(selection.listingId);window.setTimeout(()=>setLastAddedId((current)=>current===selection.listingId?null:current),1200);return true}catch(cause){setError(cause instanceof Error?cause.message:'No fue posible agregar el regalo.');return false}finally{setLoading(false)}
  },[cart,pathname,refresh,router,user])

  const removeItem=useCallback(async(id:string)=>{if(!cart)return false;setLoading(true);setError(null);try{const response=await fetch(`/api/cart/items/${id}`,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedVersion:cart.version})});const body=await response.json() as {cart?:CustomerCart;error?:{code?:string;message?:string}};if(!response.ok){if(body.error?.code==='VERSION_CONFLICT')await refresh();throw new Error(body.error?.message??'No fue posible eliminar el artículo.')}if(body.cart)setCart(body.cart);return true}catch(cause){setError(cause instanceof Error?cause.message:'No fue posible eliminar el artículo.');return false}finally{setLoading(false)}},[cart,refresh])

  const items=useMemo(()=>cart?.items??[],[cart])
  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  const value = useMemo(
    () => ({ cart, items, count, lastAddedId, loading, error, refresh, addItem, removeItem, replaceCart:setCart }),
    [cart, items, count, lastAddedId, loading, error, refresh, addItem, removeItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
