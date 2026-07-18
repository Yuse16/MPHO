import { describe, expect, it } from 'vitest'
import { parseQuoteConfiguration, parseQuoteSelection } from '@/lib/quotes'

const listingId = 'f1000000-0000-4000-8000-000000000001'
describe('quote request security', () => {
  it('accepts selection-only input', () => expect(parseQuoteSelection({ items: [{ listingId, variantId: null, optionIds: [], quantity: 1 }], zoneId: null, requestedDeliveryAt: null }).ok).toBe(true))
  it.each(['unitPrice', 'subtotal', 'discount', 'deliveryFee', 'serviceFee', 'total', 'currency', 'partnerId', 'commission', 'partnerEarning'])('rejects browser-controlled %s', (field) => expect(parseQuoteSelection({ items: [{ listingId, variantId: null, optionIds: [], quantity: 1 }], [field]: 1 })).toMatchObject({ ok: false, error: { code: 'INVALID_REQUEST' } }))
  it.each([0, -1, 1.5, 21])('rejects invalid quantity %s', (quantity) => expect(parseQuoteSelection({ items: [{ listingId, variantId: null, optionIds: [], quantity }] })).toMatchObject({ ok: false, error: { code: 'INVALID_QUANTITY' } }))
  it('rejects duplicated or excessive options', () => {
    const optionId = 'f1000000-0000-4000-8000-000000000002'
    expect(parseQuoteSelection({ items: [{ listingId, variantId: null, optionIds: [optionId, optionId], quantity: 1 }] })).toMatchObject({ ok: false, error: { code: 'OPTION_INVALID' } })
    expect(parseQuoteSelection({ items: [{ listingId, variantId: null, optionIds: Array.from({ length: 21 }, (_, index) => `f1000000-0000-4000-8000-${String(index).padStart(12, '0')}`), quantity: 1 }] })).toMatchObject({ ok: false, error: { code: 'OPTION_INVALID' } })
  })
  it('accepts only a complete public quote configuration', () => {
    const configuration = { variants: [{ id: listingId, name: 'Mediano' }], options: [{ id: listingId, label: 'Tarjeta', required: true }], zones: [{ id: listingId, name: 'Centro', city: 'Saltillo' }] }
    expect(parseQuoteConfiguration(configuration)).toEqual(configuration)
    expect(parseQuoteConfiguration({ ...configuration, zones: [{ id: 'invalid', name: 'Centro', city: 'Saltillo' }] })).toBeNull()
  })
})
