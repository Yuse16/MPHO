// =============================================================================

import type { Money } from '@mpho/types'
// Shared types and utilities for customer-facing components.
// =============================================================================
// Mock data has been replaced by server-side Supabase queries in lib/catalog.ts.
// Product type is kept here for client components (ProductCard, ProductCarousel).
// =============================================================================

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  price: Money
  image: string
  tag?: string
  alt: string
}

export type Recipient = {
  id: string
  label: string
  icon: string
  accent: 'lime' | 'cyan' | 'blue' | 'gold' | 'mphora'
}

export type CityStatus = 'active' | 'planned'

export type City = {
  id: string
  name: string
  status: CityStatus
}

export function formatPrice(money: Money) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(money.amountMinor / 100)
}
