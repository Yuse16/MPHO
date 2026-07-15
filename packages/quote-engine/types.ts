export type Currency = 'MXN'
export type Money = { amountMinor: number; currency: Currency }
export type AvailabilityStatus = 'eligible' | 'requires_review' | 'unavailable'
export type QuoteStatus = 'valid' | 'requires_review' | 'expired' | 'invalidated'

export type QuoteErrorCode =
  | 'INVALID_REQUEST' | 'LISTING_NOT_FOUND' | 'LISTING_NOT_PUBLIC' | 'PRODUCT_INACTIVE'
  | 'VARIANT_INVALID' | 'OPTION_INVALID' | 'ZONE_UNAVAILABLE' | 'CURRENCY_MISMATCH'
  | 'INVALID_QUANTITY' | 'PRICE_OVERFLOW' | 'REQUIRES_REVIEW' | 'CONFIGURATION_ERROR'
  | 'DATABASE_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN'

export type QuoteEngineError = { code: QuoteErrorCode; message: string }

export type AuthoritativeOption = { id: string; label: string; adjustmentAmountMinor: number; currency: string; active: boolean }
export type AuthoritativeVariant = { id: string; name: string; adjustmentAmountMinor: number; currency: string; active: boolean }
export type AuthoritativeItem = {
  listingId: string
  productId: string
  slug: string
  name: string
  listingPublished: boolean
  productActive: boolean
  baseAmountMinor: number
  currency: string
  quantity: number
  variant: AuthoritativeVariant | null
  options: AuthoritativeOption[]
}

export type CalculatedItem = {
  listingId: string
  productId: string
  slug: string
  name: string
  quantity: number
  unitPrice: Money
  lineTotal: Money
  variant: { id: string; name: string } | null
  options: Array<{ id: string; label: string; adjustment: Money }>
}

export type QuoteCalculation = {
  currency: Currency
  items: CalculatedItem[]
  subtotal: Money
}

export type PublicQuote = {
  id?: string
  reference?: string
  status: QuoteStatus
  availabilityStatus: AvailabilityStatus
  currency: Currency
  items: CalculatedItem[]
  subtotal: Money
  delivery: Money | null
  service: Money | null
  discount: Money
  totalKnown: Money
  totalIsFinal: boolean
  pendingComponents: string[]
  expiresAt: string | null
}

export type QuoteResult<T> = { ok: true; value: T } | { ok: false; error: QuoteEngineError }
