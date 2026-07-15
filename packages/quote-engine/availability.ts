import type { AvailabilityStatus } from './types'

export function evaluateAvailability(input: {
  listingPublished: boolean; productActive: boolean; variantActive: boolean; optionsActive: boolean
  cityActive: boolean; zoneActive: boolean; listingZoneActive: boolean; deliveryAmountKnown: boolean
  requiresOperationalReview: boolean
}): { status: AvailabilityStatus; pendingComponents: string[] } {
  if (!input.listingPublished || !input.productActive || !input.variantActive || !input.optionsActive || !input.cityActive || !input.zoneActive || !input.listingZoneActive) {
    return { status: 'unavailable', pendingComponents: [] }
  }
  const pendingComponents = []
  if (!input.deliveryAmountKnown) pendingComponents.push('delivery')
  if (input.requiresOperationalReview) pendingComponents.push('operational_availability')
  return { status: pendingComponents.length ? 'requires_review' : 'eligible', pendingComponents }
}
