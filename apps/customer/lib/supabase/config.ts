export class PublicSupabaseConfigurationError extends Error {
  constructor() {
    super('Missing required public Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.')
    this.name = 'PublicSupabaseConfigurationError'
  }
}

export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new PublicSupabaseConfigurationError()
  }

  return { url, anonKey }
}
