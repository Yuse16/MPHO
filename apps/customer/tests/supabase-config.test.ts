import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getPublicSupabaseConfig,
  PublicSupabaseConfigurationError,
} from '@/lib/supabase/config'

describe('public Supabase configuration', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('fails clearly when public browser configuration is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

    expect(() => getPublicSupabaseConfig()).toThrow(PublicSupabaseConfigurationError)
    expect(() => getPublicSupabaseConfig()).toThrow(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set',
    )
  })
})
