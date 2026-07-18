import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/inicio',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/supabase/browser', () => ({
  createBrowserSupabaseClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  }),
}))

describe('Partner app pages', () => {
  it('renders the login page', async () => {
    const { default: LoginPage } = await import('@/app/(auth)/login/page')
    render(<LoginPage />)
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
  })

  it('renders the signup page', async () => {
    const { default: SignupPage } = await import('@/app/(auth)/signup/page')
    render(<SignupPage />)
    expect(screen.getByRole('heading', { name: 'Acceso por invitación' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir a iniciar sesión' })).toHaveAttribute(
      'href',
      '/login',
    )
    expect(screen.queryByRole('button', { name: 'Crear cuenta' })).not.toBeInTheDocument()
  })

  it('renders the inicio page', async () => {
    const { default: InicioPage } = await import('@/app/(protected)/inicio/page')
    render(<InicioPage />)
    expect(screen.getByRole('heading', { name: 'Bienvenido' })).toBeInTheDocument()
    expect(screen.getByText('Resumen operativo no disponible')).toBeInTheDocument()
    expect(screen.queryByText('$0')).not.toBeInTheDocument()
  })

  it('renders the pedidos page', async () => {
    const { default: PedidosPage } = await import('@/app/(protected)/pedidos/page')
    render(<PedidosPage />)
    expect(screen.getByRole('heading', { name: 'Pedidos' })).toBeInTheDocument()
    expect(screen.getByText('Pedidos no disponibles')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders the ganancias page', async () => {
    const { default: GananciasPage } = await import('@/app/(protected)/ganancias/page')
    render(<GananciasPage />)
    expect(screen.getByRole('heading', { name: 'Ganancias' })).toBeInTheDocument()
    expect(screen.getByText('Información financiera no disponible')).toBeInTheDocument()
    expect(screen.queryByText('$0')).not.toBeInTheDocument()
  })

  it('renders the paquetes page', async () => {
    const { default: PaquetesPage } = await import('@/app/(protected)/paquetes/page')
    render(<PaquetesPage />)
    expect(screen.getByRole('heading', { name: 'Paquetes' })).toBeInTheDocument()
    expect(screen.getByText('Paquetes no disponibles')).toBeInTheDocument()
  })

  it('renders the configuracion page', async () => {
    const { default: ConfiguracionPage } = await import('@/app/(protected)/configuracion/page')
    render(<ConfiguracionPage />)
    expect(screen.getByRole('heading', { name: 'Configuración' })).toBeInTheDocument()
    expect(screen.getByText('Configuración no disponible')).toBeInTheDocument()
  })
})
