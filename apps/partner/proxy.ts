import { type NextRequest, NextResponse } from 'next/server'
import { refreshSession } from '@/lib/supabase/proxy'
import {
  getSafeRedirect,
  isProtectedRoute,
  shouldBypassProxy,
} from '@/lib/routes'

function isApiRoute(pathname: string) {
  return pathname === '/api' || pathname.startsWith('/api/')
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldBypassProxy(pathname)) {
    return NextResponse.next()
  }

  const protectedRoute = isProtectedRoute(pathname)
  const apiRoute = isApiRoute(pathname)

  let session: Awaited<ReturnType<typeof refreshSession>>
  try {
    session = await refreshSession(request)
  } catch {
    if (protectedRoute) {
      if (apiRoute) {
        return NextResponse.json(
          { error: 'service_unavailable' },
          { status: 503 },
        )
      }
      return NextResponse.redirect(
        new URL('/login?error=service_unavailable', request.url),
      )
    }
    return NextResponse.next({ request: { headers: request.headers } })
  }

  const { response, user, partnerAccess } = session

  if (protectedRoute && !user) {
    if (apiRoute) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', `${pathname}${request.nextUrl.search}`)
    return Response.redirect(loginUrl)
  }

  if (protectedRoute && partnerAccess?.status !== 'authorized') {
    if (apiRoute) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
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
  matcher: ['/((?!_next/|favicon.ico|manifest.json|sw.js|icons/).*)'],
}
