import type { CartPersonalization } from '@/lib/cart'

export type CartItemSelection = {
  listingId: string
  variantId: string | null
  optionIds: string[]
  quantity: number
  personalization: Omit<CartPersonalization, 'approvedAt'> | null
}

export type CartItemRequest = {
  expectedVersion: number
  selection: CartItemSelection
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const REQUEST_FIELDS = [
  'expectedVersion',
  'listingId',
  'variantId',
  'optionIds',
  'quantity',
  'personalization',
] as const
const PERSONALIZATION_FIELDS = [
  'recipientName',
  'message',
  'instructions',
  'spellingConfirmed',
] as const

export function parseCartItemRequest(value: unknown): CartItemRequest | null {
  if (!isExactRecord(value, REQUEST_FIELDS)) return null

  const expectedVersion = value.expectedVersion
  const listingId = value.listingId
  const variantId = value.variantId
  const optionIds = value.optionIds
  const quantity = value.quantity

  if (!Number.isSafeInteger(expectedVersion) || (expectedVersion as number) < 0) return null
  if (typeof listingId !== 'string' || !UUID.test(listingId)) return null
  if (variantId !== null && (typeof variantId !== 'string' || !UUID.test(variantId))) return null
  if (
    !Array.isArray(optionIds) ||
    optionIds.length > 20 ||
    optionIds.some((id) => typeof id !== 'string' || !UUID.test(id)) ||
    new Set(optionIds).size !== optionIds.length
  ) {
    return null
  }
  if (!Number.isSafeInteger(quantity) || (quantity as number) < 1 || (quantity as number) > 20) {
    return null
  }

  const personalization = parsePersonalization(value.personalization)
  if (personalization === undefined) return null

  return {
    expectedVersion: expectedVersion as number,
    selection: {
      listingId,
      variantId: variantId as string | null,
      optionIds: optionIds as string[],
      quantity: quantity as number,
      personalization,
    },
  }
}

function parsePersonalization(
  value: unknown,
): Omit<CartPersonalization, 'approvedAt'> | null | undefined {
  if (value === null) return null
  if (!isExactRecord(value, PERSONALIZATION_FIELDS)) return undefined

  const recipientName = nullableText(value.recipientName, 120)
  const message = nullableText(value.message, 500)
  const instructions = nullableText(value.instructions, 1000)
  if (
    recipientName === undefined ||
    message === undefined ||
    instructions === undefined ||
    typeof value.spellingConfirmed !== 'boolean'
  ) {
    return undefined
  }
  if (!recipientName && !message && !instructions) return undefined
  if ([recipientName, message, instructions].some((text) => text && /<\/?[a-z][^>]*>/i.test(text))) {
    return undefined
  }

  return {
    recipientName,
    message,
    instructions,
    spellingConfirmed: value.spellingConfirmed,
  }
}

function nullableText(value: unknown, maxLength: number): string | null | undefined {
  if (value === null) return null
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  if (normalized.length > maxLength) return undefined
  return normalized || null
}

function isExactRecord(
  value: unknown,
  fields: readonly string[],
): value is Record<string, unknown> {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === fields.length &&
    Object.keys(value as object).every((key) => fields.includes(key))
  )
}
