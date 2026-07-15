import { describe, expect, it } from 'vitest'
import { calculateItem, calculateQuote, evaluateAvailability, type AuthoritativeItem } from '..'

const item = (overrides: Partial<AuthoritativeItem> = {}): AuthoritativeItem => ({
  listingId: 'listing', productId: 'product', slug: 'regalo', name: 'Regalo', listingPublished: true,
  productActive: true, baseAmountMinor: 10000, currency: 'MXN', quantity: 2,
  variant: { id: 'variant', name: 'Grande', adjustmentAmountMinor: 2500, currency: 'MXN', active: true },
  options: [{ id: 'option', label: 'Mensaje', adjustmentAmountMinor: 500, currency: 'MXN', active: true }],
  ...overrides,
})

describe('authoritative quote engine', () => {
  it('adds base, variant and options, then multiplies quantity', () => {
    const result = calculateItem(item())
    expect(result).toMatchObject({ ok: true, value: { unitPrice: { amountMinor: 13000 }, lineTotal: { amountMinor: 26000 } } })
  })
  it('sums line subtotals', () => expect(calculateQuote([item({ quantity: 1 }), item({ quantity: 2 })])).toMatchObject({ ok: true, value: { subtotal: { amountMinor: 39000 } } }))
  it.each([0, -1, 1.5])('rejects invalid quantity %s', (quantity) => expect(calculateItem(item({ quantity }))).toMatchObject({ ok: false, error: { code: 'INVALID_QUANTITY' } }))
  it('rejects overflow', () => expect(calculateItem(item({ baseAmountMinor: Number.MAX_SAFE_INTEGER, quantity: 2, variant: null, options: [] }))).toMatchObject({ ok: false, error: { code: 'PRICE_OVERFLOW' } }))
  it('rejects currency mismatch', () => expect(calculateItem(item({ currency: 'USD' }))).toMatchObject({ ok: false, error: { code: 'CURRENCY_MISMATCH' } }))
  it('rejects fractional adjustments', () => expect(calculateItem(item({ variant: null, options: [{ id: 'x', label: 'x', adjustmentAmountMinor: 0.5, currency: 'MXN', active: true }] }))).toMatchObject({ ok: false, error: { code: 'CONFIGURATION_ERROR' } }))
  it('does not equate a candidate with confirmed availability', () => expect(evaluateAvailability({ listingPublished: true, productActive: true, variantActive: true, optionsActive: true, cityActive: true, zoneActive: true, listingZoneActive: true, deliveryAmountKnown: false, requiresOperationalReview: false })).toEqual({ status: 'requires_review', pendingComponents: ['delivery'] }))
})
