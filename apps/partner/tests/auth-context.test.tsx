import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from '@/lib/auth-context'

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  getUser: vi.fn(),
  onAuthStateChange: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}))

vi.mock('@/lib/supabase/browser', () => ({
  createBrowserSupabaseClient: () => ({
    auth: {
      getUser: mocks.getUser,
      onAuthStateChange: mocks.onAuthStateChange,
      signOut: mocks.signOut,
    },
  }),
}))

function Consumer() {
  const { user, loading, error, signOut } = useAuth()
  return (
    <div>
      <span>{loading ? 'cargando' : user?.email ?? 'sin usuario'}</span>
      {error && <span role="alert">{error}</span>}
      <button type="button" onClick={() => void signOut()}>
        salir
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user-id', email: 'aliado@example.com' } },
      error: null,
    })
    mocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })
  })

  it('redirects only after Supabase confirms sign-out', async () => {
    mocks.signOut.mockResolvedValue({ error: null })
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    await screen.findByText('aliado@example.com')

    fireEvent.click(screen.getByRole('button', { name: 'salir' }))

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/login'))
    expect(mocks.refresh).toHaveBeenCalledOnce()
  })

  it('keeps the local session state when provider sign-out fails', async () => {
    mocks.signOut.mockResolvedValue({ error: new Error('provider detail') })
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    await screen.findByText('aliado@example.com')

    fireEvent.click(screen.getByRole('button', { name: 'salir' }))

    expect(
      await screen.findByText('No fue posible cerrar la sesión. Intenta de nuevo.'),
    ).toHaveAttribute('role', 'alert')
    expect(screen.getByText('aliado@example.com')).toBeInTheDocument()
    expect(mocks.replace).not.toHaveBeenCalled()
  })
})
