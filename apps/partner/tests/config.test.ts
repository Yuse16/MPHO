import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getPublicSupabaseConfig,
  PublicSupabaseConfigurationError,
} from '@/lib/supabase/config'

describe('public Supabase configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns only the public URL and anonymous key', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://project.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'public-anon-key')

    expect(getPublicSupabaseConfig()).toEqual({
      url: 'https://project.supabase.co',
      anonKey: 'public-anon-key',
    })
  })

  it('fails explicitly when public configuration is incomplete', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

    expect(() => getPublicSupabaseConfig()).toThrow(
      PublicSupabaseConfigurationError,
    )
  })
})
