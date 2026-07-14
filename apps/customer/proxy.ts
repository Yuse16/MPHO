import { type NextRequest, NextResponse } from 'next/server'
import { refreshSession } from '@/lib/supabase/proxy'
import { getSafeRedirect, isProtectedRoute } from '@/lib/routes'

export async function proxy(request: NextRequest) {
  const { response, user } = await refreshSession(request)
  const pathname = request.nextUrl.pathname

  if (!user && isProtectedRoute(pathname)) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', `${pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(url)
  }

  if (user && (pathname === '/login' || pathname === '/signup')) {
    const redirect = getSafeRedirect(request.nextUrl.searchParams.get('redirect'))
    return NextResponse.redirect(new URL(redirect, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
