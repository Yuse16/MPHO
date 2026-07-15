import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ previewQuote: vi.fn(), createQuote: vi.fn(), getQuote: vi.fn() }))
vi.mock('@/lib/quotes', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/quotes')>()
  return { ...original, previewQuote: mocks.previewQuote, createQuote: mocks.createQuote, getQuote: mocks.getQuote }
})

import { POST as previewPost } from '@/app/api/quotes/preview/route'
import { POST as createPost } from '@/app/api/quotes/route'
import { GET as quoteGet } from '@/app/api/quotes/[id]/route'

const listingId = 'f1000000-0000-4000-8000-000000000001'
const quote = { id: 'f2000000-0000-4000-8000-000000000001', status: 'requires_review', availabilityStatus: 'requires_review', currency: 'MXN', items: [], subtotal: { amountMinor: 100, currency: 'MXN' }, delivery: null, service: null, discount: { amountMinor: 0, currency: 'MXN' }, totalKnown: { amountMinor: 100, currency: 'MXN' }, totalIsFinal: false, pendingComponents: ['delivery'], expiresAt: null }
const body = { items: [{ listingId, variantId: null, optionIds: [], quantity: 1 }], zoneId: null, requestedDeliveryAt: null }

describe('quote API boundary', () => {
  beforeEach(() => vi.clearAllMocks())
  it('returns a valid public preview DTO without internal fields', async () => {
    mocks.previewQuote.mockResolvedValue({ ok: true, value: quote })
    const response = await previewPost(new Request('http://localhost/api/quotes/preview', { method: 'POST', body: JSON.stringify(body) }))
    const result = await response.json()
    expect(response.status).toBe(200)
    expect(result.quote).not.toHaveProperty('partnerId')
    expect(result.quote).not.toHaveProperty('cost')
  })
  it('rejects invalid preview input before database access', async () => {
    const response = await previewPost(new Request('http://localhost/api/quotes/preview', { method: 'POST', body: JSON.stringify({ ...body, total: 1 }) }))
    expect(response.status).toBe(400)
    expect(mocks.previewQuote).not.toHaveBeenCalled()
  })
  it('requires an authenticated customer for persistence', async () => {
    mocks.createQuote.mockResolvedValue({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication is required.' } })
    const response = await createPost(new Request('http://localhost/api/quotes', { method: 'POST', headers: { 'idempotency-key': 'valid-key' }, body: JSON.stringify(body) }))
    expect(response.status).toBe(401)
  })
  it('returns own quote and hides a foreign quote as not found', async () => {
    mocks.getQuote.mockResolvedValueOnce({ ok: true, value: quote }).mockResolvedValueOnce({ ok: false, error: { code: 'LISTING_NOT_FOUND', message: 'not found' } })
    const own = await quoteGet(new Request('http://localhost'), { params: Promise.resolve({ id: quote.id }) })
    const foreign = await quoteGet(new Request('http://localhost'), { params: Promise.resolve({ id: quote.id }) })
    expect(own.status).toBe(200)
    expect(foreign.status).toBe(404)
  })
})
