import { describe, it, expect } from 'vitest'
import { isValidOrderStatusTransition } from '@mpho/validation'

describe('Order status transitions', () => {
  it('allows draft → cancelled', () => {
    expect(isValidOrderStatusTransition('draft', 'cancelled')).toBe(true)
  })

  it('allows paid → assignment_pending', () => {
    expect(isValidOrderStatusTransition('paid', 'assignment_pending')).toBe(true)
  })

  it('blocks delivered → preparing', () => {
    expect(isValidOrderStatusTransition('delivered', 'preparing')).toBe(false)
  })

  it('blocks cancelled → delivered', () => {
    expect(isValidOrderStatusTransition('cancelled', 'delivered')).toBe(false)
  })
})
