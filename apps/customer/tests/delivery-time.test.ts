import { describe, expect, it } from 'vitest'
import { DELIVERY_TIME_ZONE, deliveryInputToInstant, formatDeliveryInstantForInput } from '@/lib/delivery-time'

describe('delivery wall-clock time', () => {
  it('uses the explicit delivery zone', () => expect(DELIVERY_TIME_ZONE).toBe('America/Monterrey'))
  it('renders the persisted instant as the same Customer-visible hour', () => {
    expect(formatDeliveryInstantForInput('2026-07-17T20:00:00.000Z')).toBe('2026-07-17T14:00')
  })
  it('converts the Customer-visible hour to the persisted instant', () => {
    expect(deliveryInputToInstant('2026-07-17T14:00')).toBe('2026-07-17T20:00:00.000Z')
  })
  it('round-trips without using the runtime time zone', () => {
    const localValue = '2026-12-24T18:30'
    expect(formatDeliveryInstantForInput(deliveryInputToInstant(localValue))).toBe(localValue)
  })
  it.each(['', '2026-02-30T14:00', '2026-07-17T25:00', '07/17/2026 14:00'])('rejects invalid local input %s', value => {
    expect(() => deliveryInputToInstant(value)).toThrow('La fecha solicitada no es válida.')
  })
})
