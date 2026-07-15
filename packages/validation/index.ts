import type { City, Product } from '@mpho/types'

export function isValidCity(cityId: string, cities: City[]): boolean {
  return cities.some((c) => c.id === cityId && c.status === 'active')
}

export function isValidProduct(product: Product): boolean {
  return (
    product.id.trim().length > 0 &&
    product.name.trim().length > 0 &&
    product.description.trim().length > 0 &&
    product.image.trim().length > 0 &&
    product.alt.trim().length > 0 &&
    Number.isInteger(product.price.amountMinor) &&
    product.price.amountMinor > 0 &&
    product.price.currency === 'MXN' &&
    product.cityId.trim().length > 0
  )
}
