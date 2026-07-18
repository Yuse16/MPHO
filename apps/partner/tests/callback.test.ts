import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/(auth)/callback/route'

const exchangeCodeForSession = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    auth: { exchangeCodeForSession },
  })),
}))

describe('auth callback', () => {
  beforeEach(() => {
    exchangeCodeForSession.mockReset()
  })

  it('exchanges the code and keeps a safe protected redirect', async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null })

    const response = await GET(
      new Request('https://aliados.example/callback?code=valid&redirect=%2Fpedidos%3Fvista%3Dhoy'),
    )

    expect(exchangeCodeForSession).toHaveBeenCalledWith('valid')
    expect(response.headers.get('location')).toBe(
      'https://aliados.example/pedidos?vista=hoy',
    )
  })

  it('sanitizes an unsafe redirect after exchange', async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null })

    const response = await GET(
      new Request('https://aliados.example/callback?code=valid&redirect=%2F%2Fevil.example'),
    )

    expect(response.headers.get('location')).toBe('https://aliados.example/inicio')
  })

  it.each([
    ['missing code', 'https://aliados.example/callback'],
    ['provider error', 'https://aliados.example/callback?code=invalid'],
  ])('returns a fixed public error for %s', async (_label, url) => {
    exchangeCodeForSession.mockResolvedValue({ error: new Error('private detail') })

    const response = await GET(new Request(url))

    expect(response.headers.get('location')).toBe(
      'https://aliados.example/login?error=auth_callback_failed',
    )
  })
})
