import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PartnerBottomNav } from '@/components/partner-bottom-nav'
import { PartnerHeader } from '@/components/partner-header'
import { PartnerSidebar } from '@/components/partner-sidebar'

const mocks = vi.hoisted(() => ({
  pathname: '/inicio',
  signOut: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}))

vi.mock('@/lib/auth-context', () => ({
  useAuth: () => ({
    user: { email: 'aliado@example.com' },
    loading: false,
    error: null,
    signOut: mocks.signOut,
  }),
}))

describe('Partner navigation', () => {
  beforeEach(() => {
    mocks.pathname = '/inicio'
    mocks.signOut.mockReset()
  })

  it('uses real links and marks the matching mobile destination active', () => {
    mocks.pathname = '/perfil'
    render(<PartnerBottomNav />)

    const profileLink = screen.getByRole('link', { name: 'Más' })
    expect(profileLink).toHaveAttribute('href', '/perfil')
    expect(profileLink).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Pedidos' })).toHaveAttribute(
      'href',
      '/pedidos',
    )
    expect(mocks.signOut).not.toHaveBeenCalled()
  })

  it('keeps sign-out as an explicit desktop action', () => {
    render(<PartnerSidebar />)

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(mocks.signOut).toHaveBeenCalledOnce()
  })

  it('provides functional mobile links without an inert menu control', () => {
    render(<PartnerHeader />)

    expect(
      screen.getByRole('link', { name: 'Ir al inicio de MPHO Aliados' }),
    ).toHaveAttribute('href', '/inicio')
    expect(screen.getByRole('link', { name: 'Mi perfil' })).toHaveAttribute(
      'href',
      '/perfil',
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
