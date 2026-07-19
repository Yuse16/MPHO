import { describe, expect, it } from 'vitest'
import { parseCartItemRequest } from '@/lib/cart-item-selection'

const listingId = 'f1000000-0000-4000-8000-000000000001'

function request(overrides: Record<string, unknown> = {}) {
  return {
    expectedVersion: 0,
    listingId,
    variantId: null,
    optionIds: [],
    quantity: 1,
    personalization: null,
    ...overrides,
  }
}

describe('cart item selection boundary', () => {
  it('accepts a complete server-authoritative selection without price fields', () => {
    expect(parseCartItemRequest(request())).toEqual({
      expectedVersion: 0,
      selection: {
        listingId,
        variantId: null,
        optionIds: [],
        quantity: 1,
        personalization: null,
      },
    })
  })

  it.each([0, 21, 1.5, Number.NaN])('rejects invalid quantity %s', (quantity) => {
    expect(parseCartItemRequest(request({ quantity }))).toBeNull()
  })

  it('rejects duplicate options, malformed identifiers and injected prices', () => {
    const optionId = 'f1000000-0000-4000-8000-000000000002'
    expect(parseCartItemRequest(request({ optionIds: [optionId, optionId] }))).toBeNull()
    expect(parseCartItemRequest(request({ listingId: 'not-an-id' }))).toBeNull()
    expect(parseCartItemRequest({ ...request(), total: 1 })).toBeNull()
  })

  it('validates structured text personalization', () => {
    expect(
      parseCartItemRequest(
        request({
          personalization: {
            recipientName: null,
            message: 'Feliz cumpleaños',
            instructions: null,
            spellingConfirmed: true,
          },
        }),
      ),
    ).not.toBeNull()
    expect(
      parseCartItemRequest(
        request({
          personalization: {
            recipientName: null,
            message: '<script>contenido</script>',
            instructions: null,
            spellingConfirmed: true,
          },
        }),
      ),
    ).toBeNull()
  })

  it('normalizes personalization text before enforcing and forwarding its limits', () => {
    const parsed = parseCartItemRequest(
      request({
        personalization: {
          recipientName: '  Ana  ',
          message: '  Feliz cumpleaños  ',
          instructions: null,
          spellingConfirmed: true,
        },
      }),
    )

    expect(parsed?.selection.personalization).toMatchObject({
      recipientName: 'Ana',
      message: 'Feliz cumpleaños',
    })
    expect(
      parseCartItemRequest(
        request({
          personalization: {
            recipientName: null,
            message: `  ${'x'.repeat(501)}  `,
            instructions: null,
            spellingConfirmed: true,
          },
        }),
      ),
    ).toBeNull()
  })
})
