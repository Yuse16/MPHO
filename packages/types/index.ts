export type CityStatus = 'active' | 'planned'

export type City = {
  id: string
  name: string
  status: CityStatus
}

export type ProductAvailability = 'local' | 'mphora' | 'by_order'

export type Money = {
  amountMinor: number
  currency: 'MXN'
}

export type Product = {
  id: string
  name: string
  description: string
  price: Money
  image: string
  tag?: string
  alt: string
  availability: ProductAvailability
  cityId: string
}

export type PublicCatalogListing = {
  listingId: string
  productId: string
  slug: string
  name: string
  shortDescription: string | null
  fullDescription: string | null
  price: Money
  image: {
    url: string
    alt: string
  } | null
  category: {
    id: string
    slug: string
    name: string
  } | null
  featured: boolean
  personalizationAvailable: boolean
  scheduledDeliveryAvailable: boolean
  mphoraCandidate: boolean
}

export type PublicCatalogCategory = {
  id: string
  slug: string
  name: string
  description: string | null
  imageUrl: string | null
  listingCount: number
}

export type Partner = {
  id: string
  name: string
  cityId: string
  active: boolean
}
