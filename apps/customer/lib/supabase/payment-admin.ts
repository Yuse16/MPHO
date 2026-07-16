import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { getPublicSupabaseConfig } from './config'

export function createPaymentAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!key) throw new Error('Payment backend configuration is incomplete.')
  return createClient(getPublicSupabaseConfig().url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { 'X-Client-Info': 'mpho-payment-backend' } } })
}
