const publicExactRoutes = new Set(['/', '/login', '/signup', '/callback', '/acceso'])
const safeRedirectExactRoutes = new Set([
  '/inicio',
  '/pedidos',
  '/ganancias',
  '/paquetes',
  '/configuracion',
  '/perfil',
  '/equipo',
])
const safeRedirectRoutePrefixes = ['/pedidos/', '/paquetes/', '/equipo/']
const proxyBypassExactRoutes = new Set([
  '/favicon.ico',
  '/manifest.json',
  '/sw.js',
])
const proxyBypassRoutePrefixes = ['/_next/', '/icons/']

export function isPublicRoute(pathname: string) {
  return publicExactRoutes.has(pathname)
}

export function shouldBypassProxy(pathname: string) {
  return (
    proxyBypassExactRoutes.has(pathname) ||
    proxyBypassRoutePrefixes.some((prefix) => pathname.startsWith(prefix))
  )
}

export function isProtectedRoute(pathname: string) {
  return !isPublicRoute(pathname) && !shouldBypassProxy(pathname)
}

function isSafeRedirectDestination(pathname: string) {
  return (
    safeRedirectExactRoutes.has(pathname) ||
    safeRedirectRoutePrefixes.some((prefix) => pathname.startsWith(prefix))
  )
}

export function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/inicio'
  try {
    const parsed = new URL(value, 'https://aliados.mpho.invalid')
    if (
      parsed.origin !== 'https://aliados.mpho.invalid' ||
      !isSafeRedirectDestination(parsed.pathname)
    ) {
      return '/inicio'
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return '/inicio'
  }
}
