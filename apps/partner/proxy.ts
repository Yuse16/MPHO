import type { NextRequest } from 'next/server'
import { refreshSession } from '@/lib/supabase/proxy'
import { isPublicRoute, isProtectedRoute, getSafeRedirect } from '@/lib/routes'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isPublicRoute(pathname) && !isProtectedRoute(pathname)) {
    return Response.redirect(new URL('/inicio', request.url))
  }

  const { response, user } = await refreshSession(request)

  if (isProtectedRoute(pathname) && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return Response.redirect(loginUrl)
  }

  if (user && pathname === '/login') {
    const redirect = getSafeRedirect(request.nextUrl.searchParams.get('redirect'))
    return Response.redirect(new URL(redirect, request.url))
  }

  if (user && pathname === '/signup') {
    return Response.redirect(new URL('/inicio', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/).*)',
  ],
}
