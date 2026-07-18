import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DesktopHeader } from '@/components/desktop-header'
import { MobileBottomNavigation } from '@/components/mobile-bottom-navigation'

const navigation = vi.hoisted(() => ({ pathname: '/' }))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/components/cart-button', () => ({
  CartButton: () => <a href="/carrito" aria-label="Ver carrito, 0 artículos" />,
}))

describe('customer navigation', () => {
  beforeEach(() => {
    navigation.pathname = '/'
  })

  it('uses real routes and cross-route home anchors in the desktop header', () => {
    render(<DesktopHeader />)

    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Regalos' })).toHaveAttribute('href', '/explorar')
    expect(screen.getByRole('link', { name: 'MPHORA' })).toHaveAttribute('href', '/hadia')
    expect(screen.getByRole('link', { name: 'Ocasiones' })).toHaveAttribute('href', '/#ocasiones')
    expect(screen.getByRole('link', { name: 'Cómo funciona' })).toHaveAttribute('href', '/#como-funciona')
    expect(screen.getByRole('link', { name: 'Ayuda' })).toHaveAttribute('href', '/#ayuda')
    expect(screen.getByRole('link', { name: 'Mi cuenta' })).toHaveAttribute('href', '/perfil')
  })

  it('derives the active mobile destination from the current pathname', () => {
    navigation.pathname = '/pedidos'
    render(<MobileBottomNavigation />)

    expect(screen.getByRole('link', { name: 'Pedidos' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
    expect(screen.getByLabelText('Abrir HADIA, la inteligencia de regalos')).toHaveAttribute('href', '/hadia')
  })
})
