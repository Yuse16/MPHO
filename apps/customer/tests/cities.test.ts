import { describe, it, expect } from 'vitest'
import { CITIES, ACTIVE_CITIES } from '../lib/data'

describe('City data', () => {
  it('has exactly 2 cities: Saltillo and Ramos Arizpe', () => {
    expect(CITIES).toHaveLength(2)
    expect(CITIES.map((c) => c.id)).toEqual(['saltillo', 'ramos-arizpe'])
  })

  it('only Saltillo is active', () => {
    expect(ACTIVE_CITIES).toHaveLength(1)
    expect(ACTIVE_CITIES[0].id).toBe('saltillo')
  })

  it('Ramos Arizpe is planned, not active', () => {
    const ramos = CITIES.find((c) => c.id === 'ramos-arizpe')
    expect(ramos?.status).toBe('planned')
  })

  it('does NOT include Monterrey, CDMX, or Guadalajara', () => {
    const ids = CITIES.map((c) => c.id)
    expect(ids).not.toContain('monterrey')
    expect(ids).not.toContain('ciudad-de-mexico')
    expect(ids).not.toContain('guadalajara')
  })
})
