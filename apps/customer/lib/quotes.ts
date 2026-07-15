import type { PublicQuote, QuoteErrorCode, QuoteResult } from '@mpho/quote-engine'
import { createPublicSupabaseClient } from './supabase/public'
import { createServerSupabaseClient } from './supabase/server'

export type QuoteSelection = {
  items: Array<{ listingId: string; variantId: string | null; optionIds: string[]; quantity: number }>
  zoneId: string | null
  requestedDeliveryAt: string | null
}

export type QuoteConfiguration = {
  variants: Array<{ id: string; name: string }>
  options: Array<{ id: string; label: string; required: boolean }>
  zones: Array<{ id: string; name: string; city: string }>
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const forbidden = new Set(['unitPrice', 'subtotal', 'discount', 'delivery', 'deliveryFee', 'service', 'serviceFee', 'total', 'currency', 'partnerId', 'commission', 'partnerEarning'])
const selectionFields = new Set(['items', 'zoneId', 'requestedDeliveryAt'])
const itemFields = new Set(['listingId', 'variantId', 'optionIds', 'quantity'])

export function parseQuoteSelection(input: unknown): QuoteResult<QuoteSelection> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return failure('INVALID_REQUEST', 'The request body is invalid.')
  const object = input as Record<string, unknown>
  if (Object.keys(object).some((key) => forbidden.has(key))) return failure('INVALID_REQUEST', 'Client-supplied prices or partner data are not accepted.')
  if (Object.keys(object).some((key) => !selectionFields.has(key))) return failure('INVALID_REQUEST', 'The request contains unsupported fields.')
  if (!Array.isArray(object.items) || object.items.length < 1 || object.items.length > 20) return failure('INVALID_REQUEST', 'Between 1 and 20 items are required.')
  const items = []
  for (const value of object.items) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return failure('INVALID_REQUEST', 'An item is invalid.')
    const item = value as Record<string, unknown>
    if (Object.keys(item).some((key) => forbidden.has(key))) return failure('INVALID_REQUEST', 'Client-supplied prices or partner data are not accepted.')
    if (Object.keys(item).some((key) => !itemFields.has(key))) return failure('INVALID_REQUEST', 'An item contains unsupported fields.')
    if (typeof item.listingId !== 'string' || !uuid.test(item.listingId) || !Number.isSafeInteger(item.quantity) || (item.quantity as number) <= 0) return failure('INVALID_QUANTITY', 'Listing and positive integer quantity are required.')
    const variantId = item.variantId == null || item.variantId === '' ? null : item.variantId
    if (variantId !== null && (typeof variantId !== 'string' || !uuid.test(variantId))) return failure('VARIANT_INVALID', 'The selected variant is invalid.')
    if (!Array.isArray(item.optionIds) || item.optionIds.some((id) => typeof id !== 'string' || !uuid.test(id))) return failure('OPTION_INVALID', 'A selected option is invalid.')
    items.push({ listingId: item.listingId, variantId, optionIds: [...new Set(item.optionIds as string[])], quantity: item.quantity as number })
  }
  const zoneId = object.zoneId == null || object.zoneId === '' ? null : object.zoneId
  if (zoneId !== null && (typeof zoneId !== 'string' || !uuid.test(zoneId))) return failure('ZONE_UNAVAILABLE', 'The selected zone is invalid.')
  const requestedDeliveryAt = object.requestedDeliveryAt == null || object.requestedDeliveryAt === '' ? null : object.requestedDeliveryAt
  if (requestedDeliveryAt !== null && (typeof requestedDeliveryAt !== 'string' || Number.isNaN(Date.parse(requestedDeliveryAt)))) return failure('INVALID_REQUEST', 'The requested delivery date is invalid.')
  return { ok: true, value: { items, zoneId, requestedDeliveryAt } }
}

export async function previewQuote(selection: QuoteSelection): Promise<QuoteResult<PublicQuote>> {
  const { data, error } = await createPublicSupabaseClient().rpc('calculate_public_quote', { p_request: selection })
  if (error) return failure('DATABASE_ERROR', 'The quote service is unavailable.')
  return parseDatabaseResult(data)
}

export async function createQuote(selection: QuoteSelection, idempotencyKey: string): Promise<QuoteResult<PublicQuote>> {
  const supabase = await createServerSupabaseClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return failure('UNAUTHORIZED', 'Authentication is required.')
  const { data, error } = await supabase.rpc('create_customer_quote', { p_request: selection, p_idempotency_key: idempotencyKey })
  if (error) return failure('DATABASE_ERROR', 'The quote could not be saved.')
  return parseDatabaseResult(data)
}

export async function getQuote(id: string): Promise<QuoteResult<PublicQuote>> {
  if (!uuid.test(id)) return failure('LISTING_NOT_FOUND', 'The quote was not found.')
  const supabase = await createServerSupabaseClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return failure('UNAUTHORIZED', 'Authentication is required.')
  const { data, error } = await supabase.rpc('get_customer_quote', { p_quote_id: id })
  if (error) return failure('DATABASE_ERROR', 'The quote could not be loaded.')
  if (!data) return failure('LISTING_NOT_FOUND', 'The quote was not found.')
  return { ok: true, value: data as unknown as PublicQuote }
}

export async function getQuoteConfiguration(listingId: string): Promise<QuoteConfiguration | null> {
  const { data, error } = await createPublicSupabaseClient().rpc('get_public_quote_configuration', { p_listing_id: listingId })
  return error || !data ? null : data as unknown as QuoteConfiguration
}

function parseDatabaseResult(data: unknown): QuoteResult<PublicQuote> {
  if (!data || typeof data !== 'object') return failure('DATABASE_ERROR', 'The quote response is invalid.')
  const result = data as { ok?: boolean; quote?: PublicQuote; error?: { code?: QuoteErrorCode; message?: string } }
  if (result.ok && result.quote) return { ok: true, value: result.quote }
  return failure(result.error?.code ?? 'DATABASE_ERROR', result.error?.message ?? 'The quote could not be calculated.')
}

function failure<T>(code: QuoteErrorCode, message: string): QuoteResult<T> { return { ok: false, error: { code, message } } }
