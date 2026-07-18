import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSafeRedirect } from '@/lib/routes'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const redirect = getSafeRedirect(url.searchParams.get('redirect'))

  if (code) {
    try {
      const supabase = await createServerSupabaseClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) return NextResponse.redirect(new URL(redirect, url.origin))
    } catch {
      // Return a fixed public error below; never expose configuration or provider details.
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', url.origin))
}
