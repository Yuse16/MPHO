// =============================================================================
// Supabase client factory
// =============================================================================
// Creates and exports the Supabase client configured for browser and server.
// Environment variables must be set in .env.local (or .env for local dev).
// =============================================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let browserClient: SupabaseClient | null = null;

/**
 * Returns a Supabase client for browser use (singleton).
 * Uses the anon key — safe for client-side.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}

/**
 * Returns a Supabase client for server-side use (API routes, server components).
 * Uses the service role key — NEVER expose this to the client.
 */
export function getSupabaseServerClient(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for server-side Supabase clients. ' +
      'This key must NEVER be exposed to the client.'
    );
  }

  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Returns a Supabase client for use in Edge Runtime / middleware.
 */
export function getSupabaseMiddlewareClient(
  supabaseUrl: string,
  supabaseAnonKey: string,
): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey);
}
