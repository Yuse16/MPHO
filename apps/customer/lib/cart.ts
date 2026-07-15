import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { ApiError } from '@/lib/api-security'
import type { Json } from '@mpho/database/types'

export type CartPersonalization = {
  recipientName: string | null
  message: string | null
  instructions: string | null
  spellingConfirmed: boolean
  approvedAt: string | null
}
export type CartItem = { id: string; listingId: string; name: string; slug: string; variantId: string | null; quantity: number; options: Array<{ id: string }>; personalization: CartPersonalization | null }
export type CartRecipient = { sourceRecipientId: string | null; name: string; relationship: string | null; phone: string | null; surpriseMode: 'none' | 'full_surprise' | 'partial_surprise'; deliveryNote: string | null }
export type CartAddress = { sourceAddressId: string | null; label: string | null; street: string; exteriorNumber: string; interiorNumber: string | null; neighborhood: string | null; postalCode: string | null; cityId: string; zoneId: string; state: string | null; countryCode: 'MX'; references: string | null }
export type CustomerCart = { id: string; status: 'active' | 'converted' | 'abandoned'; version: number; requestedDeliveryAt: string | null; convertedOrderId: string | null; items: CartItem[]; recipient: CartRecipient | null; address: CartAddress | null }
export type DraftOrder = { id: string; reference: string; state: 'draft'; quoteId: string; requestedDeliveryAt: string; recipient: CartRecipient; address: CartAddress; currency: 'MXN'; subtotal: { amountMinor: number; currency: 'MXN' }; delivery: null; service: null; totalKnown: { amountMinor: number; currency: 'MXN' }; totalIsFinal: boolean; availabilityStatus: 'eligible' | 'requires_review'; pendingComponents: string[]; items: unknown[]; createdAt: string }
export type DomainResult<T> = { ok: true; value: T } | { ok: false; error: ApiError }

type RpcEnvelope<T> = { ok?: boolean; cart?: T; order?: T; error?: ApiError; replayed?: boolean }

async function customerClient() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.getUser()
  return data.user ? supabase : null
}

export async function getCart(): Promise<DomainResult<CustomerCart | null>> {
  const supabase = await customerClient()
  if (!supabase) return failure('UNAUTHORIZED', 'Authentication is required.')
  const { data, error } = await supabase.rpc('get_customer_cart')
  if (error) return failure('DATABASE_ERROR', 'The cart service is unavailable.')
  const envelope = data as RpcEnvelope<CustomerCart>
  return envelope.ok ? { ok: true, value: envelope.cart ?? null } : { ok: false, error: envelope.error ?? { code: 'DATABASE_ERROR', message: 'The cart response is invalid.' } }
}

export async function mutateCart(operation: string, payload: Record<string, unknown>, expectedVersion: number): Promise<DomainResult<CustomerCart>> {
  const supabase = await customerClient()
  if (!supabase) return failure('UNAUTHORIZED', 'Authentication is required.')
  const { data, error } = await supabase.rpc('mutate_customer_cart', { p_operation: operation, p_payload: payload as Json, p_expected_version: expectedVersion })
  if (error) return failure('DATABASE_ERROR', 'The cart could not be updated.')
  const envelope = data as RpcEnvelope<CustomerCart>
  return envelope.ok && envelope.cart ? { ok: true, value: envelope.cart } : { ok: false, error: envelope.error ?? { code: 'DATABASE_ERROR', message: 'The cart response is invalid.' } }
}

export async function createDraftOrder(cartId: string, expectedVersion: number, idempotencyKey: string, requestId: string): Promise<DomainResult<DraftOrder>> {
  const supabase = await customerClient()
  if (!supabase) return failure('UNAUTHORIZED', 'Authentication is required.')
  const { data, error } = await supabase.rpc('create_customer_draft_order', { p_cart_id: cartId, p_expected_version: expectedVersion, p_idempotency_key: idempotencyKey, p_request_id: requestId })
  if (error) return failure('DATABASE_ERROR', 'The draft order could not be created.')
  const envelope = data as RpcEnvelope<DraftOrder>
  return envelope.ok && envelope.order ? { ok: true, value: envelope.order } : { ok: false, error: envelope.error ?? { code: 'DATABASE_ERROR', message: 'The draft-order response is invalid.' } }
}

export async function getDraftOrder(id: string): Promise<DomainResult<DraftOrder>> {
  if (!UUID.test(id)) return failure('ORDER_NOT_FOUND', 'The order was not found.')
  const supabase = await customerClient()
  if (!supabase) return failure('UNAUTHORIZED', 'Authentication is required.')
  const { data, error } = await supabase.rpc('get_customer_order', { p_order_id: id })
  if (error) return failure('DATABASE_ERROR', 'The order could not be loaded.')
  if (!data) return failure('ORDER_NOT_FOUND', 'The order was not found.')
  return { ok: true, value: data as unknown as DraftOrder }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function failure<T>(code: string, message: string): DomainResult<T> { return { ok: false, error: { code, message } } }
