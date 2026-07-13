import type { City, Product, OrderStatus } from '@mpho/types'

export function isValidCity(cityId: string, cities: City[]): boolean {
  return cities.some((c) => c.id === cityId && c.status === 'active')
}

export function isValidProduct(product: Product): boolean {
  return (
    product.id.length > 0 &&
    product.name.length > 0 &&
    product.price > 0 &&
    product.cityId.length > 0
  )
}

export function isValidOrderStatusTransition(
  from: OrderStatus,
  to: OrderStatus,
): boolean {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    draft: ['pending_payment', 'cancelled'],
    pending_payment: ['paid', 'cancelled'],
    paid: ['assignment_pending', 'cancelled'],
    assignment_pending: ['partner_accepted', 'cancelled'],
    partner_accepted: ['preparing'],
    preparing: ['ready_for_pickup'],
    ready_for_pickup: ['out_for_delivery'],
    out_for_delivery: ['delivered'],
    delivered: ['completed'],
    completed: [],
    cancelled: [],
  }
  return transitions[from]?.includes(to) ?? false
}
