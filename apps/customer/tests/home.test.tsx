import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/components/mphora-section', () => ({
  MphoraSection: () => (
    <section id="mphora" aria-label="MPHORA, entrega rápida">
      <h2>Lo necesitas hoy MPHORA</h2>
    </section>
  ),
}))

import Home from '../app/page'

describe('Home page', () => {
  it('renders the MPHO hero heading', async () => {
    await act(async () => {
      render(<Home />)
    })
    const matches = screen.getAllByText(/regalo/i)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('renders the HADIA card section', async () => {
    await act(async () => {
      render(<Home />)
    })
    const matches = screen.getAllByText(/HADIA/i)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('does not show partner names to customers', async () => {
    await act(async () => {
      render(<Home />)
    })
    const text = document.body.textContent ?? ''
    expect(text).not.toMatch(/punto\s*mpho/i)
    expect(text).not.toMatch(/aliado/i)
  })
})
