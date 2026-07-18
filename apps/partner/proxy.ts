import { type NextRequest, NextResponse } from 'next/server'
import { refreshSession } from '@/lib/supabase/proxy'
import { isProtectedRoute, getSafeRedirect } from '@/lib/routes'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  let session: Awaited<ReturnType<typeof refreshSession>>
  try {
    session = await refreshSession(request)
  } catch {
    if (isProtectedRoute(pathname)) {
      return NextResponse.redirect(
        new URL('/login?error=service_unavailable', request.url),
      )
    }
    return NextResponse.next({ request: { headers: request.headers } })
  }

  const { response, user, partnerAccess } = session

  if (isProtectedRoute(pathname) && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', `${pathname}${request.nextUrl.search}`)
    return Response.redirect(loginUrl)
  }

  if (isProtectedRoute(pathname) && partnerAccess?.status !== 'authorized') {
    return Response.redirect(new URL('/acceso', request.url))
  }

  if (user && (pathname === '/login' || pathname === '/signup')) {
    if (partnerAccess?.status !== 'authorized') {
      return Response.redirect(new URL('/acceso', request.url))
    }
    const redirect = getSafeRedirect(request.nextUrl.searchParams.get('redirect'))
    return Response.redirect(new URL(redirect, request.url))
  }

  if (pathname === '/acceso' && user && partnerAccess?.status === 'authorized') {
    return Response.redirect(new URL('/inicio', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/).*)',
  ],
}
