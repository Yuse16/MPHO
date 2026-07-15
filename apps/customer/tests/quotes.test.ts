import { describe, expect, it } from 'vitest'
import { parseQuoteSelection } from '@/lib/quotes'

const listingId = 'f1000000-0000-4000-8000-000000000001'
describe('quote request security', () => {
  it('accepts selection-only input', () => expect(parseQuoteSelection({ items: [{ listingId, variantId: null, optionIds: [], quantity: 1 }], zoneId: null, requestedDeliveryAt: null }).ok).toBe(true))
  it.each(['unitPrice', 'subtotal', 'discount', 'deliveryFee', 'serviceFee', 'total', 'currency', 'partnerId', 'commission', 'partnerEarning'])('rejects browser-controlled %s', (field) => expect(parseQuoteSelection({ items: [{ listingId, variantId: null, optionIds: [], quantity: 1 }], [field]: 1 })).toMatchObject({ ok: false, error: { code: 'INVALID_REQUEST' } }))
  it.each([0, -1, 1.5])('rejects invalid quantity %s', (quantity) => expect(parseQuoteSelection({ items: [{ listingId, variantId: null, optionIds: [], quantity }] })).toMatchObject({ ok: false, error: { code: 'INVALID_QUANTITY' } }))
})
