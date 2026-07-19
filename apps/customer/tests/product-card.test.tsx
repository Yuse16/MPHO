import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Product } from '@/lib/data'

const cart = vi.hoisted(() => ({ addItem: vi.fn(), lastAddedId: null as string | null, loading: false }))
vi.mock('@/lib/cart-context', () => ({ useCart: () => cart }))

import { ProductCard } from '@/components/product-card'

const product: Product = {
  id: 'f1000000-0000-4000-8000-000000000001',
  slug: 'ramo-calido',
  name: 'Ramo cálido',
  description: 'Flores en tonos cálidos',
  price: { amountMinor: 90000, currency: 'MXN' },
  image: null,
  alt: 'Ramo de flores',
}

describe('ProductCard', () => {
  it('links to the real product route and adds the real listing id', async () => {
    cart.addItem.mockResolvedValue(true)
    render(<ProductCard product={product} />)

    expect(screen.getAllByRole('link', { name: /Ramo cálido/ })[0]).toHaveAttribute(
      'href',
      '/producto/ramo-calido',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Ramo cálido al carrito' }))
    await waitFor(() =>
      expect(cart.addItem).toHaveBeenCalledWith({ listingId: product.id }),
    )
    expect(screen.queryByRole('button', { name: /favoritos/i })).not.toBeInTheDocument()
  })

  it('shows an honest image fallback', () => {
    render(<ProductCard product={product} />)
    expect(screen.getByText('Imagen no disponible')).toBeInTheDocument()
  })

  it('requires detail configuration instead of adding an incomplete selection', () => {
    render(<ProductCard product={{ ...product, requiresConfiguration: true }} />)

    expect(screen.getByRole('link', { name: 'Configurar Ramo cálido' })).toHaveAttribute(
      'href',
      '/producto/ramo-calido',
    )
    expect(screen.queryByRole('button', { name: /Agregar Ramo cálido/ })).not.toBeInTheDocument()
  })
})
