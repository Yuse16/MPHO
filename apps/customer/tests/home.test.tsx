import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '../app/page'

describe('Home page', () => {
  it('renders the MPHO hero heading', async () => {
    render(<Home />)
    const matches = screen.getAllByText(/regalo/i)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('renders the HADIA card section', async () => {
    render(<Home />)
    const matches = screen.getAllByText(/HADIA/i)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('does not show partner names to customers', async () => {
    render(<Home />)
    const text = document.body.textContent ?? ''
    expect(text).not.toMatch(/punto\s*mpho/i)
    expect(text).not.toMatch(/aliado/i)
  })
})
