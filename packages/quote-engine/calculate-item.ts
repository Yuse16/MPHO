import { quoteFailure } from './errors'
import type { AuthoritativeItem, CalculatedItem, QuoteResult } from './types'

const MAX_MINOR = Number.MAX_SAFE_INTEGER

export function calculateItem(input: AuthoritativeItem): QuoteResult<CalculatedItem> {
  if (!input.listingPublished) return quoteFailure('LISTING_NOT_PUBLIC', 'The listing is not public.')
  if (!input.productActive) return quoteFailure('PRODUCT_INACTIVE', 'The product is inactive.')
  if (!Number.isSafeInteger(input.quantity) || input.quantity <= 0) return quoteFailure('INVALID_QUANTITY', 'Quantity must be a positive integer.')
  if (input.currency !== 'MXN') return quoteFailure('CURRENCY_MISMATCH', 'Only MXN is supported.')
  if (!Number.isSafeInteger(input.baseAmountMinor) || input.baseAmountMinor < 0) return quoteFailure('CONFIGURATION_ERROR', 'The listing price is invalid.')
  if (input.variant && (!input.variant.active || input.variant.currency !== input.currency)) return quoteFailure(input.variant.active ? 'CURRENCY_MISMATCH' : 'VARIANT_INVALID', 'The selected variant is invalid.')
  if (input.options.some((option) => !option.active)) return quoteFailure('OPTION_INVALID', 'A selected option is invalid.')
  if (input.options.some((option) => option.currency !== input.currency)) return quoteFailure('CURRENCY_MISMATCH', 'Selected currencies do not match.')

  const adjustments = [input.variant?.adjustmentAmountMinor ?? 0, ...input.options.map((option) => option.adjustmentAmountMinor)]
  if (adjustments.some((value) => !Number.isSafeInteger(value))) return quoteFailure('CONFIGURATION_ERROR', 'A price adjustment is invalid.')
  const unitAmount = adjustments.reduce((total, value) => total + value, input.baseAmountMinor)
  if (!Number.isSafeInteger(unitAmount) || unitAmount < 0 || unitAmount > MAX_MINOR) return quoteFailure('PRICE_OVERFLOW', 'The unit price exceeds the supported range.')
  const lineAmount = unitAmount * input.quantity
  if (!Number.isSafeInteger(lineAmount) || lineAmount > MAX_MINOR) return quoteFailure('PRICE_OVERFLOW', 'The line total exceeds the supported range.')

  return { ok: true, value: {
    listingId: input.listingId, productId: input.productId, slug: input.slug, name: input.name,
    quantity: input.quantity, unitPrice: { amountMinor: unitAmount, currency: 'MXN' },
    lineTotal: { amountMinor: lineAmount, currency: 'MXN' },
    variant: input.variant ? { id: input.variant.id, name: input.variant.name } : null,
    options: input.options.map((option) => ({ id: option.id, label: option.label, adjustment: { amountMinor: option.adjustmentAmountMinor, currency: 'MXN' } })),
  } }
}
