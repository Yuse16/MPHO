import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('public rendering without Supabase configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('imports the not-found page without public environment variables', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

    await expect(import('@/app/not-found')).resolves.toMatchObject({
      default: expect.any(Function),
    })
  })

  it('server-renders Providers without creating a browser client', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')
    const { Providers } = await import('@/lib/providers')

    expect(() => renderToString(<Providers>contenido público</Providers>)).not.toThrow()
  })
})
