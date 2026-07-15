import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@mpho/database/types'
import { getPublicSupabaseConfig } from './config'

export { PublicSupabaseConfigurationError } from './config'

let publicClient: SupabaseClient<Database> | null = null

/**
 * Anonymous, session-free client for the explicit public catalog RPCs only.
 * It never uses cookies or a privileged key and must not be used for mutations.
 */
export function createPublicSupabaseClient(): SupabaseClient<Database> {
  if (publicClient) return publicClient

  const { url, anonKey } = getPublicSupabaseConfig()

  publicClient = createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })
  return publicClient
}
