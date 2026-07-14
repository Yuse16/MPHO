import { describe, expect, it } from 'vitest'
import { isValidProduct } from './index'

describe('product validation', () => {
  const validProduct = {
    id: 'product-1',
    name: 'Regalo',
    description: 'Descripción',
    price: { amountMinor: 129000, currency: 'MXN' as const },
    image: '/image.jpg',
    alt: 'Regalo',
    availability: 'local' as const,
    cityId: 'saltillo',
  }

  it('requires integer minor units in MXN', () => {
    expect(isValidProduct(validProduct)).toBe(true)
    expect(isValidProduct({
      ...validProduct,
      price: { amountMinor: 1290.5, currency: 'MXN' },
    })).toBe(false)
  })

  it('rejects products with required blank fields', () => {
    expect(isValidProduct({ ...validProduct, name: '  ' })).toBe(false)
    expect(isValidProduct({ ...validProduct, description: '' })).toBe(false)
    expect(isValidProduct({ ...validProduct, image: '' })).toBe(false)
    expect(isValidProduct({ ...validProduct, alt: '' })).toBe(false)
  })
})
