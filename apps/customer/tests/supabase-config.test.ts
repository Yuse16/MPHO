import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'

const supabaseDirectory = join(dirname(fileURLToPath(import.meta.url)), '../lib/supabase')
const supabaseModuleNames = ['config.ts', 'browser.ts', 'server.ts', 'public.ts', 'proxy.ts']

describe('public Supabase configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('can import configuration without public environment variables', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

    await expect(import('@/lib/supabase/config')).resolves.toMatchObject({
      getPublicSupabaseConfig: expect.any(Function),
    })
  })

  it('fails clearly only when a browser client is actually created', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')
    const { createBrowserSupabaseClient } = await import('@/lib/supabase/browser')
    const { PublicSupabaseConfigurationError } = await import('@/lib/supabase/config')

    expect(() => createBrowserSupabaseClient()).toThrow(PublicSupabaseConfigurationError)
    expect(() => createBrowserSupabaseClient()).toThrow(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set',
    )
  })

  it('creates a browser client with valid public configuration', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'safe-anonymous-test-fixture')
    const { createBrowserSupabaseClient } = await import('@/lib/supabase/browser')

    expect(createBrowserSupabaseClient()).toBeDefined()
  })

  it('uses literal public environment access without hardcoded Supabase projects', async () => {
    const sources = await Promise.all(
      supabaseModuleNames.map((name) => readFile(join(supabaseDirectory, name), 'utf8')),
    )
    const source = sources.join('\n')

    expect(source).toContain('process.env.NEXT_PUBLIC_SUPABASE_URL')
    expect(source).toContain('process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
    expect(source).not.toMatch(/process\.env\s*\[/)
    expect(source).not.toMatch(/https:\/\/[a-z0-9-]+\.supabase\.co/i)
  })
})
