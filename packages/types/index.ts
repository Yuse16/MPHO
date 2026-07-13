export type CityStatus = 'active' | 'planned'

export type City = {
  id: string
  name: string
  status: CityStatus
}

export type ProductAvailability = 'local' | 'mphora' | 'by_order'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  tag?: string
  alt: string
  availability: ProductAvailability
  cityId: string
}

export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'assignment_pending'
  | 'partner_accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'

export type Order = {
  id: string
  status: OrderStatus
  customerId: string
  partnerId?: string
  cityId: string
  items: OrderItem[]
  total: number
  createdAt: string
  updatedAt: string
}

export type OrderItem = {
  id: string
  productId: string
  name: string
  price: number
  qty: number
}

export type Partner = {
  id: string
  name: string
  cityId: string
  active: boolean
}
