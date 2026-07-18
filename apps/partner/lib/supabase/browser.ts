import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@mpho/database/types'
import { getPublicSupabaseConfig } from './config'

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createBrowserSupabaseClient() {
  if (browserClient) return browserClient

  const { url, anonKey } = getPublicSupabaseConfig()

  browserClient = createBrowserClient<Database>(url, anonKey)

  return browserClient
}
