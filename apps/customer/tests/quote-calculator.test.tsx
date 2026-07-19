import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QuoteCalculator } from '@/components/quote-calculator'
import { CartProvider } from '@/lib/cart-context'

vi.mock('next/navigation', () => ({
  usePathname: () => '/producto/regalo',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}))

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
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('No fue posible calcular la cotización'))
    expect(screen.getByRole('alert')).not.toHaveTextContent('Sin red')
    expect(screen.queryByText('$0')).not.toBeInTheDocument()
  })
  it('rejects a malformed quote response without crashing the interface', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            quote: {
              availabilityStatus: 'eligible',
              subtotal: { amountMinor: '129000', currency: 'MXN' },
              pendingComponents: [],
            },
          }),
          { status: 200 },
        ),
      ),
    )
    render(
      <CartProvider>
        <QuoteCalculator listingId="listing" configuration={configuration} />
      </CartProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Calcular cotización' }))
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('No fue posible calcular la cotización'),
    )
    expect(screen.queryByText('$1,290')).not.toBeInTheDocument()
  })
  it('validates quantity and required options before requesting a quote', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    render(
      <CartProvider>
        <QuoteCalculator
          listingId="listing"
          configuration={{
            variants: [],
            zones: [],
            options: [{ id: 'option', label: 'Tarjeta', required: true }],
          }}
        />
      </CartProvider>,
    )
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calcular cotización' }))
    expect(screen.getByRole('alert')).toHaveTextContent('entre 1 y 20')
    expect(fetch).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calcular cotización' }))
    expect(screen.getByRole('alert')).toHaveTextContent('opciones requeridas')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('does not present an unavailable quote as validated', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            quote: {
              status: 'requires_review',
              availabilityStatus: 'unavailable',
              currency: 'MXN',
              items: [],
              subtotal: { amountMinor: 129000, currency: 'MXN' },
              delivery: null,
              service: null,
              discount: { amountMinor: 0, currency: 'MXN' },
              totalKnown: { amountMinor: 129000, currency: 'MXN' },
              totalIsFinal: false,
              pendingComponents: ['operational_availability'],
              expiresAt: null,
            },
          }),
          { status: 200 },
        ),
      ),
    )
    render(
      <CartProvider>
        <QuoteCalculator listingId="listing" configuration={configuration} />
      </CartProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Calcular cotización' }))
    await waitFor(() =>
      expect(screen.getByText(/no disponible para esta selección/)).toBeInTheDocument(),
    )
    expect(screen.queryByText(/validada para esta cotización/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Selección no disponible' })).toBeDisabled()
    expect(screen.getByText(/validación operativa/)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '2' } })
    expect(screen.queryByText(/no disponible para esta selección/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Agregar selección al carrito' })).toBeEnabled()
  })
})
