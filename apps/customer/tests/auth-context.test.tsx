import { render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/lib/auth-context'

const authMocks = vi.hoisted(() => {
  const unsubscribe = vi.fn()
  const getUser = vi.fn().mockResolvedValue({ data: { user: null } })
  const onAuthStateChange = vi.fn(() => ({ data: { subscription: { unsubscribe } } }))
  const signOut = vi.fn().mockResolvedValue({ error: null })
  const createBrowserSupabaseClient = vi.fn(() => ({
    auth: { getUser, onAuthStateChange, signOut },
  }))
  return { createBrowserSupabaseClient, getUser, onAuthStateChange, unsubscribe }
})

vi.mock('@/lib/supabase/browser', () => ({
  createBrowserSupabaseClient: authMocks.createBrowserSupabaseClient,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}))

describe('AuthProvider', () => {
  it('keeps one client and one auth subscription across rerenders', async () => {
    const view = render(<AuthProvider><span>contenido</span></AuthProvider>)
    view.rerender(<AuthProvider><span>actualizado</span></AuthProvider>)

    await waitFor(() => expect(authMocks.getUser).toHaveBeenCalledTimes(1))
    expect(authMocks.createBrowserSupabaseClient).toHaveBeenCalledTimes(1)
    expect(authMocks.onAuthStateChange).toHaveBeenCalledTimes(1)

    view.unmount()
    expect(authMocks.unsubscribe).toHaveBeenCalledTimes(1)
  })
})
