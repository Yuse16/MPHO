import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth=vi.hoisted(()=>({user:{id:'customer'},loading:false,push:vi.fn()}))
vi.mock('@/lib/auth-context',()=>({useAuth:()=>({user:auth.user,loading:auth.loading})}))
vi.mock('next/navigation',()=>({useRouter:()=>({push:auth.push})}))
import { CartProvider,useCart } from '@/lib/cart-context'

const empty={id:'71000000-0000-4000-8000-000000000001',status:'active',version:1,requestedDeliveryAt:null,convertedOrderId:null,items:[],recipient:null,address:null}
describe('server-authoritative cart context',()=>{
  beforeEach(()=>{vi.restoreAllMocks();auth.push.mockReset()})
  it('loads an empty persisted cart state',async()=>{vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response(JSON.stringify({cart:empty}),{status:200}));const{result}=renderHook(()=>useCart(),{wrapper:CartProvider});await waitFor(()=>expect(result.current.cart?.version).toBe(1));expect(result.current.count).toBe(0)})
  it('adds a real listing and adopts the confirmed server version',async()=>{const added={...empty,version:2,items:[{id:'item',listingId:'listing',name:'Regalo',slug:'regalo',variantId:null,quantity:1,options:[],personalization:null}]};vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(new Response(JSON.stringify({cart:empty}),{status:200})).mockResolvedValueOnce(new Response(JSON.stringify({cart:added}),{status:201}));const{result}=renderHook(()=>useCart(),{wrapper:CartProvider});await waitFor(()=>expect(result.current.cart?.version).toBe(1));await act(async()=>{expect(await result.current.addItem({listingId:'listing'})).toBe(true)});expect(result.current.cart?.version).toBe(2);expect(result.current.count).toBe(1)})
  it('refreshes after a version conflict and surfaces the error',async()=>{vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(new Response(JSON.stringify({cart:empty}),{status:200})).mockResolvedValueOnce(new Response(JSON.stringify({error:{code:'VERSION_CONFLICT',message:'changed'}}),{status:409})).mockResolvedValueOnce(new Response(JSON.stringify({cart:{...empty,version:2}}),{status:200}));const{result}=renderHook(()=>useCart(),{wrapper:CartProvider});await waitFor(()=>expect(result.current.cart?.version).toBe(1));await act(async()=>{expect(await result.current.addItem({listingId:'listing'})).toBe(false)});expect(result.current.cart?.version).toBe(2);expect(result.current.error).toContain('changed')})
})
