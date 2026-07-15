import { calculateItem } from './calculate-item'
import { quoteFailure } from './errors'
import type { AuthoritativeItem, QuoteCalculation, QuoteResult } from './types'

export function calculateQuote(inputs: AuthoritativeItem[]): QuoteResult<QuoteCalculation> {
  if (!inputs.length) return quoteFailure('INVALID_REQUEST', 'At least one item is required.')
  const items = []
  let subtotal = 0
  for (const input of inputs) {
    const calculated = calculateItem(input)
    if (!calculated.ok) return calculated
    subtotal += calculated.value.lineTotal.amountMinor
    if (!Number.isSafeInteger(subtotal)) return quoteFailure('PRICE_OVERFLOW', 'The subtotal exceeds the supported range.')
    items.push(calculated.value)
  }
  return { ok: true, value: { currency: 'MXN', items, subtotal: { amountMinor: subtotal, currency: 'MXN' } } }
}
