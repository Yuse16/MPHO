import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QuoteCalculator } from '@/components/quote-calculator'
import { CartProvider } from '@/lib/cart-context'

const configuration = { variants: [], options: [], zones: [{ id: 'z', name: 'Centro', city: 'Saltillo' }] }
afterEach(() => vi.unstubAllGlobals())
describe('quote calculator', () => {
  it('shows loading and a server subtotal', async () => {
    let resolveResponse!: (value: Response) => void
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>((resolve) => { resolveResponse = resolve })))
    render(<CartProvider><QuoteCalculator listingId="listing" configuration={configuration} /></CartProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Calcular cotización' }))
    expect(screen.getByRole('button', { name: 'Calculando…' })).toHaveTextContent('Calculando')
    resolveResponse(new Response(JSON.stringify({ quote: { status: 'requires_review', availabilityStatus: 'requires_review', currency: 'MXN', items: [], subtotal: { amountMinor: 129000, currency: 'MXN' }, delivery: null, service: null, discount: { amountMinor: 0, currency: 'MXN' }, totalKnown: { amountMinor: 129000, currency: 'MXN' }, totalIsFinal: false, pendingComponents: ['delivery'], expiresAt: null } }), { status: 200 }))
    await waitFor(() => expect(screen.getByText(/1,290/)).toBeInTheDocument())
  })
  it('does not render a network error as zero', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Sin red')))
    render(<CartProvider><QuoteCalculator listingId="listing" configuration={configuration} /></CartProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Calcular cotización' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Sin red'))
    expect(screen.queryByText('$0')).not.toBeInTheDocument()
  })
})
