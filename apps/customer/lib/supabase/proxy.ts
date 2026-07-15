import { createServerClient } from '@supabase/ssr'
import type { Database } from '@mpho/database/types'
import { type NextRequest, NextResponse } from 'next/server'
import { getPublicSupabaseConfig } from './config'

export async function refreshSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  const { url, anonKey } = getPublicSupabaseConfig()

  const supabase = createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data, error } = await supabase.auth.getUser()
  return { response, user: error ? null : data.user }
}
